import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const budgetValidation = [
  body('monthlyBudget')
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number')
];

// Get user's budget settings
export const getBudgetSettings = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        monthlyBudget: true,
        budgetAlertSent: true
      }
    });

    // Get current month's expenses
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const expenseResult = await prisma.transaction.aggregate({
      where: {
        userId: req.user.id,
        type: 'expense',
        date: {
          gte: startOfMonth
        }
      },
      _sum: {
        amount: true
      }
    });

    const currentExpenses = Number(expenseResult._sum.amount || 0);
    const budget = Number(user.monthlyBudget || 0);
    const remaining = budget - currentExpenses;
    const percentage = budget > 0 ? (currentExpenses / budget) * 100 : 0;

    res.json({
      success: true,
      data: {
        monthlyBudget: budget,
        currentExpenses,
        remaining,
        percentage: percentage.toFixed(1),
        isExceeded: currentExpenses > budget && budget > 0,
        lastAlertSent: user.budgetAlertSent
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user's monthly budget
export const updateBudgetSettings = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { monthlyBudget } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        monthlyBudget,
        budgetAlertSent: null // Reset alert when budget is updated
      },
      select: {
        monthlyBudget: true
      }
    });

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: {
        monthlyBudget: Number(user.monthlyBudget)
      }
    });
  } catch (error) {
    next(error);
  }
};