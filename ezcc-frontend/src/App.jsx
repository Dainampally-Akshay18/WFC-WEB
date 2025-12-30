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

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  // 1. Navbar: Not in landing ("/")
  const showNavbar = path !== '/';
  
  // 2. Sidebar: Only in protected areas (Not in /, /login, /signup)
  const showSidebar = !['/', '/login', '/signup'].includes(path);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {showNavbar && <Navbar />}
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main 
          className={`flex-1 w-full 
            ${showNavbar ? 'pt-16' : ''} 
            ${showSidebar ? 'lg:pl-64' : ''}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isApproved, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center dark:text-white">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isApproved) return <Navigate to="/approval" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/approval' element={<Approval />} />

          {/* Protected Routes */}
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;