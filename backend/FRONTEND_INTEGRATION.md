# NoteShare Frontend Integration Guide

This guide is designed for the frontend developer connecting a React (Vite / CRA / Next.js) application to the **NoteShare** backend.

---

## 1. Backend Server & Base URL

- **Backend Base URL:** `http://localhost:5001/api`
- **Default Port:** `5001`

### CORS Configuration Requirement
The backend CORS policy is configured to allow requests from the origin specified by the `FRONTEND_URL` environment variable in `backend/.env`:
```env
FRONTEND_URL=http://localhost:3000   # or http://localhost:5173 for Vite
```
Ensure that `FRONTEND_URL` in `backend/.env` matches the exact URL and port your frontend dev server runs on.

---

## 2. Recommended Axios Client Setup

Create an API client module (e.g. `src/api/axios.js`):

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true
});

// Request Interceptor: Automatically attach Bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('noteshare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize error unwrapping
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired / unauthorized, optionally trigger redirect to /login
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('noteshare_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 3. Standard Response Contracts

### Success Response Format
Every successful response returns `success: true` and a `data` object:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response Format
Every error response returns `success: false`, a human-readable `message`, and an `errors` array:
```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": ["Specific validation message"]
}
```

In your frontend error handling:
```javascript
try {
  const res = await api.post('/notes', formData);
  console.log(res.data.message);
} catch (err) {
  const errorMessage = err.response?.data?.message || 'Network error';
  const errorList = err.response?.data?.errors || [];
  // Display toast / notification to student
}
```

---

## 4. Authentication Integration

### A. Register Student (`POST /auth/register`)
```javascript
const registerUser = async (name, email, password) => {
  const res = await api.post('/auth/register', { name, email, password });
  const { token, user } = res.data.data;
  localStorage.setItem('noteshare_token', token);
  return user;
};
```

### B. Login Student (`POST /auth/login`)
```javascript
const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  const { token, user } = res.data.data;
  localStorage.setItem('noteshare_token', token);
  return user;
};
```

### C. Get Current Authenticated User (`GET /auth/me`)
Use on app startup to restore authentication state:
```javascript
const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data.data.user;
};
```

---

## 5. Notes Integration & File Uploads

### A. Fetch Notes Catalog (with Search, Filter & Pagination)
```javascript
const fetchNotes = async ({ search = '', subject = '', semester = '', page = 1, limit = 10 }) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (subject) params.subject = subject;
  if (semester) params.semester = semester;

  const res = await api.get('/notes', { params });
  // res.data.data.notes -> Array of notes
  // res.data.data.pagination -> { page, limit, total, totalPages }
  return res.data.data;
};
```

### B. Upload a PDF Note (`POST /notes`)
> **Crucial Rule:** Use native `FormData`. **Do not** manually set `Content-Type: multipart/form-data` with fixed headers in Axios, as Axios and the browser must set the dynamic multi-part boundary string automatically.

The form field names must be **strictly**:
- `title`
- `description`
- `subject`
- `semester`
- `file` (the PDF file object from `<input type="file" />`)

```javascript
const uploadNote = async ({ title, description, subject, semester, file }) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('subject', subject);
  formData.append('semester', semester);
  formData.append('file', file); // Raw File object

  // Simply pass formData as body. Axios handles multipart boundaries natively.
  const res = await api.post('/notes', formData);
  return res.data.data.note;
};
```

### C. Fetch User's Own Uploads (`GET /notes/my-uploads`)
```javascript
const fetchMyUploads = async (page = 1, limit = 10) => {
  const res = await api.get('/notes/my-uploads', { params: { page, limit } });
  return res.data.data;
};
```

### D. Update Note (`PUT /notes/:id`)
If only text is updated:
```javascript
const updateNoteText = async (noteId, { title, description, subject, semester }) => {
  const res = await api.put(`/notes/${noteId}`, { title, description, subject, semester });
  return res.data.data.note;
};
```
If replacing the PDF document:
```javascript
const replaceNotePDF = async (noteId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.put(`/notes/${noteId}`, formData);
  return res.data.data.note;
};
```

### E. Delete Note (`DELETE /notes/:id`)
```javascript
const deleteNote = async (noteId) => {
  const res = await api.delete(`/notes/${noteId}`);
  return res.data;
};
```

---

## 6. Bookmarks Integration

### A. Get Bookmarked Notes (`GET /bookmarks`)
```javascript
const fetchBookmarks = async () => {
  const res = await api.get('/bookmarks');
  // Returns array where each item has `_id`, `note` (populated details), and `createdAt`
  return res.data.data.bookmarks;
};
```

### B. Bookmark a Note (`POST /bookmarks/:noteId`)
```javascript
const addBookmark = async (noteId) => {
  const res = await api.post(`/bookmarks/${noteId}`);
  return res.data.data.bookmark;
};
```

### C. Remove a Bookmark (`DELETE /bookmarks/:noteId`)
```javascript
const removeBookmark = async (noteId) => {
  const res = await api.delete(`/bookmarks/${noteId}`);
  return res.data;
};
```

---

## 7. User Profile Integration

### A. Get Profile (`GET /users/profile`)
```javascript
const fetchProfile = async () => {
  const res = await api.get('/users/profile');
  return res.data.data.user;
};
```

### B. Update Name (`PUT /users/profile`)
> Note: Only `name` is accepted. Do not include `email`, `role`, or `password` in the body, or the server will reject it with HTTP 400.

```javascript
const updateProfileName = async (newName) => {
  const res = await api.put('/users/profile', { name: newName });
  return res.data.data.user;
};
```

---

## 8. Common HTTP Error Code Reference

| Status Code | Reason | Typical Message | Frontend Action |
|---|---|---|---|
| `400 Bad Request` | Missing field, invalid ID format, fake PDF, or invalid name | `"Please provide name, email, and password"` | Show validation feedback to student |
| `401 Unauthorized` | Missing, malformed, or expired JWT | `"Not authorized, no token provided"` | Clear token & redirect to `/login` |
| `403 Forbidden` | Non-owner attempted to update or delete another's note | `"Not authorized to update this note"` | Alert student of lack of permissions |
| `404 Not Found` | Note or Bookmark does not exist | `"Note not found"` | Display 404 state or refresh list |
| `409 Conflict` | Duplicate email on register or duplicate bookmark | `"Email is already registered"` | Alert student (e.g. "Already bookmarked") |
| `413 Payload Too Large`| Uploaded file exceeds 10MB limit | `"File size exceeds maximum allowed limit of 10MB"` | Instruct student to compress PDF |
| `500 Server Error` | Database or Cloudinary service exception | `"Something went wrong"` | Show general error message |

