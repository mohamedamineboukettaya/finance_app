import api from "./api";

export const transactionService = {
  // Get all transactions with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.type) params.append("type", filters.type);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.offset) params.append("offset", filters.offset);

    const response = await api.get(`/transactions?${params.toString()}`);
    return response.data;
  },

  // Get a single transaction by ID
  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  // Create a new transaction
  create: async (transactionData) => {
    const response = await api.post("/transactions", transactionData);
    return response.data;
  },

  // Update a transaction
  update: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  // Delete a transaction
  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  // Get transaction summary (totals)
  getSummary: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const response = await api.get(
      `/transactions/summary?${params.toString()}`
    );
    return response.data;
  },

  // Get analytics data for charts
  getAnalytics: async (months = 6) => {
    const response = await api.get(`/transactions/analytics?months=${months}`);
    return response.data;
  },
};