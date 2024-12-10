# Modifications à appliquer au composant PersonasManager

1. Ajouter l'import OpenAI au début du fichier :
```typescript
import { generatePersona } from '../../services/openai';
```

2. Ajouter les nouveaux états dans le composant :
```typescript
const [openAIDialog, setOpenAIDialog] = useState(false);
const [aiDescription, setAiDescription] = useState('');
```

3. Ajouter la fonction handleGeneratePersona :
```typescript
const handleGeneratePersona = async () => {
  try {
    setLoading(true);
    const generatedPersona = await generatePersona(aiDescription);
    await firestoreService.createPersona(generatedPersona);
    setOpenAIDialog(false);
    setAiDescription('');
    await fetchPersonas(); // Assurez-vous d'utiliser le nom correct de votre fonction de chargement des personas
  } catch (error) {
    console.error('Erreur lors de la génération du persona:', error);
    setError('Une erreur est survenue lors de la génération du persona');
  } finally {
    setLoading(false);
  }
};
```

4. Ajouter le bouton "Créer via IA" à côté du bouton existant :
```typescript
<Button
  variant="contained"
  color="primary"
  startIcon={<PersonIcon />}
  onClick={() => setOpenAIDialog(true)}
>
  Créer via IA
</Button>
```

5. Ajouter le dialogue de création via IA avant la dernière balise fermante du composant :
```typescript
<Dialog open={openAIDialog} onClose={() => setOpenAIDialog(false)} maxWidth="md" fullWidth>
  <DialogTitle>Créer un persona avec l'IA</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      multiline
      rows={4}
      label="Description du persona souhaité"
      value={aiDescription}
      onChange={(e) => setAiDescription(e.target.value)}
      placeholder="Décrivez le type de persona que vous souhaitez créer..."
      sx={{ mt: 2 }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenAIDialog(false)}>Annuler</Button>
    <Button
      onClick={handleGeneratePersona}
      variant="contained"
      color="primary"
      disabled={!aiDescription.trim() || loading}
    >
      {loading ? 'Génération...' : 'Générer'}
    </Button>
  </DialogActions>
</Dialog>
```
