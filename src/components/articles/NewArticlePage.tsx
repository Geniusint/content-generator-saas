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
  Modal,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
import { firestoreService, Project, Persona, Site } from '../../services/firestore';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const NewArticlePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [prompt, setPrompt] = useState('');

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

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        navigate('/articles');
    };

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
      generatedPrompt += `"Entre nous, dans le métier, on appelle ça [JARGON] - oui, on aime bien nos petits termes !"\n`;
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

      setPrompt(generatedPrompt);
      handleOpenModal();

      const articleData = {
        title,
        content: '',
        authorId: currentUser.uid,
        createdAt: new Date().toISOString(),
        projectId: selectedProject,
        status: 'draft' as 'draft',
        publishDate: new Date().toISOString(),
        persona: persona?.id ?? 'default',
        wordCount: 0,
      };
      await firestoreService.createArticle(articleData);
    } catch (error) {
      console.error(t('articles.errorCreating'), error);
      setError(t('articles.errorCreating'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('articles.createNewArticle')}
      </Typography>
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>{t('articles.selectProject')}</InputLabel>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value as string)}
                label={t('articles.selectProject')}
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
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateArticle}
              disabled={loading || !title || !selectedProject}
            >
              {loading ? '...' : t('articles.create')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="prompt-modal-title"
            aria-describedby="prompt-modal-description"
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
                <Typography id="prompt-modal-title" variant="h6" component="h2">
                    Prompt généré
                </Typography>
                <ReactMarkdown >
                    {prompt}
                </ReactMarkdown>
                <Button onClick={handleCloseModal}>Fermer</Button>
            </Box>
        </Modal>
    </Box>
  );
};

export default NewArticlePage;
