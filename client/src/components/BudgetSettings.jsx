import { useState, useEffect } from 'react';
import { budgetService } from '../utils/budgetService';
import { DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

const BudgetSettings = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [newBudget, setNewBudget] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    try {
      setLoading(true);
      const response = await budgetService.getSettings();
      setBudgetData(response.data);
      setNewBudget(response.data.monthlyBudget || '');
    } catch (err) {
      console.error('Failed to load budget:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async () => {
    if (!newBudget || parseFloat(newBudget) < 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await budgetService.updateBudget(parseFloat(newBudget));
      await loadBudget();
      setShowForm(false);
      alert('Budget updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update budget');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-400">Loading budget...</p>
      </div>
    );
  }

  const isExceeded = budgetData?.isExceeded;
  const percentage = parseFloat(budgetData?.percentage || 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <DollarSign size={24} />
          Monthly Budget
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {budgetData?.monthlyBudget > 0 ? 'Update Budget' : 'Set Budget'}
          </button>
        )}
      </div>

      {/* Budget Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">
            Set Your Monthly Budget Limit
          </h4>
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="number"
              step="0.01"
              min="0"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="Enter monthly budget"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveBudget}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-400 transition-colors"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Budget Status */}
      {budgetData?.monthlyBudget > 0 ? (
        <>
          {/* Alert if exceeded */}
          {isExceeded && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4 flex items-start gap-3">
              <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                  Budget Limit Exceeded!
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400">
                  You've exceeded your monthly budget by ${(budgetData.currentExpenses - budgetData.monthlyBudget).toFixed(2)}. 
                  An email alert has been sent to you.
                </p>
              </div>
            </div>
          )}

          {/* Budget Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Budget Limit</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${budgetData.monthlyBudget.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Expenses</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${budgetData.currentExpenses.toFixed(2)}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${budgetData.remaining >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
              <p className={`text-2xl font-bold ${budgetData.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ${Math.abs(budgetData.remaining).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Budget Usage
              </span>
              <span className={`text-sm font-bold ${percentage > 100 ? 'text-red-600' : percentage > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                {percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-300 ${
                  percentage > 100 ? 'bg-red-600' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
             You'll receive an email alert when you exceed your monthly budget limit.
          </p>
        </>
      ) : (
        <div className="text-center py-8">
          <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No budget set yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Set a monthly budget to track your spending and receive alerts
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetSettings;