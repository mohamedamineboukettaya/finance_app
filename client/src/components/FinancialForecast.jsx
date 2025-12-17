import { useState, useEffect } from 'react';
import { chatbotService } from '../utils/chatbotService';
import { TrendingUp, TrendingDown, Lightbulb, Target, Sparkles, RefreshCw } from 'lucide-react';

const FinancialForecast = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await chatbotService.getForecast();
      setForecast(response.data.forecast);
    } catch (err) {
      setError('Failed to generate forecast. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Next Month Forecast
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Analyzing your spending patterns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Next Month Forecast
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadForecast}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!forecast) return null;

  const confidenceColor = {
    high: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    low: 'text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-700 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Next Month Forecast
          </h3>
        </div>
        <button
          onClick={loadForecast}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          title="Refresh forecast"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Predicted Income</p>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${forecast.predictedIncome?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Predicted Expenses</p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${forecast.predictedExpenses?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-blue-600 dark:text-blue-400" size={20} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Expected Balance</p>
          </div>
          <p className={`text-2xl font-bold ${
            forecast.predictedBalance >= 0 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            ${forecast.predictedBalance?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Confidence Level */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Forecast Confidence</span>
          <span className={`text-sm font-semibold uppercase ${confidenceColor[forecast.confidence] || confidenceColor.medium}`}>
            {forecast.confidence}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              forecast.confidence === 'high'
                ? 'bg-green-500 w-full'
                : forecast.confidence === 'medium'
                ? 'bg-yellow-500 w-2/3'
                : 'bg-orange-500 w-1/3'
            }`}
          ></div>
        </div>
      </div>

      {/* Category Breakdown */}
      {forecast.categoryBreakdown && forecast.categoryBreakdown.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Top Predicted Expenses by Category
          </h4>
          <div className="space-y-2">
            {forecast.categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded p-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  ${cat.predictedAmount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {forecast.insights && forecast.insights.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="text-yellow-600 dark:text-yellow-400" size={20} />
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Key Insights
            </h4>
          </div>
          <ul className="space-y-2">
            {forecast.insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {forecast.recommendations && forecast.recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-blue-600 dark:text-blue-400" size={20} />
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Recommendations
            </h4>
          </div>
          <ul className="space-y-2">
            {forecast.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          AI-powered forecast based on your transaction history
        </p>
      </div>
    </div>
  );
};

export default FinancialForecast;