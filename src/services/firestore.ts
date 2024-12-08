import firebase from 'firebase/app';
import 'firebase/firestore';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  increment 
} from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { auth } from '../config/firebase';

// Types for Firestore collections
export interface Project {
  id: string;
  userId: string;
  name: string;
  site: {
    id: string;  // Référence à la collection sites
    name: string;
  };
  persona: {
    id: string;  // Référence à la collection personas
    name: string;
  };
  status: 'draft' | 'active' | 'completed';
  articleCount: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ProjectArticle {
  id?: string;
  title: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  keywords: string[];
  generatedAt: string;
  publishedAt?: string;
  wordCount: number;
}

export interface Article {
  id?: string;
  projectId: string;
  userId: string;
  title: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  publishDate: string;
  persona: string;
  wordCount: number;
}

export interface Persona {
  id?: string;
  userId: string;
  name: string;
  avatar: string;
  role: string;
  age: number;
  location: string;
  language: string; // Changé de languages[] à language
  education: string;
  interests: string[];
  goals: string[];
  painPoints: string[];
  preferredContent: string[];
  tone: string;
  description: string;
}

export interface Site {
  id?: string;
  userId: string;
  name: string;
  url: string;
  type: 'wordpress' | 'custom';
  wpUsername?: string;
  wpAppPassword?: string;
  status: 'connected' | 'error' | 'pending';
  lastSync: string;
  articlesCount: number;
  autoPublish: boolean;
  categories: string[];
}

export interface UserSettings {
  id?: string;
  userId: string;
  language: string;
  theme: 'light' | 'dark';
  openAIKey?: string;
  wordPressCredentials?: {
    url: string;
    username: string;
    appPassword: string;
  };
}

// Types personnalisés pour les erreurs Firebase
interface FirebaseErrorWithCode extends Error {
  code?: string;
  details?: any;
}

// Firestore service class
export class FirestoreService {
  private db = getFirestore();

  // Ensure user is authenticated
  private async ensureUser() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.uid;
  }

  // Generic CRUD operations
  async create<T extends { userId: string }>(collectionName: string, data: T) {
    const userId = await this.ensureUser();
    data.userId = userId;
    return addDoc(collection(this.db, collectionName), data);
  }

  async update(collectionName: string, id: string, data: any) {
    await this.ensureUser();
    const docRef = doc(this.db, collectionName, id);
    return updateDoc(docRef, data);
  }

  async delete(collectionName: string, id: string) {
    await this.ensureUser();
    const docRef = doc(this.db, collectionName, id);
    return deleteDoc(docRef);
  }

