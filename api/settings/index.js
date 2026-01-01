import mongoose from 'mongoose';

// SiteSettings Schema
const siteSettingsSchema = new mongoose.Schema({
    businessName: String,
    tagline: String,
    description: String,
    email: String,
    phone: String,
    address: String,
    socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String
    },
    propertyTypes: [String],
    services: [String],
    aboutText: String,
    contactText: String,
    locationsText: String
}, { timestamps: true });

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);

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

// Get settings handler
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

        // Find settings (there should only be one document)
        let settings = await SiteSettings.findOne();

        // If no settings exist, create default
        if (!settings) {
            settings = await SiteSettings.create({
                businessName: 'Ghion Homes',
                tagline: 'Premium Real Estate in Addis Ababa',
                description: 'Your trusted partner for luxury properties',
                email: 'info@ghionhomes.com',
                phone: '+251 11 123 4567',
                address: 'Addis Ababa, Ethiopia',
                propertyTypes: ['Apartment', 'Villa', 'Commercial', 'Consultancy'],
                services: ['Property Sales', 'Rentals', 'Consultancy'],
                aboutText: 'Welcome to Ghion Homes',
                contactText: 'Get in touch with us',
                locationsText: 'Explore our locations'
            });
        }

        return res.status(200).json({
            success: true,
            data: { settings }
        });

    } catch (error) {
        console.error('Get settings error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
