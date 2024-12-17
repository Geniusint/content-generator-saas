import { PromptData } from '../types';

export const generateComparisonPrompt = (data: PromptData): string => {
  let prompt = `# PROMPT DE RÉDACTION POUR ARTICLE COMPARATIF\n\n`;
  prompt += `## INFORMATIONS DE BASE\n`;
  prompt += `- Sujet : **${data.title}**\n`;
  prompt += `- Type de contenu : **Comparatif**\n`;
  prompt += `- Type d'analyse sémantique : **${data.semanticAnalysisType}**\n\n`;

  prompt += `## STRUCTURE DU COMPARATIF\n\n`;
  prompt += `### 1. Introduction\n`;
  prompt += `- Présentation du contexte\n`;
  prompt += `- Importance de la comparaison\n`;
  prompt += `- Critères de comparaison\n\n`;

  prompt += `### 2. Méthodologie\n`;
  prompt += `- Critères de sélection\n`;
  prompt += `- Méthode d'évaluation\n`;
  prompt += `- Points de comparaison\n\n`;

  prompt += `### 3. Tableau Comparatif\n`;
  prompt += `Créer un tableau détaillé avec :\n`;
  prompt += `- Caractéristiques principales\n`;
  prompt += `- Prix\n`;
  prompt += `- Avantages\n`;
  prompt += `- Inconvénients\n`;
  prompt += `- Note globale\n\n`;

  prompt += `### 4. Analyse Détaillée\n`;
  prompt += `Pour chaque élément comparé :\n`;
  prompt += `- Description détaillée\n`;
  prompt += `- Points forts\n`;
  prompt += `- Points faibles\n`;
  prompt += `- Cas d'usage idéaux\n\n`;

  if (data.persona) {
    prompt += `## PERSPECTIVE D'EXPERT\n`;
    prompt += `En tant qu'expert en **${data.persona.profession}**, concentre-toi sur :\n`;
    prompt += `- Les aspects techniques importants\n`;
    prompt += `- Les besoins spécifiques du secteur\n`;
    prompt += `- Les critères de choix professionnels\n\n`;
  }

  prompt += `## RECOMMANDATIONS\n`;
  prompt += `- Meilleur choix global\n`;
  prompt += `- Meilleur rapport qualité/prix\n`;
  prompt += `- Choix premium\n`;
  prompt += `- Recommandation pour débutants\n\n`;

  prompt += `## CONCLUSION\n`;
  prompt += `- Résumé des points clés\n`;
  prompt += `- Conseils de choix selon les besoins\n`;
  prompt += `- Tendances futures\n\n`;

  return prompt;
};
