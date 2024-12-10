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
  InputLabel,
  Box
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
  const [sitemap, setSitemap] = useState('');
  const [wpUsername, setWpUsername] = useState('');
  const [wpAppPassword, setWpAppPassword] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [siteType, setSiteType] = useState<'wordpress' | 'custom'>('wordpress');
  const [websiteType, setWebsiteType] = useState<'ecommerce' | 'blog' | 'corporate' | 'portfolio' | 'educational' | 'news'>('blog');
  const [targetAudienceInput, setTargetAudienceInput] = useState('');
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
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
            setSitemap(siteData.sitemap || '');
            setWpUsername(siteData.wpUsername || '');
            setWpAppPassword(siteData.wpAppPassword || '');
            setCategories(siteData.categories || []);
            setCategoryInput(siteData.categories?.join(', ') || '');
            setSiteType(siteData.type);
            setWebsiteType(siteData.siteType);
            setTargetAudience(siteData.targetAudience || []);
            setTargetAudienceInput(siteData.targetAudience?.join(', ') || '');
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
      setSitemap('');
      setWpUsername('');
      setWpAppPassword('');
      setCategoryInput('');
      setCategories([]);
      setSiteType('wordpress');
      setWebsiteType('blog');
      setTargetAudienceInput('');
      setTargetAudience([]);
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

    if (sitemap && !/^https?:\/\/.+/.test(sitemap)) {
      newErrors.sitemap = "L'URL du sitemap doit commencer par http:// ou https://";
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

  const handleTargetAudienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTargetAudienceInput(value);
    // Convertir la chaîne en tableau
    const audienceArray = value.split(',')
      .map(audience => audience.trim())
      .filter(audience => audience !== '');
    setTargetAudience(audienceArray);
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
      // S'assurer que toutes les données du formulaire sont incluses
      const siteData: Omit<FirestoreSite, 'id' | 'userId'> = {
        name: siteName.trim(),
        url: siteUrl.trim(),
        sitemap: sitemap.trim() || undefined,
        type: siteType,
        siteType: websiteType,
        targetAudience: targetAudience,
        wpUsername: siteType === 'wordpress' ? wpUsername.trim() : '',
        wpAppPassword: siteType === 'wordpress' ? wpAppPassword.trim() : '',
        status: 'pending' as const,
        lastSync: new Date().toISOString(),
        articlesCount: 0,
        autoPublish: false,
        categories: categories
      };

      console.log('Données du site à sauvegarder:', JSON.stringify(siteData, null, 2));

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
        savedSite = await firestoreService.createSite(siteData);
      }

      console.log('Site sauvegardé avec succès:', JSON.stringify(savedSite, null, 2));

      if (onSiteCreated) {
        onSiteCreated(savedSite);
      }
      onClose();
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            autoFocus
            label="Nom du site"
            fullWidth
            variant="outlined"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          
          <FormControl fullWidth variant="outlined">
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

          <FormControl fullWidth variant="outlined">
            <InputLabel>Type de contenu</InputLabel>
            <Select
              value={websiteType}
              label="Type de contenu"
              onChange={(e) => setWebsiteType(e.target.value as 'ecommerce' | 'blog' | 'corporate' | 'portfolio' | 'educational' | 'news')}
            >
              <MenuItem value="ecommerce">E-commerce</MenuItem>
              <MenuItem value="blog">Blog</MenuItem>
              <MenuItem value="corporate">Site d'entreprise</MenuItem>
              <MenuItem value="portfolio">Portfolio</MenuItem>
              <MenuItem value="educational">Site éducatif</MenuItem>
              <MenuItem value="news">Site d'actualités</MenuItem>
            </Select>
          </FormControl>

          {siteType === 'wordpress' && (
            <>
              <TextField
                label="URL du site (http:// ou https://)"
                fullWidth
                variant="outlined"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                error={!!errors.url}
                helperText={errors.url}
              />
              
              <TextField
                label="URL du sitemap (optionnel)"
                fullWidth
                variant="outlined"
                value={sitemap}
                onChange={(e) => setSitemap(e.target.value)}
                error={!!errors.sitemap}
                helperText={errors.sitemap || "Ex: https://monsite.com/sitemap.xml"}
              />
              
              <TextField
                label="Identifiant WordPress"
                fullWidth
                variant="outlined"
                value={wpUsername}
                onChange={(e) => setWpUsername(e.target.value)}
                error={!!errors.username}
                helperText={errors.username}
              />
              
              <TextField
                label="Mot de passe d'application WordPress"
                fullWidth
                variant="outlined"
                type="password"
                value={wpAppPassword}
                onChange={(e) => setWpAppPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />
            </>
          )}

          <TextField
            label="Public cible (séparé par des virgules)"
            fullWidth
            variant="outlined"
            value={targetAudienceInput}
            onChange={handleTargetAudienceChange}
            helperText="Ex: Entrepreneurs, Étudiants, Professionnels"
          />

          <TextField
            label="Catégories (séparées par des virgules)"
            fullWidth
            variant="outlined"
            value={categoryInput}
            onChange={handleCategoryChange}
            helperText="Ex: Technologie, Marketing, Business"
          />
        </Box>
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
