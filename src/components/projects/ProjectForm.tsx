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
  CircularProgress,
  FormControl,
  InputLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { firestoreService } from '../../services/firestore';
import { useAuth } from '../auth/AuthProvider';
import { PersonaModal } from '../../components/personas/PersonaModal';
import { SiteModal } from '../sites/SiteModal';
import { Project, Site, Persona } from '../../services/firestore';

interface ProjectFormProps {
  project?: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'articleCount'>;
  projectId?: string | null;
  persona?: string;
  keywords?: string[];
  mode?: 'page' | 'modal';
  onSuccess?: () => Promise<void>;
  onCancel?: () => void;
  editMode?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  projectId,
  persona = '',
  keywords = [],
  mode = 'page',
  onSuccess,
  onCancel,
  editMode = false
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
  const [errors, setErrors] = useState({
    projectName: false,
    site: false,
    persona: false
  });

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

    // Validate form
    const newErrors = {
      projectName: !projectName.trim(),
      site: !selectedSite,
      persona: !selectedPersona
    };
    
    setErrors(newErrors);

    // If there are any errors, don't submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    setIsLoading(true);
    try {
      const selectedPersonaData = personas.find(p => p.id === selectedPersona);
      const projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'articleCount'> = {
        name: projectName,
        site: { 
          id: selectedSite, 
          name: sites.find(s => s.id === selectedSite)?.name || '' 
        },
        persona: { 
          id: selectedPersona, 
          name: selectedPersonaData ? `${selectedPersonaData.prenom} ${selectedPersonaData.nom}` : '' 
        },
        status: 'draft',
      };

      const projectRef = await firestoreService.createProject(projectData);
      
      if (mode === 'modal' && onSuccess) {
        await onSuccess();
      } else {
        navigate(`/projects/${projectRef.id}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création du projet', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaCreated = async (personaData: Omit<Persona, "id" | "userId">) => {
    try {
      const newPersonaRef = await firestoreService.createPersona(personaData);
      const newPersona = {
        id: newPersonaRef.id,
        userId: currentUser?.uid || '',
        ...personaData
      };
      setPersonas(prev => [...prev, newPersona]);
      setSelectedPersona(newPersonaRef.id);
      setIsPersonaModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création du persona', error);
    }
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
        required
        error={errors.projectName}
        helperText={errors.projectName ? "Le nom du projet est requis" : ""}
        InputProps={{
          style: {
            color: 'black',
          },
        }}
        InputLabelProps={{
          style: {
            color: projectName ? 'black' : '#999',
            paddingTop: projectName ? '8px' : '0px',
          },
          shrink: !!projectName,
        }}
      />

      <Grid container spacing={2}>
        <Grid item xs={10}>
          <FormControl fullWidth variant="outlined" error={errors.site}>
            <Select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              required
              inputProps={{
                style: {
                  color: selectedSite ? 'black' : '#666',
                },
              }}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#666' }}>Sélectionner un site</span>;
                }
                return sites.find(site => site.id === selected)?.name;
              }}
            >
              {sites.map((site) => (
                <MenuItem key={site.id} value={site.id}>
                  {site.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <FormControl fullWidth variant="outlined" error={errors.persona}>
            <Select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              required
              inputProps={{
                style: {
                  color: selectedPersona ? 'black' : '#666',
                },
              }}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#666' }}>Sélectionner un persona</span>;
                }
                const persona = personas.find(p => p.id === selected);
                return persona ? `${persona.prenom} ${persona.nom}` : '';
              }}
            >
              {personas.map((persona) => (
                <MenuItem key={persona.id} value={persona.id}>
                  {`${persona.prenom} ${persona.nom}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            <Button onClick={onCancel}>Annuler</Button>
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
