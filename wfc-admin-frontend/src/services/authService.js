import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '@config/constants';
import { storage } from '@utils/storage';

/**
 * Authentication service
 */
export const authService = {
  /**
   * Admin login
   * @param {Object} credentials - Email and password
   * @returns {Promise<Object>} Auth tokens and user data
   */
  async login(credentials) {
    try {
      const response = await api.post(API_ENDPOINTS.ADMIN_LOGIN, credentials);
      const { access_token, refresh_token } = response.data;

      // Store tokens
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);

      // Fetch and store user data
      const userData = await this.getCurrentUser();
      storage.set(STORAGE_KEYS.USER_DATA, userData);

      return { tokens: response.data, user: userData };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Admin logout
   */
  async logout() {
    try {
      await api.post(API_ENDPOINTS.ADMIN_LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage regardless of API call result
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_DATA);
    }
  },

  /**
   * Get current logged-in admin user
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser() {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN_ME);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  },

  /**
   * Get stored user data
   * @returns {Object|null}
   */
  getStoredUser() {
    return storage.get(STORAGE_KEYS.USER_DATA);
  },

  /**
   * Get stored access token
   * @returns {string|null}
   */
  getAccessToken() {
    return storage.get(STORAGE_KEYS.ACCESS_TOKEN);
  },
};
