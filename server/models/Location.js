import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Location name is required'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    lat: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
    },
    lng: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    seoTitle: {
        type: String,
        maxlength: [60, 'SEO title should not exceed 60 characters']
    },
    seoDescription: {
        type: String,
        maxlength: [160, 'SEO description should not exceed 160 characters']
    },
    mapIframe: {
        type: String,
        default: null,
        trim: true
    }
}, {
    timestamps: true
});

// Auto-generate slug from name if not provided
locationSchema.pre('save', function (next) {
    if (!this.slug && this.name) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }
    next();
});

export default mongoose.model('Location', locationSchema);
