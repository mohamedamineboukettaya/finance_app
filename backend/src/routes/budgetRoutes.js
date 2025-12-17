import express from 'express';
import {
  getBudgetSettings,
  updateBudgetSettings,
  budgetValidation
} from '../controllers/budgetController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/budget - Get budget settings
router.get('/', getBudgetSettings);

// PUT /api/budget - Update monthly budget
router.put('/', budgetValidation, updateBudgetSettings);

export default router;