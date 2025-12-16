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
    
    // Map full_name to display_name for frontend consistency
    if (response.data?.users) {
      response.data.users = response.data.users.map(user => ({
        ...user,
        display_name: user.full_name || user.display_name || 'Unknown User'
      }));
    }
    
    return response.data;
  },

  // Fetch pending approvals
  getPendingUsers: async (params = {}) => {
    const { page = 1, limit = 10 } = params;
    const response = await api.get(`/users/pending?page=${page}&limit=${limit}`);
    
    // Map full_name to display_name
    if (response.data?.users) {
      response.data.users = response.data.users.map(user => ({
        ...user,
        display_name: user.full_name || user.display_name || 'Unknown User'
      }));
    }
    
    return response.data;
  },

  // Get single user details
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    
    // Map full_name to display_name
    return {
      ...response.data,
      display_name: response.data.full_name || response.data.display_name || 'Unknown User'
    };
  },

  // Approve user
  approveUser: async (userId) => {
    const response = await api.post(`/users/${userId}/approve`);
    return response.data;
  },

  // Reject user
  rejectUser: async (userId) => {
    const response = await api.post(`/users/${userId}/reject`);
    return response.data;
  },

  // Revoke user access
  revokeUser: async (userId) => {
    const response = await api.post(`/users/${userId}/revoke`);
    return response.data;
  },

  // Bulk approve users - FIXED: Send array directly
  bulkApprove: async (userIds) => {
    console.log('✅ Bulk Approve - Sending userIds:', userIds);
    const response = await api.post('/users/bulk-approve', { 
      user_ids: userIds  // ✅ Direct array, not nested object
    });
    return response.data;
  },

  // Bulk reject users - FIXED: Send array directly
  bulkReject: async (userIds) => {
    console.log('❌ Bulk Reject - Sending userIds:', userIds);
    const response = await api.post('/users/bulk-reject', { 
      user_ids: userIds  // ✅ Direct array, not nested object
    });
    return response.data;
  },

  // Get user activity history
  getUserActivity: async (userId) => {
    const response = await api.get(`/users/${userId}/activity`);
    return response.data;
  },
};

export default userService;
