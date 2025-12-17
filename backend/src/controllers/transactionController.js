import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import { sendBudgetExceededEmail } from '../utils/emailService.js';

const prisma = new PrismaClient();

// Validation rules
export const transactionValidation = [
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be either income or expense"),
  body("description")
    .optional({ values: "undefined" })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Description must be less than 255 characters"),
  body("date")
    .optional({ values: "undefined" })
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("categoryId")
    .optional({ values: "undefined" })
    .isUUID()
    .withMessage("Category ID must be a valid UUID"),
];

// Get all transactions for the authenticated user
export const getTransactions = async (req, res, next) => {
  try {
    const {
      type,
      categoryId,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
    } = req.query;

    // Build filter object
    const where = {
      userId: req.user.id,
    };

    if (type) {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    // Get total count for pagination
    const total = await prisma.transaction.count({ where });

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single transaction by ID
export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.user.id, // ensure user owns this transaction
      },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new transaction
export const createTransaction = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { amount, type, description, date, categoryId } = req.body;

    // If categoryId provided, verify it exists and is global
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          OR: [
            { isGlobal: true }, // Global categories
            { userId: req.user.id }, // User's personal categories
          ]
        }
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      // Verify category type matches transaction type
      if (category.type !== type) {
        return res.status(400).json({
          success: false,
          message: `Category type (${category.type}) must match transaction type (${type})`,
        });
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        description: description || null,
        date: date ? new Date(date) : new Date(),
        userId: req.user.id,
        categoryId: categoryId || null,
      },
      include: {
        category: true,
      },
    });

    // Check budget if it's an expense
    let budgetAlert = null;
    if (type === 'expense') {
      budgetAlert = await checkAndAlertBudget(req.user.id);
    }

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: { 
        transaction,
        ...(budgetAlert && { alert: budgetAlert })
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update a transaction
export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        category: true,
      },
    });

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const { amount, type, description, date, categoryId } = req.body;

    // Determine the final type (new type or existing)
    const finalType = type || existingTransaction.type;
    const finalCategoryId = categoryId !== undefined ? categoryId : existingTransaction.categoryId;

    // If categoryId is being set or exists, verify it matches the type
    if (finalCategoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: finalCategoryId,
          OR: [
            { isGlobal: true },
            { userId: req.user.id },
          ]
        }
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      if (category.type !== finalType) {
        return res.status(400).json({
          success: false,
          message: `Category type (${category.type}) must match transaction type (${finalType})`,
        });
      }
    }

    // Build update data object properly
    const updateData = {};
    if (amount !== undefined) updateData.amount = amount;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    // Check budget if transaction is now an expense or amount changed
    let budgetAlert = null;
    if (finalType === 'expense') {
      budgetAlert = await checkAndAlertBudget(req.user.id);
    }

    res.json({
      success: true,
      message: "Transaction updated successfully",
      data: { 
        transaction,
        ...(budgetAlert && { alert: budgetAlert })
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if transaction exists and belongs to user
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get transaction summary (totals)
export const getTransactionSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      userId: req.user.id,
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Get total income
    const incomeResult = await prisma.transaction.aggregate({
      where: {
        ...where,
        type: "income",
      },
      _sum: {
        amount: true,
      },
    });

    // Get total expenses
    const expenseResult = await prisma.transaction.aggregate({
      where: {
        ...where,
        type: "expense",
      },
      _sum: {
        amount: true,
      },
    });

    const totalIncome = incomeResult._sum.amount || 0;
    const totalExpenses = expenseResult._sum.amount || 0;
    const balance = totalIncome - totalExpenses;

    res.json({
      success: true,
      data: {
        totalIncome: Number(totalIncome),
        totalExpenses: Number(totalExpenses),
        balance: Number(balance),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get monthly analytics data
export const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const { months = 6 } = req.query;
    const userId = req.user.id;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    // Get all transactions in the date range
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: {
          select: {
            name: true,
            color: true,
            icon: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group by month
    const monthlyData = {};
    transactions.forEach((transaction) => {
      const monthKey = new Date(transaction.date).toISOString().slice(0, 7); // YYYY-MM
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          income: 0,
          expenses: 0,
        };
      }

      const amount = Number(transaction.amount);
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += amount;
      } else {
        monthlyData[monthKey].expenses += amount;
      }
    });

    // Convert to array and sort
    const monthlyArray = Object.values(monthlyData).sort((a, b) => 
      a.month.localeCompare(b.month)
    );

    // Group by category for pie chart
    const categoryData = {};
    transactions.forEach((transaction) => {
      if (transaction.type === 'expense') {
        const categoryName = transaction.category?.name || 'Uncategorized';
        const categoryColor = transaction.category?.color || '#6B7280';
        
        if (!categoryData[categoryName]) {
          categoryData[categoryName] = {
            name: categoryName,
            value: 0,
            color: categoryColor,
          };
        }
        
        categoryData[categoryName].value += Number(transaction.amount);
      }
    });

    const categoryArray = Object.values(categoryData).sort((a, b) => b.value - a.value);

    res.json({
      success: true,
      data: {
        monthlyData: monthlyArray,
        categoryData: categoryArray,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to check budget and send alerts
async function checkAndAlertBudget(userId) {
  try {
    // Get user with budget settings
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user.monthlyBudget || user.monthlyBudget <= 0) {
      return null; // No budget set, skip check
    }

    // Get start of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Check if alert was already sent this month
    const lastAlert = user.budgetAlertSent;
    if (lastAlert && lastAlert >= startOfMonth) {
      return null; // Alert already sent this month
    }

    // Calculate current month's expenses
    const expenseResult = await prisma.transaction.aggregate({
      where: {
        userId: userId,
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
    const budget = Number(user.monthlyBudget);

    // Check if budget exceeded
    if (currentExpenses > budget) {
      // Send email alert
      await sendBudgetExceededEmail(user, budget, currentExpenses);
      
      // Update last alert sent date
      await prisma.user.update({
        where: { id: userId },
        data: {
          budgetAlertSent: new Date()
        }
      });

      console.log(`Budget alert sent to ${user.email}`);

      // Return alert data for frontend
      return {
        type: 'budget_exceeded',
        message: 'Monthly budget limit exceeded!',
        monthlyBudget: budget,
        currentExpenses: currentExpenses,
        overspent: currentExpenses - budget
      };
    }

    return null;
  } catch (error) {
    console.error('Error checking budget:', error);
    // Don't throw error, just log it - budget check shouldn't break transaction creation
    return null;
  }
}