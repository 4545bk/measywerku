import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {string} file - Base64 string or file path
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} Upload result with URL and public_id
 */
export const uploadImage = async (file, folder = 'homezy/properties') => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: 'auto',
            transformation: [
                { width: 1200, height: 800, crop: 'fill', quality: 'auto:good' }
            ]
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height
        };
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

/**
 * Upload multiple images
 * @param {Array} files - Array of files to upload
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadMultipleImages = async (files, folder = 'homezy/properties') => {
    try {
        const uploadPromises = files.map(file => uploadImage(file, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        throw new Error(`Multiple upload failed: ${error.message}`);
    }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<Object>} Deletion result
 */
export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error(`Cloudinary deletion failed: ${error.message}`);
    }
};

/**
 * Delete multiple images
 * @param {Array} publicIds - Array of public IDs
 * @returns {Promise<Array>} Array of deletion results
 */
export const deleteMultipleImages = async (publicIds) => {
    try {
        const deletePromises = publicIds.map(id => deleteImage(id));
        return await Promise.all(deletePromises);
    } catch (error) {
        throw new Error(`Multiple deletion failed: ${error.message}`);
    }
};

/**
 * Upload video to Cloudinary
 * @param {string} file - Base64 string or file path
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} Upload result with URL and public_id
 */
export const uploadVideo = async (file, folder = 'homezy/videos') => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: 'video',
            transformation: [
                { quality: 'auto:good', fetch_format: 'auto' }
            ]
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
            duration: result.duration,
            format: result.format
        };
    } catch (error) {
        throw new Error(`Cloudinary video upload failed: ${error.message}`);
    }
};

/**
 * Delete video from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<Object>} Deletion result
 */
export const deleteVideo = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'video'
        });
        return result;
    } catch (error) {
        throw new Error(`Cloudinary video deletion failed: ${error.message}`);
    }
};

export default cloudinary;
