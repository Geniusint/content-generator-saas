import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../auth/AuthProvider';
import { firestoreService } from '../../services/firestore';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface Article {
  id: string;
  title: string;
  projectId: string;
  status: 'published' | 'draft' | 'scheduled';
  publishDate: string;
  excerpt: string;
  persona: string;
  wordCount: number;
  project?: string;
}

interface Project {
  id: string;
  name: string;
}

export const ArticlesList = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);

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

    fetchProjects();
  }, [currentUser, t]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!currentUser) return;

      try {
        let articlesData: Article[] = [];
        if (projectFilter === 'all') {
          // Fetch all articles for the user
          const projectsSnapshot = await firestoreService.getProjects();
          for (const projectDoc of projectsSnapshot.docs) {
            const articlesSnapshot = await firestoreService.getProjectArticles(projectDoc.id);
             articlesData.push(...articlesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                id: doc.id,
                ...doc.data(),
                projectId: projectDoc.id,
                project: projectDoc.data().name,
              } as Article)));
          }
        } else {
          // Fetch articles for the selected project
          const articlesSnapshot = await firestoreService.getProjectArticles(projectFilter);
          articlesData = articlesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
            projectId: projectFilter,
             project: projects.find(p => p.id === projectFilter)?.name || 'Unknown',
          } as Article));
        }
        setArticles(articlesData);
      } catch (error) {
        console.error(t('articles.errorLoading'), error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentUser, t, projectFilter, projects]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, articleId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedArticle(articleId);
  };

  const handleMenuClose = (action: string) => {
    setAnchorEl(null);
    if (selectedArticle) {
      if (action === 'delete') {
        handleDeleteArticle(selectedArticle);
      } else if (action === 'publish') {
        handlePublishArticle(selectedArticle);
      }
    }
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

  const getStatusLabel = (status: 'published' | 'draft' | 'scheduled'): string => {
    switch (status) {
      case 'published':
        return t('articles.status.published');
      case 'draft':
        return t('articles.status.draft');
      case 'scheduled':
        return t('articles.status.scheduled');
      default:
        return status;
    }
  };

    const handleDeleteArticle = async (articleId: string) => {
        if (!currentUser) return;
        try {
            await firestoreService.deleteArticle(currentUser.uid, articleId);
            setArticles(articles.filter(article => article.id !== articleId));
        } catch (error) {
            console.error(t('articles.errorDeleting'), error);
        }
    };

    const handlePublishArticle = async (articleId: string) => {
      if (!currentUser) return;
      try {
        const article = articles.find(article => article.id === articleId);
        if (article) {
          await firestoreService.update('articles', articleId, { status: 'published' });
          setArticles(articles.map(a => a.id === articleId ? { ...a, status: 'published' } : a));
        }
      } catch (error) {
        console.error(t('articles.errorPublishing'), error);
      }
    };

  // Filtrer les articles
  const filteredArticles = articles.filter(article => {
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
     const matchesProject = projectFilter === 'all' || article.projectId === projectFilter;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesProject && matchesSearch;
  });

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
                    label={getStatusLabel(article.status)}
                    color={getStatusColor(article.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={t('articles.wordCount', { count: article.wordCount })}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('articles.projectLabel')}: {article.project}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {article.status === 'published' 
                      ? t('articles.publishedOn') 
                      : t('articles.scheduledFor')} {new Date(article.publishDate).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {t('articles.personaLabel')}: {article.persona}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/articles/${article.id}`}>
                  {t('articles.edit')}
                </Button>
                <Button size="small" component={Link} to={`/articles/${article.id}/preview`}>
                  {t('articles.preview')}
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
        onClose={() => handleMenuClose('')}
      >
        <MenuItem onClick={() => handleMenuClose('edit')}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          {t('articles.edit')}
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('publish')}>
          <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
          {t('articles.publish')}
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('delete')} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          {t('articles.delete')}
        </MenuItem>
      </Menu>
    </Box>
  );
};
