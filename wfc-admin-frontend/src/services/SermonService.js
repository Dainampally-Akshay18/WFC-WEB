// src/services/SermonService.js
import api from './api';

/**
 * Sermon API service.
 *
 * FastAPI router is mounted under /api/v1/sermons.[file:4]
 * api.js baseURL handles /api/v1, so we only use `/sermons`.
 */
const SermonService = {
  // Get all sermons, optionally filtered by category_id
  getAll: (params = {}) => api.get('/sermons', { params }),

  // Get single sermon (with stats)
  getById: (sermonId) => api.get(`/sermons/${sermonId}`),

  // Create sermon (admin only)
  create: (payload) => api.post('/sermons', payload),

  // Update sermon (admin only)
  update: (sermonId, payload) => api.put(`/sermons/${sermonId}`, payload),

  // Delete sermon (admin only)
  remove: (sermonId) => api.delete(`/sermons/${sermonId}`),

  // Mark sermon as viewed (user)
  markViewed: (sermonId) => api.post(`/sermons/${sermonId}/view`),

  // Toggle like (user)
  toggleLike: (sermonId) => api.post(`/sermons/${sermonId}/like`),

  // Analytics (admin only)
  getAnalytics: (sermonId) => api.get(`/sermons/${sermonId}/analytics`),
};

export default SermonService;
