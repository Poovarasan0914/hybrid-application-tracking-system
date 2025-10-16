import { useState, useCallback } from 'react';
import api from '../services/api';

// Custom hook for API calls with loading and error states
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await requestFn();
      return { data: response.data, success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { error: errorMessage, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    makeRequest,
    clearError,
  };
};

export default useApi;
