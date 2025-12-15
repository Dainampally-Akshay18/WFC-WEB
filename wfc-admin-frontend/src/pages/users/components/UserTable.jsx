import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  MoreVertical,
  Check,
  X as XIcon,
  Ban,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { format } from 'date-fns';

const UserTable = ({ 
  users = [], 
  isLoading, 
  selectedUsers = [], 
  onSelectUser, 
  onSelectAll, 
  onViewDetails, 
  onApprove, 
  onReject, 
  onRevoke,
  sortConfig,
  onSort,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'revoked':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      approved: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30',
      pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30',
      revoked: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config[status] || config.pending}`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSort = (field) => {
    onSort(field);
  };

  const SortIcon = ({ field }) => {
    if (sortConfig?.field !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.order === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={users.length > 0 && selectedUsers.length === users.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                onClick={() => handleSort('display_name')}
              >
                <div className="flex items-center gap-2">
                  Name
                  <SortIcon field="display_name" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-2">
                  Email
                  <SortIcon field="email" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Branch
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-2">
                  Joined
                  <SortIcon field="created_at" />
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr 
                key={user.user_id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.user_id)}
                    onChange={(e) => onSelectUser(user.user_id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {user.display_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.display_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.phone || 'No phone'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium capitalize">
                    {user.branch || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(user.user_id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </button>

                    {/* Quick Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === user.user_id ? null : user.user_id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>

                      {openMenuId === user.user_id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
                            {user.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    onApprove(user.user_id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
                                >
                                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  Approve User
                                </button>
                                <button
                                  onClick={() => {
                                    onReject(user.user_id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                  <XIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                                  Reject User
                                </button>
                              </>
                            )}
                            {user.status === 'approved' && (
                              <button
                                onClick={() => {
                                  onRevoke(user.user_id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              >
                                <Ban className="w-4 h-4 text-red-600 dark:text-red-400" />
                                Revoke Access
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  selectedUsers: PropTypes.array,
  onSelectUser: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired,
  sortConfig: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.oneOf(['asc', 'desc']),
  }),
  onSort: PropTypes.func.isRequired,
};

export default UserTable;
