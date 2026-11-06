# NoteShare Backend API Documentation

Welcome to the **NoteShare** API reference. NoteShare is a collaborative student notes-sharing platform built on the MERN stack with Cloudinary PDF cloud storage.

---

## 1. Technology Stack

- **Runtime & Framework:** Node.js (v20+ recommended), Express.js (ES Modules `type: "module"`)
- **Database & ODM:** MongoDB Atlas, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **File Handling & Cloud Storage:** Multer (memory buffer storage), Cloudinary SDK (raw resource type for PDF)
- **Input Validation:** express-validator
- **Cross-Origin & Config:** CORS, dotenv

---

## 2. Local Setup & Configuration

### Environment Variables
Create a file named `.env` in the `backend/` directory based on `.env.example`.

> **Security Note:** Never commit `.env` to Git. Keep credentials private.

| Variable Name | Description | Example / Default |
|---|---|---|
| `PORT` | Local server port | `5001` (avoid port 5000 on macOS AirPlay) |
| `NODE_ENV` | Runtime environment mode | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/noteshare` |
| `JWT_SECRET` | Secret key used for signing JWTs | e.g. `your_long_secure_jwt_secret` |
| `JWT_EXPIRES_IN` | Token expiration duration | `30d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name (from console) | e.g. `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | e.g. `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | e.g. `your_cloudinary_api_secret` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `http://localhost:3000` or `http://localhost:5173` |

### Installation & Startup Commands
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start in development mode (with nodemon auto-restart)
npm run dev

# Start in production mode
npm start
```

---

## 3. Global Architecture & Response Contract

- **Base URL:** `http://localhost:5001/api`
- **Default Port:** `5001`
- **Standard Success Response:**
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": {}
  }
  ```
- **Standard Error Response:**
  ```json
  {
    "success": false,
    "message": "Error description",
    "errors": []
  }
  ```

### Authentication Header
Protected endpoints require an `Authorization` header containing the Bearer token:
```text
Authorization: Bearer <JWT_TOKEN>
```

---

## 4. API Endpoints

### 4.1 Health Check

#### `GET /api/health`
Checks server uptime and database connectivity.
- **Access:** Public
- **Headers:** None
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "NoteShare API is running smoothly",
    "data": {
      "status": "UP",
      "uptime": "120.45s",
      "timestamp": "2026-11-05T12:00:00.000Z",
      "database": "connected"
    }
  }
  ```

---

### 4.2 Authentication Endpoints

#### `POST /api/auth/register`
Registers a new student user. Role is automatically set to `student`.
- **Access:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "Alex Student",
    "email": "alex@university.edu",
    "password": "securePassword123"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "_id": "6aec6175533c89be24cd5c8b",
        "name": "Alex Student",
        "email": "alex@university.edu",
        "role": "student"
      }
    }
  }
  ```
- **Common Errors:**
  - `400 Bad Request`: Missing fields, invalid email format, or password < 6 characters.
  - `409 Conflict`: Email already exists.

#### `POST /api/auth/login`
Authenticates an existing user and returns a JWT.
- **Access:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "alex@university.edu",
    "password": "securePassword123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "_id": "6aec6175533c89be24cd5c8b",
        "name": "Alex Student",
        "email": "alex@university.edu",
        "role": "student"
      }
    }
  }
  ```
- **Common Errors:**
  - `400 Bad Request`: Missing email or password.
  - `401 Unauthorized`: Generic `"Invalid email or password"`.

