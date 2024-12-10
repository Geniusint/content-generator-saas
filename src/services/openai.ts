import { Configuration, OpenAIApi } from 'openai';
import { Persona } from './firestore';

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

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
    
    IMPORTANT: Les champs niveau_expertise, style_langage_prefere et tonalite_preferee DOIVENT correspondre EXACTEMENT aux valeurs spécifiées.
    
    Réponds uniquement avec un objet JSON valide.`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const response = completion.data.choices[0].message?.content;
    if (!response) throw new Error("Pas de réponse de l'IA");

    const persona = JSON.parse(response);
    return {
      prenom: persona.prenom,
      nom: persona.nom,
      age: parseInt(persona.age),
      profession: persona.profession,
      niveau_expertise: persona.niveau_expertise,
      objectifs: persona.objectifs || [],
      defis: persona.defis || [],
      sujets_interet: persona.sujets_interet || [],
      style_langage_prefere: persona.style_langage_prefere,
      tonalite_preferee: persona.tonalite_preferee,
      sources_information_habituelles: persona.sources_information_habituelles || [],
      langue: persona.langue
    };
  } catch (error) {
    console.error('Erreur lors de la génération du persona:', error);
    throw error;
  }
};
