import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    customerPhone: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true,
        trim: true
    },
    propertyType: {
        type: String
    },
    // Status for moderation
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // For featured testimonials
    featured: {
        type: Boolean,
        default: false
    },
    // IP address for spam prevention
    ipAddress: String
}, {
    timestamps: true
});

// Index for efficient queries
testimonialSchema.index({ status: 1, createdAt: -1 });
testimonialSchema.index({ featured: 1, rating: -1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
