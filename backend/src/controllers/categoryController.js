import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Validation rules
export const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name must be less than 50 characters'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Icon name must be less than 50 characters')
];

// Helper function to check if user is admin
const checkAdmin = (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Only admins can manage categories'
    });
    return false;
  }
  return true;
};

// Get all categories (global + user's personal categories)
export const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;

    const where = {
      OR: [
        { isGlobal: true },           // Global categories (admin-created)
        { userId: req.user.id }       // User's personal categories
      ]
    };

    if (type) {
      where.type = type;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: [
        { isGlobal: 'desc' },  // Global categories first
        { name: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id,
        OR: [
          { isGlobal: true },           // Global categories
          { userId: req.user.id },      // User's personal categories
        ],
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, type, color, icon } = req.body;
    const isAdmin = req.user.role === 'admin';

    // Check for duplicate in user's categories or global categories
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        type,
        OR: [
          { isGlobal: true },
          { userId: req.user.id }
        ]
      }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: `A ${type} category with this name already exists`
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        color: color || null,
        icon: icon || null,
        userId: isAdmin ? null : req.user.id,  // Admin creates global, users create personal
        isGlobal: isAdmin ? true : false       // Only admins can create global categories
      }
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

// Update category - only owner or admin can update
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check permissions: admin can edit global, users can only edit their own
    const isAdmin = req.user.role === 'admin';
    const isOwner = existingCategory.userId === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own categories'
      });
    }

    const { name, type, color, icon } = req.body;

    if (name || type) {
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          name: name || existingCategory.name,
          type: type || existingCategory.type,
          OR: [
            { isGlobal: true },
            { userId: req.user.id }
          ],
          NOT: { id }
        }
      });

      if (duplicateCategory) {
        return res.status(400).json({
          success: false,
          message: 'A category with this name and type already exists'
        });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon })
      }
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

// Delete category - only owner or admin can delete
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isOwner = category.userId === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own categories'
      });
    }

    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id }
    });

    if (transactionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is used by ${transactionCount} transaction(s).`
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};