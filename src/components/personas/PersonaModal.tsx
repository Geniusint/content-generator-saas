import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField 
} from '@mui/material';
import { firestoreService } from '../../services/firestore';
import { useAuth } from '../auth/AuthProvider';
import { Persona } from '../../services/firestore';

interface PersonaModalProps {
  open: boolean;
  onClose: () => void;
  onPersonaCreated?: (persona: Persona) => void;
}

export const PersonaModal: React.FC<PersonaModalProps> = ({ 
  open, 
  onClose, 
  onPersonaCreated 
}) => {
  const { currentUser } = useAuth();
  const [personaName, setPersonaName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePersona = async () => {
    if (!currentUser || !personaName.trim()) return;

    setLoading(true);
    try {
      const newPersonaData: Omit<Persona, 'id'> = { 
        userId: currentUser.uid,
        name: personaName.trim(),
        description: '', 
        tone: 'neutral', 
        keywords: [] 
      };

      const newPersonaRef = await firestoreService.create<Persona>('personas', newPersonaData);
      
      if (onPersonaCreated) {
        onPersonaCreated({ 
          id: newPersonaRef.id, 
          ...newPersonaData 
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de la persona', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Créer une nouvelle persona</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nom de la persona"
          fullWidth
          variant="outlined"
          value={personaName}
          onChange={(e) => setPersonaName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleCreatePersona}
          disabled={!personaName.trim() || loading}
        >
          {loading ? 'Création...' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
