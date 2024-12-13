import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { firestoreService } from '../../services/firestore';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface Project {
  id: string;
  name: string;
}

interface Article {
  id?: string;
  title: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  publishDate: string;
  projectId: string;
}

export const ArticlesList = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) return;
      try {
        const projectsSnapshot = await firestoreService.getProjects();
        const projectsData = projectsSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          name: doc.data().name,
        } as Project));
        setProjects(projectsData);
      } catch (error) {
        console.error(t('articles.errorLoadingProjects'), error);
      }
    };

    const fetchArticles = async () => {
      if (!currentUser) return;
      try {
        const articlesSnapshot = await firestoreService.getArticles();
        const articlesData = articlesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data()
        } as Article));
        setArticles(articlesData);
      } catch (error) {
        console.error(t('articles.errorLoadingArticles'), error);
      }
    };

    fetchProjects();
    fetchArticles();
  }, [currentUser, t]);

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
  };

  const handleProjectFilterChange = (event: SelectChangeEvent<string>) => {
    setProjectFilter(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {t('articles.myArticles')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/new-article"
        >
          {t('articles.newArticle')}
        </Button>
      </Box>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('articles.search')}
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
              <InputLabel>{t('articles.status.label')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('articles.status.label')}
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">{t('articles.status.all')}</MenuItem>
                <MenuItem value="published">{t('articles.status.published')}</MenuItem>
                <MenuItem value="draft">{t('articles.status.draft')}</MenuItem>
                <MenuItem value="scheduled">{t('articles.status.scheduled')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>{t('articles.project')}</InputLabel>
              <Select
                value={projectFilter}
                label={t('articles.project')}
                onChange={handleProjectFilterChange}
              >
                <MenuItem value="all">{t('articles.allProjects')}</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Liste des articles */}
      <Paper sx={{ p: 2 }}>
        <List>
          {articles
            .filter(article => 
              (statusFilter === 'all' || article.status === statusFilter) &&
              (projectFilter === 'all' || article.projectId === projectFilter) &&
              (article.title.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map((article) => (
              <ListItem 
                key={article.id}
                divider
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <ListItemText
                  primary={article.title}
                  secondary={`${t('articles.publishedOn')}: ${new Date(article.publishDate).toLocaleDateString()}`}
                />
                <Box>
                  <Chip 
                    label={t(`articles.status.${article.status}`)}
                    color={article.status === 'published' ? 'success' : article.status === 'scheduled' ? 'warning' : 'default'}
                    sx={{ mr: 1 }}
                  />
                  {projects.find(p => p.id === article.projectId)?.name && (
                    <Chip 
                      label={projects.find(p => p.id === article.projectId)?.name}
                      variant="outlined"
                    />
                  )}
                </Box>
              </ListItem>
            ))}
          {articles.length === 0 && (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 3 }}>
              {t('articles.noArticles')}
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};
