import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  size: {
    type: Number,
    required: [true, 'Size is required'],
    min: [1, 'Size must be at least 1 sqm']
  },
  bedrooms: {
    type: Number,
    required: true,
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: true,
    min: [0, 'Bathrooms cannot be negative']
  },
  amenities: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    enum: ['Apartment', 'Villa', 'Commercial', 'Consultancy'],
    required: [true, 'Property type is required']
  },
  purpose: {
    type: String,
    enum: ['Sale', 'Rent', 'Investment'],
    required: [true, 'Property purpose is required']
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: [true, 'Location is required']
  },
  images: {
    type: [{
      url: String,
      publicId: String,
      isPrimary: { type: Boolean, default: false }
    }],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  video: {
    url: { type: String, default: null },
    publicId: { type: String, default: null }
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  inquiries: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
propertySchema.index({ type: 1, purpose: 1, locationId: 1 });
propertySchema.index({ featured: 1, createdAt: -1 });
propertySchema.index({ price: 1 });

// Virtual for location details
propertySchema.virtual('location', {
  ref: 'Location',
  localField: 'locationId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.model('Property', propertySchema);
