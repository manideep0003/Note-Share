/**
 * Extracts a meaningful human-readable error message from an Axios error object.
 * Catches network errors when the backend server is unreachable.
 * 
 * @param {Error|Object} error - Caught error
 * @param {string} fallbackMessage - Default message if no specific detail is found
 * @returns {string} User-facing error message
 */
export const getApiErrorMessage = (error, fallbackMessage = 'An unexpected error occurred.') => {
  if (!error) return fallbackMessage;

  // Network connection failure (e.g. backend server is offline or connection refused)
  if (
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNREFUSED' ||
    (!error.response && error.message === 'Network Error')
  ) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    return `Unable to connect to the backend server at ${apiUrl}. Please verify that the API server is running and accessible.`;
  }

  // Request timeout
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'The request timed out while connecting to the server. Please try again.';
  }

  // Backend returned a specific error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Fallback to error message or default
  return error.message || fallbackMessage;
};

export default getApiErrorMessage;

