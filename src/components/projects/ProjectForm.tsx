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
import { SiteModal } from '../sites/SiteModal';
import { PersonaModal } from '../personas/PersonaModal';
import { Project, Site, Persona } from '../../services/firestore';

interface ProjectFormProps {
  project?: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'articleCount'>;
  projectId?: string | null;
  keywords?: string[];
  mode?: 'page' | 'modal';
  onSuccess?: () => Promise<void>;
  onCancel?: () => void;
  editMode?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  projectId,
  keywords = [],
  mode = 'page',
  onSuccess,
  onCancel,
  editMode = false
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [projectName, setProjectName] = useState(project?.name || '');
  const [selectedSite, setSelectedSite] = useState(project?.site.id || '');
  const [selectedPersona, setSelectedPersona] = useState(project?.persona?.id || '');
  const [projectStatus, setProjectStatus] = useState(project?.status || 'draft');
  const [isLoading, setIsLoading] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [errors, setErrors] = useState({
    projectName: false,
    site: false,
  });

  // États pour les listes déroulantes
  const [sites, setSites] = useState<Site[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [filteredPersonas, setFilteredPersonas] = useState<Persona[]>([]);

  // Charger les sites et personas
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        const sitesSnapshot = await firestoreService.getSites();
        setSites(sitesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Site)));

        const personasSnapshot = await firestoreService.getPersonas();
        setPersonas(personasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Persona)));
      } catch (error) {
        console.error('Erreur lors du chargement des sites et personas', error);
      }
    };

    fetchData();
  }, [currentUser]);

  // Filtrer les personas en fonction du site sélectionné
  useEffect(() => {
    if (selectedSite && personas.length > 0) {
      const filtered = personas.filter(persona => persona.siteId === selectedSite);
      setFilteredPersonas(filtered);
    } else {
        setFilteredPersonas(personas);
    }
  }, [selectedSite, personas]);

  const handleCreateProject = async () => {
    if (!currentUser) return;

    // Validate form
    const newErrors = {
      projectName: !projectName.trim(),
      site: !selectedSite,
    };
    
    setErrors(newErrors);

    // If there are any errors, don't submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    setIsLoading(true);
    try {
      const projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'articleCount'> = {
        name: projectName,
        site: { 
          id: selectedSite, 
          name: sites.find(s => s.id === selectedSite)?.name || '' 
        },
        persona: selectedPersona ? {
          id: selectedPersona,
          name: personas.find(p => p.id === selectedPersona)?.prenom + ' ' + personas.find(p => p.id === selectedPersona)?.nom || ''
        } : undefined,
        status: projectStatus,
      };

      if (projectId && editMode) {
        await firestoreService.updateProject(projectId, projectData);
      } else {
        const projectRef = await firestoreService.createProject(projectData);
        if (mode === 'modal' && onSuccess) {
          await onSuccess();
        } else {
          navigate(`/projects/${projectRef.id}`);
        }
      }
      
      if (mode === 'modal' && onSuccess) {
        await onSuccess();
      } else {
        navigate('/projects');
      }
    } catch (error) {
      console.error('Erreur lors de la création du projet', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSiteCreated = (newSite: Site) => {
    setSites(prev => [...prev, newSite]);
    if (newSite.id) {
      setSelectedSite(newSite.id);
    }
    setIsSiteModalOpen(false);
  };

    const handlePersonaCreated = async (newPersona: Omit<Persona, 'id' | 'userId'>) => {
        if (!currentUser) return;
        
        const personaRef = await firestoreService.createPersona(newPersona);
        
        const personaWithUserId = {
            ...newPersona,
            userId: currentUser.uid,
            id: personaRef.id
        } as Persona;

        setPersonas(prev => [...prev, personaWithUserId]);
        setSelectedPersona(personaRef.id);
        setIsPersonaModalOpen(false);
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
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="project-persona-label">Persona du projet</InputLabel>
                    <Select
                        labelId="project-persona-label"
                        id="project-persona"
                        value={selectedPersona}
                        onChange={(e) => setSelectedPersona(e.target.value as string)}
                        label="Persona du projet"
                        displayEmpty
                        renderValue={(selected) => {
                            if (!selected) {
                                return <span style={{ color: '#666' }}>Sélectionner un persona</span>;
                            }
                            const persona = filteredPersonas.find(persona => persona.id === selected);
                            return persona ? `${persona.prenom} ${persona.nom}` : 'Aucun persona pour ce site';
                        }}
                    >
                        <MenuItem value="">
                            <em>Aucun</em>
                        </MenuItem>
                        {filteredPersonas.map((persona) => (
                            <MenuItem key={persona.id} value={persona.id}>
                                {persona.prenom} {persona.nom}
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

      <FormControl fullWidth variant="outlined">
        <InputLabel id="project-status-label">Status du projet</InputLabel>
        <Select
          labelId="project-status-label"
          id="project-status"
          value={projectStatus}
          onChange={(e) => setProjectStatus(e.target.value as 'draft' | 'active' | 'completed')}
          label="Status du projet"
        >
          <MenuItem value="draft">Brouillon</MenuItem>
          <MenuItem value="active">Actif</MenuItem>
          <MenuItem value="completed">Terminé</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        disabled={!projectName || !selectedSite || isLoading}
        onClick={handleCreateProject}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {isLoading ? (editMode ? 'Mise à jour en cours...' : 'Création en cours...') : (editMode ? 'Mettre à jour le projet' : 'Créer le projet')}
      </Button>
    </Box>
  );

  return (
    <>
      {mode === 'page' ? (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {editMode ? 'Modifier le projet' : 'Créer un nouveau projet'}
          </Typography>
          {renderForm()}
        </Container>
      ) : (
        <>
          <DialogTitle>{editMode ? 'Modifier le projet' : 'Créer un nouveau projet'}</DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {renderForm()}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onCancel}>Annuler</Button>
          </DialogActions>
        </>
      )}

      <SiteModal 
        open={isSiteModalOpen} 
        onClose={() => setIsSiteModalOpen(false)} 
        onSiteCreated={handleSiteCreated}
      />
        <PersonaModal
            open={isPersonaModalOpen}
            onClose={() => setIsPersonaModalOpen(false)}
            onPersonaCreated={handlePersonaCreated}
        />
    </>
  );
};
