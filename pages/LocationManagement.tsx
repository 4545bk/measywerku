import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import api from '../services/api';

interface Location {
    _id: string;
    name: string;
    description: string;
    lat: number;
    lng: number;
    slug: string;
    seoTitle?: string;
    seoDescription?: string;
    mapIframe?: string;
    propertyCount?: number;
}

export const LocationManagement = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const response = await api.locations.getAll();
            setLocations(response.data.locations);
        } catch (error) {
            console.error('Failed to load locations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this location?')) return;

        try {
            await api.locations.delete(id);
            setLocations(locations.filter(l => l._id !== id));
            alert('Location deleted successfully!');
        } catch (error: any) {
            alert('Failed to delete location: ' + error.message);
        }
    };

    const handleEdit = (location: Location) => {
        setEditingLocation(location);
        setShowForm(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading locations...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Location Management</h1>
                    <p className="text-slate-500 mt-1">Manage geographic areas and locations</p>
                </div>
                <button
                    onClick={() => {
                        setEditingLocation(null);
                        setShowForm(true);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Location</span>
                </button>
            </div>

            {/* Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((location) => (
                    <div key={location._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{location.name}</h3>
                                        <p className="text-xs text-slate-500">/{location.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => handleEdit(location)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(location._id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{location.description}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span>Coordinates:</span>
                                    <span className="font-mono text-xs">{location.lat}, {location.lng}</span>
                                </div>
                                {location.propertyCount !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Properties:</span>
                                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-bold">
                                            {location.propertyCount}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {locations.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    No locations found. Add your first location!
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <LocationForm
                    location={editingLocation}
                    onClose={() => {
                        setShowForm(false);
                        setEditingLocation(null);
                    }}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingLocation(null);
                        fetchLocations();
                    }}
                />
            )}
        </div>
    );
};

// Location Form Component
interface LocationFormProps {
    location: Location | null;
    onClose: () => void;
    onSuccess: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ location, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: location?.name || '',
        description: location?.description || '',
        lat: location?.lat?.toString() || '',
        lng: location?.lng?.toString() || '',
        slug: location?.slug || '',
        seoTitle: location?.seoTitle || '',
        seoDescription: location?.seoDescription || '',
        mapIframe: location?.mapIframe || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                name: formData.name,
                description: formData.description,
                lat: parseFloat(formData.lat),
                lng: parseFloat(formData.lng),
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
                seoTitle: formData.seoTitle,
                seoDescription: formData.seoDescription,
                mapIframe: formData.mapIframe
            };

            if (location) {
                await api.locations.update(location._id, data);
                alert('Location updated successfully!');
            } else {
                await api.locations.create(data);
                alert('Location created successfully!');
            }

            onSuccess();
        } catch (error: any) {
            alert(`Failed to ${location ? 'update' : 'create'} location: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 rounded-t-3xl">
                    <h2 className="text-2xl font-serif font-bold text-slate-900">
                        {location ? 'Edit Location' : 'Add New Location'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Location Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="e.g. Bole"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="Describe the area..."
                        />
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Latitude *</label>
                            <input
                                type="number"
                                step="any"
                                required
                                value={formData.lat}
                                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="e.g. 8.995"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Longitude *</label>
                            <input
                                type="number"
                                step="any"
                                required
                                value={formData.lng}
                                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="e.g. 38.788"
                            />
                        </div>
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="Auto-generated from name if empty"
                        />
                        <p className="text-xs text-slate-500 mt-1">URL: /properties/{formData.slug || 'location-slug'}</p>
                    </div>

                    {/* Google Maps Iframe */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Google Maps Iframe (Optional)</label>
                        <textarea
                            value={formData.mapIframe}
                            onChange={(e) => setFormData({ ...formData, mapIframe: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-mono text-xs"
                            placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            💡 Go to Google Maps → Share → Embed a map → Copy HTML code and paste here
                        </p>
                    </div>

                    {/* SEO Fields */}
                    <div className="border-t border-slate-200 pt-6">
                        <h3 className="text-sm font-bold text-slate-700 mb-4">SEO Optimization (Optional)</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">SEO Title</label>
                                <input
                                    type="text"
                                    maxLength={60}
                                    value={formData.seoTitle}
                                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="Luxury Properties in Bole - Addis Ababa"
                                />
                                <p className="text-xs text-slate-500 mt-1">{formData.seoTitle.length}/60 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">SEO Description</label>
                                <textarea
                                    maxLength={160}
                                    value={formData.seoDescription}
                                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="Discover premium properties in..."
                                />
                                <p className="text-xs text-slate-500 mt-1">{formData.seoDescription.length}/160 characters</p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center space-x-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold disabled:opacity-50"
                        >
                            {loading ? (location ? 'Updating...' : 'Creating...') : (location ? 'Update Location' : 'Create Location')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
