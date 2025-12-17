import express from 'express';
import {
  register,
  registerValidation,
  login,
  loginValidation,
  getCurrentUser,
  refreshAccessToken
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshAccessToken);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

export default router;