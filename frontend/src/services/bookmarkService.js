import api from './api';

/**
 * Bookmark Service adhering strictly to backend contract
 */
export const bookmarkService = {
  /**
   * Fetch all bookmarked notes for the current user
   * @returns {Promise<Object>} API response
   */
  async getBookmarks() {
    const response = await api.get('/bookmarks');
    return response.data;
  },

  /**
   * Bookmark a note by ID
   * @param {string} noteId
   * @returns {Promise<Object>} API response
   */
  async addBookmark(noteId) {
    const response = await api.post(`/bookmarks/${noteId}`);
    return response.data;
  },

  /**
   * Remove a note from bookmarks by ID
   * @param {string} noteId
   * @returns {Promise<Object>} API response
   */
  async removeBookmark(noteId) {
    const response = await api.delete(`/bookmarks/${noteId}`);
    return response.data;
  },
};

export default bookmarkService;

