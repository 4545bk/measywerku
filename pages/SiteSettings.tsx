import React, { useState, useEffect } from 'react';
import { Save, Plus, X, MapPin, Phone, Mail, Globe, Clock, Menu, ArrowUp, ArrowDown, LayoutDashboard } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';

export const SiteSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<any>({});
    const [newPropertyType, setNewPropertyType] = useState('');
    const [newService, setNewService] = useState('');
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.settings.get();
            setSettings(response.data.settings);
        } catch (error) {
            console.error('Failed to load settings:', error);
            showError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };



    const handleSave = async () => {
        try {
            setSaving(true);
            await api.settings.update(settings);
            showSuccess('Settings saved successfully!');
        } catch (error: any) {
            showError('Failed to save settings: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAddPropertyType = async () => {
        if (!newPropertyType.trim()) return;

        try {
            await api.settings.addPropertyType(newPropertyType);
            setNewPropertyType('');
            fetchSettings();
            showSuccess('Property type added');
        } catch (error: any) {
            showError('Failed to add property type: ' + error.message);
        }
    };

    const handleRemovePropertyType = async (type: string) => {
        if (!confirm(`Remove "${type}" from property types?`)) return;

        try {
            await api.settings.removePropertyType(type);
            fetchSettings();
            showSuccess('Property type removed');
        } catch (error: any) {
            showError('Failed to remove property type: ' + error.message);
        }
    };

    const handleAddService = async () => {
        if (!newService.trim()) return;

        try {
            await api.settings.addService(newService);
            setNewService('');
            fetchSettings();
            showSuccess('Service added');
        } catch (error: any) {
            showError('Failed to add service: ' + error.message);
        }
    };

    const handleRemoveService = async (service: string) => {
        if (!confirm(`Remove "${service}" from services?`)) return;

        try {
            await api.settings.removeService(service);
            fetchSettings();
            showSuccess('Service removed');
        } catch (error: any) {
            showError('Failed to remove service: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Site Settings</h1>
                    <p className="text-slate-500 mt-1">Manage your website configuration and contact information</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Business Information */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8">
                    <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 flex items-center">
                        <Globe className="w-5 h-5 mr-2 text-amber-600" />
                        Business Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                            <input
                                type="text"
                                value={settings.businessName || ''}
                                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tagline</label>
                            <input
                                type="text"
                                value={settings.tagline || ''}
                                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">About Text</label>
                            <textarea
                                value={settings.aboutText || ''}
                                onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8">
                    <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-amber-600" />
                        Contact Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                            <input
                                type="text"
                                value={settings.phone || ''}
                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={settings.email || ''}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number</label>
                            <input
                                type="text"
                                value={settings.whatsapp || ''}
                                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="251983020552"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                            <input
                                type="text"
                                value={settings.address || ''}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Map Settings */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8">
                    <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                        Google Maps Embed
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Google Maps Iframe Code</label>
                            <textarea
                                value={settings.mapIframe || ''}
                                onChange={(e) => setSettings({ ...settings, mapIframe: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-mono text-xs"
                                placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                            />
                            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                <p className="text-xs font-semibold text-amber-900 mb-2">📍 How to get iframe code:</p>
                                <ol className="text-xs text-amber-800 space-y-1 list-decimal list-inside">
                                    <li>Go to Google Maps</li>
                                    <li>Search for your location (e.g., "Bole, Addis Ababa")</li>
                                    <li>Click "Share" button</li>
                                    <li>Select "Embed a map" tab</li>
                                    <li>Copy the iframe code and paste here</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Hours */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8">
                    <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-amber-600" />
                        Business Hours
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Hours (Short)</label>
                            <input
                                type="text"
                                value={settings.hoursText || ''}
                                onChange={(e) => setSettings({ ...settings, hoursText: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="Open 24 Hours"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Hours (Detailed)</label>
                            <input
                                type="text"
                                value={settings.hoursDetail || ''}
                                onChange={(e) => setSettings({ ...settings, hoursDetail: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="Monday–Sunday: Open 24 hours"
                            />
                        </div>
                    </div>
                </div>
            </div>




            {/* Property Types & Services */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Property Types */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8">
                    <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Property Types</h2>

                    <div className="space-y-4">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newPropertyType}
                                onChange={(e) => setNewPropertyType(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddPropertyType()}
                                placeholder="e.g. Consultancy"
                                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                            <button
                                onClick={handleAddPropertyType}
                                className="px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {settings.propertyTypes?.map((type: string) => (
                                <div key={type} className="bg-slate-100 px-4 py-2 rounded-full flex items-center space-x-2">
                                    <span className="text-sm font-semibold">{type}</span>
                                    <button
                                        onClick={() => handleRemovePropertyType(type)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Services */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8">
                    <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Services Offered</h2>

                    <div className="space-y-4">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newService}
                                onChange={(e) => setNewService(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
                                placeholder="e.g. Property Valuation"
                                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                            <button
                                onClick={handleAddService}
                                className="px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {settings.services?.map((service: string) => (
                                <div key={service} className="bg-slate-100 px-4 py-2 rounded-full flex items-center space-x-2">
                                    <span className="text-sm font-semibold">{service}</span>
                                    <button
                                        onClick={() => handleRemoveService(service)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Social Media Links</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['facebook', 'instagram', 'email', 'linkedin', 'telegram'].map((platform) => (
                        <div key={platform}>
                            <label className="block text-sm font-bold text-slate-700 mb-2 capitalize">{platform}</label>
                            <input
                                type={platform === 'email' ? 'email' : 'url'}
                                value={settings[platform] || ''}
                                onChange={(e) => setSettings({ ...settings, [platform]: e.target.value })}
                                placeholder={platform === 'email' ? 'contact@example.com' : `https://${platform}.com/...`}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Page Content Management */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 flex items-center">
                    <LayoutDashboard className="w-5 h-5 mr-2 text-amber-600" />
                    Page Content
                </h2>
                <div className="space-y-6">
                    {/* Locations Page Text */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Locations Page Intro</label>
                        <textarea
                            value={settings.locationsText || ''}
                            onChange={(e) => setSettings({ ...settings, locationsText: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="Explore our premier locations..."
                        />
                    </div>

                    {/* About Page Content */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">About Page Content</label>
                        <textarea
                            value={settings.aboutText || ''}
                            onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="Tell your story here..."
                        />
                    </div>

                    {/* Contact Page Intro */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Contact Page Intro</label>
                        <textarea
                            value={settings.contactText || ''}
                            onChange={(e) => setSettings({ ...settings, contactText: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="We'd love to hear from you..."
                        />
                    </div>
                </div>
            </div>

            {/* Save Button (Bottom) */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
                </button>
            </div>
        </div >
    );
};
