import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { transactionService } from '../utils/transactionService';
import { categoryService } from '../utils/categoryService';
import { User, Mail, Calendar, Shield, PieChart, BarChart3, Users } from 'lucide-react';
import CategoryManagement from './CategoryManagement';
import UserManagement from './UserManagement';
import FinancialForecast from './FinancialForecast';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalCategories: 0,
    accountAge: 0
  });
  const [analyticsData, setAnalyticsData] = useState({
    monthlyData: [],
    categoryData: []
  });
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
    loadAnalytics();
  }, [user]);

  const loadUserStats = async () => {
    try {
      const [transactions, categories] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll()
      ]);

      const accountAge = Math.floor(
        (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
      );

      setStats({
        totalTransactions: transactions.data.pagination.total,
        totalCategories: categories.data.categories.length,
        accountAge
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await transactionService.getAnalytics(6);
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  // Format month labels
  const formatMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  // Prepare data for charts
  const monthlyChartData = analyticsData.monthlyData.map(item => ({
    ...item,
    monthLabel: formatMonthLabel(item.month),
  }));

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-gray-100">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-gray-100">{payload[0].name}</p>
          <p className="text-sm" style={{ color: payload[0].payload.color }}>
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Profile
      </h1>

      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {user?.name || 'User'}
            </h2>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium mt-2">
                <Shield size={16} />
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <Mail size={20} />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <Calendar size={20} />
            <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <User size={20} />
            <span>Account ID: {user?.id}</span>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Your Statistics
        </h3>
        
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading statistics...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {stats.totalTransactions}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Categories Available</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {stats.totalCategories}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Account Age</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {stats.accountAge} days
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Charts */}
      <div className="space-y-6 mb-6">
        {/* Financial Forecast */}
        <FinancialForecast />

        {/* Monthly Income vs Expenses Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-blue-600 dark:text-blue-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Monthly Income vs Expenses
            </h3>
          </div>
          
          {analyticsLoading ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Loading analytics...</p>
          ) : monthlyChartData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data available yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis 
                  dataKey="monthLabel" 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Spending by Category Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="text-purple-600 dark:text-purple-400" size={24} />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Expenses by Category
            </h3>
          </div>
          
          {analyticsLoading ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Loading...</p>
          ) : analyticsData.categoryData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No expenses yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <RechartsPie>
                <Pie
                  data={analyticsData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </RechartsPie>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Admin Section */}
      {isAdmin && (
        <div className="space-y-6">
          {/* User Management */}
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg shadow-md p-6 border border-blue-300 dark:border-blue-700 transition-colors duration-200">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Admin: User Management
              </h3>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Manage all users, change roles, and delete accounts.
            </p>

            <UserManagement />
          </div>

          {/* Category Management */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg shadow-md p-6 border border-purple-300 dark:border-purple-700 transition-colors duration-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-purple-600 dark:text-purple-400" size={24} />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Admin: Category Management
              </h3>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Create and manage categories that all users can use for their transactions.
            </p>

            <CategoryManagement />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;