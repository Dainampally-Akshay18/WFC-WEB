import { create } from 'zustand';
import { authService } from '@services/authService';
import toast from 'react-hot-toast';

/**
 * Authentication store
 */
export const useAuthStore = create((set, get) => ({
  // State
  admin: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  /**
   * Signup action
   * @param {Object} signupData - Email, password, display_name
   */
  signup: async (signupData) => {
    set({ isLoading: true, error: null });
    
    try {
      const admin = await authService.signup(signupData);
      
      set({
        isLoading: false,
        error: null,
      });

      toast.success('Admin account created successfully! Please login.');
      return { success: true, admin };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Signup failed';
      
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Login action
   * @param {Object} credentials - Email and password
   */
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const { user } = await authService.login(credentials);
      
      set({
        admin: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  },

  /**
   * Logout action
   */
  logout: async () => {
    set({ isLoading: true });

    try {
      await authService.logout();
      
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear state even if API call fails
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Initialize auth state from storage
   */
  initialize: async () => {
    const isAuth = authService.isAuthenticated();
    const storedUser = authService.getStoredUser();

    if (isAuth && storedUser) {
      set({
        admin: storedUser,
        isAuthenticated: true,
      });

      // Optionally refresh user data
      try {
        const freshUserData = await authService.getCurrentUser();
        set({ admin: freshUserData });
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    } else {
      set({
        admin: null,
        isAuthenticated: false,
      });
    }
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),
}));
