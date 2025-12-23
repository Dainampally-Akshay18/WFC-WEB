// src/pages/sermons/SermonsPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import DashboardLayout from '@components/layout/DashboardLayout';
import { useSermons } from '@hooks/sermon';
import { useSermonCategories } from '@hooks/sermoncategory';
import ConfirmDialog from '@components/common/ConfirmDialog';

function SermonsPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const {
    sermons,
    isLoadingSermons,
    createSermonAsync,
    updateSermonAsync,
    deleteSermonAsync,
  } = useSermons({ category_id: categoryId });

  const { useCategoryById } = useSermonCategories();
  const {
    data: category,
    isLoading: isLoadingCategory,
  } = useCategoryById(categoryId);

  // undefined = closed, null = create, object = edit
  const [editingSermon, setEditingSermon] = useState(undefined);

  const [formState, setFormState] = useState({
    title: '',
    description: '',
    videoFile: null,
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreateModal = () => {
    setEditingSermon(null);
    setFormState({
      title: '',
      description: '',
      videoFile: null,
    });
  };

  const openEditModal = (sermon) => {
    setEditingSermon(sermon);
    setFormState({
      title: sermon.title || '',
      description: sermon.description || '',
      videoFile: null, // editing does not change video
    });
  };

  const closeModal = () => {
    setEditingSermon(undefined);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingSermon && editingSermon.id) {
      // Update metadata only
      const payload = {
        title: formState.title,
        description: formState.description,
        category_id: categoryId,
      };
      await updateSermonAsync({ id: editingSermon.id, payload });
    } else {
      // Create with file upload
      if (!formState.videoFile) {
        // You can replace this with a toast
        alert('Please select a video file');
        return;
      }

      const formData = new FormData();
      formData.append('title', formState.title);
      formData.append('description', formState.description || '');
      formData.append('category_id', categoryId);
      formData.append('video_file', formState.videoFile);

      await createSermonAsync(formData);
    }

    closeModal();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteSermonAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleWatch = (sermon) => {
    navigate(`/sermons/${sermon.id}/watch`, {
      state: { sermon },
    });
  };

  const showModal = editingSermon !== undefined;

  if (isLoadingSermons || isLoadingCategory) {
    return (
      <DashboardLayout>
        <div className="p-4 text-sm text-gray-700 dark:text-gray-200">
          Loading sermons...
        </div>
      </DashboardLayout>
    );
  }

  const hasSermons = sermons && sermons.length > 0;

  return (
    <DashboardLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">
              Sermons in {category?.name || 'Category'}
            </h1>
            <p className="text-sm text-gray-500">
              Manage sermons for this category.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/sermon-categories')}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Back to Categories
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Add Sermon
            </button>
          </div>
        </div>

        {!hasSermons && (
          <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-300">
            No sermons found in this category yet. Click &quot;Add Sermon&quot; to
            create one.
          </div>
        )}

        {hasSermons && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <div
                key={sermon.id}
                className="flex flex-col rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                {sermon.thumbnail_url && (
                  <img
                    src={sermon.thumbnail_url}
                    alt={sermon.title}
                    className="mb-2 h-40 w-full rounded-md object-cover"
                  />
                )}

                <h2 className="text-sm font-semibold">{sermon.title}</h2>
                <p className="mt-1 line-clamp-3 text-xs text-gray-500 dark:text-gray-400">
                  {sermon.description || 'No description'}
                </p>

                <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Views: {sermon.total_views ?? 0}</span>
                  <span>Likes: {sermon.total_likes ?? 0}</span>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleWatch(sermon)}
                    className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                  >
                    Watch
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(sermon)}
                    className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(sermon)}
                    className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit sermon modal */}
        {showModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-lg dark:bg-gray-900">
              <h2 className="mb-3 text-base font-semibold">
                {editingSermon && editingSermon.id
                  ? 'Edit Sermon'
                  : 'Create Sermon'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        title: e.target.value,
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
                    rows={3}
                    value={formState.description}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  />
                </div>

                {!editingSermon && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Video file
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          videoFile: e.target.files?.[0] || null,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                    />
                  </div>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
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
            title="Delete Sermon"
            description={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            type="danger"
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default SermonsPage;
