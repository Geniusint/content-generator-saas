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
  Modal,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { firestoreService, Persona } from '../../services/firestore';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';

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
  persona: string;
}

export const ArticlesList = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [personaFilter, setPersonaFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [openModal, setOpenModal] = useState(false);

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

    const fetchPersonas = async () => {
      if (!currentUser) return;
      try {
        const personasSnapshot = await firestoreService.getPersonas();
        const personasData = personasSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data()
        } as Persona));
        setPersonas(personasData);
      } catch (error) {
        console.error(t('articles.errorLoadingPersonas'), error);
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
    fetchPersonas();
    fetchArticles();
  }, [currentUser, t]);

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
  };

  const handleProjectFilterChange = (event: SelectChangeEvent<string>) => {
    setProjectFilter(event.target.value);
  };

  const handlePersonaFilterChange = (event: SelectChangeEvent<string>) => {
    setPersonaFilter(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenModal = (article: Article) => {
    setSelectedArticle(article);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedArticle(null);
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
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>{t('articles.persona')}</InputLabel>
              <Select
                value={personaFilter}
                label={t('articles.persona')}
                onChange={handlePersonaFilterChange}
              >
                <MenuItem value="all">{t('articles.allPersonas')}</MenuItem>
                {personas.map((persona) => (
                  <MenuItem key={persona.id} value={persona.id}>
                    {`${persona.prenom} ${persona.nom}`}
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
              (personaFilter === 'all' || article.persona === personaFilter) &&
              (article.title.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map((article) => {
                const persona = personas.find(p => p.id === article.persona);
                return (
              <ListItem 
                key={article.id}
                divider
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => handleOpenModal(article)}
              >
                <ListItemText
                  primary={article.title}
                                  secondary={
                    < >
                      {`${t('articles.publishedOn')}: ${new Date(article.publishDate).toLocaleDateString()}`}
                      {persona && ` - ${t('articles.persona')}: ${persona.prenom} ${persona.nom}`}
                    </ >
                  }
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
            )
            })}
          {articles.length === 0 && (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 3 }}>
              {t('articles.noArticles')}
            </Typography>
          )}
        </List>
      </Paper>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="article-modal-title"
        aria-describedby="article-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <Typography id="article-modal-title" variant="h6" component="h2">
            {selectedArticle?.title}
          </Typography>
          <ReactMarkdown>
            {selectedArticle?.content}
          </ReactMarkdown>
          <Button onClick={handleCloseModal}>Fermer</Button>
        </Box>
      </Modal>
    </Box>
  );
};
