import api from './api';

/**
 * User Profile Service adhering strictly to backend contract
 */
export const userService = {
  /**
   * Fetch current user profile details
   * @returns {Promise<Object>} API response
   */
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  /**
   * Update current user profile details
   * @param {Object} profileData
   * @returns {Promise<Object>} API response
   */
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
};

export default userService;

