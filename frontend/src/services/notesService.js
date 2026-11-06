import api from './api';

/**
 * Notes Service adhering strictly to backend contract
 */
export const notesService = {
  /**
   * Fetch paginated/filtered list of notes
   * @param {Object} params - Query parameters (e.g. { page, limit, search, subject, course, semester })
   * @returns {Promise<Object>} { success, message, data: { notes: [], pagination: { page, limit, total, totalPages } } }
   */
  async getNotes(params = {}) {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  /**
   * Fetch a single note by its ID
   * @param {string} id - Note ID
   * @returns {Promise<Object>}
   */
  async getNoteById(id) {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  /**
   * Upload a new note with a PDF file (multipart/form-data)
   * The PDF file field MUST be named "file" per backend contract:
   *   formData.append('file', fileObject);
   *
   * Note: We deliberately do NOT manually hardcode 'Content-Type': 'multipart/form-data'.
   * Letting Axios/browser automatically generate the header ensures the correct boundary
   * string (e.g. boundary=----WebKitFormBoundary...) is present for the backend parser.
   *
   * @param {FormData} formData
   * @param {Function} [onUploadProgress]
   * @returns {Promise<Object>}
   */
  async createNote(formData, onUploadProgress) {
    const response = await api.post('/notes', formData, {
      onUploadProgress,
    });
    return response.data;
  },

  /**
   * Update note metadata or replace attached document
   * @param {string} id
   * @param {Object|FormData} updateData
   * @returns {Promise<Object>}
   */
  async updateNote(id, updateData) {
    const response = await api.put(`/notes/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete a note by its ID
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async deleteNote(id) {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  /**
   * Fetch notes uploaded by the currently authenticated user
   * Exact endpoint: GET /notes/my-uploads
   * @param {Object} [params] - Optional query parameters (e.g. { page, limit })
   * @returns {Promise<Object>}
   */
  async getMyUploads(params = {}) {
    const response = await api.get('/notes/my-uploads', { params });
    return response.data;
  },
};

export default notesService;