  // Projects methods
  async getProjects() {
    const userId = await this.ensureUser();
    const q = query(
      collection(this.db, 'projects'), 
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    return getDocs(q);
  }

  async createProject(project: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'articleCount'>) {
    const userId = await this.ensureUser();
    const projectsRef = collection(this.db, 'projects');
    const projectRef = doc(projectsRef);
    
    const projectData: Project = {
      id: projectRef.id,
      ...project,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      articleCount: 0
    };

    await setDoc(projectRef, projectData);
    return projectRef;
  }

  async updateProject(projectId: string, projectData: Partial<Omit<Project, 'id' | 'userId'>>) {
    const projectRef = doc(this.db, 'projects', projectId);
    return updateDoc(projectRef, {
      ...projectData,
      updatedAt: Timestamp.now()
    });
  }

  async addProjectArticle(projectId: string, articleData: ProjectArticle) {
    const projectRef = doc(this.db, 'projects', projectId);
    const articlesRef = collection(projectRef, 'articles');
    const articleRef = await addDoc(articlesRef, articleData);

    // Incrémenter le compteur d'articles du projet
    await updateDoc(projectRef, {
      articleCount: increment(1),
      updatedAt: Timestamp.now()
    });

    return articleRef;
  }

  async deleteProjectArticle(projectId: string, articleId: string) {
    const projectRef = doc(this.db, 'projects', projectId);
    const articleRef = doc(projectRef, 'articles', articleId);

    await deleteDoc(articleRef);

    // Décrémenter le compteur d'articles du projet
    await updateDoc(projectRef, {
      articleCount: increment(-1),
      updatedAt: Timestamp.now()
    });
  }

  async getProjectArticles(projectId: string) {
    await this.ensureUser();
    const projectRef = doc(this.db, 'projects', projectId);
    const articlesQuery = query(
      collection(projectRef, 'articles'),
      orderBy('generatedAt', 'desc')
    );
    return getDocs(articlesQuery);
  }

  async updateProjectArticle(projectId: string, articleId: string, articleData: Partial<ProjectArticle>) {
    await this.ensureUser();
    const articleRef = doc(this.db, 'projects', projectId, 'articles', articleId);
    return updateDoc(articleRef, articleData);
  }

  // Articles methods
  async getArticlesByProject(projectId: string) {
    const userId = await this.ensureUser();
    const q = query(
      collection(this.db, 'articles'), 
      where('userId', '==', userId),
      where('projectId', '==', projectId),
      orderBy('publishDate', 'desc')
    );
    return getDocs(q);
  }

  async createArticle(article: Omit<Article, 'id' | 'userId'>) {
    return this.create<Article>('articles', article as Article);
  }

  // Personas methods
  async getPersonas() {
    const userId = await this.ensureUser();
    const q = query(
      collection(this.db, 'personas'), 
      where('userId', '==', userId)
    );
    return getDocs(q);
  }

  async createPersona(personaData: Omit<Persona, 'id' | 'userId'>) {
    try {
      const userId = await this.ensureUser();
      console.log('Creating persona with userId:', userId);

      const personasCollection = collection(this.db, 'personas');
      const personaRef = doc(personasCollection);
      
      const completePersonaData = {
        id: personaRef.id,
        ...personaData,
        userId
      };

      await setDoc(personaRef, completePersonaData);
      console.log('Persona created successfully:', personaRef.id);
      
      return personaRef;
    } catch (error) {
      console.error('Error in createPersona:', error);
      throw error;
    }
  }

  async updatePersona(personaId: string, personaData: Partial<Omit<Persona, 'id' | 'userId'>>) {
    return this.update('personas', personaId, personaData);
  }

  async deletePersona(personaId: string) {
    return this.delete('personas', personaId);
  }

  // Sites methods
  async getSites() {
    const userId = await this.ensureUser();
    const q = query(
      collection(this.db, 'sites'), 
      where('userId', '==', userId)
    );
    return getDocs(q);
  }

  async createSite(site: Omit<Site, 'id' | 'userId'>) {
    console.log('Début de createSite dans FirestoreService');
    try {
      const userId = await this.ensureUser();
      console.log('UserID récupéré:', userId);

      const siteWithUserId = {
        ...site,
        userId,
      };
      console.log('Données du site à créer:', JSON.stringify(siteWithUserId, null, 2));

      const sitesCollection = collection(this.db, 'sites');
      const newSiteRef = await addDoc(sitesCollection, siteWithUserId);
      
      // Créer l'objet site complet avec l'ID généré
      const createdSite: Site = {
        ...siteWithUserId,
        id: newSiteRef.id
      };
      
      console.log('Site créé avec succès:', {
        id: newSiteRef.id,
        path: newSiteRef.path
      });

      return createdSite;
    } catch (error: unknown) {
      const firebaseError = error as FirebaseErrorWithCode;
      console.error('Erreur détaillée dans createSite:', {
        message: firebaseError.message,
        code: firebaseError.code,
        details: firebaseError.details,
        stack: firebaseError.stack
      });
      throw error;
    }
  }

  async getSite(siteId: string): Promise<Site | null> {
    try {
      const siteDoc = await getDoc(doc(this.db, 'sites', siteId));
      if (siteDoc.exists()) {
        return { id: siteDoc.id, ...siteDoc.data() } as Site;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du site:', error);
      throw error;
    }
  }

  async updateSite(siteId: string, siteData: Partial<Omit<Site, 'id' | 'userId'>>): Promise<void> {
    try {
      await updateDoc(doc(this.db, 'sites', siteId), siteData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du site:', error);
      throw error;
    }
  }

  async deleteSite(siteId: string): Promise<void> {
    try {
      if (!siteId) {
        throw new Error('Site ID is required for deletion');
      }

      await this.ensureUser();
      const siteRef = doc(this.db, 'sites', siteId);
      console.log('deleteSite - Site reference created:', siteRef.path);
      
      await deleteDoc(siteRef);
      console.log('deleteSite - Site deleted successfully');
    } catch (error) {
      console.error('deleteSite - Error:', error);
      throw error;
    }
  }

  // User Settings methods
  async getUserSettings() {
    const userId = await this.ensureUser();
    const q = query(
      collection(this.db, 'userSettings'), 
      where('userId', '==', userId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0];
  }

  async updateUserSettings(settings: Partial<UserSettings>) {
    const userId = await this.ensureUser();
    const settingsDoc = await this.getUserSettings();
    
    if (settingsDoc) {
      return this.update('userSettings', settingsDoc.id, settings);
    } else {
      return this.create('userSettings', settings as UserSettings);
    }
  }
}

export const firestoreService = new FirestoreService();
