import { Article } from './firestore';

class ArticleGeneratorService {
  async generateArticle(articleId: string): Promise<void> {
    // Cette méthode sera implémentée plus tard pour gérer la génération d'article
    // Elle s'exécutera en arrière-plan et mettra à jour l'article dans Firestore
    // au fur et à mesure de la génération
  }
}

export const articleGeneratorService = new ArticleGeneratorService();
