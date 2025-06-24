import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Debug logging
  console.log('ProtectedRoute Debug:', {
    loading,
    isAuthenticated: isAuthenticated(),
    user
  });

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('User authenticated, showing protected content');
  return children;
};

export default ProtectedRoute;