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
  OutlinedInput,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  Work as WorkIcon,
  School as EducationIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
import { firestoreService, Persona } from '../../services/firestore';
import { generatePersona } from '../../services/openai';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

const initialPersonaState: Omit<Persona, 'id' | 'userId'> = {
  prenom: '',
  nom: '',
  age: 0,
  profession: '',
  niveau_expertise: 'novice',
  objectifs: [],
  defis: [],
  sujets_interet: [],
  style_langage_prefere: 'simple',
  tonalite_preferee: 'pédagogique',
  sources_information_habituelles: [],
  langue: 'fr'
};

const niveauxExpertise = ['novice', 'intermédiaire', 'expert'];
const stylesLangage = ['simple', 'neutre', 'soutenu'];
const tonalites = ['pédagogique', 'humoristique', 'sérieux'];

const langues = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'Anglais' },
  { code: 'es', name: 'Espagnol' },
  { code: 'de', name: 'Allemand' },
  { code: 'it', name: 'Italien' }
];

const categoryColors = {
  sujets_interet: '#e3f2fd',
  objectifs: '#f3e5f5',
  defis: '#ffebee'
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
  const [openAIDialog, setOpenAIDialog] = useState(false);
  const [personaDescription, setPersonaDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Omit<Persona, 'id' | 'userId'>>({
    ...initialPersonaState,
    objectifs: [],
    defis: [],
    sujets_interet: [],
    sources_information_habituelles: []
  });
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error' | 'info'}>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    profession: 'all',
    langue: 'all',
    niveau_expertise: 'all'
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

    if (filters.searchTerm) {
      filtered = filtered.filter(persona => 
        `${persona.prenom} ${persona.nom}`.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        persona.profession.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.profession !== 'all') {
      filtered = filtered.filter(persona => persona.profession === filters.profession);
    }

    if (filters.langue !== 'all') {
      filtered = filtered.filter(persona => persona.langue === filters.langue);
    }

    if (filters.niveau_expertise !== 'all') {
      filtered = filtered.filter(persona => persona.niveau_expertise === filters.niveau_expertise);
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
        prenom: persona.prenom,
        nom: persona.nom,
        age: persona.age,
        profession: persona.profession,
        niveau_expertise: persona.niveau_expertise,
        objectifs: persona.objectifs || [],
        defis: persona.defis || [],
        sujets_interet: persona.sujets_interet || [],
        style_langage_prefere: persona.style_langage_prefere,
        tonalite_preferee: persona.tonalite_preferee,
        sources_information_habituelles: persona.sources_information_habituelles || [],
        langue: persona.langue
      });
      setSelectedPersonaId(persona.id);
    } else {
      setCurrentPersona({
        ...initialPersonaState,
        objectifs: [],
        defis: [],
        sujets_interet: [],
        sources_information_habituelles: []
      });
      setSelectedPersonaId(null);
    }
    setEditMode(edit);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentPersona({
      ...initialPersonaState,
      objectifs: [],
      defis: [],
      sujets_interet: [],
      sources_information_habituelles: []
    });
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
    if (!persona.prenom.trim() || !persona.nom.trim()) {
      setSnackbar({
        open: true,
        message: 'Le prénom et le nom sont requis',
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

  const handleGeneratePersona = async () => {
    if (!personaDescription.trim()) {
      setSnackbar({
        open: true,
        message: 'Veuillez fournir une description pour générer le persona',
        severity: 'error'
      });
      return;
    }

    const description = personaDescription;
    setOpenAIDialog(false);
    setPersonaDescription('');
    setIsGenerating(true);
    setSnackbar({
      open: true,
      message: 'Génération du persona en cours...',
      severity: 'info'
    });

    try {
      const generatedPersona = await generatePersona(description);
      await firestoreService.createPersona(generatedPersona);
      setSnackbar({
        open: true,
        message: 'Persona généré et sauvegardé avec succès',
        severity: 'success'
      });
      await loadPersonas();
    } catch (error) {
      console.error('Erreur lors de la génération du persona:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la génération du persona',
        severity: 'error'
      });
    } finally {
      setIsGenerating(false);
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

  const uniqueProfessions = Array.from(new Set(personas.map(p => p.profession))).filter(Boolean);

  const getLanguageName = (code: string): string => {
    const language = langues.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Mes Personas
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <PsychologyIcon />}
            onClick={() => setOpenAIDialog(true)}
            color="secondary"
            disabled={isGenerating}
          >
            {isGenerating ? 'Génération en cours...' : 'Créer avec l\'IA'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nouveau Persona
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Rechercher"
              variant="outlined"
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Profession</InputLabel>
              <Select
                value={filters.profession}
                onChange={(e) => setFilters(prev => ({ ...prev, profession: e.target.value }))}
                input={<OutlinedInput label="Profession" />}
              >
                <MenuItem value="all">Toutes les professions</MenuItem>
                {uniqueProfessions.map((profession) => (
                  <MenuItem key={profession} value={profession}>{profession}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Langue</InputLabel>
              <Select
                value={filters.langue}
                onChange={(e) => setFilters(prev => ({ ...prev, langue: e.target.value }))}
                input={<OutlinedInput label="Langue" />}
              >
                <MenuItem value="all">Toutes les langues</MenuItem>
                {langues.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Niveau d'expertise</InputLabel>
              <Select
                value={filters.niveau_expertise}
                onChange={(e) => setFilters(prev => ({ ...prev, niveau_expertise: e.target.value }))}
                input={<OutlinedInput label="Niveau d'expertise" />}
              >
                <MenuItem value="all">Tous les niveaux</MenuItem>
                {niveauxExpertise.map((niveau) => (
                  <MenuItem key={niveau} value={niveau}>
                    {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
                  </MenuItem>
                ))}
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
                      <Avatar sx={{ width: 60, height: 60 }}>
                        {persona.prenom.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {persona.prenom} {persona.nom}
                        </Typography>
                        <Typography color="text.secondary">
                          {persona.profession}, {persona.age} ans
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
                        <WorkIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={persona.profession}
                        secondary={`Niveau: ${persona.niveau_expertise}`}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <LanguageIcon />
                      </ListItemIcon>
                      <Chip
                        label={getLanguageName(persona.langue)}
                        size="small"
                        sx={{ bgcolor: categoryColors.sujets_interet }}
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Sujets d'intérêt
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(persona.sujets_interet || []).map((sujet, index) => (
                      <Chip
                        key={index}
                        label={sujet}
                        size="small"
                        sx={{ bgcolor: categoryColors.sujets_interet }}
                      />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Objectifs
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(persona.objectifs || []).map((objectif, index) => (
                      <Chip
                        key={index}
                        label={objectif}
                        size="small"
                        sx={{ bgcolor: categoryColors.objectifs }}
                      />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Défis
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(persona.defis || []).map((defi, index) => (
                      <Chip
                        key={index}
                        label={defi}
                        size="small"
                        sx={{ bgcolor: categoryColors.defis }}
                      />
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Style de langage préféré
                  </Typography>
                  <Typography variant="body2">
                    {persona.style_langage_prefere}
                  </Typography>

                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                    Tonalité préférée
                  </Typography>
                  <Typography variant="body2">
                    {persona.tonalite_preferee}
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
                label="Prénom"
                value={currentPersona.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                value={currentPersona.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                required
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
                label="Profession"
                value={currentPersona.profession}
                onChange={(e) => handleInputChange('profession', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Niveau d'expertise</InputLabel>
                <Select
                  value={currentPersona.niveau_expertise}
                  onChange={(e) => handleInputChange('niveau_expertise', e.target.value)}
                  label="Niveau d'expertise"
                >
                  {niveauxExpertise.map((niveau) => (
                    <MenuItem key={niveau} value={niveau}>
                      {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Langue</InputLabel>
                <Select
                  value={currentPersona.langue}
                  onChange={(e) => handleInputChange('langue', e.target.value)}
                  label="Langue"
                >
                  {langues.map((langue) => (
                    <MenuItem key={langue.code} value={langue.code}>
                      {langue.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Objectifs (séparés par des virgules)"
                value={currentPersona.objectifs.join(', ')}
                onChange={(e) => handleArrayInputChange('objectifs', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Défis (séparés par des virgules)"
                value={currentPersona.defis.join(', ')}
                onChange={(e) => handleArrayInputChange('defis', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sujets d'intérêt (séparés par des virgules)"
                value={currentPersona.sujets_interet.join(', ')}
                onChange={(e) => handleArrayInputChange('sujets_interet', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Style de langage préféré</InputLabel>
                <Select
                  value={currentPersona.style_langage_prefere}
                  onChange={(e) => handleInputChange('style_langage_prefere', e.target.value)}
                  label="Style de langage préféré"
                >
                  {stylesLangage.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tonalité préférée</InputLabel>
                <Select
                  value={currentPersona.tonalite_preferee}
                  onChange={(e) => handleInputChange('tonalite_preferee', e.target.value)}
                  label="Tonalité préférée"
                >
                  {tonalites.map((ton) => (
                    <MenuItem key={ton} value={ton}>
                      {ton.charAt(0).toUpperCase() + ton.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sources d'information habituelles (séparées par des virgules)"
                value={currentPersona.sources_information_habituelles.join(', ')}
                onChange={(e) => handleArrayInputChange('sources_information_habituelles', e.target.value)}
                multiline
                rows={2}
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
        open={openAIDialog}
        onClose={() => setOpenAIDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Créer un persona avec l'IA
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Décrivez le type de persona que vous souhaitez créer. Par exemple : "Un jeune professionnel du marketing digital qui cherche à se former sur l'intelligence artificielle"
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description du persona"
            value={personaDescription}
            onChange={(e) => setPersonaDescription(e.target.value)}
            placeholder="Décrivez le persona que vous souhaitez créer..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAIDialog(false)}>Annuler</Button>
          <Button
            onClick={handleGeneratePersona}
            variant="contained"
            disabled={loading || isGenerating}
            startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <PsychologyIcon />}
          >
            {isGenerating ? 'Génération...' : 'Générer'}
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
