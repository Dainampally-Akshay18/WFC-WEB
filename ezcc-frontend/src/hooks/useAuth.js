//useAuth.js

import { useAuthStore } from '../store/authStore';
import { USER_STATUS } from '../config/constants';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, signup, logout, error } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    // Status helpers based on backend UserStatus
    isPending: user?.status === USER_STATUS.PENDING,
    isApproved: user?.status === USER_STATUS.APPROVED,
    isRevoked: user?.status === USER_STATUS.REVOKED,
  };
};