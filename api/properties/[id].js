import mongoose from 'mongoose';

// Property Schema (inline)
const propertySchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    type: String,
    purpose: String,
    bedrooms: Number,
    bathrooms: Number,
    size: Number,
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    amenities: [String],
    images: [{ url: String, isPrimary: Boolean }],
    videoUrl: String,
    featured: Boolean,
    status: String,
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 }
}, { timestamps: true });

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

// Location Schema (for population)
const locationSchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    lat: Number,
    lng: Number,
    mapIframe: String
});

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
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB error:', error.message);
        throw error;
    }
}

// Get property by ID handler
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

        // Extract ID from URL
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Property ID required'
            });
        }

        // Find property and populate location with mapIframe
        const property = await Property.findById(id)
            .populate('locationId', 'name slug description lat lng mapIframe');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Increment views
        property.views = (property.views || 0) + 1;
        await property.save();

        return res.status(200).json({
            success: true,
            data: { property }
        });

    } catch (error) {
        console.error('Get property error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
