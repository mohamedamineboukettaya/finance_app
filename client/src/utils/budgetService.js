import api from './api';

export const budgetService = {
  // Get budget settings and status
  getSettings: async () => {
    const response = await api.get('/budget');
    return response.data;
  },

  // Update monthly budget
  updateBudget: async (monthlyBudget) => {
    const response = await api.put('/budget', { monthlyBudget });
    return response.data;
  }
};