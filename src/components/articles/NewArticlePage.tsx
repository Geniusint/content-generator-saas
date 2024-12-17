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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
import { firestoreService, Project, Persona, Site } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';

// Types de contenu et d'analyse disponibles
const CONTENT_TYPES = {
  BLOG: 'blog',
  COMPARISON: 'comparison',
  RECIPE: 'recipe',
  PRODUCT: 'product'
} as const;

const SEMANTIC_ANALYSIS_TYPES = {
  NONE: 'none',
  AI: 'ai',
  SCRAPE: 'scrape'
} as const;

type ContentType = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];
type SemanticAnalysisType = typeof SEMANTIC_ANALYSIS_TYPES[keyof typeof SEMANTIC_ANALYSIS_TYPES];

const NewArticlePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [contentType, setContentType] = useState<ContentType>(CONTENT_TYPES.BLOG);
  const [semanticAnalysisType, setSemanticAnalysisType] = useState<SemanticAnalysisType>(SEMANTIC_ANALYSIS_TYPES.NONE);

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

      let generatedPrompt = `# PROMPT DE RÉDACTION AUTHENTIQUE AVEC RICHESSE SÉMANTIQUE pour le mot clé : **${title}**\n\n`;
      generatedPrompt += `## PRÉPARATION DU CONTENU\n\n`;
      generatedPrompt += `### 1. ANALYSE SÉMANTIQUE À UTILISER\n`;
      generatedPrompt += `Extrais de l'analyse sémantique précédente :\n`;
      generatedPrompt += `- 5-7 synonymes et variations du mot-clé principal\n`;
      generatedPrompt += `- 3-4 expressions courantes du domaine\n`;
      generatedPrompt += `- 4-5 termes techniques essentiels\n`;
      generatedPrompt += `- 3-4 questions fréquentes des utilisateurs\n`;
      generatedPrompt += `- 2-3 cas d'usage concrets\n`;
      generatedPrompt += `- 4-5 termes du jargon professionnel\n`;
      generatedPrompt += `- 2-3 expressions idiomatiques du secteur\n`;
      generatedPrompt += `- 3-4 concepts connexes importants\n\n`;

      generatedPrompt += `### 2. PERSONNAGE ET CONTEXTE\n`;
      if (persona) {
        generatedPrompt += `Tu es un expert en **${persona.profession}** qui :\n`;
        generatedPrompt += `- Utilise naturellement le vocabulaire du secteur\n`;
        generatedPrompt += `- A de l'expérience avec les **${persona.objectifs.join(', ')}**\n`;
        generatedPrompt += `- Connaît les **${persona.defis.join(', ')}**\n`;
        generatedPrompt += `- Maîtrise les sujets d'intérêt suivants: **${persona.sujets_interet.join(', ')}**\n\n`;
      }

      if (site) {
        generatedPrompt += `L'article sera publié sur le site web **${site.name}** (**${site.url}**). Le type de site est **${site.siteType}** et l'audience cible est: **${site.targetAudience.join(', ')}**.\n\n`;
      }

      generatedPrompt += `## STRUCTURE DE RÉDACTION\n\n`;
      generatedPrompt += `### Introduction\n`;
      generatedPrompt += `Commence par :\n`;
      generatedPrompt += `- Une accroche avec une [EXPRESSION COURANTE] du secteur\n`;
      generatedPrompt += `- Une situation personnelle utilisant du [JARGON PROFESSIONNEL]\n`;
      generatedPrompt += `- Un questionnement tiré des [QUESTIONS FRÉQUENTES]\n\n`;
      generatedPrompt += `Example de structure :\n`;
      generatedPrompt += `"L'autre jour, en [SITUATION PROFESSIONNELLE], je me suis retrouvé face à [PROBLÉMATIQUE]. Comme beaucoup de [PUBLIC CIBLE], je me suis dit que..."\n\n`;

      generatedPrompt += `### Corps du Texte\n\n`;
      generatedPrompt += `Pour chaque partie principale :\n\n`;
      generatedPrompt += `1. Début de section\n`;
      generatedPrompt += `- Introduis avec une [EXPRESSION IDIOMATIQUE] du secteur\n`;
      generatedPrompt += `- Pose une [QUESTION FRÉQUENTE] de manière conversationnelle\n`;
      generatedPrompt += `- Utilise un [TERME TECHNIQUE] dans une anecdote\n\n`;
      generatedPrompt += `2. Développement\n`;
      generatedPrompt += `Alterne entre :\n`;
      generatedPrompt += `- Explications techniques avec [VOCABULAIRE SPÉCIFIQUE]\n`;
      generatedPrompt += `- Exemples personnels utilisant les [TERMES ASSOCIÉS]\n`;
      generatedPrompt += `- Solutions pratiques mentionnant les [OUTILS ET ÉQUIPEMENTS]\n`;
      generatedPrompt += `- Réflexions incluant les [CONCEPTS CONNEXES]\n\n`;
      generatedPrompt += `3. Transitions Naturelles\n`;
      generatedPrompt += `Utilise :\n`;
      generatedPrompt += `- "D'ailleurs, en parlant de [TERME ASSOCIÉ]..."\n`;
      generatedPrompt += `- "Ça me rappelle une situation avec [CAS D'USAGE]..."\n`;
      generatedPrompt += `- "Et vous savez ce qui est [EXPRESSION COURANTE] dans ce cas ?"\n\n`;

      generatedPrompt += `### ÉLÉMENTS DE STYLE NATUREL\n\n`;
      generatedPrompt += `#### Variations de Ton\n`;
      generatedPrompt += `Alterne entre :\n`;
      generatedPrompt += `- Expert utilisant le [JARGON PROFESSIONNEL]\n`;
      generatedPrompt += `- Collègue partageant des [CAS D'USAGE]\n`;
      generatedPrompt += `- Mentor expliquant les [ASPECTS TECHNIQUES]\n\n`;

      generatedPrompt += `#### Intégration Naturelle du Vocabulaire\n`;
      generatedPrompt += `✅ FAIRE :\n`;
      generatedPrompt += `"Je me souviens d'un projet où [TERME TECHNIQUE] prenait tout son sens..."\n`;
      generatedPrompt += `"Entre nous, dans le métier, on appelle ça [JARGON] - oui, je sais, on aime nos termes compliqués !"\n`;
      generatedPrompt += `"C'est marrant, mais [EXPRESSION IDIOMATIQUE] prend vraiment tout son sens quand..."\n\n`;
      generatedPrompt += `❌ ÉVITER :\n`;
      generatedPrompt += `"Il est important de noter que [TERME TECHNIQUE]..."\n`;
      generatedPrompt += `"Comme défini précédemment, [CONCEPT] est..."\n`;
      generatedPrompt += `"On peut donc en conclure que..."\n\n`;

      generatedPrompt += `#### Marqueurs de Naturel\n`;
      generatedPrompt += `Intègre :\n`;
      generatedPrompt += `- Parenthèses avec des (petites précisions techniques)\n`;
      generatedPrompt += `- Des "ah tiens, d'ailleurs..." pertinents\n`;
      generatedPrompt += `- Des questions rhétoriques utilisant les [TERMES ASSOCIÉS]\n`;
      generatedPrompt += `- Des doutes et nuances sur les [ASPECTS TECHNIQUES]\n\n`;

      generatedPrompt += `### INSTRUCTIONS D'ÉCRITURE\n\n`;
      generatedPrompt += `1. Pour chaque paragraphe, inclure :\n`;
      generatedPrompt += `- Au moins 1 terme du champ sémantique\n`;
      generatedPrompt += `- 1 élément de style conversationnel\n`;
      generatedPrompt += `- 1 exemple ou anecdote\n\n`;
      generatedPrompt += `2. Pour les explications techniques :\n`;
      generatedPrompt += `- Commencer par une situation concrète\n`;
      generatedPrompt += `- Utiliser le jargon naturellement\n`;
      generatedPrompt += `- Expliquer avec des analogies\n`;
      generatedPrompt += `- Relier aux cas d'usage\n\n`;
      generatedPrompt += `3. Pour le fil conducteur :\n`;
      generatedPrompt += `- Maintenir une progression logique\n`;
      generatedPrompt += `- Lier les concepts entre eux\n`;
      generatedPrompt += `- Revenir sur les points clés\n`;
      generatedPrompt += `- Anticiper les questions\n\n`;

      generatedPrompt += `## CHECKLIST FINALE\n\n`;
      generatedPrompt += `Vérifier la présence de :\n`;
      generatedPrompt += `- [ ] Tous les termes techniques clés\n`;
      generatedPrompt += `- [ ] Les expressions du secteur\n`;
      generatedPrompt += `- [ ] Le jargon professionnel\n`;
      generatedPrompt += `- [ ] Les questions fréquentes\n`;
      generatedPrompt += `- [ ] Les cas d'usage concrets\n`;
      generatedPrompt += `- [ ] Les éléments de style naturel\n`;
      generatedPrompt += `- [ ] Les transitions fluides\n\n`;

      generatedPrompt += `## EXEMPLE DE STRUCTURE\n\n`;
      generatedPrompt += `"[Expression courante] ! L'autre jour, en travaillant sur [cas d'usage], je me suis retrouvé face à un défi intéressant. Vous savez, ce genre de situation où [terme technique] devient soudain très concret...\n\n`;
      generatedPrompt += `(D'ailleurs, petit aparté technique rapide : dans le métier, on appelle ça [jargon professionnel] - oui, je sais, on aime nos termes compliqués !)\n\n`;
      generatedPrompt += `Ce qui est vraiment [expression idiomatique], c'est que..."\n`;

      const articleData = {
        title,
        content: generatedPrompt,
        projectId: selectedProject,
        status: 'draft' as const,
        publishDate: new Date().toISOString(),
        persona: project.persona?.id || '',
        wordCount: 0,
        contentType,
        semanticAnalysisType,
      };

      await firestoreService.createArticle(articleData);
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
                <MenuItem value={CONTENT_TYPES.BLOG}>{t('articles.contentTypes.blog')}</MenuItem>
                <MenuItem value={CONTENT_TYPES.COMPARISON}>{t('articles.contentTypes.comparison')}</MenuItem>
                <MenuItem value={CONTENT_TYPES.RECIPE}>{t('articles.contentTypes.recipe')}</MenuItem>
                <MenuItem value={CONTENT_TYPES.PRODUCT}>{t('articles.contentTypes.product')}</MenuItem>
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
