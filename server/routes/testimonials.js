import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC: Submit testimonial
router.post('/submit', async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, rating, review, propertyType } = req.body;

        // Get IP address for spam prevention
        const ipAddress = req.ip || req.connection.remoteAddress;

        const testimonial = await Testimonial.create({
            customerName,
            customerEmail,
            customerPhone,
            rating,
            review,
            propertyType,
            ipAddress,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback! Your testimonial is being reviewed.',
            data: { testimonial }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// PUBLIC: Get approved testimonials
router.get('/approved', async (req, res) => {
    try {
        const { limit = 10, featured } = req.query;

        const query = { status: 'approved' };
        if (featured === 'true') {
            query.featured = true;
        }

        const testimonials = await Testimonial.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: { testimonials, count: testimonials.length }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ADMIN: Get all testimonials (with filters)
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
    try {
        const { status } = req.query;

        const query = {};
        if (status) {
            query.status = status;
        }

        const testimonials = await Testimonial.find(query)
            .sort({ createdAt: -1 });

        const stats = {
            total: await Testimonial.countDocuments(),
            pending: await Testimonial.countDocuments({ status: 'pending' }),
            approved: await Testimonial.countDocuments({ status: 'approved' }),
            rejected: await Testimonial.countDocuments({ status: 'rejected' }),
            featured: await Testimonial.countDocuments({ featured: true })
        };

        res.json({
            success: true,
            data: { testimonials, stats }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ADMIN: Update testimonial status
router.patch('/admin/:id/status', authenticate, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({
            success: true,
            message: `Testimonial ${status}`,
            data: { testimonial }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// ADMIN: Toggle featured
router.patch('/admin/:id/featured', authenticate, requireAdmin, async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        testimonial.featured = !testimonial.featured;
        await testimonial.save();

        res.json({
            success: true,
            message: testimonial.featured ? 'Testimonial featured' : 'Testimonial unfeatured',
            data: { testimonial }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// ADMIN: Delete testimonial
router.delete('/admin/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Testimonial deleted'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
