import express from 'express';
import Property from '../models/Property.js';
import Location from '../models/Location.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/analytics/overview
 * @desc    Get analytics overview (Admin only)
 * @access  Private/Admin
 */
router.get('/overview', authenticate, requireAdmin, async (req, res) => {
    try {
        // Total counts
        const totalProperties = await Property.countDocuments({ status: 'active' });
        const totalLocations = await Location.countDocuments();

        // Total views and inquiries
        const stats = await Property.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$views' },
                    totalInquiries: { $sum: '$inquiries' }
                }
            }
        ]);

        const { totalViews = 0, totalInquiries = 0 } = stats[0] || {};

        // Properties by type
        const propertiesByType = await Property.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$price' }
                }
            }
        ]);

        // Properties by purpose
        const propertiesByPurpose = await Property.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$purpose',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Properties by location
        const propertiesByLocation = await Property.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$locationId',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'locations',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'location'
                }
            },
            { $unwind: '$location' },
            {
                $project: {
                    locationName: '$location.name',
                    count: 1
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Top performing properties (by views)
        const topByViews = await Property.find({ status: 'active' })
            .sort({ views: -1 })
            .limit(5)
            .select('title price type views inquiries')
            .populate('locationId', 'name');

        // High conversion properties (by inquiry ratio)
        const highConversion = await Property.find({
            status: 'active',
            views: { $gt: 0 }
        })
            .select('title price type views inquiries')
            .populate('locationId', 'name')
            .lean();

        const conversionRates = highConversion.map(prop => ({
            ...prop,
            conversionRate: ((prop.inquiries / prop.views) * 100).toFixed(2)
        }))
            .sort((a, b) => b.conversionRate - a.conversionRate)
            .slice(0, 5);

        // Weekly traffic (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyTraffic = await Property.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    properties: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalProperties,
                    totalLocations,
                    totalViews,
                    totalInquiries,
                    conversionRate: totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(2) : 0
                },
                distribution: {
                    byType: propertiesByType,
                    byPurpose: propertiesByPurpose,
                    byLocation: propertiesByLocation
                },
                performance: {
                    topByViews,
                    highConversion: conversionRates
                },
                traffic: {
                    weekly: weeklyTraffic
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/analytics/property/:id
 * @desc    Get analytics for specific property (Admin only)
 * @access  Private/Admin
 */
router.get('/property/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('locationId', 'name');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Calculate metrics
        const conversionRate = property.views > 0
            ? ((property.inquiries / property.views) * 100).toFixed(2)
            : 0;

        // Compare with similar properties
        const similarProps = await Property.find({
            type: property.type,
            _id: { $ne: property._id },
            status: 'active'
        }).select('views inquiries');

        const avgViews = similarProps.reduce((sum, p) => sum + p.views, 0) / (similarProps.length || 1);
        const avgInquiries = similarProps.reduce((sum, p) => sum + p.inquiries, 0) / (similarProps.length || 1);

        res.json({
            success: true,
            data: {
                property: {
                    id: property._id,
                    title: property.title,
                    type: property.type,
                    price: property.price
                },
                metrics: {
                    views: property.views,
                    inquiries: property.inquiries,
                    conversionRate
                },
                comparison: {
                    avgViews: Math.round(avgViews),
                    avgInquiries: Math.round(avgInquiries),
                    viewsPerformance: property.views > avgViews ? 'above' : 'below',
                    inquiriesPerformance: property.inquiries > avgInquiries ? 'above' : 'below'
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch property analytics',
            error: error.message
        });
    }
});

export default router;
