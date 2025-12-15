import { useState } from 'react';
import DashboardLayout from '@components/layout/DashboardLayout';
import { Clock, CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';
import { usePendingUsers } from '@hooks/useUsers';
import { useUserActions } from '@hooks/useUserActions';
import UserDetailModal from './components/UserDetailModal';
import BulkActions from './components/BulkActions';
import ConfirmDialog from '@components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const PendingApprovals = () => {
  const [activeSection, setActiveSection] = useState('users');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null,
    userId: null,
  });

  const itemsPerPage = 10;

  // Fetch pending users
  const { data: pendingData, isLoading, refetch } = usePendingUsers({
    page: currentPage,
    limit: itemsPerPage,
  });

  const { approveUser, rejectUser, bulkApprove, bulkReject } = useUserActions();

  // Handlers
  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(pendingData?.users.map((user) => user.user_id) || []);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleViewDetails = (userId) => {
    setSelectedUserId(userId);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (userId) => {
    setConfirmDialog({
      isOpen: true,
      type: 'approve',
      userId,
    });
  };

  const handleReject = (userId) => {
    setConfirmDialog({
      isOpen: true,
      type: 'reject',
      userId,
    });
  };

  const handleBulkApprove = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'bulkApprove',
      userId: null,
    });
  };

  const handleBulkReject = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'bulkReject',
      userId: null,
    });
  };

  const confirmAction = async () => {
    const { type, userId } = confirmDialog;

    try {
      switch (type) {
        case 'approve':
          await approveUser.mutateAsync(userId);
          break;
        case 'reject':
          await rejectUser.mutateAsync({ userId, reason: '' });
          break;
        case 'bulkApprove':
          await bulkApprove.mutateAsync(selectedUsers);
          setSelectedUsers([]);
          break;
        case 'bulkReject':
          await bulkReject.mutateAsync({ userIds: selectedUsers, reason: '' });
          setSelectedUsers([]);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setConfirmDialog({ isOpen: false, type: null, userId: null });
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Pending approvals refreshed!');
  };

  const totalItems = pendingData?.pagination?.total || 0;

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Pending Approvals
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Review and approve new user registrations
                  </p>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Users</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Selected</p>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedUsers.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quick Actions</p>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Select & Approve
                </p>
              </div>
            </div>
          </div>

          {/* Pending Users List */}
          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading pending approvals...</p>
                </div>
              </div>
            </div>
          ) : totalItems === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  All Caught Up! 🎉
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No pending user approvals at the moment.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={pendingData?.users?.length > 0 && selectedUsers.length === pendingData.users.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Select All ({pendingData?.users?.length || 0} users)
                  </span>
                </div>
              </div>

              {/* Users List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {pendingData?.users?.map((user) => (
                  <div
                    key={user.user_id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Checkbox & User Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.user_id)}
                          onChange={(e) => handleSelectUser(user.user_id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />

                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {user.display_name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {user.display_name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              📧 {user.email}
                            </span>
                            {user.phone && (
                              <span className="flex items-center gap-1">
                                📱 {user.phone}
                              </span>
                            )}
                            {user.branch && (
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium capitalize">
                                {user.branch}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              🕐 {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleViewDetails(user.user_id)}
                          className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </button>

                        <button
                          onClick={() => handleApprove(user.user_id)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Approve</span>
                        </button>

                        <button
                          onClick={() => handleReject(user.user_id)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          <BulkActions
            selectedCount={selectedUsers.length}
            onApprove={handleBulkApprove}
            onReject={handleBulkReject}
            onClear={() => setSelectedUsers([])}
            isLoading={bulkApprove.isLoading || bulkReject.isLoading}
          />

          {/* User Detail Modal */}
          <UserDetailModal
            userId={selectedUserId}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedUserId(null);
            }}
          />

          {/* Confirmation Dialog */}
          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            onClose={() => setConfirmDialog({ isOpen: false, type: null, userId: null })}
            onConfirm={confirmAction}
            title={
              confirmDialog.type === 'approve'
                ? 'Approve User'
                : confirmDialog.type === 'reject'
                ? 'Reject User'
                : confirmDialog.type === 'bulkApprove'
                ? 'Approve Multiple Users'
                : 'Reject Multiple Users'
            }
            message={
              confirmDialog.type === 'approve'
                ? 'Are you sure you want to approve this user? They will gain access to the system.'
                : confirmDialog.type === 'reject'
                ? 'Are you sure you want to reject this user? This action cannot be undone.'
                : confirmDialog.type === 'bulkApprove'
                ? `Are you sure you want to approve ${selectedUsers.length} users?`
                : `Are you sure you want to reject ${selectedUsers.length} users?`
            }
            confirmText={confirmDialog.type?.includes('Approve') ? 'Approve' : 'Reject'}
            variant={confirmDialog.type?.includes('Approve') ? 'info' : 'danger'}
            isLoading={
              approveUser.isLoading ||
              rejectUser.isLoading ||
              bulkApprove.isLoading ||
              bulkReject.isLoading
            }
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PendingApprovals;
