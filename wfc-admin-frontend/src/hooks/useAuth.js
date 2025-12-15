import { useAuthStore } from '@store/authStore';

/**
 * Custom hook to access auth state and actions
 * @returns {Object} Auth state and methods
 */
export const useAuth = () => {
  const {
    admin,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    initialize,
    clearError,
  } = useAuthStore();

  return {
    admin,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    initialize,
    clearError,
  };
};
