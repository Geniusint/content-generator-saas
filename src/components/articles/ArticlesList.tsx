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
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Edit as DraftIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface Article {
  id: string;
  title: string;
  project: string;
  status: 'published' | 'draft' | 'scheduled';
  publishDate: string;
  excerpt: string;
  persona: string;
  wordCount: number;
}

export const ArticlesList = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Données simulées
  const articles: Article[] = [
    {
      id: '1',
      title: 'Les tendances IA en 2024',
      project: 'Blog Tech Innovation',
      status: 'published',
      publishDate: '2024-01-15',
      excerpt: 'Découvrez les dernières avancées en intelligence artificielle...',
      persona: 'Tech Enthusiast',
      wordCount: 1200
    },
    {
      id: '2',
      title: 'Guide du Content Marketing',
      project: 'Guide Marketing Digital',
      status: 'scheduled',
      publishDate: '2024-01-20',
      excerpt: 'Un guide complet pour maîtriser le content marketing...',
      persona: 'Marketing Manager',
      wordCount: 2500
    },
    {
      id: '3',
      title: 'Newsletter #45',
      project: 'Newsletter Hebdomadaire',
      status: 'draft',
      publishDate: '2024-01-13',
      excerpt: 'Les actualités tech de la semaine...',
      persona: 'Tech Reader',
      wordCount: 800
    }
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, articleId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedArticle(articleId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedArticle(null);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handleProjectFilterChange = (event: SelectChangeEvent) => {
    setProjectFilter(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const getStatusColor = (status: 'published' | 'draft' | 'scheduled') => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: 'published' | 'draft' | 'scheduled'): JSX.Element | undefined => {
    switch (status) {
      case 'published':
        return <CheckCircleIcon fontSize="small" />;
      case 'draft':
        return <DraftIcon fontSize="small" />;
      case 'scheduled':
        return <ScheduleIcon fontSize="small" />;
      default:
        return undefined;
    }
  };

  // Filtrer les articles
  const filteredArticles = articles.filter(article => {
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchesProject = projectFilter === 'all' || article.project === projectFilter;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesProject && matchesSearch;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Mes Articles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/new-article"
        >
          Nouvel Article
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                label="Statut"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="published">Publiés</MenuItem>
                <MenuItem value="draft">Brouillons</MenuItem>
                <MenuItem value="scheduled">Programmés</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Projet</InputLabel>
              <Select
                value={projectFilter}
                label="Projet"
                onChange={handleProjectFilterChange}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="Blog Tech Innovation">Blog Tech Innovation</MenuItem>
                <MenuItem value="Guide Marketing Digital">Guide Marketing Digital</MenuItem>
                <MenuItem value="Newsletter Hebdomadaire">Newsletter Hebdomadaire</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Liste des articles */}
      <Grid container spacing={3}>
        {filteredArticles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {article.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, article.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {article.excerpt}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={getStatusIcon(article.status)}
                    label={article.status}
                    color={getStatusColor(article.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`${article.wordCount} mots`}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Projet: {article.project}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {article.status === 'published' ? 'Publié le' : 'Prévu le'} {new Date(article.publishDate).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Persona: {article.persona}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/articles/${article.id}`}>
                  Modifier
                </Button>
                <Button size="small" component={Link} to={`/articles/${article.id}/preview`}>
                  Aperçu
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
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
          Publier
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>
    </Box>
  );
};
