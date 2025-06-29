import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Helper function to extract error message from ErrorResponse
const getErrorMessage = (error) => {

  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Fallback for string responses
  if (typeof error.response?.data === 'string') {
    return error.response.data;
  }
  
  // Default fallback
  return error.message || 'An unexpected error occurred';
};

export const categoryService = {
  /*
   * Get all categories
   */
  async getAllCategories(page = 0, size = 100) {
    try {
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES}?page=${page}&size=${size}`);
      
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        return response.data.content;
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      console.warn('Unexpected API response format:', response.data);
      return [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  async getAllCategoriesPaginated(page = 0, size = 20) {
    try {
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch paginated categories:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  /*
   * Get single category by ID
   */
  async getCategoryById(id) {
    if (!id) {
      throw new Error('Category ID is required');
    }

    try {
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  },

  /*
   * Get category with all its associated products
   */
  async getCategoryWithProducts(id) {
    if (!id) {
      throw new Error('Category ID is required');
    }

    try {
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/${id}/products`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch category ${id} with products:`, error);
      throw new Error(getErrorMessage(error));
    }
  },

  /*
   * Create new category
   */
  async createCategory(categoryData) {
    if (!categoryData || !categoryData.name || !categoryData.name.trim()) {
      throw new Error('Category name is required');
    }

    try {
      const payload = {
        name: categoryData.name.trim(),
        description: categoryData.description?.trim() || ''
      };

      const response = await api.post(API_ENDPOINTS.CATEGORIES, payload);
      return response.data;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  /*
   * Update existing category
   */
  async updateCategory(id, categoryData) {
    if (!id) {
      throw new Error('Category ID is required');
    }
    if (!categoryData || !categoryData.name || !categoryData.name.trim()) {
      throw new Error('Category name is required');
    }

    try {
      const payload = {
        name: categoryData.name.trim(),
        description: categoryData.description?.trim() || ''
      };

      const response = await api.put(`${API_ENDPOINTS.CATEGORIES}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  },

  /*
   * Delete category
   */
  async deleteCategory(id) {
    if (!id) {
      throw new Error('Category ID is required');
    }

    try {
      await api.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  },

  async categoryExists(id) {
    if (!id) return false;

    try {
      await this.getCategoryById(id);
      return true;
    } catch (error) {
      return false;
    }
  },

 /**
   * Search category - Fixed typo in URL
   */
  async searchCategory(name, params = {}){
    try{
      const searchParams = {...params, name};
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/search`, {params: searchParams});
      return response.data;
    } catch (error) {
      console.error('Failed to search category:', error);
      throw new Error(getErrorMessage(error));
    }
  }
};