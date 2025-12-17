import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon } from 'react-feather';
import { useTheme } from '../context/ThemeContext';

const MyNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-950 dark:bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand - Left */}
        <div className="text-xl font-bold">
          SereniCash
        </div>
        
        {/* Navigation Links - Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-6">
          <Link 
            to="/dashboard" 
            className="hover:text-blue-300 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/transactions" 
            className="hover:text-blue-300 transition-colors"
          >
            Transactions
          </Link>
          <Link 
            to="/profile" 
            className="hover:text-blue-300 transition-colors"
          >
            Profile
          </Link>
          <Link 
            to="/about" 
            className="hover:text-blue-300 transition-colors"
          >
            About
          </Link>
          
        </div>

        {/* User Actions - Right */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 shadow-md shadow-purple-400 cursor-pointer
                 text-gray-600 hover:text-purple-400
                 transition-all ease-in-out dark:bg-white dark:shadow-amber-400 dark:hover:text-amber-400"
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </button>

          <span className="text-sm hidden md:inline">
            {user?.name || user?.email} 
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-900 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;