import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

export const GoogleSignInButton: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error: any) {
      console.error('Erreur de connexion Google:', error.message);
    }
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={handleGoogleSignIn}
      sx={{
        borderColor: '#4285f4',
        color: '#4285f4',
        '&:hover': {
          borderColor: '#357abd',
          backgroundColor: 'rgba(66, 133, 244, 0.04)',
        },
        textTransform: 'none',
        mb: 2,
      }}
    >
      Se connecter avec Google
    </Button>
  );
};
