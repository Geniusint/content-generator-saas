import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  LinearProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed';
  articlesCount: number;
  progress: number;
  lastUpdate: string;
  targetArticles: number;
}

export const ProjectsList = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Données simulées
  const projects: Project[] = [
    {
      id: '1',
      name: 'Blog Tech Innovation',
      description: 'Articles sur les dernières tendances technologiques',
      status: 'active',
      articlesCount: 8,
      progress: 65,
      lastUpdate: '2024-01-15',
      targetArticles: 12
    },
    {
      id: '2',
      name: 'Newsletter Hebdomadaire',
      description: 'Newsletter hebdomadaire sur l\'actualité tech',
      status: 'active',
      articlesCount: 12,
      progress: 85,
      lastUpdate: '2024-01-14',
      targetArticles: 14
    },
    {
      id: '3',
      name: 'Guide Marketing Digital',
      description: 'Guide complet sur le marketing digital',
      status: 'completed',
      articlesCount: 15,
      progress: 100,
      lastUpdate: '2024-01-10',
      targetArticles: 15
    }
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(projectId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleEditClick = () => {
    setEditMode(true);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleArchiveClick = () => {
    // Logique d'archivage
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    // Logique de suppression
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const getStatusColor = (status: 'active' | 'completed') => {
    return status === 'active' ? 'primary' : 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Mes Projets
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/new-project"
        >
          Nouveau Projet
        </Button>
      </Box>

      {/* Liste des projets */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {project.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, project.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={project.status === 'active' ? 'Actif' : 'Terminé'}
                    color={getStatusColor(project.status)}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Progression: {project.progress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Articles: {project.articlesCount}/{project.targetArticles}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mis à jour le {new Date(project.lastUpdate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/projects/${project.id}`}>
                  Voir les détails
                </Button>
                <Button size="small" component={Link} to={`/projects/${project.id}/articles`}>
                  Voir les articles
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Menu contextuel */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={handleArchiveClick}>
          <ArchiveIcon fontSize="small" sx={{ mr: 1 }} />
          Archiver
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Dialog d'édition */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editMode ? 'Modifier le projet' : 'Nouveau projet'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du projet"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Nombre d'articles cible"
            type="number"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleCloseDialog} variant="contained">
            {editMode ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
