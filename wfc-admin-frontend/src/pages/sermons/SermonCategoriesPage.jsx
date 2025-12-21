// src/pages/sermons/SermonCategoriesPage.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import DashboardLayout from '@components/layout/DashboardLayout';
import ConfirmDialog from '@components/common/ConfirmDialog';
import { useSermonCategories } from '@hooks/sermoncategory';

function SermonCategoriesPage() {
  const navigate = useNavigate();
  const {
    categories,
    isLoadingCategories,
    createCategoryAsync,
    updateCategoryAsync,
    deleteCategoryAsync,
  } = useSermonCategories();

  // undefined = closed, null = create, object = edit
  const [editingCategory, setEditingCategory] = useState(undefined);
  const [formState, setFormState] = useState({ name: '', description: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormState({ name: '', description: '' });
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormState({
      name: category.name || '',
      description: category.description || '',
    });
  };

  const closeModal = () => {
    setEditingCategory(undefined);
    setFormState({ name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingCategory && editingCategory.id) {
      await updateCategoryAsync({
        id: editingCategory.id,
        payload: {
          name: formState.name,
          description: formState.description,
        },
      });
    } else {
      await createCategoryAsync({
        name: formState.name,
        description: formState.description,
      });
    }

    closeModal();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCategoryAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const showModal = editingCategory !== undefined;

  if (isLoadingCategories) {
    return (
      <DashboardLayout>
        <div className="p-4">Loading sermon categories...</div>
      </DashboardLayout>
    );
  }

  const hasCategories = categories && categories.length > 0;

  return (
    <DashboardLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Sermon Categories</h1>
          <button
            className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={openCreateModal}
          >
            Add Category
          </button>
        </div>

        {!hasCategories && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No sermon categories found. Create one to start adding sermons.
            </p>
            <button
              className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={openCreateModal}
            >
              Create Sermon Category
            </button>
          </div>
        )}

        {hasCategories && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-medium">
                    {category.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {category.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Sermons: {category.sermon_count ?? 0}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={() =>
                      navigate(
                        `/sermon-categories/${category.id}/sermons`,
                      )
                    }
                  >
                    View Sermons
                  </button>
                  <button
                    className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => openEditModal(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                    onClick={() => setDeleteTarget(category)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingCategory && editingCategory.id
                ? 'Edit Sermon Category'
                : 'Create Sermon Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formState.description}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          open={true}
          title="Delete Sermon Category"
          description={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          type="danger"
        />
      )}
    </DashboardLayout>
  );
}

export default SermonCategoriesPage;
