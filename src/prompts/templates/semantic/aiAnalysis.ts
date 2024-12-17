import { PromptData } from "../../types";

export const generateAIAnalysisPrompt = (data: PromptData): string => {
  return `Je vais t'aider à analyser le sujet "${data.topic}" de manière approfondie.

1. Analyse du contexte et de la pertinence :
- Identifie les aspects clés et les sous-thèmes importants
- Évalue la pertinence actuelle du sujet
- Détermine le public cible principal

2. Analyse des tendances et évolutions :
- Examine les tendances récentes liées au sujet
- Identifie les évolutions futures potentielles
- Repère les controverses ou débats actuels

3. Recommandations pour le contenu :
- Suggère les points clés à aborder
- Propose un angle d'approche original
- Identifie les sources d'autorité à citer

4. Optimisation SEO :
- Identifie les mots-clés principaux et secondaires
- Suggère des questions fréquentes des utilisateurs
- Propose une structure optimisée pour le référencement

Basé sur cette analyse, génère maintenant le contenu demandé en suivant ces insights.`;
};
