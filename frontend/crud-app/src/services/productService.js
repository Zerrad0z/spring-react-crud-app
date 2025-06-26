import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

export const productService = {

    /**
     * Get all products with pagination
     */
    async getAllProducts(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS, { params });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  /**
   * Create product
   */
  async createProduct(productData) {
    try {
      const response = await api.post(API_ENDPOINTS.PRODUCTS, productData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create product');
    }
  },

  /**
   * Update existing product
   */
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, productData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update product');
    }
  },

  /**
   * Delete product
   */
  async deleteProduct(id) {
    try {
      await api.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error('Failed to delete product');
    }
  },

  /**
   *  Get product by category
   */
   async getProductsByCategory(categoryId, params = {}) {
    try {
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/category/${categoryId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch products by category');
    }
  },

  /**
   * Search product
   */
  async searchProduct(name, params = {}){
    try{
      const searchParams = {...params, name};
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/seach`, {params: searchParams});
      return response.data;
    } catch (error) {
      if(error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to search products');
    }
  }

}