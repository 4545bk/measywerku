import express from 'express';
import Property from '../models/Property.js';
import Location from '../models/Location.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { uploadMixed, bufferToBase64 } from '../middleware/upload.js';
import { uploadMultipleImages, deleteMultipleImages, uploadVideo, deleteVideo } from '../config/cloudinary.js';

const router = express.Router();

/**
 * @route   GET /api/properties
 * @desc    Get all properties with filters
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { type, purpose, location, minPrice, maxPrice, bedrooms, featured, limit } = req.query;

        // Build query
        let query = { status: 'active' };

        if (type) query.type = type;
        if (purpose) query.purpose = purpose;
        if (bedrooms) query.bedrooms = Number(bedrooms);
        if (featured === 'true') query.featured = true;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Handle location filter (by slug or ID)
        if (location) {
            const locationDoc = await Location.findOne({ slug: location });
            if (locationDoc) {
                query.locationId = locationDoc._id;
            }
        }

        let queryBuilder = Property.find(query)
            .populate('locationId', 'name slug description lat lng')
            .sort({ featured: -1, createdAt: -1 });

        if (limit) {
            queryBuilder = queryBuilder.limit(Number(limit));
        }

        const properties = await queryBuilder;

        res.json({
            success: true,
            count: properties.length,
            data: { properties }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch properties',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/properties/:id
 * @desc    Get single property by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('locationId', 'name slug description lat lng mapIframe');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Increment views
        property.views += 1;
        await property.save();

        res.json({
            success: true,
            data: { property }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch property',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/properties
 * @desc    Create new property (Admin only)
 * @access  Private/Admin
 */
router.post('/', authenticate, requireAdmin, uploadMixed, async (req, res) => {
    try {
        const {
            title, description, price, size, bedrooms, bathrooms,
            amenities, type, purpose, locationId, featured
        } = req.body;

        // Validate required files
        if (!req.files || !req.files.images || req.files.images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one image is required'
            });
        }

        // Upload images to Cloudinary
        const imageBuffers = req.files.images.map(file =>
            bufferToBase64(file.buffer, file.mimetype)
        );

        const uploadedImages = await uploadMultipleImages(imageBuffers);

        const images = uploadedImages.map((img, index) => ({
            url: img.url,
            publicId: img.publicId,
            isPrimary: index === 0
        }));

        // Upload video if provided
        let video = { url: null, publicId: null };
        if (req.files.video && req.files.video[0]) {
            const videoBuffer = bufferToBase64(req.files.video[0].buffer, req.files.video[0].mimetype);
            const uploadedVideo = await uploadVideo(videoBuffer);
            video = {
                url: uploadedVideo.url,
                publicId: uploadedVideo.publicId
            };
        }

        // Create property
        const property = await Property.create({
            title,
            description,
            price: Number(price),
            size: Number(size),
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            amenities: Array.isArray(amenities) ? amenities : JSON.parse(amenities || '[]'),
            type,
            purpose,
            locationId,
            images,
            video,
            featured: featured === 'true'
        });

        const populatedProperty = await Property.findById(property._id)
            .populate('locationId');

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: { property: populatedProperty }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create property',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/properties/:id
 * @desc    Update property (Admin only)
 * @access  Private/Admin
 */
router.put('/:id', authenticate, requireAdmin, uploadMixed, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Handle new image uploads if provided
        let updatedImages = property.images;

        if (req.files && req.files.images && req.files.images.length > 0) {
            // Delete old images from Cloudinary
            const oldPublicIds = property.images.map(img => img.publicId);
            await deleteMultipleImages(oldPublicIds);

            // Upload new images
            const imageBuffers = req.files.images.map(file =>
                bufferToBase64(file.buffer, file.mimetype)
            );

            const uploadedImages = await uploadMultipleImages(imageBuffers);

            updatedImages = uploadedImages.map((img, index) => ({
                url: img.url,
                publicId: img.publicId,
                isPrimary: index === 0
            }));
        }

        // Handle video upload/update
        let updatedVideo = property.video || { url: null, publicId: null };

        // If new video file uploaded
        if (req.files && req.files.video && req.files.video[0]) {
            // Delete old video from Cloudinary if exists
            if (property.video && property.video.publicId) {
                await deleteVideo(property.video.publicId);
            }

            // Upload new video
            const videoBuffer = bufferToBase64(req.files.video[0].buffer, req.files.video[0].mimetype);
            const uploadedVideo = await uploadVideo(videoBuffer);
            updatedVideo = {
                url: uploadedVideo.url,
                publicId: uploadedVideo.publicId
            };
        }
        // If video URL provided instead
        else if (req.body.videoUrl) {
            updatedVideo = { url: req.body.videoUrl, publicId: null };
        }

        // Update fields
        const updates = { ...req.body };
        if (updates.amenities && typeof updates.amenities === 'string') {
            updates.amenities = JSON.parse(updates.amenities);
        }

        updates.images = updatedImages;
        updates.video = updatedVideo;

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).populate('locationId');

        res.json({
            success: true,
            message: 'Property updated successfully',
            data: { property: updatedProperty }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update property',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete property (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Delete images from Cloudinary
        const publicIds = property.images.map(img => img.publicId);
        await deleteMultipleImages(publicIds);

        // Delete property
        await property.deleteOne();

        res.json({
            success: true,
            message: 'Property deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete property',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/properties/:id/inquire
 * @desc    Increment inquiry count
 * @access  Public
 */
router.post('/:id/inquire', async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { $inc: { inquiries: 1 } },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        res.json({
            success: true,
            message: 'Inquiry recorded',
            data: { inquiries: property.inquiries }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to record inquiry',
            error: error.message
        });
    }
});

export default router;
