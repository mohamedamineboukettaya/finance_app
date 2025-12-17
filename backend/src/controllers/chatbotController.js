import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();

export const chatWithBot = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    console.log('=== Chatbot Request ===');
    console.log('User ID:', userId);
    console.log('Message:', message);
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Chatbot API key is not configured',
      });
    }

    console.log('Fetching user financial data...');

    // Get user's financial data
    const [transactions, incomeResult, expenseResult] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { date: 'desc' },
        take: 20,
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'income' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'expense' },
        _sum: { amount: true },
      }),
    ]);

    console.log('Transactions fetched:', transactions.length);

    const totalIncome = Number(incomeResult._sum.amount || 0);
    const totalExpenses = Number(expenseResult._sum.amount || 0);
    const balance = totalIncome - totalExpenses;

    // Group expenses by category
    const categoryExpenses = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const categoryName = t.category?.name || 'Uncategorized';
        categoryExpenses[categoryName] = (categoryExpenses[categoryName] || 0) + Number(t.amount);
      });

    // Create context for the AI
    const context = `You are a helpful financial assistant for a budget tracking app. 

User's Financial Summary:
- Total Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpenses.toFixed(2)}
- Current Balance: $${balance.toFixed(2)}
- Total Transactions: ${transactions.length}

${Object.keys(categoryExpenses).length > 0 ? `Expenses by Category:
${Object.entries(categoryExpenses)
  .map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)}`)
  .join('\n')}` : 'No expense data yet.'}

${transactions.length > 0 ? `Recent Transactions:
${transactions
  .slice(0, 5)
  .map(t => `- ${t.type === 'income' ? '+' : '-'}$${Number(t.amount).toFixed(2)} (${t.category?.name || 'N/A'}) - ${t.description || 'No description'}`)
  .join('\n')}` : 'No transactions yet.'}

Based on this data, help the user with their question. Be concise, friendly, and provide actionable advice.`;

    console.log('Calling Gemini API...');

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use gemini-2.5-flash which is available in your API key
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('Using gemini-2.5-flash model');

    // Create prompt
    const prompt = `${context}\n\nUser question: ${message}\n\nYour response:`;

    console.log('Sending prompt to Gemini...');

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botReply = response.text();

    console.log('Got response from Gemini');
    console.log('Response length:', botReply.length);

    res.json({
      success: true,
      data: {
        reply: botReply,
        userMessage: message,
      },
    });
  } catch (error) {
    console.error('=== Chatbot Error ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.response) {
      console.error('API Response error:', error.response);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to get response from chatbot',
      error: error.message,
      errorType: error.name,
    });
  }
};

// Generate financial forecast for next month
export const generateForecast = async (req, res, next) => {
  try {
    const userId = req.user.id;

    console.log('=== Generating Forecast ===');
    console.log('User ID:', userId);

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Forecast service is not configured',
      });
    }

    // Get last 3 months of transactions
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: threeMonthsAgo,
        },
      },
      include: { category: true },
      orderBy: { date: 'desc' },
    });

    console.log('Transactions for forecast:', transactions.length);

    if (transactions.length === 0) {
      return res.json({
        success: true,
        data: {
          forecast: {
            predictedIncome: 0,
            predictedExpenses: 0,
            predictedBalance: 0,
            confidence: 'low',
            insights: ['Not enough data to generate a forecast. Add more transactions to get predictions.'],
          },
        },
      });
    }

    // Group by month
    const monthlyData = {};
    transactions.forEach(t => {
      const monthKey = new Date(t.date).toISOString().slice(0, 7);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0, byCategory: {} };
      }
      
      const amount = Number(t.amount);
      if (t.type === 'income') {
        monthlyData[monthKey].income += amount;
      } else {
        monthlyData[monthKey].expenses += amount;
        const cat = t.category?.name || 'Uncategorized';
        monthlyData[monthKey].byCategory[cat] = (monthlyData[monthKey].byCategory[cat] || 0) + amount;
      }
    });

    // Calculate averages
    const months = Object.keys(monthlyData);
    const avgIncome = months.reduce((sum, m) => sum + monthlyData[m].income, 0) / months.length;
    const avgExpenses = months.reduce((sum, m) => sum + monthlyData[m].expenses, 0) / months.length;

    // Get category averages
    const categoryAverages = {};
    months.forEach(m => {
      Object.entries(monthlyData[m].byCategory).forEach(([cat, amt]) => {
        categoryAverages[cat] = (categoryAverages[cat] || 0) + amt;
      });
    });
    Object.keys(categoryAverages).forEach(cat => {
      categoryAverages[cat] = categoryAverages[cat] / months.length;
    });

    // Create context for AI
    const context = `You are a financial forecasting AI. Based on the user's transaction history, provide a forecast for next month.

Historical Data (last ${months.length} months):
${months.map(m => {
  const data = monthlyData[m];
  return `Month ${m}: Income: $${data.income.toFixed(2)}, Expenses: $${data.expenses.toFixed(2)}, Net: $${(data.income - data.expenses).toFixed(2)}`;
}).join('\n')}

Average Monthly Income: $${avgIncome.toFixed(2)}
Average Monthly Expenses: $${avgExpenses.toFixed(2)}

Average Expenses by Category:
${Object.entries(categoryAverages).map(([cat, amt]) => `- ${cat}: $${amt.toFixed(2)}`).join('\n')}

Based on this data, provide:
1. Predicted income for next month
2. Predicted expenses for next month
3. Key insights and trends you notice
4. Spending recommendations

Respond in JSON format:
{
  "predictedIncome": number,
  "predictedExpenses": number,
  "confidence": "high" | "medium" | "low",
  "insights": ["insight1", "insight2", ...],
  "recommendations": ["rec1", "rec2", ...]
}`;

    // Call Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(context);
    const response = await result.response;
    let aiResponse = response.text();

    console.log('AI Response received');

    // Clean up response (remove markdown code blocks if present)
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let forecast;
    try {
      forecast = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback to simple average
      forecast = {
        predictedIncome: Math.round(avgIncome * 100) / 100,
        predictedExpenses: Math.round(avgExpenses * 100) / 100,
        confidence: 'medium',
        insights: [
          `Based on ${months.length} months of data, your average monthly income is $${avgIncome.toFixed(2)}`,
          `Your average monthly expenses are $${avgExpenses.toFixed(2)}`,
        ],
        recommendations: [
          'Continue tracking your transactions for more accurate forecasts',
        ],
      };
    }

    // Add calculated balance
    forecast.predictedBalance = forecast.predictedIncome - forecast.predictedExpenses;

    // Add category breakdown predictions
    forecast.categoryBreakdown = Object.entries(categoryAverages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, amount]) => ({
        name,
        predictedAmount: Math.round(amount * 100) / 100,
      }));

    res.json({
      success: true,
      data: { forecast },
    });
  } catch (error) {
    console.error('=== Forecast Error ===');
    console.error('Error:', error.message);
    next(error);
  }
};