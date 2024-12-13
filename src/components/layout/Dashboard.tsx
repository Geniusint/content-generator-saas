import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  IconButton,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface ProjectSummary {
  id: string;
  name: string;
  status: 'active' | 'completed';
  articlesCount: number;
  progress: number;
  lastUpdate: string;
}

interface RecentArticle {
  id: string;
  title: string;
  project: string;
  publishDate: string;
  status: 'published' | 'draft' | 'scheduled';
}

export const Dashboard = () => {
  const { t } = useTranslation();

  // Données simulées pour la démonstration
  const stats = {
    totalProjects: 12,
    activeProjects: 5,
    completedProjects: 7,
    totalArticles: 48,
    publishedArticles: 35,
    draftArticles: 13,
    monthlyGrowth: 15
  };

  const recentProjects: ProjectSummary[] = [
    {
      id: '1',
      name: 'Blog Tech Innovation',
      status: 'active',
      articlesCount: 8,
      progress: 65,
      lastUpdate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Newsletter Hebdomadaire',
      status: 'active',
      articlesCount: 12,
      progress: 85,
      lastUpdate: '2024-01-14'
    },
    {
      id: '3',
      name: 'Guide Marketing Digital',
      status: 'completed',
      articlesCount: 15,
      progress: 100,
      lastUpdate: '2024-01-10'
    }
  ];

  const recentArticles: RecentArticle[] = [
    {
      id: '1',
      title: 'Les tendances IA en 2024',
      project: 'Blog Tech Innovation',
      publishDate: '2024-01-15',
      status: 'published'
    },
    {
      id: '2',
      title: 'Guide du Content Marketing',
      project: 'Guide Marketing Digital',
      publishDate: '2024-01-14',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Newsletter #45',
      project: 'Newsletter Hebdomadaire',
      publishDate: '2024-01-13',
      status: 'draft'
    }
  ];

  const getStatusColor = (status: 'active' | 'completed' | 'published' | 'draft' | 'scheduled') => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
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
        return <AssignmentIcon fontSize="small" />;
      case 'scheduled':
        return <ScheduleIcon fontSize="small" />;
      default:
        return undefined;
    }
  };

  const getStatusLabel = (status: 'active' | 'completed' | 'published' | 'draft' | 'scheduled'): string => {
    switch (status) {
      case 'active':
        return t('dashboard.status.active');
      case 'completed':
        return t('dashboard.status.completed');
      case 'published':
        return t('dashboard.status.published');
      case 'draft':
        return t('dashboard.status.draft');
      case 'scheduled':
        return t('dashboard.status.scheduled');
      default:
        return status;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête avec titre et bouton */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {t('dashboard.welcome')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/new-project"
        >
          {t('dashboard.createNewProject')}
        </Button>
      </Box>

      {/* Statistiques globales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h3" component="div" color="primary">
                {stats.totalProjects}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {t('dashboard.stats.totalProjects')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  {t('dashboard.stats.monthlyGrowth', { growth: stats.monthlyGrowth })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h3" component="div" color="success.main">
                {stats.activeProjects}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {t('dashboard.stats.activeProjects')}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(stats.activeProjects / stats.totalProjects) * 100}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h3" component="div">
                {stats.completedProjects}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {t('dashboard.stats.completedProjects')}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(stats.completedProjects / stats.totalProjects) * 100}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h3" component="div" color="info.main">
                {stats.publishedArticles}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {t('dashboard.stats.publishedArticles')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('dashboard.stats.draftCount', { count: stats.draftArticles })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Projets récents et Articles récents */}
      <Grid container spacing={3}>
        {/* Projets récents */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('dashboard.recentProjects')}</Typography>
              <Button
                endIcon={<ArrowForwardIcon />}
                component={Link}
                to="/projects"
                size="small"
              >
                {t('dashboard.viewAll')}
              </Button>
            </Box>
            <List>
              {recentProjects.map((project, index) => (
                <React.Fragment key={project.id}>
                  <ListItem
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      py: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                      <Typography variant="subtitle1" component="div">
                        {project.name}
                      </Typography>
                      <Chip
                        label={getStatusLabel(project.status)}
                        color={getStatusColor(project.status)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('dashboard.articleCount', { count: project.articlesCount })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('dashboard.lastUpdate', { date: new Date(project.lastUpdate).toLocaleDateString() })}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < recentProjects.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Articles récents */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('dashboard.recentArticles')}</Typography>
              <Button
                endIcon={<ArrowForwardIcon />}
                component={Link}
                to="/articles"
                size="small"
              >
                {t('dashboard.viewAll')}
              </Button>
            </Box>
            <List>
              {recentArticles.map((article, index) => (
                <React.Fragment key={article.id}>
                  <ListItem
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      py: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                      <Typography variant="subtitle1" component="div">
                        {article.title}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(article.status)}
                        label={getStatusLabel(article.status)}
                        color={getStatusColor(article.status)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="body2" color="text.secondary">
                        {article.project}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(article.publishDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < recentArticles.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
