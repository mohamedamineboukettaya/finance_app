import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryValidation,
} from "../controllers/categoryController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/categories - Get all categories
router.get("/", getCategories);

// GET /api/categories/:id - Get single category
router.get("/:id", getCategoryById);

// POST /api/categories - Create new category
router.post("/", categoryValidation, createCategory);

// PUT /api/categories/:id - Update category
router.put("/:id", categoryValidation, updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete("/:id", deleteCategory);

export default router;
