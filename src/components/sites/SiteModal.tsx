import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { firestoreService } from '../../services/firestore';
import { useAuth } from '../auth/AuthProvider';
import type { Site as FirestoreSite } from '../../services/firestore';

interface SiteModalProps {
  open: boolean;
  onClose: () => void;
  onSiteCreated?: (site: FirestoreSite) => void;
  siteId?: string | null;
}

export const SiteModal: React.FC<SiteModalProps> = ({ 
  open, 
  onClose, 
  onSiteCreated,
  siteId 
}) => {
  const { currentUser } = useAuth();
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [wpUsername, setWpUsername] = useState('');
  const [wpAppPassword, setWpAppPassword] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [siteType, setSiteType] = useState<'wordpress' | 'custom'>('wordpress');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const loadSiteData = async () => {
      if (siteId && open) {
        try {
          const siteData = await firestoreService.getSite(siteId);
          if (siteData) {
            setSiteName(siteData.name);
            setSiteUrl(siteData.url || '');
            setWpUsername(siteData.wpUsername || '');
            setWpAppPassword(siteData.wpAppPassword || '');
            setCategories(siteData.categories || []);
            setCategoryInput(siteData.categories?.join(', ') || '');
            setSiteType(siteData.type);
          }
        } catch (error) {
          console.error('Erreur lors du chargement du site:', error);
        }
      }
    };

    loadSiteData();
  }, [siteId, open]);

  useEffect(() => {
    if (!open) {
      // Réinitialiser le formulaire à la fermeture
      setSiteName('');
      setSiteUrl('');
      setWpUsername('');
      setWpAppPassword('');
      setCategoryInput('');
      setCategories([]);
      setSiteType('wordpress');
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!siteName.trim()) {
      newErrors.name = 'Le nom du site est requis';
    }

    if (siteType === 'wordpress') {
      if (!siteUrl.trim()) {
        newErrors.url = "L'URL du site est requise";
      } else if (!/^https?:\/\/.+/.test(siteUrl)) {
        newErrors.url = "L'URL doit commencer par http:// ou https://";
      }

      if (!wpUsername.trim()) {
        newErrors.username = "L'identifiant WordPress est requis";
      }

      if (!wpAppPassword.trim()) {
        newErrors.password = "Le mot de passe d'application est requis";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategoryInput(value);
    // Convertir la chaîne en tableau de catégories
    const categoriesArray = value.split(',')
      .map(cat => cat.trim())
      .filter(cat => cat !== '');
    setCategories(categoriesArray);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!currentUser) {
      console.error('Validation échouée: utilisateur non connecté');
      return;
    }

    setLoading(true);
    try {
      const siteData: Omit<FirestoreSite, 'id' | 'userId'> = {
        name: siteName.trim(),
        url: siteUrl.trim(),
        type: siteType,
        wpUsername: siteType === 'wordpress' ? wpUsername.trim() : '',
        wpAppPassword: siteType === 'wordpress' ? wpAppPassword.trim() : '',
        status: 'pending' as const,
        lastSync: new Date().toISOString(),
        articlesCount: 0,
        autoPublish: false,
        categories: categories
      };

      let savedSite: FirestoreSite;

      if (siteId) {
        // Modification
        await firestoreService.updateSite(siteId, siteData);
        savedSite = {
          id: siteId,
          userId: currentUser.uid,
          ...siteData
        };
      } else {
        // Création
        const newSiteRef = await firestoreService.createSite(siteData);
        savedSite = {
          id: newSiteRef.id,
          userId: currentUser.uid,
          ...siteData
        };
      }

      if (onSiteCreated) {
        onSiteCreated(savedSite);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du site', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{siteId ? 'Modifier le site' : 'Créer un nouveau site'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nom du site"
          fullWidth
          variant="outlined"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Type de site</InputLabel>
          <Select
            value={siteType}
            label="Type de site"
            onChange={(e) => setSiteType(e.target.value as 'wordpress' | 'custom')}
          >
            <MenuItem value="wordpress">Site WordPress</MenuItem>
            <MenuItem value="custom">Site personnalisé</MenuItem>
          </Select>
        </FormControl>

        {siteType === 'wordpress' && (
          <>
            <TextField
              margin="dense"
              label="URL du site (http:// ou https://)"
              fullWidth
              variant="outlined"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              error={!!errors.url}
              helperText={errors.url}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="Identifiant WordPress"
              fullWidth
              variant="outlined"
              value={wpUsername}
              onChange={(e) => setWpUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="Mot de passe d'application WordPress"
              fullWidth
              variant="outlined"
              type="password"
              value={wpAppPassword}
              onChange={(e) => setWpAppPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
            />
          </>
        )}

        <TextField
          margin="dense"
          label="Catégories (séparées par des virgules)"
          fullWidth
          variant="outlined"
          value={categoryInput}
          onChange={handleCategoryChange}
          helperText="Ex: Technologie, Marketing, Business"
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading}
        >
          {siteId ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
