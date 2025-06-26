import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

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
      throw new Error('Failed to fetch categories');
    }
  },

  async getAllCategoriesPaginated(page = 0, size = 20) {
    try {
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch paginated categories:', error);
      throw new Error('Failed to fetch categories');
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
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      console.error(`Failed to fetch category ${id}:`, error);
      throw new Error('Failed to fetch category');
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
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      console.error(`Failed to fetch category ${id} with products:`, error);
      throw new Error('Failed to fetch category with products');
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
      if (error.response?.status === 400) {
        const message = error.response.data?.message || 'Invalid category data';
        throw new Error(message);
      }
      if (error.response?.status === 409) {
        throw new Error('Category with this name already exists');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error('Failed to create category:', error);
      throw new Error('Failed to create category');
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
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      if (error.response?.status === 400) {
        const message = error.response.data?.message || 'Invalid category data';
        throw new Error(message);
      }
      if (error.response?.status === 409) {
        throw new Error('Category with this name already exists');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error(`Failed to update category ${id}:`, error);
      throw new Error('Failed to update category');
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
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      if (error.response?.status === 409) {
        throw new Error('Cannot delete category with existing products');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error(`Failed to delete category ${id}:`, error);
      throw new Error('Failed to delete category');
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
   * Search category
   */
  async searchCategory(name, params = {}){
    try{
      const searchParams = {...params, name};
      const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/seach`, {params: searchParams});
      return response.data;
    } catch (error) {
      if(error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to search category');
    }
  }
};