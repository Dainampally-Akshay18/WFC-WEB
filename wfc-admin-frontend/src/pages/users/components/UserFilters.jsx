import { useState } from 'react';
import PropTypes from 'prop-types';
import { Search, Filter, X } from 'lucide-react';

const UserFilters = ({ onFilterChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    branch: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({ status: '', branch: '' });
    setSearchTerm('');
    onFilterChange({ status: '', branch: '' });
    onSearch('');
  };

  const hasActiveFilters = filters.status || filters.branch || searchTerm;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full">
              {[filters.status, filters.branch, searchTerm].filter(Boolean).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Branch
              </label>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange('branch', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              >
                <option value="">All Branches</option>
                <option value="main">Main Branch</option>
                <option value="north">North Branch</option>
                <option value="south">South Branch</option>
                <option value="east">East Branch</option>
                <option value="west">West Branch</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

UserFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default UserFilters;
