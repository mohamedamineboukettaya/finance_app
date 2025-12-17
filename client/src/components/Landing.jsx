import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, PieChart, Bell, FileText } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Take Control of Your Finances
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          SereniCash helps you track expenses, manage budgets, and achieve your financial goals with ease.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Get Started Free <ArrowRight />
          </Link>
          <Link 
            to="/about"
            className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg border border-gray-200 dark:border-gray-700"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Features Preview */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
          Everything You Need to Manage Your Money
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <DollarSign className="mx-auto mb-4 text-green-600" size={48} />
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Track Expenses</h3>
            <p className="text-gray-600 dark:text-gray-400">Monitor every dollar you spend</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <PieChart className="mx-auto mb-4 text-blue-600" size={48} />
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Visual Reports</h3>
            <p className="text-gray-600 dark:text-gray-400">Beautiful charts and insights</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <Bell className="mx-auto mb-4 text-yellow-600" size={48} />
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Budget Alerts</h3>
            <p className="text-gray-600 dark:text-gray-400">Stay on track with notifications</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <FileText className="mx-auto mb-4 text-purple-600" size={48} />
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">PDF Reports</h3>
            <p className="text-gray-600 dark:text-gray-400">Export anytime you need</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Financial Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users managing their money smarter</p>
          <Link 
            to="/register"
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg inline-flex items-center gap-2"
          >
            Create Free Account <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;