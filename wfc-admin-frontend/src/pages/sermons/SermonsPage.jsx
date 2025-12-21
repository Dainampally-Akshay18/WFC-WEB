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

  const [editingSermon, setEditingSermon] = useState(undefined); // undefined=closed, null=create
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    video_id: '',
    embed_url: '',
    thumbnail_url: '',
    duration: 0,
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreateModal = () => {
    setEditingSermon(null);
    setFormState({
      title: '',
      description: '',
      video_id: '',
      embed_url: '',
      thumbnail_url: '',
      duration: 0,
    });
  };

  const openEditModal = (sermon) => {
    setEditingSermon(sermon);
    setFormState({
      title: sermon.title || '',
      description: sermon.description || '',
      video_id: sermon.video_id || '',
      embed_url: sermon.embed_url || '',
      thumbnail_url: sermon.thumbnail_url || '',
      duration: sermon.duration || 0,
    });
  };

  const closeModal = () => {
    setEditingSermon(undefined);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formState.title,
      description: formState.description,
      category_id: categoryId,
      video_id: formState.video_id,
      embed_url: formState.embed_url,
      thumbnail_url: formState.thumbnail_url,
      duration: Number(formState.duration) || 0,
    };

    if (editingSermon && editingSermon.id) {
      await updateSermonAsync({ id: editingSermon.id, payload });
    } else {
      await createSermonAsync(payload);
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
        <div className="p-4">Loading sermons...</div>
      </DashboardLayout>
    );
  }

  const hasSermons = sermons && sermons.length > 0;

  return (
    <DashboardLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Sermons in {category?.name || 'Category'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage sermons for this category.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => navigate('/sermon-categories')}
            >
              Back to Categories
            </button>
            <button
              className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={openCreateModal}
            >
              Add Sermon
            </button>
          </div>
        </div>

        {!hasSermons && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            No sermons found in this category yet. Click "Add Sermon" to create one.
          </p>
        )}

        {hasSermons && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <div
                key={sermon.id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden flex flex-col"
              >
                {sermon.thumbnail_url && (
                  <img
                    src={sermon.thumbnail_url}
                    alt={sermon.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-medium">{sermon.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">
                      {sermon.description || 'No description'}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-x-2">
                      <span>Views: {sermon.total_views ?? 0}</span>
                      <span>Likes: {sermon.total_likes ?? 0}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      className="flex-1 px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                      onClick={() => handleWatch(sermon)}
                    >
                      Watch
                    </button>
                    <button
                      className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => openEditModal(sermon)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                      onClick={() => setDeleteTarget(sermon)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit sermon modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingSermon && editingSermon.id
                ? 'Edit Sermon'
                : 'Create Sermon'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Video ID
                  </label>
                  <input
                    type="text"
                    value={formState.video_id}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        video_id: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={formState.duration}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Embed URL
                </label>
                <input
                  type="text"
                  value={formState.embed_url}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      embed_url: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  value={formState.thumbnail_url}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      thumbnail_url: e.target.value,
                    }))
                  }
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
          title="Delete Sermon"
          description={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          type="danger"
        />
      )}
    </DashboardLayout>
  );
}

export default SermonsPage;
