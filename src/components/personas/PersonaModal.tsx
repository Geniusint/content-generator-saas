import React, { useState } from 'react';
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
} from '@mui/material';
import { Persona } from '../../services/firestore';

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
  const [formData, setFormData] = React.useState<Omit<Persona, 'id' | 'userId'>>(initialData ? {
    prenom: initialData.prenom,
    nom: initialData.nom,
    age: initialData.age,
    profession: initialData.profession,
    niveau_expertise: initialData.niveau_expertise,
    objectifs: initialData.objectifs,
    defis: initialData.defis,
    sujets_interet: initialData.sujets_interet,
    style_langage_prefere: initialData.style_langage_prefere,
    tonalite_preferee: initialData.tonalite_preferee,
    sources_information_habituelles: initialData.sources_information_habituelles,
    langue: initialData.langue
  } : initialPersonaState);

  const [errors, setErrors] = useState({
    prenom: false,
    nom: false
  });

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
    // Validate required fields
    const newErrors = {
      prenom: !formData.prenom.trim(),
      nom: !formData.nom.trim()
    };
    
    setErrors(newErrors);

    // If there are any errors, don't submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

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
              label="Prénom"
              value={formData.prenom}
              onChange={(e) => handleChange('prenom', e.target.value)}
              required
              error={errors.prenom}
              helperText={errors.prenom ? "Le prénom est requis" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              required
              error={errors.nom}
              helperText={errors.nom ? "Le nom est requis" : ""}
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
              label="Profession"
              value={formData.profession}
              onChange={(e) => handleChange('profession', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Niveau d'expertise</InputLabel>
              <Select
                value={formData.niveau_expertise}
                onChange={(e) => handleChange('niveau_expertise', e.target.value)}
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
                value={formData.langue}
                onChange={(e) => handleChange('langue', e.target.value)}
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
              value={formData.objectifs.join(', ')}
              onChange={(e) => handleArrayChange('objectifs', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Défis (séparés par des virgules)"
              value={formData.defis.join(', ')}
              onChange={(e) => handleArrayChange('defis', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Sujets d'intérêt (séparés par des virgules)"
              value={formData.sujets_interet.join(', ')}
              onChange={(e) => handleArrayChange('sujets_interet', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Style de langage préféré</InputLabel>
              <Select
                value={formData.style_langage_prefere}
                onChange={(e) => handleChange('style_langage_prefere', e.target.value)}
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
                value={formData.tonalite_preferee}
                onChange={(e) => handleChange('tonalite_preferee', e.target.value)}
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
              value={formData.sources_information_habituelles.join(', ')}
              onChange={(e) => handleArrayChange('sources_information_habituelles', e.target.value)}
              multiline
              rows={2}
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
