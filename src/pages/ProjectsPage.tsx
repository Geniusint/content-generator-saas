import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Chip, 
  LinearProgress, 
  Container, 
  Dialog 
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import WebIcon from '@mui/icons-material/Web';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { firestoreService } from '../services/firestore';
import { useAuth } from '../components/auth/AuthProvider';
import { Project } from '../services/firestore';
import { ProjectForm } from '../components/projects/ProjectForm';

export const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  const [projects, setProjects] = useState<(Project & { id: string })[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) return;

      try {
        const projectsSnapshot = await firestoreService.getProjects();
        const projectsData = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project & { id: string }));

        setProjects(projectsData);
        setProjectsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des projets', error);
        setProjectsLoading(false);
      }
    };

    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  const getStatusColor = (status: Project['status']): 'success' | 'primary' | 'warning' | 'secondary' => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'draft': return 'warning';
      default: return 'secondary';
    }
  };

  const renderProjectCard = (project: Project & { id: string }) => (
    <Grid item xs={12} sm={6} md={4} key={project.id}>
      <Card 
        elevation={3} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="div">
              {project.name}
            </Typography>
            <Chip 
              label={project.status} 
              color={getStatusColor(project.status)} 
              size="small" 
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <WebIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {project.site.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {project.persona.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ArticleIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {project.articleCount} articles
            </Typography>
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={project.status === 'completed' ? 100 : 50} 
            color={getStatusColor(project.status)}
          />
        </CardContent>

        <CardActions>
          <Button 
            size="small" 
            color="primary" 
            onClick={() => navigate(`/project/${project.id}`)}
          >
            Détails du projet
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  const handleProjectCreated = () => {
    setIsCreateProjectModalOpen(false);
    // Optionnel : rafraîchir la liste des projets
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography variant="h4" component="h1">
          {t('projects.myProjects') as string}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateProjectModalOpen(true)}
        >
          {t('projects.createNew') as string}
        </Button>
      </Box>

      {projectsLoading ? (
        <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
          <Typography variant="body1">
            Chargement de vos projets...
          </Typography>
        </Box>
      ) : projects.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '50vh' 
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Vous n'avez pas encore de projets
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateProjectModalOpen(true)}
          >
            Créer mon premier projet
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map(renderProjectCard)}
        </Grid>
      )}

      <Dialog
        open={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <ProjectForm 
          onProjectCreated={handleProjectCreated}
          onClose={() => setIsCreateProjectModalOpen(false)}
          mode="modal" 
        />
      </Dialog>
    </Container>
  );
};
