import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats,
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/users/stats - Get user statistics
router.get('/stats', getUserStats);

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get single user
router.get('/:id', getUserById);

// PATCH /api/users/:id/role - Update user role
router.patch('/:id/role', updateUserRole);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

export default router;