import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for injecting JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  /**
   * Register new user
   * @param {Object} userData - { email, password, full_name, branch_id }
   */
  async signup(userData) {
    const response = await api.post(API_ENDPOINTS.SIGNUP, userData);
    return response.data;
  },

  /**
   * Member Login
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    if (response.data.access_token) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh_token);
    }
    return response.data;
  },

  /**
   * Fetch current authenticated user info
   */
  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.ME);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
    return response.data;
  },

  /**
   * Logout user and clear storage
   */
  async logout() {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  /**
   * Helper methods
   */
  getStoredUser: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA)),
  isAuthenticated: () => !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  
  // Fetches branches for the signup form
  async getBranches() {
    const response = await api.get(API_ENDPOINTS.BRANCHES);
    return response.data;
  }
};