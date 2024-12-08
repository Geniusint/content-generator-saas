import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
import { firestoreService } from '../../services/firestore';

const NewArticlePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) return;

      try {
        const projectsSnapshot = await firestoreService.getProjects();
        const projectsData = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
      }
    };

    fetchProjects();
  }, [currentUser]);

  const handleCreateArticle = async () => {
    if (!currentUser?.uid || !selectedProject) {
      console.error('User not authenticated or no project selected');
      return;
    }

    setLoading(true);
    try {
      const articleData = {
        title,
        content,
        authorId: currentUser.uid,
        createdAt: new Date().toISOString(),
        projectId: selectedProject, // Use selected project ID
        status: 'draft' as 'draft',
        publishDate: new Date().toISOString(),
        persona: 'default',
        wordCount: content.split(' ').length,
      };

      await firestoreService.createArticle(articleData);
      // Redirect or show success message
    } catch (error) {
      console.error("Erreur lors de la création de l'article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('articles.createNewArticle') as string}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>{t('articles.selectProject') as string}</InputLabel>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value as string)}
                label={t('articles.selectProject') as string}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('articles.title') as string}
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('articles.content') as string}
              variant="outlined"
              multiline
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateArticle}
              disabled={loading || !title || !content || !selectedProject}
            >
              {t('articles.create') as string}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default NewArticlePage;
