import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Vous pouvez remplacer ceci par un spinner
  }

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};
