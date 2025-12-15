import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';

// Pages
import Login from '@pages/auth/Login';
import Signup from '@pages/auth/Signup';
import Dashboard from '@pages/dashboard/Dashboard';

// Components
import ProtectedRoute from '@components/common/ProtectedRoute';

function App() {
  const { initialize, isAuthenticated } = useAuth();
  const { theme } = useTheme();

  // Initialize auth state on app load
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Apply theme to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />

          {/* Signup Route */}
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
            } 
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard or login */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />

          {/* 404 - Not Found */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>

        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
