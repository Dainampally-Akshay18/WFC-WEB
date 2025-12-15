import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '@hooks/useAuth';

/**
 * Protected route wrapper - redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
