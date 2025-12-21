// src/hooks/sermoncategory.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SermonCategoryService from '@services/SermonCategoryService';
import toast from 'react-hot-toast';

const CATEGORY_KEYS = {
  all: ['sermonCategories'],
  detail: (id) => ['sermonCategory', id],
};

export const useSermonCategories = () => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: CATEGORY_KEYS.all,
    queryFn: async () => {
      const { data } = await SermonCategoryService.getAll();
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => SermonCategoryService.create(payload),
    onSuccess: () => {
      toast.success('Sermon category created');
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
    onError: () => {
      toast.error('Failed to create sermon category');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      SermonCategoryService.update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Sermon category updated');
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.detail(id) });
    },
    onError: () => {
      toast.error('Failed to update sermon category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => SermonCategoryService.remove(id),
    onSuccess: () => {
      toast.success('Sermon category deleted');
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
    onError: () => {
      toast.error('Failed to delete sermon category');
    },
  });

  const useCategoryById = (id, enabled = true) =>
    useQuery({
      queryKey: CATEGORY_KEYS.detail(id),
      queryFn: async () => {
        const { data } = await SermonCategoryService.getById(id);
        return data;
      },
      enabled: !!id && enabled,
    });

  return {
    categories: listQuery.data,
    isLoadingCategories: listQuery.isLoading,
    categoriesError: listQuery.error,

    createCategory: createMutation.mutate,
    createCategoryAsync: createMutation.mutateAsync,
    isCreatingCategory: createMutation.isPending,

    updateCategory: updateMutation.mutate,
    updateCategoryAsync: updateMutation.mutateAsync,
    isUpdatingCategory: updateMutation.isPending,

    deleteCategory: deleteMutation.mutate,
    deleteCategoryAsync: deleteMutation.mutateAsync,
    isDeletingCategory: deleteMutation.isPending,

    useCategoryById,
  };
};
