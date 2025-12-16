import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';

// Pages
import Login from '@pages/auth/Login';
import Signup from '@pages/auth/Signup';
import Dashboard from '@pages/dashboard/Dashboard';
import UserManagement from '@pages/users/UserManagement';
import PendingApprovals from '@pages/users/PendingApprovals';

// Components
import ProtectedRoute from '@components/common/ProtectedRoute';
import NotFound from './pages/Not-Found/NotFound';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { initialize, isAuthenticated } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Apply theme to root element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} 
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
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/pending"
            element={
              <ProtectedRoute>
                <PendingApprovals />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          
          {/* 404 */}
          <Route
            path="*"
            element={<NotFound/>
            }
          />
        </Routes>

        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: theme === 'dark' ? '#1f2937' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
            },
            success: {
              iconTheme: {
                primary: theme === 'dark' ? '#10b981' : '#059669',
                secondary: theme === 'dark' ? '#1f2937' : '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: theme === 'dark' ? '#ef4444' : '#dc2626',
                secondary: theme === 'dark' ? '#1f2937' : '#ffffff',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
