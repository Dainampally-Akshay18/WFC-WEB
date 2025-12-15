import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@services/userService';
import toast from 'react-hot-toast';

export const useUserActions = () => {
  const queryClient = useQueryClient();

  const approveUser = useMutation({
    mutationFn: userService.approveUser,
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['pendingUsers']);
      toast.success('User approved successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve user');
    },
  });

  const rejectUser = useMutation({
    mutationFn: ({ userId, reason }) => userService.rejectUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['pendingUsers']);
      toast.success('User rejected successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject user');
    },
  });

  const revokeUser = useMutation({
    mutationFn: ({ userId, reason }) => userService.revokeUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User access revoked successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to revoke user access');
    },
  });

  const bulkApprove = useMutation({
    mutationFn: userService.bulkApprove,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['pendingUsers']);
      toast.success(`${data.approved_count} users approved successfully!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve users');
    },
  });

  const bulkReject = useMutation({
    mutationFn: ({ userIds, reason }) => userService.bulkReject(userIds, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['pendingUsers']);
      toast.success(`${data.rejected_count} users rejected successfully!`);
    },
    onError: (error) => {
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