#### `GET /api/auth/me`
Retrieves currently authenticated user from token.
- **Access:** Private
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User retrieved successfully",
    "data": {
      "user": {
        "_id": "6aec6175533c89be24cd5c8b",
        "name": "Alex Student",
        "email": "alex@university.edu",
        "role": "student"
      }
    }
  }
  ```
- **Common Errors:**
  - `401 Unauthorized`: Token missing, malformed, or expired.

---

### 4.3 Notes Endpoints

#### `GET /api/notes`
Retrieves paginated list of notes with optional search and filters.
- **Access:** Public
- **Query Parameters:**
  - `search` *(optional)*: Search term matched against `title`, `description`, and `subject`.
  - `subject` *(optional)*: Filter by exact subject name (case-insensitive).
  - `semester` *(optional)*: Filter by semester (e.g. `Semester 3`).
  - `page` *(optional, default: 1)*: Page number.
  - `limit` *(optional, default: 10, max: 50)*: Items per page.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Notes retrieved successfully",
    "data": {
      "notes": [
        {
          "_id": "6aec6175533c89be24cd5c90",
          "title": "Data Structures & Algorithms",
          "description": "Lecture notes covering Trees and Graphs.",
          "subject": "Computer Science",
          "semester": "Semester 3",
          "fileUrl": "https://res.cloudinary.com/.../note.pdf",
          "filePublicId": "noteshare/notes/file_abc123.pdf",
          "fileType": "application/pdf",
          "uploadedBy": {
            "_id": "6aec6175533c89be24cd5c8b",
            "name": "Alex Student",
            "role": "student"
          },
          "downloads": 0,
          "createdAt": "2026-11-05T10:00:00.000Z",
          "updatedAt": "2026-11-05T10:00:00.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1
      }
    }
  }
  ```

#### `POST /api/notes`
Uploads a new PDF note to Cloudinary and saves the metadata to MongoDB.
- **Access:** Private
- **Headers:**
  - `Authorization: Bearer <TOKEN>`
  - `Content-Type: multipart/form-data`
- **Form Data Fields:**
  - `title`: string (required)
  - `description`: string (required)
  - `subject`: string (required)
  - `semester`: string (required)
  - `file`: PDF binary file (required, max 10MB, must start with `%PDF`)
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Note uploaded successfully",
    "data": {
      "note": {
        "_id": "6aec6175533c89be24cd5c90",
        "title": "Data Structures & Algorithms",
        "description": "Lecture notes covering Trees and Graphs.",
        "subject": "Computer Science",
        "semester": "Semester 3",
        "fileUrl": "https://res.cloudinary.com/.../noteshare/notes/file_123.pdf",
        "filePublicId": "noteshare/notes/file_123.pdf",
        "fileType": "application/pdf",
        "uploadedBy": {
          "_id": "6aec6175533c89be24cd5c8b",
          "name": "Alex Student",
          "role": "student"
        },
        "downloads": 0,
        "createdAt": "2026-11-05T10:00:00.000Z",
        "updatedAt": "2026-11-05T10:00:00.000Z"
      }
    }
  }
  ```
- **Common Errors:**
  - `400 Bad Request`: Missing form fields, missing file, or invalid PDF magic bytes.
  - `401 Unauthorized`: Token missing or invalid.
  - `413 Payload Too Large`: Uploaded file exceeds 10MB.

#### `GET /api/notes/my-uploads`
Retrieves paginated list of notes uploaded by the authenticated user.
- **Access:** Private
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Query Parameters:** `page`, `limit`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "My notes retrieved successfully",
    "data": {
      "notes": [],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 0,
        "totalPages": 0
      }
    }
  }
  ```

#### `GET /api/notes/:id`
Retrieves a single note by ID.
- **Access:** Public
- **Headers:** None
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Note retrieved successfully",
    "data": {
      "note": {
        "_id": "6aec6175533c89be24cd5c90",
        "title": "Data Structures & Algorithms",
        "uploadedBy": {
          "_id": "...",
          "name": "Alex Student",
          "role": "student"
        }
      }
    }
  }
  ```
- **Common Errors:**
  - `400 Bad Request`: Malformed ObjectId.
  - `404 Not Found`: Note does not exist.

#### `PUT /api/notes/:id`
Updates note metadata or replaces the PDF document. Only the owner or an admin can update.
- **Access:** Private (Owner or Admin)
- **Headers:** `Authorization: Bearer <TOKEN>` (and `multipart/form-data` if replacing file)
- **Fields:** `title`, `description`, `subject`, `semester`, `file` *(optional replacement)*
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Note updated successfully",
    "data": {
      "note": { ... }
    }
  }
  ```
