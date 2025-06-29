import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS, USER_ROLES } from '../utils/constants';

export const login = async (credentials) => {
  try {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);

    // Store authentication data
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    
    const userData = {
      username: response.data.username,
      role: response.data.role || USER_ROLES.USER // Default to USER role if not provided
    };
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

    return response.data;
  } catch (error) {
    // Handle specific error messages from backend
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Invalid username or password');
      }
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Check if current user is admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  console.log('Current user:', user); // Debug log
  return user?.role === USER_ROLES.ADMIN;
};

/**
 * Check if current user is regular user
 */
export const isUser = () => {
  const user = getCurrentUser();
  return user?.role === USER_ROLES.USER;
};

/**
 * Get current user's role
 */
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};