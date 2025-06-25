import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const categoryService = {
  /**
   * Get all categories
   */
  async getAllCategories() {
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  },

  /**
   * Get single category by ID
   */
  async getCategoryById(id) {
    try {
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error('Failed to fetch category');
    }
  },

  /**
   * Get category with its products
   */
  async getCategoryWithProducts(id) {
    try {
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/${id}/products`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error('Failed to fetch category with products');
    }
  },

  /**
   * Create new category
   */
  async createCategory(categoryData) {
    try {
      const response = await api.post(API_ENDPOINTS.CATEGORIES, categoryData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create category');
    }
  },

  /**
   * Update existing category
   */
  async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`${API_ENDPOINTS.CATEGORIES}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update category');
    }
  },

  /**
   * Delete category
   */
  async deleteCategory(id) {
    try {
      await api.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      if (error.response?.status === 409) {
        throw new Error('Cannot delete category with existing products');
      }
      throw new Error('Failed to delete category');
    }
  }
};