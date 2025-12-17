import express from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getMonthlyAnalytics,
  transactionValidation
} from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/transactions/summary - Get totals
router.get('/summary', getTransactionSummary);

// GET /api/transactions/analytics - Get monthly analytics
router.get('/analytics', getMonthlyAnalytics);

// GET /api/transactions - Get all transactions (with filters)
router.get('/', getTransactions);

// GET /api/transactions/:id - Get single transaction
router.get('/:id', getTransactionById);

// POST /api/transactions - Create new transaction
router.post('/', transactionValidation, createTransaction);

// PUT /api/transactions/:id - Update transaction
router.put('/:id', transactionValidation, updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', deleteTransaction);

export default router;