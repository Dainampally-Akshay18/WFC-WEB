import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@services/userService';
import toast from 'react-hot-toast';

export const useUserActions = () => {
  const queryClient = useQueryClient();

  const approveUser = useMutation({
    mutationFn: (userId) => userService.approveUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['pendingUsers']);
      toast.success('User approved successfully!');
    },
    onError: (error) => {
      console.error('Approve error:', error);
      toast.error(error.response?.data?.message || 'Failed to approve user');
    },
  });

  const rejectUser = useMutation({
    mutationFn: (userId) => userService.rejectUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['pendingUsers']);
      toast.success('User rejected successfully!');
    },
    onError: (error) => {
      console.error('Reject error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject user');
    },
  });

  const revokeUser = useMutation({
    mutationFn: (userId) => userService.revokeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User access revoked successfully!');
    },
    onError: (error) => {
      console.error('Revoke error:', error);
      toast.error(error.response?.data?.message || 'Failed to revoke user access');
    },
  });

  const bulkApprove = useMutation({
    mutationFn: (userIds) => {
      console.log('bulkApprove mutation - userIds:', userIds); // Debug
      return userService.bulkApprove(userIds);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['pendingUsers']);
      toast.success(`${data.approved_count || 'Multiple'} user(s) approved successfully!`);
    },
    onError: (error) => {
      console.error('Bulk approve error:', error);
      toast.error(error.response?.data?.message || 'Failed to approve users');
    },
  });

  const bulkReject = useMutation({
    mutationFn: (userIds) => {
      console.log('bulkReject mutation - userIds:', userIds); // Debug
      return userService.bulkReject(userIds);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['pendingUsers']);
      toast.success(`${data.rejected_count || 'Multiple'} user(s) rejected successfully!`);
    },
    onError: (error) => {
      console.error('Bulk reject error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject users');
    },
  });

  return {
    approveUser,
    rejectUser,
    revokeUser,
    bulkApprove,
    bulkReject,
  };
};
