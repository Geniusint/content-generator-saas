import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ListItemIcon,
  ListItemText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Web as WebIcon,
  Link as LinkIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
import { firestoreService } from '../../services/firestore';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { SiteModal } from './SiteModal';
import type { Site as FirestoreSite } from '../../services/firestore';

type Site = Required<Pick<FirestoreSite, 'id'>> & Omit<FirestoreSite, 'id'>;

type ChipColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const COLORS: ChipColor[] = ['primary', 'secondary', 'error', 'info', 'success', 'warning'];

const getCategoryColor = (category: string): ChipColor => {
  // Utiliser une somme simple des codes de caractères pour générer un index
  const sum = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLORS[sum % COLORS.length];
};

export const SitesList = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const fetchSites = async () => {
    if (!currentUser) return;

    try {
      const sitesSnapshot = await firestoreService.getSites();
      const sitesData = sitesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      } as Site));

      setSites(sitesData);
    } catch (error) {
      console.error('Erreur lors de la récupération des sites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [currentUser]);

  // Fonction de filtrage des sites
  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || site.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSite(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, site: Site) => {
    setAnchorEl(event.currentTarget);
    setSelectedSite(site);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSiteCreated = (site: FirestoreSite) => {
    handleCloseDialog();
    fetchSites();
  };

  const handleEditClick = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    setAnchorEl(null);
  };

  const handleConfirmDelete = async () => {
    if (!currentUser || !selectedSite || !selectedSite.id) return;

    try {
      await firestoreService.deleteSite(selectedSite.id);
      await fetchSites();
      setOpenDeleteDialog(false);
      setSelectedSite(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSiteUpdated = (updatedSite: FirestoreSite) => {
    handleCloseDialog();
    fetchSites();
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
          onClick={handleOpenDialog}
        >
          Nouveau Site
        </Button>
      </Box>

      {/* Filtres */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 4, 
          p: 2, 
          backgroundColor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          alignItems: 'center' 
        }}>
          <FilterIcon color="action" />
          <TextField
            placeholder="Rechercher un site..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />

          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              }
            }}
          >
            <InputLabel>Type de site</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Type de site"
            >
              <MenuItem value="all">Tous les types</MenuItem>
              <MenuItem value="wordpress">WordPress</MenuItem>
              <MenuItem value="custom">Personnalisé</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Liste des sites */}
      {loading ? (
        <Typography variant="body1">Chargement des sites...</Typography>
      ) : filteredSites.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '200px',
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 1,
            p: 4
          }}
        >
          <WebIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {sites.length === 0 ? "Vous n'avez pas encore de site" : "Aucun site ne correspond aux critères"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {sites.length === 0 ? "Commencez par créer votre premier site pour gérer vos contenus" : "Essayez de modifier vos filtres"}
          </Typography>
          {sites.length === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              size="large"
            >
              Créer mon premier site
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredSites.map((site) => (
            <Grid item xs={12} sm={6} md={4} key={site.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" component="div" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
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
                      onClick={(e) => handleMenuClick(e, site)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinkIcon fontSize="small" />
                      {site.url || 'URL non définie'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {site.articlesCount} {site.articlesCount <= 1 ? 'article publié' : 'articles publiés'}
                    </Typography>
                    {site.categories?.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        {site.categories.map((category, index) => (
                          <Chip 
                            key={index}
                            label={category}
                            size="small"
                            variant="outlined"
                            color={getCategoryColor(category)}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </CardContent>
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
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Modifier" />
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Supprimer" />
        </MenuItem>
      </Menu>

      {/* Modal de modification */}
      <SiteModal
        open={openDialog}
        onClose={handleCloseDialog}
        onSiteCreated={selectedSite ? handleSiteUpdated : handleSiteCreated}
        siteId={selectedSite?.id}
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce site ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
