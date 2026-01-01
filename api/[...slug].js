import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import routes
import authRoutes from '../server/routes/auth.js';
import propertyRoutes from '../server/routes/properties.js';
import locationRoutes from '../server/routes/locations.js';
import analyticsRoutes from '../server/routes/analytics.js';
import settingsRoutes from '../server/routes/settings.js';
import testimonialRoutes from '../server/routes/testimonials.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB (only once)
let isConnected = false;
async function connectDB() {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Ghion Homes API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/testimonials', testimonialRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Vercel serverless handler
export default async (req, res) => {
    try {
        // Connect to database
        await connectDB();

        // Let Express handle the request
        return app(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
