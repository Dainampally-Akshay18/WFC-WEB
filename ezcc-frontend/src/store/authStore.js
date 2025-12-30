import { create } from 'zustand';
import { authService } from '../services/useAuthService';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  signup: async (signupData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.signup(signupData);
      set({ isLoading: false });
      toast.success('Registration successful! Please wait for admin approval.');
      return { success: true, data: result };
    } catch (error) {
      const message = error.response?.data?.detail || 'Signup failed';
      set({ isLoading: false, error: message });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login(credentials);
      const userData = await authService.getCurrentUser();
      
      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success(`Welcome back, ${userData.full_name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      set({ user: null, isAuthenticated: false, isLoading: false, error: message });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    toast.success('Logged out successfully');
  },

  initialize: async () => {
    if (authService.isAuthenticated()) {
      try {
        const user = await authService.getCurrentUser();
        set({ user, isAuthenticated: true });
      } catch (error) {
        authService.logout();
        set({ user: null, isAuthenticated: false });
      }
    }
  }
}));