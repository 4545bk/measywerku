import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Award, Copy, Check } from 'lucide-react';
import api from '../services/api';

export const TestimonialManagement = () => {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [copied, setCopied] = useState(false);

    const shareLink = `${window.location.origin}/testimonial/submit`;

    useEffect(() => {
        fetchTestimonials();
    }, [filter]);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const params = filter !== 'all' ? `?status=${filter}` : '';
            const response = await fetch(`/api/testimonials/admin/all${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            const data = await response.json();
            setTestimonials(data.data.testimonials);
            setStats(data.data.stats);
        } catch (error) {
            console.error('Failed to load testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await fetch(`/api/testimonials/admin/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ status })
            });
            fetchTestimonials();
        } catch (error: any) {
            alert('Failed to update status: ' + error.message);
        }
    };

    const handleToggleFeatured = async (id: string) => {
        try {
            await fetch(`/api/testimonials/admin/${id}/featured`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            fetchTestimonials();
        } catch (error: any) {
            alert('Failed to toggle featured: ' + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            await fetch(`/api/testimonials/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            fetchTestimonials();
        } catch (error: any) {
            alert('Failed to delete testimonial: ' + error.message);
        }
    };

    const copyShareLink = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading testimonials...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Customer Testimonials</h1>
                    <p className="text-slate-500 mt-1">Manage and moderate customer reviews</p>
                </div>

                {/* Share Link */}
                <div className="bg-gradient-to-r from-purple-50 to-amber-50 border-2 border-purple-200 rounded-2xl p-4 flex items-center space-x-3">
                    <div className="flex-1">
                        <p className="text-xs font-bold text-purple-900 mb-1">Share with customers:</p>
                        <code className="text-xs text-purple-700 font-mono">{shareLink}</code>
                    </div>
                    <button
                        onClick={copyShareLink}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition-all"
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: 'Total', value: stats.total || 0, color: 'slate' },
                    { label: 'Pending', value: stats.pending || 0, color: 'amber' },
                    { label: 'Approved', value: stats.approved || 0, color: 'green' },
                    { label: 'Rejected', value: stats.rejected || 0, color: 'red' },
                    { label: 'Featured', value: stats.featured || 0, color: 'purple' }
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-6 border border-slate-200">
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${filter === status
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Testimonials List */}
            <div className="space-y-4">
                {testimonials.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                        <p className="text-slate-400">No testimonials found</p>
                    </div>
                ) : (
                    testimonials.map((testimonial) => (
                        <div
                            key={testimonial._id}
                            className="bg-white rounded-3xl border border-slate-200 p-8 hover:shadow-lg transition-all"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{testimonial.customerName}</h3>
                                            <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                                                {testimonial.customerEmail && <span>{testimonial.customerEmail}</span>}
                                                {testimonial.customerPhone && <span>{testimonial.customerPhone}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {renderStars(testimonial.rating)}
                                            {testimonial.featured && (
                                                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                                                    <Award className="w-3 h-3" />
                                                    <span>Featured</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Review */}
                                    <p className="text-slate-700 leading-relaxed mb-4">"{testimonial.review}"</p>

                                    {/* Meta */}
                                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                                        {testimonial.propertyType && (
                                            <span className="bg-slate-100 px-3 py-1 rounded-full">{testimonial.propertyType}</span>
                                        )}
                                        <span>{new Date(testimonial.createdAt).toLocaleDateString()}</span>
                                        <span className={`px-3 py-1 rounded-full font-bold ${testimonial.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            testimonial.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {testimonial.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                                    {testimonial.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(testimonial._id, 'approved')}
                                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm font-semibold"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Approve</span>
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(testimonial._id, 'rejected')}
                                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-sm font-semibold"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                <span>Reject</span>
                                            </button>
                                        </>
                                    )}

                                    {testimonial.status === 'approved' && (
                                        <button
                                            onClick={() => handleToggleFeatured(testimonial._id)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all text-sm font-semibold ${testimonial.featured
                                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                }`}
                                        >
                                            <Award className="w-4 h-4" />
                                            <span>{testimonial.featured ? 'Unfeatufe' : 'Feature'}</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(testimonial._id)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all text-sm font-semibold"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
