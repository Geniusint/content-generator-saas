import React, { useState, useEffect } from 'react'; // Importation des hooks React
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material'; // Importation des composants Material-UI
import { useTranslation } from 'react-i18next'; // Importation pour la gestion de l'internationalisation
import { useAuth } from '../auth/AuthProvider'; // Hook personnalisé pour l'authentification
import { firestoreService, Project, Persona, Site } from '../../services/firestore'; // Services Firestore
import { useNavigate } from 'react-router-dom'; // Hook pour la navigation
import { generatePrompt, SemanticAnalysisType } from '../../prompts'; // Fonction pour générer des prompts
import { ContentType, contentTypes } from '../../content-types'; // Types de contenu
import { ArticleStatus } from '../../types/articleStatus'; // Statuts d'article

// Types de contenu et d'analyse disponibles
const CONTENT_TYPES = contentTypes; // Récupération des types de contenu

const SEMANTIC_ANALYSIS_TYPES = {
  NONE: 'none',
  AI: 'ai',
  SCRAPE: 'scrape'
} as const; // Types d'analyse sémantique disponibles

const NewArticlePage: React.FC = () => {
  const { t } = useTranslation(); // Hook pour la traduction
  const { currentUser } = useAuth(); // Récupération de l'utilisateur actuel
  const navigate = useNavigate(); // Fonction de navigation
  const [title, setTitle] = useState(''); // État pour le titre de l'article
  const [loading, setLoading] = useState(false); // État pour le chargement
  const [error, setError] = useState<string | null>(null); // État pour les erreurs
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]); // État pour les projets
  const [selectedProject, setSelectedProject] = useState(''); // État pour le projet sélectionné
  const [contentType, setContentType] = useState<ContentType>('blog'); // État pour le type de contenu
  const [semanticAnalysisType, setSemanticAnalysisType] = useState<SemanticAnalysisType>('none'); // État pour le type d'analyse sémantique
  const [humanize, setHumanize] = useState(false); // État pour l'option de "humaniser"

  // Effet pour charger les projets de l'utilisateur
  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) return; // Si l'utilisateur n'est pas connecté, ne rien faire

      try {
        const projectsSnapshot = await firestoreService.getProjects(); // Récupération des projets depuis Firestore
        const projectsData = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setProjects(projectsData); // Mise à jour de l'état avec les projets récupérés
      } catch (error) {
        console.error(t('articles.errorLoading'), error); // Log de l'erreur
        setError(t('articles.errorLoading')); // Mise à jour de l'état d'erreur
      }
    };

    fetchProjects(); // Appel de la fonction pour charger les projets
  }, [currentUser, t]); // Dépendances de l'effet

  // Fonction pour créer un nouvel article
  const handleCreateArticle = async () => {
    if (!currentUser?.uid || !selectedProject) { // Vérification de l'utilisateur et du projet sélectionné
      setError(t('articles.errorCreating')); // Mise à jour de l'état d'erreur
      return; // Sortie de la fonction
    }

    setLoading(true); // Activation de l'état de chargement
    setError(null); // Réinitialisation de l'état d'erreur
    try {
      const project = await firestoreService.getProject(selectedProject) as Project; // Récupération du projet sélectionné
      let persona: Persona | null = null; // Initialisation de la persona
      let site: Site | null = null; // Initialisation du site

      // Récupération de la persona si elle existe
      if (project.persona?.id) {
        persona = await firestoreService.getPersona(project.persona.id) as Persona;
      }
      // Récupération du site si il existe
      if (project.site?.id) {
        site = await firestoreService.getSite(project.site.id) as Site;
      }

      // Création des données pour le prompt
      const promptData = {
        title,
        topic: title,
        contentType,
        semanticAnalysisType,
        persona: persona ? {
          profession: persona.profession,
          objectifs: persona.objectifs,
          defis: persona.defis,
          sujets_interet: persona.sujets_interet
        } : undefined,
        site: site ? {
          name: site.name,
          url: site.url,
          siteType: site.siteType,
          targetAudience: site.targetAudience
        } : undefined
      };

      const generatedPrompt = generatePrompt(promptData); // Génération du prompt

      // Création des données de l'article
      const articleData = {
        title,
        content: generatedPrompt,
        projectId: selectedProject,
        status: 'generation' as ArticleStatus,
        publishDate: new Date().toISOString(),
        persona: project.persona?.id || '',
        wordCount: 0,
        contentType,
        semanticAnalysisType,
        humanize
      };

      await firestoreService.createArticle(articleData); // Création de l'article dans Firestore
      navigate('/articles'); // Navigation vers la liste des articles
    } catch (error) {
      console.error('Error creating article:', error); // Log de l'erreur
      setError(t('articles.errorCreating')); // Mise à jour de l'état d'erreur
    } finally {
      setLoading(false); // Désactivation de l'état de chargement
    }
  };

  // Rendu du composant
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('articles.newArticle')} // Titre de la page
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>{t('articles.project')}</InputLabel>
              <Select
                value={selectedProject}
                label={t('articles.project')}
                onChange={(e) => setSelectedProject(e.target.value)} // Mise à jour du projet sélectionné
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name} // Affichage du nom du projet
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('articles.title')}
              value={title}
              onChange={(e) => setTitle(e.target.value)} // Mise à jour du titre
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('articles.contentType')}</InputLabel>
              <Select
                value={contentType}
                label={t('articles.contentType')}
                onChange={(e) => setContentType(e.target.value as ContentType)} // Mise à jour du type de contenu
              >
                {CONTENT_TYPES.map((contentType) => (
                  <MenuItem key={contentType.type} value={contentType.type}>
                    {contentType.label} // Affichage du label du type de contenu
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('articles.semanticAnalysis')}</InputLabel>
              <Select
                value={semanticAnalysisType}
                label={t('articles.semanticAnalysis')}
                onChange={(e) => setSemanticAnalysisType(e.target.value as SemanticAnalysisType)} // Mise à jour du type d'analyse sémantique
              >
                <MenuItem value={SEMANTIC_ANALYSIS_TYPES.NONE}>{t('articles.semanticAnalysisTypes.none')}</MenuItem>
                <MenuItem value={SEMANTIC_ANALYSIS_TYPES.AI}>{t('articles.semanticAnalysisTypes.ai')}</MenuItem>
                <MenuItem value={SEMANTIC_ANALYSIS_TYPES.SCRAPE}>{t('articles.semanticAnalysisTypes.scrape')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={humanize}
                  onChange={(e) => setHumanize(e.target.checked)} // Mise à jour de l'option "humaniser"
                />
              }
              label={t('articles.humanize')}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleCreateArticle} // Appel de la fonction pour créer l'article
              disabled={loading || !selectedProject || !title} // Désactivation si en chargement ou si les champs sont vides
            >
              {loading ? t('common.loading') : t('articles.create')} // Affichage du texte du bouton
            </Button>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert> // Affichage des messages d'erreur
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default NewArticlePage; // Exportation du composant
