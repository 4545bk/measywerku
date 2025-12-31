import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface DynamicPageProps {
    type: 'about' | 'contact' | 'locations';
    title: string;
}

export const DynamicPage: React.FC<DynamicPageProps> = ({ type, title }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await api.settings.get();
                const settings = response.data.settings;
                if (type === 'about') setContent(settings.aboutText);
                else if (type === 'contact') setContent(settings.contactText);
                else if (type === 'locations') setContent(settings.locationsText);
            } catch (error) {
                console.error('Failed to load content:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [type]);

    if (loading) {
        return <div className="p-24 text-center text-slate-400">Loading...</div>;
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <section className="bg-white border-b border-slate-100 py-24">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8">{title}</h1>
                    <div className="prose prose-lg prose-slate mx-auto whitespace-pre-wrap text-slate-500 leading-relaxed">
                        {content}
                    </div>

                    {/* Specific adjustments for Contact page */}
                    {type === 'contact' && (
                        <div className="mt-12 flex justify-center space-x-6">
                            <a href="tel:+251983020552" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">
                                Call Now
                            </a>
                            <a href="mailto:contact@mesay.com" className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold hover:border-slate-900 transition-all">
                                Email Us
                            </a>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
