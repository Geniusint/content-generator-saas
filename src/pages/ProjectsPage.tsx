import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../components/auth/AuthProvider';
import { firestoreService, Project } from '../services/firestore';
import { Timestamp } from 'firebase/firestore';

const initialProjectState: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'articleCount'> = {
  name: '',
  site: {
    id: '',
    name: ''
  },
  persona: {
    id: '',
    name: ''
  },
  status: 'draft'
};

export const ProjectsPage = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<typeof initialProjectState>(initialProjectState);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (currentUser) {
      loadProjects();
    }
  }, [currentUser]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const snapshot = await firestoreService.getProjects();
      const loadedProjects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(loadedProjects);
      setError(null);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (edit: boolean = false, project?: Project) => {
    if (edit && project) {
      setCurrentProject({
        name: project.name,
        site: project.site,
        persona: project.persona,
        status: project.status
      });
      setSelectedProjectId(project.id);
    } else {
      setCurrentProject(initialProjectState);
      setSelectedProjectId(null);
    }
    setEditMode(edit);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentProject(initialProjectState);
    setSelectedProjectId(null);
  };

  const handleSaveProject = async () => {
    if (!currentUser) {
      setSnackbar({
        open: true,
        message: 'Vous devez être connecté pour créer un projet',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      
      if (editMode && selectedProjectId) {
        await firestoreService.updateProject(selectedProjectId, currentProject);
        setSnackbar({
          open: true,
          message: 'Projet mis à jour avec succès',
          severity: 'success'
        });
      } else {
        await firestoreService.createProject(currentProject);
        setSnackbar({
          open: true,
          message: 'Projet créé avec succès',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
      await loadProjects();
      
    } catch (error) {
      console.error('Error saving project:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde du projet',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      setLoading(true);
      await firestoreService.delete('projects', projectId);
      setSnackbar({
        open: true,
        message: 'Projet supprimé avec succès',
        severity: 'success'
      });
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression du projet',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Mes Projets
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nouveau Projet
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Typography>Chargement des projets...</Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} key={project.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">
                        {project.name}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Créé le {formatDate(project.createdAt)}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Status: {project.status}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleOpenDialog(true, project)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => project.id && handleDeleteProject(project.id)} 
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Site: {project.site.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Persona: {project.persona.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Articles: {project.articleCount || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Modifier le projet' : 'Nouveau projet'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom du projet"
              value={currentProject.name}
              onChange={(e) => setCurrentProject(prev => ({ ...prev, name: e.target.value }))}
              required
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSaveProject}
            variant="contained"
            disabled={loading}
          >
            {editMode ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
