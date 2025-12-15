import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Mail, Phone, MapPin, Calendar, Activity, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useUserById, useUserActivity } from '@hooks/useUsers';
import { format } from 'date-fns';

const UserDetailModal = ({ userId, isOpen, onClose }) => {
  const { data: user, isLoading: userLoading } = useUserById(userId);
  const { data: activity, isLoading: activityLoading } = useUserActivity(userId);
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'revoked':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {user?.display_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {userLoading ? 'Loading...' : user?.display_name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userLoading ? 'Loading details...' : user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            User Details
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'activity'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Activity History
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {userLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Account Status
                    </label>
                    {getStatusBadge(user?.status || 'pending')}
                  </div>

                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <p className="text-gray-900 dark:text-white">{user?.email}</p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </label>
                      <p className="text-gray-900 dark:text-white">{user?.phone || 'Not provided'}</p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <MapPin className="w-4 h-4" />
                        Branch
                      </label>
                      <p className="text-gray-900 dark:text-white capitalize">{user?.branch || 'Not assigned'}</p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4" />
                        Joined Date
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {user?.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {user?.address && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <p className="text-gray-900 dark:text-white">{user.address}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-4">
                  {activityLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                  ) : activity && activity.length > 0 ? (
                    activity.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.action}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.timestamp ? format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No activity recorded yet</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

UserDetailModal.propTypes = {
  userId: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserDetailModal;
