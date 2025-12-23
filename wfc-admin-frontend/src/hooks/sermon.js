// src/hooks/sermon.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SermonService from '@services/SermonService';
import toast from 'react-hot-toast';

const SERMON_KEYS = {
  all: ['sermons'],
  list: (params) => ['sermons', params],
  detail: (id) => ['sermon', id],
};

export const useSermons = (params = {}) => {
  const queryClient = useQueryClient();

  // List sermons (optionally by category_id)
  const listQuery = useQuery({
    queryKey: SERMON_KEYS.list(params),
    queryFn: async () => {
      const { data } = await SermonService.getAll(params);
      return data;
    },
  });

  // Create sermon via file upload (FormData)
  const createMutation = useMutation({
    mutationFn: (formData) => SermonService.create(formData),
    onSuccess: () => {
      toast.success('Sermon created successfully');
      queryClient.invalidateQueries({ queryKey: SERMON_KEYS.all });
    },
    onError: () => {
      toast.error('Failed to create sermon');
    },
  });

  // Update sermon metadata
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => SermonService.update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Sermon updated successfully');
      queryClient.invalidateQueries({ queryKey: SERMON_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SERMON_KEYS.detail(id) });
    },
    onError: () => {
      toast.error('Failed to update sermon');
    },
  });

  // Delete sermon
  const deleteMutation = useMutation({
    mutationFn: (id) => SermonService.remove(id),
    onSuccess: () => {
      toast.success('Sermon deleted successfully');
      queryClient.invalidateQueries({ queryKey: SERMON_KEYS.all });
    },
    onError: () => {
      toast.error('Failed to delete sermon');
    },
  });

  // Fetch single sermon by ID
  const useSermonById = (id, enabled = true) =>
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

    useSermonById,
  };
};
