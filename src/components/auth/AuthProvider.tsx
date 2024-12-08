import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import { User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider - Initial Setup');
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log('AuthStateChanged - User:', {
        user: !!user,
        uid: user?.uid,
        email: user?.email
      });
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth State Change Error:', error);
      setLoading(false);
    });

    // Vérification supplémentaire de l'utilisateur courant
    const checkCurrentUser = () => {
      const user = auth.currentUser;
      console.log('Direct auth.currentUser check:', {
        user: !!user,
        uid: user?.uid,
        email: user?.email
      });
    };

    checkCurrentUser();

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
