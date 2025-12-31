import express from 'express';
import Location from '../models/Location.js';
import Property from '../models/Property.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/locations
 * @desc    Get all locations
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find().sort({ name: 1 });

        // Optionally include property count for each location
        const locationsWithCount = await Promise.all(
            locations.map(async (location) => {
                const propertyCount = await Property.countDocuments({
                    locationId: location._id,
                    status: 'active'
                });

                return {
                    ...location.toObject(),
                    propertyCount
                };
            })
        );

        res.json({
            success: true,
            count: locations.length,
            data: { locations: locationsWithCount }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch locations',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/locations/:slug
 * @desc    Get location by slug with properties
 * @access  Public
 */
router.get('/:slug', async (req, res) => {
    try {
        const location = await Location.findOne({ slug: req.params.slug });

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        // Get properties in this location
        const properties = await Property.find({
            locationId: location._id,
            status: 'active'
        }).sort({ featured: -1, createdAt: -1 });

        res.json({
            success: true,
            data: {
                location,
                properties
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch location',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/locations
 * @desc    Create new location (Admin only)
 * @access  Private/Admin
 */
router.post('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, description, lat, lng, slug, seoTitle, seoDescription, mapIframe } = req.body;

        const location = await Location.create({
            name,
            description,
            lat,
            lng,
            slug,
            seoTitle,
            seoDescription,
            mapIframe
        });

        res.status(201).json({
            success: true,
            message: 'Location created successfully',
            data: { location }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Location name or slug already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create location',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/locations/:id
 * @desc    Update location (Admin only)
 * @access  Private/Admin
 */
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        res.json({
            success: true,
            message: 'Location updated successfully',
            data: { location }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update location',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/locations/:id
 * @desc    Delete location (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        // Check if location has properties
        const propertyCount = await Property.countDocuments({ locationId: req.params.id });

        if (propertyCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete location. ${propertyCount} properties are using this location.`
            });
        }

        const location = await Location.findByIdAndDelete(req.params.id);

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        res.json({
            success: true,
            message: 'Location deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete location',
            error: error.message
        });
    }
});

export default router;
