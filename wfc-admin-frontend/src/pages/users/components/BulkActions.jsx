import PropTypes from 'prop-types';
import { CheckCircle, XCircle, X } from 'lucide-react';

const BulkActions = ({ selectedCount, onApprove, onReject, onClear, isLoading }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 rounded-2xl shadow-2xl px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Selection Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                {selectedCount}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {selectedCount} {selectedCount === 1 ? 'user' : 'users'} selected
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose an action below
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onApprove}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              Approve All
            </button>

            <button
              onClick={onReject}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" />
              Reject All
            </button>

            <button
              onClick={onClear}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

BulkActions.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default BulkActions;
