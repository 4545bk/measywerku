import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
    // Contact Information
    businessName: {
        type: String,
        required: true,
        default: 'Mesay Real Estate'
    },
    tagline: {
        type: String,
        default: 'Your Trusted Partner in Prime Real Estate'
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String
    },
    address: {
        type: String,
        required: true
    },

    // Map Settings
    mapLat: {
        type: Number,
        default: 8.9806
    },
    mapLng: {
        type: Number,
        default: 38.7578
    },
    mapZoom: {
        type: Number,
        default: 13
    },

    // Social Media
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    telegram: String,

    // Business Hours
    hoursText: {
        type: String,
        default: 'Open 24 Hours'
    },
    hoursDetail: {
        type: String,
        default: 'Monday–Sunday: Open 24 hours'
    },

    // About/Description
    aboutText: {
        type: String,
        default: 'We are a trusted real estate agency providing premium properties in Addis Ababa.'
    },
    contactText: {
        type: String,
        default: 'We would love to hear from you. Reach out to us for any inquiries.'
    },
    locationsText: {
        type: String,
        default: 'Explore our premier locations across Addis Ababa.'
    },

    // Property Types (can be customized)
    propertyTypes: {
        type: [String],
        default: ['Apartment', 'Villa', 'Commercial', 'Consultancy']
    },

    // Services Offered
    services: {
        type: [String],
        default: ['Property Sales', 'Property Leasing', 'Investment Consultation']
    },

    // Navigation Menu
    navigation: {
        type: [{
            label: { type: String, required: true },
            path: { type: String, required: true },
            order: { type: Number, default: 0 }
        }],
        default: [
            { label: 'Home', path: '/', order: 1 },
            { label: 'Properties', path: '/properties', order: 2 },
            { label: 'Locations', path: '/locations', order: 3 },
            { label: 'About', path: '/about', order: 4 }
        ]
    },

    // SEO Settings
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],

    // Single document pattern - only one settings document
    _id: {
        type: String,
        default: 'site-settings'
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
siteSettingsSchema.pre('save', function (next) {
    this._id = 'site-settings';
    next();
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
