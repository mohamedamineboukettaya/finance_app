import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { transactionService } from '../utils/transactionService';
import { exportService } from '../utils/exportService'; 
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Calendar } from 'lucide-react'; 

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadData();
  }, [dateFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Build filter object
      const filters = {};
      if (dateFilter.startDate) filters.startDate = dateFilter.startDate;
      if (dateFilter.endDate) filters.endDate = dateFilter.endDate;
      
      // Load summary with filters
      const summaryResponse = await transactionService.getSummary(filters);
      setSummary(summaryResponse.data);

      // Load recent transactions (last 5) with filters
      const transactionsResponse = await transactionService.getAll({ 
        limit: 5,
        ...filters
      });
      setRecentTransactions(transactionsResponse.data.transactions);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    const result = await exportService.exportPDF(dateFilter);
    if (result.success) {
      alert('PDF exported successfully!');
    } else {
      alert('Failed to export PDF: ' + result.error);
    }
    setExporting(false);
  };

  const handleClearFilters = () => {
    setDateFilter({
      startDate: '',
      endDate: ''
    });
  };

  const hasActiveFilters = dateFilter.startDate || dateFilter.endDate;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Export and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Date Filter Toggle Button */}
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Calendar size={18} />
            {showDateFilter ? 'Hide Filters' : 'Filter by Date'}
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={18} />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Date Filter Panel */}
      {showDateFilter && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Filter Transactions by Date
          </h3>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
          {hasActiveFilters && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Showing transactions from{' '}
              <strong>{dateFilter.startDate || 'beginning'}</strong> to{' '}
              <strong>{dateFilter.endDate || 'now'}</strong>
            </p>
          )}
        </div>
      )}
      
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Welcome back, {user?.name || user?.email}!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {hasActiveFilters 
            ? "Here's your filtered financial overview." 
            : "Here's your financial overview."}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Total Income</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            ${summary.totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
            ${summary.totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Balance</h3>
          <p className={`text-3xl font-bold mt-2 ${
            summary.balance >= 0 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            ${summary.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {hasActiveFilters ? 'Filtered Transactions (Latest 5)' : 'Recent Transactions'}
          </h3>
          <Link 
            to="/transactions"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading...</p>
        ) : recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {hasActiveFilters 
                ? 'No transactions found for this date range' 
                : 'No transactions yet'}
            </p>
            <Link 
              to="/transactions"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Add Your First Transaction
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map(transaction => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                    </span>
                    {transaction.category && (
                      <span className="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
                        {transaction.category.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {transaction.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;