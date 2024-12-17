import { PromptData } from '../types';

export const generateRecipePrompt = (data: PromptData): string => {
  let prompt = `# PROMPT DE RÉDACTION POUR RECETTE\n\n`;
  prompt += `## INFORMATIONS DE BASE\n`;
  prompt += `- Recette : **${data.title}**\n`;
  prompt += `- Type de contenu : **Recette**\n`;
  prompt += `- Type d'analyse sémantique : **${data.semanticAnalysisType}**\n\n`;

  prompt += `## STRUCTURE DE LA RECETTE\n\n`;
  prompt += `### 1. Introduction\n`;
  prompt += `- Histoire de la recette\n`;
  prompt += `- Origine et traditions\n`;
  prompt += `- Occasions de préparation\n\n`;

  prompt += `### 2. Informations Techniques\n`;
  prompt += `- Temps de préparation\n`;
  prompt += `- Temps de cuisson\n`;
  prompt += `- Niveau de difficulté\n`;
  prompt += `- Nombre de personnes\n`;
  prompt += `- Coût estimé\n\n`;

  prompt += `### 3. Ingrédients\n`;
  prompt += `Liste détaillée avec :\n`;
  prompt += `- Quantités précises\n`;
  prompt += `- Alternatives possibles\n`;
  prompt += `- Notes sur la qualité/choix\n\n`;

  prompt += `### 4. Étapes de Préparation\n`;
  prompt += `Pour chaque étape :\n`;
  prompt += `- Instructions détaillées\n`;
  prompt += `- Temps par étape\n`;
  prompt += `- Conseils techniques\n`;
  prompt += `- Points de vigilance\n\n`;

  prompt += `### 5. Conseils et Astuces\n`;
  prompt += `- Techniques spécifiques\n`;
  prompt += `- Erreurs à éviter\n`;
  prompt += `- Variantes possibles\n`;
  prompt += `- Conservation\n\n`;

  if (data.persona) {
    prompt += `## EXPERTISE CULINAIRE\n`;
    prompt += `En tant que **${data.persona.profession}**, ajoute :\n`;
    prompt += `- Techniques professionnelles\n`;
    prompt += `- Secrets de chef\n`;
    prompt += `- Conseils d'expert\n\n`;
  }

  prompt += `## PRÉSENTATION\n`;
  prompt += `- Dressage\n`;
  prompt += `- Accompagnements suggérés\n`;
  prompt += `- Accords mets/vins\n\n`;

  prompt += `## VALEURS NUTRITIONNELLES\n`;
  prompt += `- Calories\n`;
  prompt += `- Macronutriments\n`;
  prompt += `- Régimes spéciaux\n`;
  prompt += `- Allergènes\n\n`;

  return prompt;
};