- **Common Errors:**
  - `403 Forbidden`: Not note owner or admin.
  - `404 Not Found`: Note does not exist.

#### `DELETE /api/notes/:id`
Deletes note from MongoDB and destroys the Cloudinary asset. Only owner or admin.
- **Access:** Private (Owner or Admin)
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Note deleted successfully",
    "data": {
      "noteId": "6aec6175533c89be24cd5c90"
    }
  }
  ```
- **Common Errors:**
  - `403 Forbidden`: Not authorized.
  - `404 Not Found`: Note does not exist.

---

### 4.4 Bookmarks Endpoints

#### `GET /api/bookmarks`
Returns all bookmarks for the authenticated user, newest first.
- **Access:** Private
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Bookmarks retrieved successfully",
    "data": {
      "bookmarks": [
        {
          "_id": "6aec6175533c89be24cd5c95",
          "user": "6aec6175533c89be24cd5c8b",
          "note": {
            "_id": "6aec6175533c89be24cd5c90",
            "title": "Data Structures & Algorithms",
            "subject": "Computer Science",
            "semester": "Semester 3",
            "fileUrl": "https://res.cloudinary.com/.../note.pdf",
            "uploadedBy": {
              "name": "Alex Student",
              "role": "student"
            }
          },
          "createdAt": "2026-11-05T11:00:00.000Z"
        }
      ]
    }
  }
  ```

#### `POST /api/bookmarks/:noteId`
Bookmarks a note for the authenticated user.
- **Access:** Private
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Note bookmarked successfully",
    "data": {
      "bookmark": {
        "_id": "6aec6175533c89be24cd5c95",
        "user": "6aec6175533c89be24cd5c8b",
        "note": "6aec6175533c89be24cd5c90",
        "createdAt": "2026-11-05T11:00:00.000Z"
      }
    }
  }
  ```
- **Common Errors:**
  - `400 Bad Request`: Malformed note ID.
  - `404 Not Found`: Note does not exist.
  - `409 Conflict`: Note already bookmarked by user.

#### `DELETE /api/bookmarks/:noteId`
Removes a bookmark for the authenticated user. (Underlying note is preserved).
- **Access:** Private
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Bookmark removed successfully",
    "data": {}
  }
  ```
- **Common Errors:**
  - `404 Not Found`: Bookmark not found.

---

### 4.5 User Profile Endpoints

#### `GET /api/users/profile`
Retrieves authenticated user's profile.
- **Access:** Private
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully",
    "data": {
      "user": {
        "_id": "6aec6175533c89be24cd5c8b",
        "name": "Alex Student",
        "email": "alex@university.edu",
        "role": "student",
        "createdAt": "2026-11-05T10:00:00.000Z"
      }
    }
  }
  ```

#### `PUT /api/users/profile`
Updates the authenticated user's `name`.
- **Access:** Private
- **Headers:**
  - `Authorization: Bearer <TOKEN>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "Alexander Student"
  }
  ```
- **Forbidden Fields:** Sending `role`, `email`, `password`, `_id`, or `createdAt` triggers HTTP 400.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "user": {
        "_id": "6aec6175533c89be24cd5c8b",
        "name": "Alexander Student",
        "email": "alex@university.edu",
        "role": "student",
        "createdAt": "2026-11-05T10:00:00.000Z"
      }
    }
  }
  ```
- **Common Errors:**
  - `400 Bad Request`: Empty name, non-string, name > 50 characters, or attempting to modify forbidden fields (`role`, `email`, `password`, `_id`).

