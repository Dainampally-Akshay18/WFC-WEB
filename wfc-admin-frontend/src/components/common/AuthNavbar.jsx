import { Link } from 'react-router-dom';
import { Shield, Moon, Sun } from 'lucide-react';
import { useTheme } from '@hooks/useTheme';
import { APP_NAME } from '@config/constants';

const AuthNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      isDarkMode 
        ? 'bg-gray-900/80 border-gray-800' 
        : 'bg-white/80 border-gray-200'
    } backdrop-blur-xl border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isDarkMode
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 group-hover:shadow-lg group-hover:shadow-blue-500/50'
                : 'bg-gradient-to-br from-blue-600 to-indigo-600 group-hover:shadow-lg group-hover:shadow-blue-500/30'
            }`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {APP_NAME}
              </h1>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Church Management
              </p>
            </div>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all ${
              isDarkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
