import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

export const UserProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        size="large"
        aria-label="compte de l'utilisateur"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar
          alt={currentUser.displayName || currentUser.email || 'User'}
          src={currentUser.photoURL || undefined}
          sx={{ width: 32, height: 32 }}
        >
          {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" noWrap>
            {currentUser.displayName || currentUser.email}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {currentUser.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          Se déconnecter
        </MenuItem>
      </Menu>
    </Box>
  );
};
