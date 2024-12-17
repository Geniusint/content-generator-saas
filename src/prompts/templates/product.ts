import { PromptData } from '../types';

export const generateProductPrompt = (data: PromptData): string => {
  let prompt = `# PROMPT DE RÉDACTION POUR FICHE PRODUIT\n\n`;
  prompt += `## INFORMATIONS DE BASE\n`;
  prompt += `- Produit : **${data.title}**\n`;
  prompt += `- Type de contenu : **Fiche produit**\n`;
  prompt += `- Type d'analyse sémantique : **${data.semanticAnalysisType}**\n\n`;

  prompt += `## STRUCTURE DE LA FICHE PRODUIT\n\n`;
  prompt += `### 1. Présentation Générale\n`;
  prompt += `- Description courte et impactante\n`;
  prompt += `- Marque/Fabricant\n`;
  prompt += `- Positionnement sur le marché\n`;
  prompt += `- Public cible\n\n`;

  prompt += `### 2. Caractéristiques Techniques\n`;
  prompt += `- Spécifications détaillées\n`;
  prompt += `- Dimensions et poids\n`;
  prompt += `- Matériaux utilisés\n`;
  prompt += `- Technologies employées\n\n`;

  prompt += `### 3. Avantages et Bénéfices\n`;
  prompt += `Pour chaque caractéristique clé :\n`;
  prompt += `- Description technique\n`;
  prompt += `- Avantage concret\n`;
  prompt += `- Bénéfice pour l'utilisateur\n`;
  prompt += `- Exemples d'utilisation\n\n`;

  if (data.persona) {
    prompt += `## ANALYSE D'EXPERT\n`;
    prompt += `En tant que **${data.persona.profession}**, détaille :\n`;
    prompt += `- Points forts techniques\n`;
    prompt += `- Applications professionnelles\n`;
    prompt += `- Comparaison avec la concurrence\n\n`;
  }

  prompt += `### 4. Informations Pratiques\n`;
  prompt += `- Prix conseillé\n`;
  prompt += `- Disponibilité\n`;
  prompt += `- Garantie\n`;
  prompt += `- Service après-vente\n\n`;

  prompt += `### 5. Guide d'Utilisation\n`;
  prompt += `- Installation/Mise en service\n`;
  prompt += `- Utilisation quotidienne\n`;
  prompt += `- Entretien et maintenance\n`;
  prompt += `- Résolution des problèmes courants\n\n`;

  prompt += `## OPTIMISATION SEO\n`;
  prompt += `- Mots-clés principaux\n`;
  prompt += `- Variations sémantiques\n`;
  prompt += `- Questions fréquentes\n`;
  prompt += `- Termes techniques essentiels\n\n`;

  return prompt;
};
