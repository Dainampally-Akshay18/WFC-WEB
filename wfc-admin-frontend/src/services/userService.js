import api from '@services/api';

const userService = {
  // Fetch all users with filters
  getUsers: async (params = {}) => {
    const { page = 1, limit = 10, search = '', branch = '', status = '', sortBy = 'created_at', sortOrder = 'desc' } = params;
    
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(branch && { branch }),
      ...(status && { status }),
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    const response = await api.get(`/users?${queryParams}`);
    return response.data;
  },

  // Fetch pending approvals
  getPendingUsers: async (params = {}) => {
    const { page = 1, limit = 10 } = params;
    const response = await api.get(`/users/pending?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get single user details
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Approve user
  approveUser: async (userId) => {
    const response = await api.post(`/users/${userId}/approve`);
    return response.data;
  },

  // Reject user
  rejectUser: async (userId, reason = '') => {
    const response = await api.post(`/users/${userId}/reject`, { reason });
    return response.data;
  },

  // Revoke user access
  revokeUser: async (userId, reason = '') => {
    const response = await api.post(`/users/${userId}/revoke`, { reason });
    return response.data;
  },

  // Bulk approve users
  bulkApprove: async (userIds) => {
    const response = await api.post('/users/bulk-approve', { user_ids: userIds });
    return response.data;
  },

  // Bulk reject users
  bulkReject: async (userIds, reason = '') => {
    const response = await api.post('/users/bulk-reject', { user_ids: userIds, reason });
    return response.data;
  },

  // Get user activity history
  getUserActivity: async (userId) => {
    const response = await api.get(`/users/${userId}/activity`);
    return response.data;
  },
};

export default userService;
