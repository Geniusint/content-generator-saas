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
  MenuItem,
  Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
import { firestoreService } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';

const NewArticlePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        console.error(t('articles.errorLoading'), error);
        setError(t('articles.errorLoading'));
      }
    };

    fetchProjects();
  }, [currentUser, t]);

  const handleCreateArticle = async () => {
    if (!currentUser?.uid || !selectedProject) {
      setError(t('articles.errorCreating'));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const articleData = {
        title,
        content,
        authorId: currentUser.uid,
        createdAt: new Date().toISOString(),
        projectId: selectedProject,
        status: 'draft' as 'draft',
        publishDate: new Date().toISOString(),
        persona: 'default',
        wordCount: content.split(' ').length,
      };

      await firestoreService.createArticle(articleData);
      navigate('/articles');
    } catch (error) {
      console.error(t('articles.errorCreating'), error);
      setError(t('articles.errorCreating'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('articles.createNewArticle')}
      </Typography>
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>{t('articles.selectProject')}</InputLabel>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value as string)}
                label={t('articles.selectProject')}
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
              label={t('articles.title')}
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('articles.content')}
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
              {loading ? '...' : t('articles.create')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default NewArticlePage;
