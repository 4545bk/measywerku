import multer from 'multer';
import path from 'path';

// Memory storage - files stored as Buffer in memory
const storage = multer.memoryStorage();

// File filter - allow images and videos
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|mov|avi|wmv|flv|mkv|webm/;
    const extname = path.extname(file.originalname).toLowerCase();
    const isImage = allowedImageTypes.test(extname) && file.mimetype.startsWith('image/');
    const isVideo = allowedVideoTypes.test(extname) && file.mimetype.startsWith('video/');

    if (isImage || isVideo) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max file size (for videos)
    }
});

// Export upload middleware
export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 10); // Max 10 images
export const uploadVideo = upload.single('video'); // Single video upload
export const uploadMixed = upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 1 }
]);

/**
 * Convert buffer to base64 for Cloudinary upload
 */
export const bufferToBase64 = (buffer, mimetype) => {
    return `data:${mimetype};base64,${buffer.toString('base64')}`;
};

export default upload;
