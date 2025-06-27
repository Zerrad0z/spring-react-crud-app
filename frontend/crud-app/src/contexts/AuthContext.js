import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser, isAuthenticated } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const userData = await apiLogin(credentials);
    setCurrentUser({
      username: userData.username
    });
    return userData;
  };

  const logout = () => {
    apiLogout();
    setCurrentUser(null);
  };

  const authValue = {
    currentUser,
    login,
    logout,
    isAuthenticated: isAuthenticated()
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);