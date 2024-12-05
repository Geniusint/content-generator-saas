import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  Folder as ProjectIcon,
  Person as PersonaIcon,
  Settings as SettingsIcon,
  Language as SitesIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const FULL_DRAWER_WIDTH = 320;
const MINI_DRAWER_WIDTH = 280;

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const drawerWidth = isSmallScreen ? MINI_DRAWER_WIDTH : (isMediumScreen ? MINI_DRAWER_WIDTH : FULL_DRAWER_WIDTH);

  const menuItems = [
    { text: t('menu.dashboard') as string, icon: <DashboardIcon />, path: '/' },
    { text: t('menu.projects') as string, icon: <ProjectIcon />, path: '/projects' },
    { text: t('menu.articles') as string, icon: <ArticleIcon />, path: '/articles' },
    { text: t('menu.personas') as string, icon: <PersonaIcon />, path: '/personas' },
    { text: t('menu.sites') as string, icon: <SitesIcon />, path: '/sites' },
    { text: t('menu.settings') as string, icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 2,
        }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{ height: 40, width: 'auto' }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: '1.5rem',
            fontWeight: 600,
            color: theme.palette.primary.main
          }}
        >
          Content Gen
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isSmallScreen && onMobileClose) {
                onMobileClose();
              }
            }}
            selected={location.pathname === item.path}
            sx={{
              minHeight: 56,
              px: 3,
              py: 1,
              mb: 1,
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 48,
                color: location.pathname === item.path
                  ? theme.palette.primary.main
                  : 'inherit',
                '& .MuiSvgIcon-root': {
                  fontSize: '1.5rem',
                },
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                ml: 1,
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  fontSize: '1rem',
                  color: location.pathname === item.path
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: MINI_DRAWER_WIDTH,
            backgroundColor: theme.palette.background.default,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};
