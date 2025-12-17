import api from './api';

export const userService = {
  // Get all users (admin only)
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get a single user by ID (admin only)
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user role (admin only)
  updateRole: async (id, role) => {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  // Delete user (admin only)
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Get user statistics (admin only)
  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};