import express from 'express';
import { exportTransactionsPDF } from '../controllers/exportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/export/transactions/pdf - Export transactions as PDF
router.get('/transactions/pdf', exportTransactionsPDF);

export default router;