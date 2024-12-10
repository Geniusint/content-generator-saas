import { Configuration, OpenAIApi } from 'openai';
import { Persona } from './firestore';

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const validateLangue = (langue: string | undefined): string => {
  const validLangues = ['fr', 'en', 'es', 'de', 'it'];
  return validLangues.includes(langue || '') ? langue! : 'fr';
};

const validateNiveauExpertise = (niveau: string | undefined): 'novice' | 'intermédiaire' | 'expert' => {
  const validNiveaux = ['novice', 'intermédiaire', 'expert'] as const;
  return validNiveaux.includes(niveau as any) ? niveau as 'novice' | 'intermédiaire' | 'expert' : 'novice';
};

const validateStyleLangage = (style: string | undefined): 'simple' | 'neutre' | 'soutenu' => {
  const validStyles = ['simple', 'neutre', 'soutenu'] as const;
  return validStyles.includes(style as any) ? style as 'simple' | 'neutre' | 'soutenu' : 'simple';
};

const validateTonalite = (tonalite: string | undefined): 'pédagogique' | 'humoristique' | 'sérieux' => {
  const validTonalites = ['pédagogique', 'humoristique', 'sérieux'] as const;
  return validTonalites.includes(tonalite as any) ? tonalite as 'pédagogique' | 'humoristique' | 'sérieux' : 'pédagogique';
};

export const generatePersona = async (description: string): Promise<Omit<Persona, 'id' | 'userId'>> => {
  const prompt = `Crée un persona détaillé pour un projet de marketing de contenu basé sur cette description: "${description}". 
    Le persona doit inclure les informations suivantes:
    - Prénom
    - Nom
    - Âge
    - Profession
    - Niveau d'expertise (DOIT être exactement l'une de ces valeurs: novice, intermédiaire ou expert)
    - Objectifs (liste)
    - Défis (liste)
    - Sujets d'intérêt (liste)
    - Style de langage préféré (DOIT être exactement l'une de ces valeurs: simple, neutre ou soutenu)
    - Tonalité préférée (DOIT être exactement l'une de ces valeurs: pédagogique, humoristique ou sérieux)
    - Sources d'information habituelles (liste)
    - Langue principale (DOIT être exactement l'une de ces valeurs: fr, en, es, de, ou it)
    
    IMPORTANT: Les champs niveau_expertise, style_langage_prefere, tonalite_preferee et langue DOIVENT correspondre EXACTEMENT aux valeurs spécifiées.
    
    Réponds uniquement avec un objet JSON valide.`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const response = completion.data.choices[0].message?.content;
    if (!response) throw new Error("Pas de réponse de l'IA");

    console.log('Réponse brute de l\'IA:', response);
    const persona = JSON.parse(response);
    console.log('Persona parsé:', persona);

    // Validation et transformation des données avec les types corrects
    const validatedPersona: Omit<Persona, 'id' | 'userId'> = {
      prenom: persona.prenom || 'John',
      nom: persona.nom || 'Doe',
      age: parseInt(persona.age) || 30,
      profession: persona.profession || 'Non spécifié',
      niveau_expertise: validateNiveauExpertise(persona.niveau_expertise),
      objectifs: Array.isArray(persona.objectifs) ? persona.objectifs : [],
      defis: Array.isArray(persona.defis) ? persona.defis : [],
      sujets_interet: Array.isArray(persona.sujets_interet) ? persona.sujets_interet : [],
      style_langage_prefere: validateStyleLangage(persona.style_langage_prefere),
      tonalite_preferee: validateTonalite(persona.tonalite_preferee),
      sources_information_habituelles: Array.isArray(persona.sources_information_habituelles) ? persona.sources_information_habituelles : [],
      langue: validateLangue(persona.langue)
    };

    console.log('Persona validé:', validatedPersona);
    return validatedPersona;
  } catch (error) {
    console.error('Erreur lors de la génération du persona:', error);
    throw error;
  }
};
