import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Approval from './pages/approval/Approval';
import Home from './pages/home/Home';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import { useAuth } from './hooks/useAuth';

/* -------------------- Layout Wrapper -------------------- */
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const showNavbar = path !== '/';
  const showSidebar = !['/', '/login', '/signup'].includes(path);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {showNavbar && <Navbar />}

      <div className="flex">
        {showSidebar && <Sidebar />}

        <main
          className={`flex-1 w-full ${showNavbar ? 'pt-16' : ''} ${showSidebar ? 'lg:pl-64' : ''}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

/* -------------------- Protected Route -------------------- */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isApproved, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isApproved) return <Navigate to="/approval" replace />;

  return children;
};

/* -------------------- App -------------------- */
function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/approval" element={<Approval />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
