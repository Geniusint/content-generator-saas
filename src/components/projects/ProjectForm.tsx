import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { firestoreService } from '../../services/firestore';
import { useAuth } from '../auth/AuthProvider';
import { PersonaModal } from '../personas/PersonaModal';
import { SiteModal } from '../sites/SiteModal';
import { Project, Site, Persona } from '../../services/firestore';

interface ProjectFormProps {
  persona?: string;
  keywords?: string[];
  mode?: 'page' | 'modal';
  onProjectCreated?: () => void;
  onClose?: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  persona = '',
  keywords = [],
  mode = 'page',
  onProjectCreated,
  onClose
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [projectName, setProjectName] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(persona);
  const [isLoading, setIsLoading] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);

  // États pour les listes déroulantes
  const [sites, setSites] = useState<Site[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);

  // Charger les sites et personas
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        const sitesSnapshot = await firestoreService.getSites();
        const personasSnapshot = await firestoreService.getPersonas();

        setSites(sitesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Site)));
        setPersonas(personasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Persona)));
      } catch (error) {
        console.error('Erreur lors du chargement des sites et personas', error);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleCreateProject = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'articleCount'> = {
        name: projectName,
        site: { 
          id: selectedSite, 
          name: sites.find(s => s.id === selectedSite)?.name || '' 
        },
        persona: { 
          id: selectedPersona, 
          name: personas.find(p => p.id === selectedPersona)?.name || '' 
        },
        status: 'draft',
      };

      const projectRef = await firestoreService.createProject(projectData);
      
      if (mode === 'modal' && onProjectCreated) {
        onProjectCreated();
      } else {
        navigate(`/projects/${projectRef.id}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création du projet', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaCreated = (newPersona: Persona) => {
    setPersonas(prev => [...prev, newPersona]);
    if (newPersona.id) {
      setSelectedPersona(newPersona.id);
    }
    setIsPersonaModalOpen(false);
  };

  const handleSiteCreated = (newSite: Site) => {
    setSites(prev => [...prev, newSite]);
    if (newSite.id) {
      setSelectedSite(newSite.id);
    }
    setIsSiteModalOpen(false);
  };

  const renderForm = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3,
      width: '100%',
      maxWidth: 600,
      margin: 'auto'
    }}>
      <TextField
        label="Nom du projet"
        variant="outlined"
        fullWidth
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Select
            label="Site"
            variant="outlined"
            fullWidth
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Sélectionner un site
            </MenuItem>
            {sites.map((site) => (
              <MenuItem key={site.id} value={site.id}>
                {site.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={2}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => setIsSiteModalOpen(true)}
            fullWidth
            sx={{ height: '100%' }}
          >
            +
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Select
            label="Persona"
            variant="outlined"
            fullWidth
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Sélectionner un persona
            </MenuItem>
            {personas.map((persona) => (
              <MenuItem key={persona.id} value={persona.id}>
                {persona.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={2}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => setIsPersonaModalOpen(true)}
            fullWidth
            sx={{ height: '100%' }}
          >
            +
          </Button>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        disabled={!projectName || !selectedSite || !selectedPersona || isLoading}
        onClick={handleCreateProject}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {isLoading ? 'Création en cours...' : 'Créer le projet'}
      </Button>
    </Box>
  );

  return (
    <>
      {mode === 'page' ? (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Créer un nouveau projet
          </Typography>
          {renderForm()}
        </Container>
      ) : (
        <>
          <DialogTitle>Créer un nouveau projet</DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {renderForm()}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose}>Annuler</Button>
          </DialogActions>
        </>
      )}

      <PersonaModal 
        open={isPersonaModalOpen} 
        onClose={() => setIsPersonaModalOpen(false)} 
        onPersonaCreated={handlePersonaCreated}
      />
      <SiteModal 
        open={isSiteModalOpen} 
        onClose={() => setIsSiteModalOpen(false)} 
        onSiteCreated={handleSiteCreated}
      />
    </>
  );
};
