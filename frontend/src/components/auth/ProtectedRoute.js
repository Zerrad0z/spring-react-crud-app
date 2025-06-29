import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../../services/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  
  // First check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // If admin access is required, check admin status
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default ProtectedRoute;