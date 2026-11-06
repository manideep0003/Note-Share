import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Validates Cloudinary environment variables
 */
export const validateCloudinaryConfig = () => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary environment credentials are missing or incomplete');
  }
};

/**
 * Uploads a PDF buffer to Cloudinary in the noteshare/notes folder
 * @param {Buffer} buffer - File buffer from Multer memory storage
 * @param {string} [originalName] - Original filename for reference
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadPDFToCloudinary = (buffer, originalName = 'note.pdf') => {
  validateCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'noteshare/notes',
        resource_type: 'raw',
        format: 'pdf',
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Deletes an asset from Cloudinary using its public_id
 * @param {string} publicId - The Cloudinary public_id of the asset
 * @param {string} [resourceType='raw'] - Cloudinary resource type
 * @returns {Promise<any>}
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'raw') => {
  validateCloudinaryConfig();
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true
  });
};

export default cloudinary;

