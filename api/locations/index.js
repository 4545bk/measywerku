import mongoose from 'mongoose';

// Location Schema
const locationSchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    lat: Number,
    lng: Number,
    mapIframe: String,
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String]
}, { timestamps: true });

const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);

// MongoDB connection
let isConnected = false;
async function connectDB() {
    if (isConnected) return;

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI not set');

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = true;
    } catch (error) {
        console.error('❌ MongoDB error:', error.message);
        throw error;
    }
}

// Get all locations handler
export default async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        // Connect to DB
        await connectDB();

        // Find all locations
        const locations = await Location.find().sort({ name: 1 });

        return res.status(200).json({
            success: true,
            data: { locations }
        });

    } catch (error) {
        console.error('Get locations error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
