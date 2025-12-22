import axios from 'axios';

/**
 * Centralized Axios instance for API calls
 * - Automatically includes baseURL from environment
 * - Automatically sends cookies with every request (withCredentials: true)
 * - Ensures consistent authentication across all API calls
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;



