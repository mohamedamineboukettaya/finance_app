import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const About = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About SereniCash
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Your intelligent financial companion for smarter money management
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 rounded-full p-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Our Mission
          </h2>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          At SereniCash, we believe that managing your finances shouldn't be complicated, stressful, or time-consuming. 
          Our mission is to empower individuals to take control of their financial future through intuitive, powerful, 
          and intelligent tools that make budgeting effortless.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          We're committed to helping you build better financial habits, achieve your savings goals, and gain peace of 
          mind knowing exactly where your money goes.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Why Choose SereniCash?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Smart Transaction Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Effortlessly record and categorize all your income and expenses. Our intelligent system learns your 
              spending patterns to provide personalized insights.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Real-Time Financial Overview
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get instant visibility into your financial health with beautiful dashboards, charts, and summaries 
              that update in real-time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Budget Management
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Set monthly budget limits and receive instant alerts when you're approaching or exceeding your spending goals.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <span className="text-3xl">📧</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Email Notifications
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Stay informed with automatic email alerts when you exceed budget limits or reach important financial milestones.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              PDF Reports
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Export beautiful, professional financial reports with just one click. Perfect for tax season or personal record-keeping.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Secure & Private
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your financial data is encrypted and protected with industry-standard security. Your privacy is our top priority.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-200">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Create Account</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sign up for free in seconds</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Set Your Budget</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Define your monthly spending limits</p>
          </div>
          <div className="text-center">
            <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Track Expenses</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Log income and expenses easily</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              4
            </div>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Achieve Goals</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Watch your savings grow</p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
        <h2 className="text-3xl font-bold text-center mb-8">
          SereniCash by the Numbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-5xl font-bold mb-2">10K+</p>
            <p className="text-lg opacity-90">Active Users</p>
          </div>
          <div>
            <p className="text-5xl font-bold mb-2">$50M+</p>
            <p className="text-lg opacity-90">Money Managed</p>
          </div>
          <div>
            <p className="text-5xl font-bold mb-2">95%</p>
            <p className="text-lg opacity-90">User Satisfaction</p>
          </div>
        </div>
      </div>

      {/* CTA Section - Only show if NOT logged in */}
      {!isAuthenticated && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-colors duration-200">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial lives with SereniCash. 
            Start your journey to financial freedom today - completely free!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login"
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Have questions or feedback? We'd love to hear from you!
        </p>
        <a 
          href="mailto:SereniCash@gmail.com" 
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          SereniCash@gmail.com
        </a>
      </div>
    </div>
  );
};

export default About;