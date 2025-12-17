import api from './api';

export const chatbotService = {
  // Send message to chatbot
  sendMessage: async (message) => {
    const response = await api.post('/chatbot', { message });
    return response.data;
  },

  // Get financial forecast for next month
  getForecast: async () => {
    const response = await api.get('/chatbot/forecast');
    return response.data;
  },
};