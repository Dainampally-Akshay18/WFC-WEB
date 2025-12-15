import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} pattern - Date format pattern
 * @returns {string} Formatted date
 */
export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  return format(new Date(date), pattern);
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

/**
 * Format date as time ago (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Time ago string
 */
export const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
