import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Approval from './pages/approval/Approval';
import Home from './pages/home/home';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isApproved, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  // If not logged in at all, go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but status is not approved, go to approval
  if (!isApproved) {
    return <Navigate to="/approval" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/approval' element={<Approval />} />

        <Route 
          path='/home' 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;