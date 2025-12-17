import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'react-feather';

const PublicNavbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-blue-950 dark:bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand - Left */}
        <Link to="/" className="text-xl font-bold hover:text-blue-300 transition-colors">
          SereniCash
        </Link>
        
        {/* Navigation Links - Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-6">
          <Link 
            to="/about" 
            className="hover:text-blue-300 transition-colors"
          >
            About
          </Link>
        </div>

        {/* Actions - Right */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 shadow-md shadow-purple-400 cursor-pointer
                 text-gray-600 hover:text-purple-400
                 transition-all ease-in-out dark:bg-white dark:shadow-amber-400 dark:hover:text-amber-400"
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </button>

          <Link 
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/register"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;