import { PromptData, SemanticAnalysisType } from './types';
import { generateBlogPostPrompt } from './templates/blogPost';
import { generateComparisonPrompt } from './templates/comparison';
import { generateRecipePrompt } from './templates/recipe';
import { generateProductPrompt } from './templates/product';
import { generateAIAnalysisPrompt } from './templates/semantic/aiAnalysis';
import { generateScrapAnalysisPrompt } from './templates/semantic/scrapAnalysis';

const SEMANTIC_PROMPTS = {
  ai: generateAIAnalysisPrompt,
  scrape: generateScrapAnalysisPrompt,
  none: () => ''
} as const;

const generateContentPrompt = (data: PromptData): string => {
  switch (data.contentType) {
    case 'blog':
      return generateBlogPostPrompt(data);
    case 'comparison':
      return generateComparisonPrompt(data);
    case 'recipe':
      return generateRecipePrompt(data);
    case 'product':
      return generateProductPrompt(data);
    default:
      throw new Error(`Type de contenu non supporté: ${data.contentType}`);
  }
};

const generateSemanticPrompt = (data: PromptData): string => {
  const promptGenerator = SEMANTIC_PROMPTS[data.semanticAnalysisType];
  return promptGenerator(data);
};

export const generatePrompt = (data: PromptData): string => {
  const contentPrompt = generateContentPrompt(data);
  const semanticPrompt = generateSemanticPrompt(data);

  if (!semanticPrompt) {
    return contentPrompt;
  }

  return `${semanticPrompt}

Une fois cette analyse effectuée, utilise les informations suivantes pour générer le contenu :

${contentPrompt}`;
};

export type { PromptData, SemanticAnalysisType };
