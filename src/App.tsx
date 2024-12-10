import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/layout/Dashboard';
import { ContentGenerator } from './components/content/ContentGenerator';
import { WordPressPublisher } from './components/wordpress/WordPressPublisher';
import { PersonasManager } from './components/personas/PersonasManager';
import { Settings } from './components/settings/Settings';
import { ArticlesList } from './components/articles/ArticlesList';
import NewArticlePage from './components/articles/NewArticlePage';
import { SitesList } from './components/sites/SitesList';
import { AuthProvider } from './components/auth/AuthProvider';
import { ProjectsPage } from './components/ProjectsPage';
import { SignInPage } from './components/auth/SignInPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
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
          <Routes>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/generator" element={<ContentGenerator persona="default" keywords={[]} />} />
              <Route path="/publisher" element={<WordPressPublisher content="" title="" />} />
              <Route path="/personas" element={<PersonasManager />} />
              <Route path="/sites" element={<SitesList />} />
              <Route path="/articles" element={<ArticlesList />} />
              <Route path="/new-article" element={<NewArticlePage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
