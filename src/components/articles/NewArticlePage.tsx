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
import { firestoreService, Project, Persona, Site } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';

const NewArticlePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
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
      const project = await firestoreService.getProject(selectedProject) as Project;
      let persona: Persona | null = null;
      let site: Site | null = null;

      if (project.persona?.id) {
        persona = await firestoreService.getPersona(project.persona.id) as Persona;
      }
      if (project.site?.id) {
          site = await firestoreService.getSite(project.site.id) as Site;
      }

      let prompt = `En tant que ${persona?.profession} ${persona?.niveau_expertise}, rédige un article sur le sujet suivant: ${title}. `;

      if (persona) {
        prompt += `Utilise tes compétences et tes connaissances pour aborder ce sujet. Tes objectifs sont: ${persona.objectifs.join(', ')}. Tes défis sont: ${persona.defis.join(', ')}. Tes sujets d'intérêt sont: ${persona.sujets_interet.join(', ')}. Tu préfères un style de langage ${persona.style_langage_prefere} et une tonalité ${persona.tonalite_preferee}. `;
      }

      if (site) {
        prompt += `L'article sera publié sur le site web ${site.name} (${site.url}). Le type de site est ${site.siteType} et l'audience cible est: ${site.targetAudience.join(', ')}. `;
      }

      const articleData = {
        title,
        content: '',
        authorId: currentUser.uid,
        createdAt: new Date().toISOString(),
        projectId: selectedProject,
        status: 'draft' as 'draft',
        publishDate: new Date().toISOString(),
        persona: persona?.id ?? 'default',
        wordCount: 0,
      };
      alert('Prompt généré: ' + prompt);
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateArticle}
              disabled={loading || !title || !selectedProject}
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
