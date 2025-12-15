import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@services/userService';
import toast from 'react-hot-toast';

export const useUsers = (params) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
    keepPreviousData: true,
    staleTime: 30000, // 30 seconds
  });
};

export const usePendingUsers = (params) => {
  return useQuery({
    queryKey: ['pendingUsers', params],
    queryFn: () => userService.getPendingUsers(params),
    keepPreviousData: true,
  });
};

export const useUserById = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  });
};

export const useUserActivity = (userId) => {
  return useQuery({
    queryKey: ['userActivity', userId],
    queryFn: () => userService.getUserActivity(userId),
    enabled: !!userId,
  });
};
