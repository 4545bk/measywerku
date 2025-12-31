import React, { useState } from 'react';
import { Star, CheckCircle, Send } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

export const SubmitTestimonial = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        review: '',
        propertyType: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a star rating');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/testimonials/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    rating
                })
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
            } else {
                alert('Failed to submit: ' + data.message);
            }
        } catch (error: any) {
            alert('Failed to submit testimonial: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Thank You!</h1>
                    <p className="text-slate-600 mb-8">
                        Your testimonial has been submitted successfully and is being reviewed. We appreciate your feedback!
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-gradient-to-r from-purple-600 to-amber-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all"
                    >
                        Back to Homepage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 py-12 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block bg-white px-6 py-3 rounded-full shadow-lg mb-6">
                        <h2 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-amber-600">
                            {BUSINESS_INFO.name}
                        </h2>
                    </div>
                    <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4">Share Your Experience</h1>
                    <p className="text-xl text-slate-600">
                        Your feedback helps us serve you better and helps others make informed decisions.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
                    {/* Star Rating */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-4">How would you rate your experience? *</label>
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-125"
                                >
                                    <Star
                                        className={`w-12 h-12 ${star <= (hoverRating || rating)
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-slate-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-sm text-slate-500 mt-2">
                            {rating === 0 ? 'Click to rate' : `${rating} star${rating !== 1 ? 's' : ''}`}
                        </p>
                    </div>

                    {/* Name */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Your Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                            className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            placeholder="john@example.com"
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                            className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            placeholder="098 302 0552"
                        />
                    </div>

                    {/* Property Type */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                        <select
                            value={formData.propertyType}
                            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                            className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                        >
                            <option value="">Select property type...</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Consultancy">Consultancy</option>
                        </select>
                    </div>

                    {/* Review */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Your Review *</label>
                        <textarea
                            required
                            value={formData.review}
                            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                            rows={5}
                            className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
                            placeholder="Tell us about your experience..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-amber-600 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span>Submitting...</span>
                        ) : (
                            <>
                                <Send className="w-6 h-6" />
                                <span>Submit Testimonial</span>
                            </>
                        )}
                    </button>

                    <p className="text-xs text-slate-500 text-center mt-6">
                        Your testimonial will be reviewed before being published on our website.
                    </p>
                </form>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-slate-500">
                    <p>Need help? Contact us at <a href={`tel:${BUSINESS_INFO.phone}`} className="text-purple-600 font-semibold">{BUSINESS_INFO.phone}</a></p>
                </div>
            </div>
        </div>
    );
};
