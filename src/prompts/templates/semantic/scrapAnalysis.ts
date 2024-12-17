import { PromptData } from "../../types";

export const generateScrapAnalysisPrompt = (data: PromptData): string => {
  return `Je vais t'aider à analyser et synthétiser les meilleurs contenus existants sur le sujet "${data.topic}".

1. Analyse comparative des contenus :
- Compare les 5 meilleurs articles sur le sujet
- Identifie les points communs et différences
- Repère les angles uniques et innovants

2. Analyse des lacunes :
- Identifie les aspects peu ou mal couverts
- Repère les questions sans réponses
- Note les opportunités de contenu original

3. Analyse de la qualité :
- Évalue la profondeur du traitement
- Identifie les sources citées
- Analyse le style et le ton utilisés

4. Recommandations :
- Suggère une approche différenciante
- Propose des améliorations par rapport à l'existant
- Identifie les éléments à éviter

Basé sur cette analyse des contenus existants, génère maintenant un contenu unique et amélioré qui se démarque de la concurrence.`;
};
