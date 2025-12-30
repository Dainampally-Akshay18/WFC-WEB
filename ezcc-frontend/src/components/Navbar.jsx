import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Sun, Moon, Shield, LogOut } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="h-full px-6 flex items-center justify-between">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            EZCC
          </h1>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-md
              bg-gray-200 dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              transition-colors"
          >
            {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600 font-medium
              hover:bg-red-50 dark:hover:bg-red-900/20
              px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
