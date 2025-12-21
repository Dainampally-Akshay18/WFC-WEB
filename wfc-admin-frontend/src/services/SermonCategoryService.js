// src/services/SermonCategoryService.js
import api from '@services/api';

/**
 * Sermon Category API service.
 *
 * Backend routes:
 * - GET    /api/v1/sermon-categories              (get_current_user)[file:13][file:14][file:15]
 * - GET    /api/v1/sermon-categories/{id}        (get_current_user)
 * - POST   /api/v1/sermon-categories             (get_current_admin)
 * - PUT    /api/v1/sermon-categories/{id}        (get_current_admin)
 * - DELETE /api/v1/sermon-categories/{id}        (get_current_admin)
 *
 * api.js baseURL = /api/v1, so we use `/sermon-categories` here.[file:6]
 */

const BASE_PATH = '/sermon-categories';

const SermonCategoryService = {
  // List all categories (user or admin)
  getAll: async () => {
    const response = await api.get(BASE_PATH);
    return response;
  },

  // Get single category
  getById: async (categoryId) => {
    const response = await api.get(`${BASE_PATH}/${categoryId}`);
    return response;
  },

  // Create category (admin only – enforced by backend)
  create: async (payload) => {
    const response = await api.post(BASE_PATH, payload);
    return response;
  },

  // Update category (admin only)
  update: async (categoryId, payload) => {
    const response = await api.put(`${BASE_PATH}/${categoryId}`, payload);
    return response;
  },

  // Delete category (admin only)
  remove: async (categoryId) => {
    const response = await api.delete(`${BASE_PATH}/${categoryId}`);
    return response;
  },
};

export default SermonCategoryService;
