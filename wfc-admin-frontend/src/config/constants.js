export const APP_NAME = import.meta.env.VITE_APP_NAME || 'WFC Admin Portal';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'wfc_admin_access_token',
  REFRESH_TOKEN: 'wfc_admin_refresh_token',
  USER_DATA: 'wfc_admin_user',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  ADMIN_LOGIN: '/admin/login',
  ADMIN_LOGOUT: '/admin/logout',
  ADMIN_ME: '/admin/me',
  
  // Users
  USERS: '/users',
  USERS_PENDING: '/users/pending',
  USER_APPROVE: (id) => `/users/${id}/approve`,
  USER_REJECT: (id) => `/users/${id}/reject`,
  USER_REVOKE: (id) => `/users/${id}/revoke`,
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_ACTIVITY: '/dashboard/recent-activity',
  
  // Sermons
  SERMONS: '/sermons',
  SERMON_CATEGORIES: '/sermon-categories',
  
  // Blogs
  BLOGS: '/blogs',
  
  // Events
  EVENTS: '/events',
  
  // Prayers
  PRAYERS: '/prayers',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// User Status
export const USER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REVOKED: 'revoked',
};

// Blog Status
export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

// Event Cross Branch Status
export const EVENT_CROSS_BRANCH_STATUS = {
  NONE: 'none',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};
