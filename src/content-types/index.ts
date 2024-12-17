export type ContentType = 'blog' | 'comparison' | 'recipe' | 'product';

export interface ContentTypeMetadata {
  type: ContentType;
  label: string;
  description: string;
}

export const contentTypes: ContentTypeMetadata[] = [
  {
    type: 'blog',
    label: 'Article de blog',
    description: 'Un article de blog informatif et engageant'
  },
  {
    type: 'comparison',
    label: 'Article comparatif',
    description: 'Une comparaison détaillée entre différents produits ou services'
  },
  {
    type: 'recipe',
    label: 'Recette',
    description: 'Une recette détaillée avec ingrédients et instructions'
  },
  {
    type: 'product',
    label: 'Article produit',
    description: 'Un article présentant un produit spécifique'
  }
];
