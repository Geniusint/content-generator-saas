import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/layout/Dashboard';
import { ContentGenerator } from './components/content/ContentGenerator';
import { WordPressPublisher } from './components/wordpress/WordPressPublisher';
import { PersonaManager } from './components/persona/PersonaManager';
import { Settings } from './components/settings/Settings';
import { ArticlesList } from './components/articles/ArticlesList';
import { PersonasList } from './components/personas/PersonasList';
import { SitesList } from './components/sites/SitesList';
import { AuthProvider } from './components/auth/AuthProvider';
import './i18n/i18n';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Dashboard />} />
              <Route path="/new-project" element={<ContentGenerator persona="default" keywords={[]} />} />
              <Route path="/articles" element={<ArticlesList />} />
              <Route path="/personas" element={<PersonasList />} />
              <Route path="/sites" element={<SitesList />} />
              <Route path="/publish" element={<WordPressPublisher content="" title="" />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
