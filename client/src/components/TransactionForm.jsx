import { useState, useEffect } from 'react';
import { transactionService } from '../utils/transactionService';
import { categoryService } from '../utils/categoryService';
import QuickAddCategory from './QuickAddCategory';  // ← ADD THIS IMPORT

const TransactionForm = ({ onSuccess, editTransaction = null, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    description: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);  // ← ADD THIS

  useEffect(() => {
    loadCategories();
  }, [formData.type]);

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        amount: editTransaction.amount,
        type: editTransaction.type,
        description: editTransaction.description || '',
        date: new Date(editTransaction.date).toISOString().split('T')[0],
        categoryId: editTransaction.categoryId || ''
      });
    }
  }, [editTransaction]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll(formData.type);
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // ← ADD THIS: Open quick add modal when "+ New Category" is selected
    if (name === 'categoryId' && value === '__new__') {
      setShowQuickAdd(true);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleQuickAddSuccess = () => {
    loadCategories();  // Reload categories
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.description || undefined,
        date: formData.date,
        categoryId: formData.categoryId || undefined
      };

      if (editTransaction) {
        await transactionService.update(editTransaction.id, data);
      } else {
        await transactionService.create(data);
      }

      setFormData({
        amount: '',
        type: 'expense',
        description: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: ''
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Full error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {editTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </h3>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-green-600 dark:text-green-400 font-medium">Income</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-red-600 dark:text-red-400 font-medium">Expense</span>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          {/* Category - UPDATED */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} {cat.isGlobal ? '' : '(Personal)'}
                </option>
              ))}
              <option value="__new__" className="font-semibold text-blue-600">
                + New Category
              </option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength="255"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Grocery shopping"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md
                       disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : (editTransaction ? 'Update' : 'Add Transaction')}
            </button>
            {editTransaction && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md
                         transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Quick Add Category Modal */}
      {showQuickAdd && (
        <QuickAddCategory
          type={formData.type}
          onSuccess={handleQuickAddSuccess}
          onClose={() => setShowQuickAdd(false)}
        />
      )}
    </>
  );
};

export default TransactionForm;