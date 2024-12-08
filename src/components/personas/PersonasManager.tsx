import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  School as EducationIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
import { firestoreService, Persona } from '../../services/firestore';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

const initialPersonaState: Omit<Persona, 'id' | 'userId'> = {
  name: '',
  avatar: '',
  role: '',
  age: 0,
  location: '',
  language: '',
  education: '',
  interests: [],
  goals: [],
  painPoints: [],
  preferredContent: [],
  tone: 'neutral',
  description: ''
};

// Liste prédéfinie des langues
const predefinedLanguages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'Anglais' },
  { code: 'es', name: 'Espagnol' },
  { code: 'de', name: 'Allemand' },
  { code: 'it', name: 'Italien' },
  { code: 'pt', name: 'Portugais' },
  { code: 'nl', name: 'Néerlandais' },
  { code: 'ru', name: 'Russe' },
  { code: 'ar', name: 'Arabe' },
  { code: 'zh', name: 'Chinois' },
  { code: 'ja', name: 'Japonais' },
  { code: 'ko', name: 'Coréen' }
];

// Couleurs pour les différentes catégories
const categoryColors = {
  interests: '#e3f2fd',
  goals: '#f3e5f5',
  painPoints: '#ffebee',
  language: '#e8f5e9',
  preferredContent: '#fff3e0'
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const PersonasManager = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [filteredPersonas, setFilteredPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Omit<Persona, 'id' | 'userId'>>(initialPersonaState);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Filtres
  const [filters, setFilters] = useState({
    searchTerm: '',
    role: 'all',
    language: 'all',
    ageRange: 'all'
  });

  useEffect(() => {
    if (currentUser) {
      loadPersonas();
    }
  }, [currentUser]);

  useEffect(() => {
    applyFilters();
  }, [filters, personas]);

  const applyFilters = () => {
    let filtered = [...personas];

    // Filtre par terme de recherche
    if (filters.searchTerm) {
      filtered = filtered.filter(persona => 
        persona.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        persona.role.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        persona.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Filtre par rôle
    if (filters.role !== 'all') {
      filtered = filtered.filter(persona => persona.role === filters.role);
    }

    // Filtre par langue
    if (filters.language !== 'all') {
      filtered = filtered.filter(persona => 
        persona.language === filters.language
      );
    }

    // Filtre par tranche d'âge
    if (filters.ageRange !== 'all') {
      const [min, max] = filters.ageRange.split('-').map(Number);
      filtered = filtered.filter(persona => 
        persona.age >= min && persona.age <= (max || Infinity)
      );
    }

    setFilteredPersonas(filtered);
  };

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const snapshot = await firestoreService.getPersonas();
      const loadedPersonas = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      })) as Persona[];
      setPersonas(loadedPersonas);
      setFilteredPersonas(loadedPersonas);
      setError(null);
    } catch (error) {
      console.error('Error loading personas:', error);
      setError('Erreur lors du chargement des personas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (edit: boolean = false, persona?: Persona) => {
    if (edit && persona && persona.id) {
      setCurrentPersona({
        name: persona.name,
        avatar: persona.avatar,
        role: persona.role,
        age: persona.age,
        location: persona.location,
        language: persona.language,
        education: persona.education,
        interests: persona.interests,
        goals: persona.goals,
        painPoints: persona.painPoints,
        preferredContent: persona.preferredContent,
        tone: persona.tone,
        description: persona.description
      });
      setSelectedPersonaId(persona.id);
    } else {
      setCurrentPersona(initialPersonaState);
      setSelectedPersonaId(null);
    }
    setEditMode(edit);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentPersona(initialPersonaState);
    setSelectedPersonaId(null);
  };

  const handleDeleteClick = (personaId: string) => {
    setPersonaToDelete(personaId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!personaToDelete) return;
    
    try {
      setLoading(true);
      await firestoreService.deletePersona(personaToDelete);
      setSnackbar({
        open: true,
        message: 'Persona supprimé avec succès',
        severity: 'success'
      });
      await loadPersonas();
    } catch (error) {
      console.error('Error deleting persona:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression du persona',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setPersonaToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPersonaToDelete(null);
  };

  const validatePersona = (persona: Omit<Persona, 'id' | 'userId'>): boolean => {
    if (!persona.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Le nom est requis',
        severity: 'error'
      });
      return false;
    }
    if (persona.age < 0) {
      setSnackbar({
        open: true,
        message: "L'âge ne peut pas être négatif",
        severity: 'error'
      });
      return false;
    }
    return true;
  };

  const handleSavePersona = async () => {
    if (!validatePersona(currentPersona)) {
      return;
    }
    
    if (!currentUser) {
      setSnackbar({
        open: true,
        message: 'Vous devez être connecté pour créer un persona',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      
      if (editMode && selectedPersonaId) {
        await firestoreService.updatePersona(selectedPersonaId, currentPersona);
        setSnackbar({
          open: true,
          message: 'Persona mis à jour avec succès',
          severity: 'success'
        });
      } else {
        await firestoreService.createPersona(currentPersona);
        setSnackbar({
          open: true,
          message: 'Persona créé avec succès',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
      await loadPersonas();
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde du persona',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<Persona, 'id' | 'userId'>, value: any) => {
    setCurrentPersona(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: keyof Omit<Persona, 'id' | 'userId'>, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setCurrentPersona(prev => ({
      ...prev,
      [field]: arrayValue
    }));
  };

  // Obtenir les valeurs uniques pour les filtres
  const uniqueRoles = Array.from(new Set(personas.map(p => p.role))).filter(Boolean);

  // Fonction pour obtenir le nom complet de la langue à partir du code
  const getLanguageName = (code: string): string => {
    const language = predefinedLanguages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Mes Personas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nouveau Persona
        </Button>
      </Box>

      {/* Section des filtres */}
      <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Rechercher"
              variant="outlined"
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                input={<OutlinedInput label="Rôle" />}
              >
                <MenuItem value="all">Tous les rôles</MenuItem>
                {uniqueRoles.map((role) => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Langue</InputLabel>
              <Select
                value={filters.language}
                onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                input={<OutlinedInput label="Langue" />}
              >
                <MenuItem value="all">Toutes les langues</MenuItem>
                {predefinedLanguages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Âge</InputLabel>
              <Select
                value={filters.ageRange}
                onChange={(e) => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
                input={<OutlinedInput label="Âge" />}
              >
                <MenuItem value="all">Tous les âges</MenuItem>
                <MenuItem value="18-25">18-25 ans</MenuItem>
                <MenuItem value="26-35">26-35 ans</MenuItem>
                <MenuItem value="36-50">36-50 ans</MenuItem>
                <MenuItem value="51">51+ ans</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Typography>Chargement des personas...</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredPersonas.map((persona) => (
            <Grid item xs={12} md={6} key={persona.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        src={persona.avatar}
                        alt={persona.name}
                        sx={{ width: 60, height: 60 }}
                      >
                        {persona.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {persona.name}
                        </Typography>
                        <Typography color="text.secondary">
                          {persona.role}, {persona.age} ans
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleOpenDialog(true, persona)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => persona.id && handleDeleteClick(persona.id)} 
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
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
                      <Chip
                        label={getLanguageName(persona.language)}
                        size="small"
                        sx={{ bgcolor: categoryColors.language }}
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
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {persona.interests.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        size="small"
                        sx={{ bgcolor: categoryColors.interests }}
                      />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Objectifs
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {persona.goals.map((goal, index) => (
                      <Chip
                        key={index}
                        label={goal}
                        size="small"
                        sx={{ bgcolor: categoryColors.goals }}
                      />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Points de friction
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {persona.painPoints.map((point, index) => (
                      <Chip
                        key={index}
                        label={point}
                        size="small"
                        sx={{ bgcolor: categoryColors.painPoints }}
                      />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Types de contenu préférés
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {persona.preferredContent.map((content, index) => (
                      <Chip
                        key={index}
                        label={content}
                        size="small"
                        sx={{ bgcolor: categoryColors.preferredContent }}
                      />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {persona.description}
                  </Typography>

                  <Typography variant="subtitle2" gutterBottom>
                    Ton de communication
                  </Typography>
                  <Typography variant="body2">
                    {persona.tone}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
                value={currentPersona.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rôle"
                value={currentPersona.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Âge"
                type="number"
                value={currentPersona.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Localisation"
                value={currentPersona.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Langue</InputLabel>
                <Select
                  value={currentPersona.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  input={<OutlinedInput label="Langue" />}
                >
                  {predefinedLanguages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Formation"
                value={currentPersona.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Centres d'intérêt (séparés par des virgules)"
                value={currentPersona.interests.join(', ')}
                onChange={(e) => handleArrayInputChange('interests', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Objectifs (séparés par des virgules)"
                value={currentPersona.goals.join(', ')}
                onChange={(e) => handleArrayInputChange('goals', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Points de friction (séparés par des virgules)"
                value={currentPersona.painPoints.join(', ')}
                onChange={(e) => handleArrayInputChange('painPoints', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Types de contenu préférés (séparés par des virgules)"
                value={currentPersona.preferredContent.join(', ')}
                onChange={(e) => handleArrayInputChange('preferredContent', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={currentPersona.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ton de communication"
                value={currentPersona.tone}
                onChange={(e) => handleInputChange('tone', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSavePersona}
            variant="contained"
            disabled={loading}
          >
            {editMode ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce persona ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
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
