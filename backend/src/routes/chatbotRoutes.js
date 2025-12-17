import express from 'express';
import { chatWithBot, generateForecast } from '../controllers/chatbotController.js';
import { authenticateToken } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Test endpoint to verify API key (no auth needed for testing)
router.get('/test', async (req, res) => {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('API Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10));

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: false, message: 'API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try to list available models
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
      );
      const data = await response.json();
      
      if (data.models) {
        const modelNames = data.models.map(m => m.name);
        return res.json({
          success: true,
          message: 'Available models:',
          models: modelNames,
        });
      } else {
        return res.json({
          success: false,
          message: 'Could not list models',
          error: data,
        });
      }
    } catch (listError) {
      // If listing fails, try a simple generation
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Say hello');
      const response = await result.response;
      const text = response.text();
      
      res.json({ 
        success: true, 
        message: 'API key is working!',
        response: text 
      });
    }
  } catch (error) {
    console.error('Test error:', error.message);
    res.json({ 
      success: false, 
      message: 'API key test failed',
      error: error.message,
      suggestion: 'Please create a NEW API key at https://aistudio.google.com/app/apikey'
    });
  }
});

// All other routes require authentication
router.use(authenticateToken);

// POST /api/chatbot - Send message to chatbot
router.post('/', chatWithBot);

// GET /api/chatbot/forecast - Generate financial forecast
router.get('/forecast', generateForecast);

export default router;