import { useState } from 'react';
import DashboardLayout from '@components/layout/DashboardLayout';
import { Users as UsersIcon, Download, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useUsers } from '@hooks/useUsers';
import { useUserActions } from '@hooks/useUserActions';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import UserDetailModal from './components/UserDetailModal';
import BulkActions from './components/BulkActions';
import ConfirmDialog from '@components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [activeSection, setActiveSection] = useState('users');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    branch: '',
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'created_at',
    order: 'desc',
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null,
    userId: null,
  });

  const itemsPerPage = 10;

  // Fetch users with filters
  const { data: usersData, isLoading, refetch } = useUsers({
    page: currentPage,
    limit: itemsPerPage,
    search: filters.search,
    status: filters.status,
    branch: filters.branch,
    sortBy: sortConfig.field,
    sortOrder: sortConfig.order,
  });

  const { approveUser, rejectUser, revokeUser, bulkApprove, bulkReject } = useUserActions();

  // Handlers
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(usersData?.users.map((user) => user.user_id) || []);
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

  const handleRevoke = (userId) => {
    setConfirmDialog({
      isOpen: true,
      type: 'revoke',
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
        case 'revoke':
          await revokeUser.mutateAsync({ userId, reason: '' });
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    refetch();
    toast.success('User list refreshed!');
  };

  const handleExport = () => {
    toast.success('Exporting users... (Feature coming soon)');
  };

  // Pagination
  const totalPages = usersData?.pagination?.total_pages || 1;
  const totalItems = usersData?.pagination?.total || 0;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    User Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage church members and their access
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalItems}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Selected</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedUsers.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Page</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentPage} / {totalPages}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <UserFilters onFilterChange={handleFilterChange} onSearch={handleSearch} />
          </div>

          {/* Table */}
          <UserTable
            users={usersData?.users || []}
            isLoading={isLoading}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onViewDetails={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
            onRevoke={handleRevoke}
            sortConfig={sortConfig}
            onSort={handleSort}
          />


          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> results
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronsLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) =>
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronsRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
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
                : confirmDialog.type === 'revoke'
                ? 'Revoke Access'
                : confirmDialog.type === 'bulkApprove'
                ? 'Approve Multiple Users'
                : 'Reject Multiple Users'
            }
            message={
              confirmDialog.type === 'approve'
                ? 'Are you sure you want to approve this user? They will gain access to the system.'
                : confirmDialog.type === 'reject'
                ? 'Are you sure you want to reject this user? This action cannot be undone.'
                : confirmDialog.type === 'revoke'
                ? 'Are you sure you want to revoke access for this user? They will no longer be able to access the system.'
                : confirmDialog.type === 'bulkApprove'
                ? `Are you sure you want to approve ${selectedUsers.length} users?`
                : `Are you sure you want to reject ${selectedUsers.length} users?`
            }
            confirmText={
              confirmDialog.type?.includes('Approve') ? 'Approve' : confirmDialog.type === 'revoke' ? 'Revoke' : 'Reject'
            }
            variant={confirmDialog.type?.includes('Approve') ? 'info' : 'danger'}
            isLoading={approveUser.isLoading || rejectUser.isLoading || revokeUser.isLoading || bulkApprove.isLoading || bulkReject.isLoading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
