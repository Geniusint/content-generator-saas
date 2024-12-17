import { PromptData } from '../types';

export const generateBlogPostPrompt = (data: PromptData): string => {
  let prompt = `# PROMPT DE RÉDACTION AUTHENTIQUE AVEC RICHESSE SÉMANTIQUE\n\n`;
  prompt += `## INFORMATIONS DE BASE\n`;
  prompt += `- Mot clé : **${data.title}**\n`;
  prompt += `- Type de contenu : **Article de blog**\n`;
  prompt += `- Type d'analyse sémantique : **${data.semanticAnalysisType}**\n\n`;

  prompt += `## PRÉPARATION DU CONTENU\n\n`;
  prompt += `### 1. ANALYSE SÉMANTIQUE À UTILISER\n`;
  prompt += `Extrais de l'analyse sémantique précédente :\n`;
  prompt += `- 5-7 synonymes et variations du mot-clé principal\n`;
  prompt += `- 3-4 expressions courantes du domaine\n`;
  prompt += `- 4-5 termes techniques essentiels\n`;
  prompt += `- 3-4 questions fréquentes des utilisateurs\n`;
  prompt += `- 2-3 cas d'usage concrets\n`;
  prompt += `- 4-5 termes du jargon professionnel\n`;
  prompt += `- 2-3 expressions idiomatiques du secteur\n`;
  prompt += `- 3-4 concepts connexes importants\n\n`;

  if (data.persona) {
    prompt += `### 2. PERSONNAGE ET CONTEXTE\n`;
    prompt += `Tu es un expert en **${data.persona.profession}** qui :\n`;
    prompt += `- Utilise naturellement le vocabulaire du secteur\n`;
    prompt += `- A de l'expérience avec les **${data.persona.objectifs.join(', ')}**\n`;
    prompt += `- Connaît les **${data.persona.defis.join(', ')}**\n`;
    prompt += `- Maîtrise les sujets d'intérêt suivants: **${data.persona.sujets_interet.join(', ')}**\n\n`;
  }

  if (data.site) {
    prompt += `L'article sera publié sur le site web **${data.site.name}** (**${data.site.url}**). `;
    prompt += `Le type de site est **${data.site.siteType}** et l'audience cible est: **${data.site.targetAudience.join(', ')}**.\n\n`;
  }

  prompt += `## STRUCTURE DE RÉDACTION\n\n`;
  prompt += `### Introduction\n`;
  prompt += `Commence par :\n`;
  prompt += `- Une accroche avec une [EXPRESSION COURANTE] du secteur\n`;
  prompt += `- Une situation personnelle utilisant du [JARGON PROFESSIONNEL]\n`;
  prompt += `- Un questionnement tiré des [QUESTIONS FRÉQUENTES]\n\n`;

  prompt += `### Corps du Texte\n\n`;
  prompt += `Pour chaque partie principale :\n\n`;
  prompt += `1. Début de section\n`;
  prompt += `- Introduis avec une [EXPRESSION IDIOMATIQUE] du secteur\n`;
  prompt += `- Pose une [QUESTION FRÉQUENTE] de manière conversationnelle\n`;
  prompt += `- Utilise un [TERME TECHNIQUE] dans une anecdote\n\n`;

  prompt += `2. Développement\n`;
  prompt += `Alterne entre :\n`;
  prompt += `- Explications techniques avec [VOCABULAIRE SPÉCIFIQUE]\n`;
  prompt += `- Exemples personnels utilisant les [TERMES ASSOCIÉS]\n`;
  prompt += `- Solutions pratiques mentionnant les [OUTILS ET ÉQUIPEMENTS]\n`;
  prompt += `- Réflexions incluant les [CONCEPTS CONNEXES]\n\n`;

  prompt += `### Conclusion\n`;
  prompt += `- Résume les points clés\n`;
  prompt += `- Fournis une perspective personnelle\n`;
  prompt += `- Termine avec un appel à l'action ou une réflexion\n\n`;

  prompt += `## STYLE ET TON\n`;
  prompt += `- Ton conversationnel mais professionnel\n`;
  prompt += `- Utilisation naturelle du jargon technique\n`;
  prompt += `- Exemples concrets et anecdotes personnelles\n`;
  prompt += `- Questions rhétoriques pour engager le lecteur\n\n`;

  return prompt;
};
