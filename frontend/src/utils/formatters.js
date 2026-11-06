/**
 * Format date string into a clean academic citation date (e.g. "Nov 5, 2026")
 * @param {string|Date} dateValue
 * @returns {string} Formatted date string
 */
export const formatDate = (dateValue) => {
  if (!dateValue) return 'Recent';
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
};

/**
 * Normalizes file URL from backend for downloading/viewing.
 * Cloudinary URLs (e.g. https://res.cloudinary.com/...) are returned directly
 * and are never prefixed with the local backend URL.
 * 
 * @param {string} filePath - Cloudinary URL or local relative path returned from API
 * @returns {string} Accessible URL
 */
export const getFileDownloadUrl = (filePath) => {
  if (!filePath || typeof filePath !== 'string') return null;
  const trimmed = filePath.trim();
  if (
    trimmed === '' ||
    trimmed === '#' ||
    trimmed.toLowerCase() === 'null' ||
    trimmed.toLowerCase() === 'undefined'
  ) {
    return null;
  }

  // Direct absolute HTTP/HTTPS URL (Cloudinary storage)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Protocol-relative URL
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  // Cloudinary domain without leading protocol
  if (trimmed.includes('cloudinary.com') || trimmed.includes('res.cloudinary.com')) {
    return `https://${trimmed.replace(/^\/+/, '')}`;
  }

  // Fallback for relative paths served from the local backend
  const backendBase =
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5001';
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${backendBase}${cleanPath}`;
};
