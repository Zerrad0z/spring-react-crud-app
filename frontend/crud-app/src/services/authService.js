import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
  /**
   * Login user
   * @param {Object} credentials - {username, password}
   * @returns {Promise<Object>} User data
   */
  async login(credentials) {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
      return response.data; // Returns UserDTO: {id, username, role}
    } catch (error) {
      // Handle different error scenarios
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      } else if (error.response?.status === 404) {
        throw new Error('User not found');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  },

  /**
   * Logout user
   */
  logout() {
    return Promise.resolve();
  }
};