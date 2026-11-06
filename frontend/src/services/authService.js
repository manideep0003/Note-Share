import api from './api';

/**
 * Authentication Service adhering strictly to backend contract
 */
export const authService = {
  /**
   * Register a new student account
   * Reads backend response: response.data.data.token and response.data.data.user
   * @param {Object} userData - { name, email, password, role }
   * @returns {Promise<Object>} Formatted API response with token and user
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const token = response.data?.data?.token;
    const user = response.data?.data?.user;
    return {
      ...response.data,
      token,
      user,
    };
  },

  /**
   * Log in an existing user
   * Contract Login response:
   * {
   *   "success": true,
   *   "message": "Login successful",
   *   "data": {
   *     "token": "JWT_TOKEN",
   *     "user": {
   *       "_id": "USER_ID",
   *       "name": "Student Name",
   *       "email": "student@example.com",
   *       "role": "student"
   *     }
   *   }
   * }
   * Reads: response.data.data.token and response.data.data.user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Formatted API response with token and user
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const token = response.data?.data?.token;
    const user = response.data?.data?.user;
    return {
      ...response.data,
      token,
      user,
    };
  },

  /**
   * Fetch authenticated user details from GET /auth/me
   * Reads user object from response.data.data.user, response.data.data, or response.data.user
   * @returns {Promise<Object>}
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    const user =
      response.data?.data?.user ||
      response.data?.data ||
      response.data?.user;
    return {
      ...response.data,
      user,
    };
  },
};

export default authService;
