import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@mui/material';
import { Persona } from '../../services/firestore';

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

interface PersonaModalProps {
  open: boolean;
  onClose: () => void;
  onPersonaCreated: (persona: Omit<Persona, 'id' | 'userId'>) => void;
  initialData?: Persona;
  isEdit?: boolean;
}

export const PersonaModal: React.FC<PersonaModalProps> = ({
  open,
  onClose,
  onPersonaCreated,
  initialData,
  isEdit = false
}) => {
  const [formData, setFormData] = React.useState<Omit<Persona, 'id' | 'userId'>>(
    initialData ? {
      name: initialData.name,
      avatar: initialData.avatar,
      role: initialData.role,
      age: initialData.age,
      location: initialData.location,
      language: initialData.language,
      education: initialData.education,
      interests: initialData.interests,
      goals: initialData.goals,
      painPoints: initialData.painPoints,
      preferredContent: initialData.preferredContent,
      tone: initialData.tone,
      description: initialData.description
    } : initialPersonaState
  );

  const handleChange = (field: keyof Omit<Persona, 'id' | 'userId'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof Omit<Persona, 'id' | 'userId'>, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({
      ...prev,
      [field]: arrayValue
    }));
  };

  const handleSubmit = () => {
    onPersonaCreated(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Modifier le persona' : 'Nouveau persona'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Rôle"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Âge"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Localisation"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Langue</InputLabel>
              <Select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
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
              value={formData.education}
              onChange={(e) => handleChange('education', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Centres d'intérêt (séparés par des virgules)"
              value={formData.interests.join(', ')}
              onChange={(e) => handleArrayChange('interests', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Objectifs (séparés par des virgules)"
              value={formData.goals.join(', ')}
              onChange={(e) => handleArrayChange('goals', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Points de friction (séparés par des virgules)"
              value={formData.painPoints.join(', ')}
              onChange={(e) => handleArrayChange('painPoints', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Types de contenu préférés (séparés par des virgules)"
              value={formData.preferredContent.join(', ')}
              onChange={(e) => handleArrayChange('preferredContent', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ton de communication"
              value={formData.tone}
              onChange={(e) => handleChange('tone', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEdit ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
