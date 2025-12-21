// src/hooks/sermon.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SermonService from '@services/SermonService';
import toast from 'react-hot-toast';

const SERMON_KEYS = {
  list: (filters) => ['sermons', filters || {}],
  detail: (id) => ['sermon', id],
  analytics: (id) => ['sermonAnalytics', id],
};

export const useSermons = (filters = {}) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: SERMON_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await SermonService.getAll(filters);
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => SermonService.create(payload),
    onSuccess: () => {
      toast.success('Sermon created');
      queryClient.invalidateQueries({
        queryKey: SERMON_KEYS.list(filters),
      });
    },
    onError: () => {
      toast.error('Failed to create sermon');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => SermonService.update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Sermon updated');
      queryClient.invalidateQueries({
        queryKey: SERMON_KEYS.list(filters),
      });
      queryClient.invalidateQueries({ queryKey: SERMON_KEYS.detail(id) });
    },
    onError: () => {
      toast.error('Failed to update sermon');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => SermonService.remove(id),
    onSuccess: () => {
      toast.success('Sermon deleted');
      queryClient.invalidateQueries({
        queryKey: SERMON_KEYS.list(filters),
      });
    },
    onError: () => {
      toast.error('Failed to delete sermon');
    },
  });

  const markViewedMutation = useMutation({
    mutationFn: (id) => SermonService.markViewed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SERMON_KEYS.list(filters),
      });
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: (id) => SermonService.toggleLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SERMON_KEYS.list(filters),
      });
    },
  });

  const analyticsQuery = (id, enabled = true) =>
    useQuery({
      queryKey: SERMON_KEYS.analytics(id),
      queryFn: async () => {
        const { data } = await SermonService.getAnalytics(id);
        return data;
      },
      enabled: !!id && enabled,
    });

  const sermonByIdQuery = (id, enabled = true) =>
    useQuery({
      queryKey: SERMON_KEYS.detail(id),
      queryFn: async () => {
        const { data } = await SermonService.getById(id);
        return data;
      },
      enabled: !!id && enabled,
    });

  return {
    sermons: listQuery.data,
    isLoadingSermons: listQuery.isLoading,
    sermonsError: listQuery.error,

    createSermon: createMutation.mutate,
    createSermonAsync: createMutation.mutateAsync,
    isCreatingSermon: createMutation.isPending,

    updateSermon: updateMutation.mutate,
    updateSermonAsync: updateMutation.mutateAsync,
    isUpdatingSermon: updateMutation.isPending,

    deleteSermon: deleteMutation.mutate,
    deleteSermonAsync: deleteMutation.mutateAsync,
    isDeletingSermon: deleteMutation.isPending,

    markSermonViewed: markViewedMutation.mutate,
    toggleSermonLike: toggleLikeMutation.mutate,

    useSermonById: sermonByIdQuery,
    useSermonAnalytics: analyticsQuery,
  };
};
