import { format, parseISO, isValid } from 'date-fns';

// Format date for display
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, formatString) : '';
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

// Format date and time
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - parsedDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(date);
  } catch (error) {
    console.error('Relative time error:', error);
    return '';
  }
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${currency} ${amount}`;
  }
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get status color for Material-UI
export const getStatusColor = (status) => {
  const statusColors = {
    pending: 'warning',
    reviewing: 'info',
    shortlisted: 'success',
    rejected: 'error',
    accepted: 'success',
    active: 'success',
    inactive: 'error'
  };
  
  return statusColors[status] || 'default';
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Check if user has permission
export const hasPermission = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  
  const roleHierarchy = {
    applicant: 1,
    bot: 2,
    admin: 3
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export default {
  formatDate,
  formatDateTime,
  getRelativeTime,
  capitalize,
  formatCurrency,
  truncateText,
  getStatusColor,
  isValidEmail,
  generateId,
  debounce,
  hasPermission
};
