import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X, Play, Upload } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';

interface Property {
    _id: string;
    title: string;
    description: string;
    price: number;
    type: string;
    purpose: string;
    bedrooms: number;
    bathrooms: number;
    size: number;
    locationId: {
        _id: string;
        name: string;
    };
    amenities: string[];
    images: { url: string; isPrimary: boolean }[];
    featured: boolean;
    status: string;
}

export const PropertyManagement = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [propertyTypes, setPropertyTypes] = useState<string[]>(['Apartment', 'Villa', 'Commercial', 'Consultancy']);
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchProperties();
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.settings.get();
            if (response.data.settings.propertyTypes) {
                setPropertyTypes(response.data.settings.propertyTypes);
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await api.properties.getAll();
            setProperties(response.data.properties);
        } catch (error) {
            // ... existing fetchProperties error handling ...
            showError('Failed to load properties');
            console.error('Failed to load properties:', error);
        } finally {
            setLoading(false);
        }
    };

    // ... existing code ...



    const handleEdit = (property: Property) => {
        setEditingProperty(property);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        // Using native confirm for now - can be replaced with a custom modal
        if (!confirm('Are you sure you want to delete this property?')) return;

        try {
            await api.properties.delete(id);
            setProperties(properties.filter(p => p._id !== id));
            showSuccess('Property deleted successfully!');
        } catch (error: any) {
            showError('Failed to delete property: ' + error.message);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProperty(null);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingProperty(null);
        fetchProperties();
    };

    const filteredProperties = properties.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.locationId?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'All' || p.type === selectedType;
        return matchesSearch && matchesType;
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-ET', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading properties...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Property Management</h1>
                    <p className="text-slate-500 mt-1">Manage your property listings</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Property</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-3 pb-2 overflow-x-auto">
                {['All', ...propertyTypes].map((type) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${selectedType === type
                            ? 'bg-amber-600 text-white shadow-lg'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-500'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Property List */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Property</th>
                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Price</th>
                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Type</th>
                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Location</th>
                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Details</th>
                                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProperties.map((property) => (
                                <tr key={property._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={property.images.find(img => img.isPrimary)?.url || property.images[0]?.url}
                                                alt={property.title}
                                                className="w-16 h-16 rounded-xl object-cover"
                                            />
                                            <div>
                                                <div className="font-bold text-slate-900">{property.title}</div>
                                                {property.featured && (
                                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Featured</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">{formatPrice(property.price)}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                                            {property.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{property.locationId?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {property.bedrooms} bed • {property.bathrooms} bath • {property.size} sqm
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${property.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {property.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleEdit(property)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                                                title="Edit property"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(property._id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                title="Delete property"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden divide-y divide-slate-100">
                    {filteredProperties.map((property) => (
                        <div key={property._id} className="p-4 hover:bg-slate-50 transition-colors">
                            {/* Property Image and Title */}
                            <div className="flex items-start space-x-3 mb-3">
                                <img
                                    src={property.images.find(img => img.isPrimary)?.url || property.images[0]?.url}
                                    alt={property.title}
                                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 text-sm mb-1 truncate">{property.title}</h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {property.featured && (
                                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Featured</span>
                                        )}
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${property.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {property.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Property Details Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <div className="text-xs text-slate-500 font-semibold mb-1">Price</div>
                                    <div className="font-bold text-slate-900 text-sm">{formatPrice(property.price)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-semibold mb-1">Type</div>
                                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-semibold inline-block">
                                        {property.type}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-semibold mb-1">Location</div>
                                    <div className="text-sm text-slate-600 truncate">{property.locationId?.name || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-semibold mb-1">Details</div>
                                    <div className="text-xs text-slate-600">
                                        {property.bedrooms} bed • {property.bathrooms} bath
                                    </div>
                                    <div className="text-xs text-slate-600">{property.size} sqm</div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                <button
                                    onClick={() => handleEdit(property)}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-100 transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(property._id)}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProperties.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        No properties found
                    </div>
                )}
            </div>

            {/* Property Form Modal */}
            {showForm && (
                <PropertyForm
                    property={editingProperty}
                    onClose={handleCloseForm}
                    onSuccess={handleFormSuccess}
                    propertyTypes={propertyTypes}
                />
            )}
        </div>
    );
};

// Property Form Component
interface PropertyFormProps {
    property?: Property | null;
    onClose: () => void;
    onSuccess: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<any[]>([]);
    const { showSuccess, showError } = useToast();

    const [formData, setFormData] = useState({
        title: property?.title || '',
        description: property?.description || '',
        price: property?.price?.toString() || '',
        size: property?.size?.toString() || '',
        bedrooms: property?.bedrooms?.toString() || '',
        bathrooms: property?.bathrooms?.toString() || '',
        type: property?.type || 'Apartment',
        purpose: property?.purpose || 'Sale',
        locationId: property?.locationId?._id || '',
        amenities: property?.amenities?.join(', ') || '',
        videoUrl: property?.videoUrl || '',
        featured: property?.featured || false
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState(property?.images || []);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [existingVideo, setExistingVideo] = useState(property?.video?.url || null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await api.locations.getAll();
            setLocations(response.data.locations);
        } catch (error) {
            showError('Failed to load locations');
        }
    };

    const handleRemoveExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!property && imageFiles.length === 0) {
            showError('Please select at least one image');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('size', formData.size);
            data.append('bedrooms', formData.bedrooms);
            data.append('bathrooms', formData.bathrooms);
            data.append('type', formData.type);
            data.append('purpose', formData.purpose);
            data.append('locationId', formData.locationId);
            data.append('featured', formData.featured.toString());

            // Parse amenities
            const amenitiesArray = formData.amenities.split(',').map(a => a.trim()).filter(Boolean);
            data.append('amenities', JSON.stringify(amenitiesArray));

            // Add video URL if provided (and no file upload)
            if (formData.videoUrl && !videoFile) {
                data.append('videoUrl', formData.videoUrl);
            }

            // Add video file if provided (takes priority over URL)
            if (videoFile) {
                data.append('video', videoFile);
            }

            // Add new images
            imageFiles.forEach(file => {
                data.append('images', file);
            });

            // If editing, include existing images
            if (property) {
                data.append('existingImages', JSON.stringify(existingImages));
            }

            if (property) {
                await api.properties.update(property._id, data);
                showSuccess('Property updated successfully!', 'Success');
            } else {
                await api.properties.create(data);
                showSuccess('Property created successfully!', 'Success');
            }

            onSuccess();
        } catch (error: any) {
            showError(
                property ? 'Failed to update property' : 'Failed to create property',
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 rounded-t-3xl flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-bold text-slate-900">
                        {property ? 'Edit Property' : 'Add New Property'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Property Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="e.g. Luxury Penthouse with City View"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="Describe the property..."
                        />
                    </div>

                    {/* Grid Row 1 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Price (ETB) *</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Size (sqm) *</label>
                            <input
                                type="number"
                                required
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Grid Row 2 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Bedrooms *</label>
                            <input
                                type="number"
                                required
                                value={formData.bedrooms}
                                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Bathrooms *</label>
                            <input
                                type="number"
                                required
                                value={formData.bathrooms}
                                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Grid Row 3 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Property Type *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            >
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Consultancy">Consultancy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Purpose *</label>
                            <select
                                value={formData.purpose}
                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            >
                                <option value="Sale">Sale</option>
                                <option value="Rent">Rent</option>
                                <option value="Investment">Investment</option>
                            </select>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Location *</label>
                        <select
                            required
                            value={formData.locationId}
                            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                        >
                            <option value="">Select location...</option>
                            {locations.map(loc => (
                                <option key={loc._id} value={loc._id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Amenities */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Amenities (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.amenities}
                            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="e.g. 24/7 Security, Gym, Swimming Pool"
                        />
                    </div>

                    {/* Existing Images (when editing) */}
                    {property && existingImages.length > 0 && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Current Images</label>
                            <div className="grid grid-cols-4 gap-3">
                                {existingImages.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img src={img.url} alt="" className="w-full h-24 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(index)}
                                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {img.isPrimary && (
                                            <span className="absolute bottom-1 left-1 bg-amber-600 text-white text-xs px-2 py-0.5 rounded">Primary</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Images */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            {property ? 'Add New Images (Optional)' : 'Property Images * (Max 10)'}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {imageFiles.length} new file(s) selected
                        </p>
                    </div>

                    {/* Video URL */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Property Video URL (Optional)</label>
                        <input
                            type="url"
                            value={formData.videoUrl}
                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="https://youtube.com/... or https://vimeo.com/..."
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Add a YouTube, Vimeo, or direct video link to showcase the property
                        </p>
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    {/* Video File Upload */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Upload Property Video (Optional)
                        </label>

                        {/* Existing Video Display */}
                        {existingVideo && !videoFile && (
                            <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <Play className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Current Video</p>
                                            <p className="text-xs text-slate-500">Video uploaded</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setExistingVideo(null)}
                                        className="text-red-600 hover:text-red-700 text-sm font-bold"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Video File Preview */}
                        {videoFile && (
                            <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Upload className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{videoFile.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setVideoFile(null)}
                                        className="text-red-600 hover:text-red-700 text-sm font-bold"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        {!videoFile && (
                            <div>
                                <input
                                    type="file"
                                    id="video-upload"
                                    accept="video/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 100 * 1024 * 1024) {
                                                showError('Video file must be less than 100MB');
                                                return;
                                            }
                                            setVideoFile(file);
                                            // Clear URL if file is selected
                                            setFormData({ ...formData, videoUrl: '' });
                                        }
                                    }}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="video-upload"
                                    className="block w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all"
                                >
                                    <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">
                                        Click to upload video file
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">
                                        MP4, MOV, AVI, WEBM (Max 100MB)
                                    </p>
                                </label>
                            </div>
                        )}

                        <p className="text-xs text-slate-500 mt-2">
                            💡 Tip: Upload a video file directly to Cloudinary storage, or use a video URL above
                        </p>
                    </div>

                    {/* Featured */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor="featured" className="text-sm font-bold text-slate-700">
                            Mark as Featured Property
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center space-x-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold disabled:opacity-50 transition-all"
                        >
                            {loading ? (property ? 'Updating...' : 'Creating...') : (property ? 'Update Property' : 'Create Property')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
