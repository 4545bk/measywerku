import express from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET site settings (public)
router.get('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findById('site-settings');

        // Create default settings if none exist
        if (!settings) {
            settings = await SiteSettings.create({});
        }

        res.json({
            success: true,
            data: { settings }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// UPDATE site settings (admin only)
router.put('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const settings = await SiteSettings.findByIdAndUpdate(
            'site-settings',
            req.body,
            { new: true, upsert: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: { settings }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// ADD property type (admin only)
router.post('/property-types', authenticate, requireAdmin, async (req, res) => {
    try {
        const { type } = req.body;

        const settings = await SiteSettings.findById('site-settings');
        if (!settings.propertyTypes.includes(type)) {
            settings.propertyTypes.push(type);
            await settings.save();
        }

        res.json({
            success: true,
            message: 'Property type added',
            data: { propertyTypes: settings.propertyTypes }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// REMOVE property type (admin only)
router.delete('/property-types/:type', authenticate, requireAdmin, async (req, res) => {
    try {
        const { type } = req.params;

        const settings = await SiteSettings.findById('site-settings');
        settings.propertyTypes = settings.propertyTypes.filter(t => t !== type);
        await settings.save();

        res.json({
            success: true,
            message: 'Property type removed',
            data: { propertyTypes: settings.propertyTypes }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// ADD service (admin only)
router.post('/services', authenticate, requireAdmin, async (req, res) => {
    try {
        const { service } = req.body;

        const settings = await SiteSettings.findById('site-settings');
        if (!settings.services.includes(service)) {
            settings.services.push(service);
            await settings.save();
        }

        res.json({
            success: true,
            message: 'Service added',
            data: { services: settings.services }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// REMOVE service (admin only)
router.delete('/services/:service', authenticate, requireAdmin, async (req, res) => {
    try {
        const { service } = req.params;

        const settings = await SiteSettings.findById('site-settings');
        settings.services = settings.services.filter(s => s !== service);
        await settings.save();

        res.json({
            success: true,
            message: 'Service removed',
            data: { services: settings.services }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
