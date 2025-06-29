import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

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

export const productService = {

  /**
   * Get all products with pagination
   */
  async getAllProducts(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get single product by ID
   */
  async getProductById(id) {
    if (!id) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create product
   */
  async createProduct(productData) {
    if (!productData || !productData.name || !productData.name.trim()) {
      throw new Error('Product name is required');
    }

    try {
      const response = await api.post(API_ENDPOINTS.PRODUCTS, productData);
      return response.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update existing product
   */
  async updateProduct(id, productData) {
    if (!id) {
      throw new Error('Product ID is required');
    }
    if (!productData || !productData.name || !productData.name.trim()) {
      throw new Error('Product name is required');
    }

    try {
      const response = await api.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete product
   */
  async deleteProduct(id) {
    if (!id) {
      throw new Error('Product ID is required');
    }

    try {
      await api.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId, params = {}) {
    if (!categoryId) {
      throw new Error('Category ID is required');
    }

    try {
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/category/${categoryId}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch products for category ${categoryId}:`, error);
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Check if product exists
   */
  async productExists(id) {
    if (!id) return false;

    try {
      await this.getProductById(id);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Search product
   */
  async searchProduct(name, params = {}) {
    try {
      const searchParams = { ...params, name };
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/search`, { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Failed to search products:', error);
      throw new Error(getErrorMessage(error));
    }
  }
};