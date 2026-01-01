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
    } catch (error) {
        console.error('❌ MongoDB error:', error.message);
        throw error;
    }
}

// Get all properties handler
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

        // Build query from filters
        const query = {};

        if (req.query.type) {
            query.type = req.query.type;
        }

        if (req.query.purpose) {
            query.purpose = req.query.purpose;
        }

        if (req.query.locationId) {
            query.locationId = req.query.locationId;
        }

        if (req.query.status) {
            query.status = req.query.status;
        } else {
            // Default to active properties only
            query.status = 'active';
        }

        // Find properties and populate location
        const properties = await Property.find(query)
            .populate('locationId', 'name slug description lat lng mapIframe')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: { properties }
        });

    } catch (error) {
        console.error('Get properties error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
