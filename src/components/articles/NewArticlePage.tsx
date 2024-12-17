import React, { useState, useEffect } from 'react'; 
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
} from '@mui/material'; 
import { useTranslation } from 'react-i18next'; 
import { useAuth } from '../auth/AuthProvider'; 
import { firestoreService, Project, Persona, Site } from '../../services/firestore'; 
import { articleGeneratorService } from '../../services/articleGenerator';
import { useNavigate } from 'react-router-dom'; 
import { generatePrompt, SemanticAnalysisType } from '../../prompts'; 
import { ContentType, contentTypes } from '../../content-types'; 
import { ArticleStatus } from '../../types/articleStatus'; 

const CONTENT_TYPES = contentTypes; 

const SEMANTIC_ANALYSIS_TYPES = {
  NONE: 'none',
  AI: 'ai',
  SCRAPE: 'scrape'
} as const; 

const NewArticlePage: React.FC = () => {
  const { t } = useTranslation(); 
  const { currentUser } = useAuth(); 
  const navigate = useNavigate(); 
  const [title, setTitle] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]); 
  const [selectedProject, setSelectedProject] = useState(''); 
  const [contentType, setContentType] = useState<ContentType>('blog'); 
  const [semanticAnalysisType, setSemanticAnalysisType] = useState<SemanticAnalysisType>('none'); 
  const [humanize, setHumanize] = useState(false); 

  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) return; 

      try {
        const projectsSnapshot = await firestoreService.getProjects(); 
        const projectsData = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setProjects(projectsData); 
      } catch (error) {
        console.error(t('articles.errorLoading'), error); 
        setError(t('articles.errorLoading')); 
      }
    };

    fetchProjects(); 
  }, [currentUser, t]); 

  const handleCreateArticle = async () => {
    if (!currentUser?.uid || !selectedProject) { 
      setError(t('articles.errorCreating')); 
      return; 
    }

    setLoading(true); 
    setError(null); 
    try {
      const project = await firestoreService.getProject(selectedProject) as Project; 
      let persona: Persona | null = null; 
      let site: Site | null = null; 

      if (project.persona?.id) {
        persona = await firestoreService.getPersona(project.persona.id) as Persona;
      }
      if (project.site?.id) {
        site = await firestoreService.getSite(project.site.id) as Site;
      }

      const articleData = {
        title,
        content: '',
        projectId: selectedProject,
        userId: currentUser.uid,
        status: 'generation' as ArticleStatus,
        publishDate: new Date().toISOString(),
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
        } : undefined,
        wordCount: 0,
        contentType,
        semanticAnalysisType,
        humanize
      };

      const docRef = await firestoreService.createArticle(articleData);
      // Lancer la génération en arrière-plan avec l'article complet
      await articleGeneratorService.generateArticle({ ...articleData, id: docRef.id });
      navigate('/articles'); 
    } catch (error) {
      console.error('Error creating article:', error); 
      setError(t('articles.errorCreating')); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('articles.newArticle')}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>{t('articles.project')}</InputLabel>
              <Select
                value={selectedProject}
                label={t('articles.project')}
                onChange={(e) => setSelectedProject(e.target.value)} 
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
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
              onChange={(e) => setTitle(e.target.value)} 
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('articles.contentType')}</InputLabel>
              <Select
                value={contentType}
                label={t('articles.contentType')}
                onChange={(e) => setContentType(e.target.value as ContentType)} 
              >
                {CONTENT_TYPES.map((contentType) => (
                  <MenuItem key={contentType.type} value={contentType.type}>
                    {contentType.label}
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
                onChange={(e) => setSemanticAnalysisType(e.target.value as SemanticAnalysisType)} 
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
                  onChange={(e) => setHumanize(e.target.checked)} 
                />
              }
              label={t('articles.humanize')}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleCreateArticle} 
              disabled={loading || !selectedProject || !title} 
            >
              {loading ? t('common.loading') : t('articles.create')} 
            </Button>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert> 
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default NewArticlePage;
