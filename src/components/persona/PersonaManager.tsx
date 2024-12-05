import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { db } from '../../config/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';

interface Persona {
  id: string;
  name: string;
  description: string;
  tone: string;
  style: string;
}

export const PersonaManager: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [newPersona, setNewPersona] = useState({
    name: '',
    description: '',
    tone: '',
    style: ''
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadPersonas();
    }
  }, [currentUser]);

  const loadPersonas = async () => {
    if (!currentUser) return;
    
    try {
      const personasCollection = collection(db, `users/${currentUser.uid}/personas`);
      const snapshot = await getDocs(personasCollection);
      const loadedPersonas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Persona[];
      setPersonas(loadedPersonas);
    } catch (error) {
      console.error('Error loading personas:', error);
    }
  };

  const addPersona = async () => {
    if (!currentUser) return;
    
    try {
      const personasCollection = collection(db, `users/${currentUser.uid}/personas`);
      await addDoc(personasCollection, newPersona);
      setNewPersona({ name: '', description: '', tone: '', style: '' });
      loadPersonas();
    } catch (error) {
      console.error('Error adding persona:', error);
    }
  };

  const deletePersona = async (personaId: string) => {
    if (!currentUser) return;
    
    try {
      const personaRef = doc(db, `users/${currentUser.uid}/personas/${personaId}`);
      await deleteDoc(personaRef);
      loadPersonas();
    } catch (error) {
      console.error('Error deleting persona:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Persona Manager
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          value={newPersona.name}
          onChange={(e) => setNewPersona({ ...newPersona, name: e.target.value })}
        />
        <TextField
          label="Description"
          multiline
          rows={2}
          value={newPersona.description}
          onChange={(e) => setNewPersona({ ...newPersona, description: e.target.value })}
        />
        <TextField
          label="Tone"
          value={newPersona.tone}
          onChange={(e) => setNewPersona({ ...newPersona, tone: e.target.value })}
        />
        <TextField
          label="Style"
          value={newPersona.style}
          onChange={(e) => setNewPersona({ ...newPersona, style: e.target.value })}
        />
        <Button variant="contained" onClick={addPersona}>
          Add Persona
        </Button>

        <List>
          {personas.map((persona) => (
            <ListItem key={persona.id}>
              <ListItemText
                primary={persona.name}
                secondary={persona.description}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => deletePersona(persona.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};
