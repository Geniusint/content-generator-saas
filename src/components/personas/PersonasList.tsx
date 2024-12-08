import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  Work as WorkIcon,
  School as EducationIcon,
  Interests as InterestsIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
import { firestoreService } from '../../services/firestore';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface Persona {
  id: string;
  name: string;
  avatar: string;
  role: string;
  age: number;
  location: string;
  languages: string[];
  education: string;
  interests: string[];
  goals: string[];
  painPoints: string[];
  preferredContent: string[];
}

export const PersonasList = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPersonas = async () => {
      if (!currentUser) return;

      try {
        const personasSnapshot = await firestoreService.getPersonas();
        const personasData = personasSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data()
        } as Persona));

        setPersonas(personasData);
      } catch (error) {
        console.error('Erreur lors de la récupération des personas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, [currentUser]);

  const handleOpenDialog = (edit: boolean = false) => {
    setEditMode(edit);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, personaId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPersona(personaId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPersona(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    handleOpenDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Mes Personas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(false)}
        >
          Nouveau Persona
        </Button>
      </Box>

      {/* Liste des personas */}
      {loading ? (
        <Typography variant="body1">Chargement des personas...</Typography>
      ) : (
        <Grid container spacing={3}>
          {personas.map((persona) => (
            <Grid item xs={12} md={6} key={persona.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        src={persona.avatar}
                        alt={persona.name}
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box>
                        <Typography variant="h6" component="div">
                          {persona.name}
                        </Typography>
                        <Typography color="text.secondary">
                          {persona.role}, {persona.age} ans
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, persona.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon />
                      </ListItemIcon>
                      <ListItemText primary={persona.location} />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <LanguageIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={persona.languages.join(', ')}
                        secondary="Langues"
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <EducationIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={persona.education}
                        secondary="Formation"
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Centres d'intérêt
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {persona.interests.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Objectifs principaux
                  </Typography>
                  <List dense>
                    {persona.goals.map((goal, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={goal} />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="subtitle2" gutterBottom>
                    Points de friction
                  </Typography>
                  <List dense>
                    {persona.painPoints.map((point, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={point} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenDialog(true)}>
                    Modifier
                  </Button>
                  <Button size="small">
                    Utiliser pour un article
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
        <MenuItem onClick={handleMenuClose}>
          <PersonIcon fontSize="small" sx={{ mr: 1 }} />
          Utiliser
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Dialog d'édition/création */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Modifier le persona' : 'Nouveau persona'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rôle"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Âge"
                type="number"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Localisation"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Formation"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Centres d'intérêt (séparés par des virgules)"
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Objectifs (séparés par des virgules)"
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Points de friction (séparés par des virgules)"
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Types de contenu préférés (séparés par des virgules)"
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
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
