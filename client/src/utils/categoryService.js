import api from './api';

export const categoryService = {
  // Get all categories with optional type filter
  getAll: async (type = null) => {
    const params = type ? `?type=${type}` : '';
    const response = await api.get(`/categories${params}`);
    return response.data;
  },

  // Get a single category by ID
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create a new category
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update a category
  update: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete a category
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};