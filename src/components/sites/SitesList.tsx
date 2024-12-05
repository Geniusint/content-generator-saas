import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Switch,
  FormControlLabel,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Web as WebIcon,
  Link as LinkIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Site {
  id: string;
  name: string;
  url: string;
  type: 'wordpress' | 'custom';
  status: 'connected' | 'error' | 'pending';
  lastSync: string;
  articlesCount: number;
  autoPublish: boolean;
  categories: string[];
  apiKey?: string;
}

export const SitesList = () => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Données simulées
  const sites: Site[] = [
    {
      id: '1',
      name: 'Blog Corporate',
      url: 'https://corporate.example.com',
      type: 'wordpress',
      status: 'connected',
      lastSync: '2024-01-15T10:30:00',
      articlesCount: 25,
      autoPublish: true,
      categories: ['Technology', 'Business']
    },
    {
      id: '2',
      name: 'Site Marketing',
      url: 'https://marketing.example.com',
      type: 'wordpress',
      status: 'error',
      lastSync: '2024-01-14T15:45:00',
      articlesCount: 18,
      autoPublish: false,
      categories: ['Marketing', 'Strategy']
    },
    {
      id: '3',
      name: 'Blog Personnel',
      url: 'https://blog.example.com',
      type: 'custom',
      status: 'pending',
      lastSync: '2024-01-13T09:15:00',
      articlesCount: 12,
      autoPublish: false,
      categories: ['Personal', 'Tech']
    }
  ];

  const handleOpenDialog = (edit: boolean = false) => {
    setEditMode(edit);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, siteId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedSite(siteId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSite(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    handleOpenDialog(true);
  };

  const getStatusColor = (status: Site['status']) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'error':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: Site['status']): JSX.Element => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon fontSize="small" />;
      case 'error':
        return <ErrorIcon fontSize="small" />;
      case 'pending':
        return <RefreshIcon fontSize="small" />;
      default:
        return <CheckCircleIcon fontSize="small" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Mes Sites
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(false)}
        >
          Nouveau Site
        </Button>
      </Box>

      {/* Liste des sites */}
      <Grid container spacing={3}>
        {sites.map((site) => (
          <Grid item xs={12} sm={6} md={4} key={site.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" component="div">
                      {site.name}
                    </Typography>
                    {site.type === 'wordpress' && (
                      <Tooltip title="Site WordPress">
                        <WebIcon color="action" />
                      </Tooltip>
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, site.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Box sx={{ mt: 2, mb: 2 }}>
                  <Chip
                    icon={getStatusIcon(site.status)}
                    label={site.status}
                    color={getStatusColor(site.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    icon={<LinkIcon fontSize="small" />}
                    label={site.type}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinkIcon fontSize="small" />
                    {site.url}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {site.articlesCount} articles publiés
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dernière synchro: {new Date(site.lastSync).toLocaleString()}
                  </Typography>
                </Box>

                {site.categories.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Catégories:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {site.categories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {site.status === 'error' && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Erreur de connexion. Veuillez vérifier vos identifiants.
                  </Alert>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<RefreshIcon />}>
                  Synchroniser
                </Button>
                <Button size="small" startIcon={<SecurityIcon />}>
                  Paramètres API
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
        <MenuItem onClick={handleMenuClose}>
          <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
          Synchroniser
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Dialog d'ajout/modification */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Modifier le site' : 'Nouveau site'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du site"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL du site"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type de site</InputLabel>
                <Select
                  label="Type de site"
                  defaultValue="wordpress"
                >
                  <MenuItem value="wordpress">WordPress</MenuItem>
                  <MenuItem value="custom">Site personnalisé</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Clé API"
                variant="outlined"
                type="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Catégories (séparées par des virgules)"
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Publication automatique"
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
