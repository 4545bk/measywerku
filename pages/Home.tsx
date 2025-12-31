import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram, Facebook, Mail, Phone, ArrowLeft,
  ChevronRight, Star, Award, ShieldCheck, MapPinned, Send
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { INITIAL_PROPERTIES, INITIAL_LOCATIONS } from '../constants';
import { PropertyCard } from '../components/PropertyCard';
import api from '../services/api';

export const Home = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch properties
        const propsResponse = await api.properties.getAll({ featured: true, limit: 6 });
        if (propsResponse.data.properties && propsResponse.data.properties.length > 0) {
          setFeatured(propsResponse.data.properties);
        } else {
          setFeatured(INITIAL_PROPERTIES.slice(0, 6));
        }

        // Fetch site settings for social links
        try {
          const settingsResponse = await api.settings.get();
          setSettings(settingsResponse.data.settings);
        } catch (err) {
          console.log('Settings not available, using defaults');
        }
      } catch (error) {
        console.error('Failed to fetch properties, using dummy data:', error);
        setFeatured(INITIAL_PROPERTIES.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pb-24 bg-slate-50">
      {/* Enhanced Agent Header Banner */}
      <section className="max-w-[90rem] mx-auto px-6 lg:px-12 py-12">
        <div className="mb-10">
          <Link to="/properties" className="inline-flex items-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Explore our portfolio
          </Link>
        </div>

        <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row gap-16 items-center lg:items-start relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

          {/* Profile Photo - Large Professional Portrait */}
          <div className="w-full lg:w-[32rem] shrink-0 relative z-10">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-gradient-to-br from-purple-100 to-slate-100 border-[12px] border-white shadow-2xl relative group">
              <img
                src="/images/imagemesay.jpg"
                alt="Mesay - Real Estate Consultant"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
              />
              {/* Gradient Overlay for Premium Feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-60" />

              {/* Premium Badge */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-slate-900">Premium Agent</span>
                </div>
              </div>

              {/* Quality Watermark */}
              <div className="absolute bottom-6 right-6 text-white/30 font-serif italic text-3xl select-none pointer-events-none">
                Quality
              </div>
            </div>
            {/* Floating Achievement Badge */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-[2rem] shadow-2xl border-4 border-white hidden md:block">
              <Award className="w-8 h-8" />
            </div>
          </div>

          {/* Info Details */}
          <div className="flex-1 space-y-10 relative z-10 pt-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="h-px w-8 bg-amber-500" />
                  <p className="text-amber-600 font-bold text-sm uppercase tracking-[0.3em]">Premier Sales Consultant</p>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-4 leading-tight">Mesay Werku</h1>
                <p className="text-slate-400 font-medium text-xl">RealEstate Sales Consultant & Property Strategist</p>
              </div>

              {/* Social Actions */}
              <SocialActions settings={settings} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2 text-amber-500" />
                  Our Commitment
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium text-lg">
                  Specializing in the sales and leasing of luxury apartments and commercial properties. We bridge the gap between discerning investors and premium architectural excellence in Addis Ababa.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <MapPinned className="w-5 h-5 mr-2 text-amber-500" />
                  Expert Presence
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium text-lg">
                  Dominating the market in Bole, Kazanchis, and Ayat. Established in 2016, we have a proven record of facilitating high-value investment opportunities.
                </p>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-10">
              <div className="group">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-2 group-hover:text-amber-600 transition-colors">Listings</div>
                <div className="text-2xl font-bold text-slate-900">12 Units</div>
              </div>
              <div className="group">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-2 group-hover:text-amber-600 transition-colors">Estd. Since</div>
                <div className="text-2xl font-bold text-slate-900">2016</div>
              </div>
              <div className="group">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-2 group-hover:text-amber-600 transition-colors">Coverage</div>
                <div className="text-2xl font-bold text-slate-900">All Addis</div>
              </div>
              <div className="group">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-2 group-hover:text-amber-600 transition-colors">Expertise</div>
                <div className="text-2xl font-bold text-slate-900">Sales & Rent</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Listings Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Curated Portfolio</span>
            </div>
            <h2 className="text-5xl font-serif font-bold text-slate-900 mb-4">Premier Listings</h2>
            <p className="text-slate-500 text-lg font-medium">Discover hand-selected luxury residences and high-yield commercial spaces tailored for your lifestyle and portfolio.</p>
          </div>
          <div className="bg-white px-8 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <span className="text-3xl font-bold text-slate-900">{featured.length}</span>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-tight">
              Active<br />Listings
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[3rem] p-6 animate-pulse">
                <div className="bg-slate-200 h-64 rounded-2xl mb-4"></div>
                <div className="bg-slate-200 h-6 rounded mb-2"></div>
                <div className="bg-slate-200 h-4 rounded w-2/3"></div>
              </div>
            ))
          ) : (
            featured.map(prop => (
              <PropertyCard
                key={prop._id || prop.id}
                property={prop}
                locationName={prop.locationId?.name || INITIAL_LOCATIONS.find(l => l.id === prop.locationId)?.name || 'Addis'}
              />
            ))
          )}
        </div>

        <div className="mt-24 text-center">
          <a
            href="/properties"
            className="inline-flex items-center space-x-4 bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-bold hover:bg-amber-600 transition-all shadow-2xl shadow-slate-900/20 group"
          >
            <span className="text-lg">View All Properties</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Units Sold', val: '450+', sub: 'Luxury residences and shops' },
            { label: 'Client Satisfaction', val: '98%', sub: 'Based on verified buyer reviews' },
            { label: 'Avg Appreciation', val: '14.2%', sub: 'Annual value increase for investors' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 text-center hover:shadow-xl transition-all">
              <div className="text-4xl font-serif font-bold text-slate-900 mb-2">{stat.val}</div>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4">{stat.label}</div>
              <p className="text-slate-400 text-sm font-medium">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-32">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Reviews</span>
          </div>
          <h2 className="text-5xl font-serif font-bold text-slate-900 mb-4">What Our Clients Say</h2>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Hear from satisfied customers who found their dream properties with Mesay Real Estate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Abebe Kebede",
              role: "Property Investor",
              rating: 5,
              review: "Excellent service! Mesay helped me find the perfect investment property in Bole. Professional, knowledgeable, and always available to answer questions.",
              image: "https://ui-avatars.com/api/?name=Abebe+Kebede&background=f59e0b&color=fff&size=128"
            },
            {
              name: "Tigist Alemu",
              role: "First-Time Buyer",
              rating: 5,
              review: "As a first-time buyer, I was nervous about the process. Mesay made everything smooth and easy. Found my dream apartment in just 2 weeks!",
              image: "https://ui-avatars.com/api/?name=Tigist+Alemu&background=8b5cf6&color=fff&size=128"
            },
            {
              name: "Daniel Haile",
              role: "Business Owner",
              rating: 5,
              review: "Located the ideal commercial space for my business in Kazanchis. Mesay's expertise in the local market is unmatched. Highly recommended!",
              image: "https://ui-avatars.com/api/?name=Daniel+Haile&background=3b82f6&color=fff&size=128"
            },
            {
              name: "Sara Yohannes",
              role: "Expatriate",
              rating: 5,
              review: "Moving to Addis was made easy thanks to Mesay. Found a beautiful villa in my budget and handled all the paperwork smoothly. Five stars!",
              image: "https://ui-avatars.com/api/?name=Sara+Yohannes&background=ec4899&color=fff&size=128"
            },
            {
              name: "Mesfin Tadesse",
              role: "Real Estate Investor",
              rating: 5,
              review: "Professional consultancy service for my property investments. Mesay provided valuable market insights that helped me make informed decisions.",
              image: "https://ui-avatars.com/api/?name=Mesfin+Tadesse&background=10b981&color=fff&size=128"
            },
            {
              name: "Hana Bekele",
              role: "Apartment Renter",
              rating: 5,
              review: "Exceptional service from start to finish. Found the perfect apartment near my workplace. Mesay went above and beyond to ensure I was satisfied.",
              image: "https://ui-avatars.com/api/?name=Hana+Bekele&background=f97316&color=fff&size=128"
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white rounded-[3rem] p-8 border border-slate-100 hover:shadow-xl transition-all group">
              {/* Rating Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review */}
              <p className="text-slate-600 leading-relaxed mb-6 italic">
                "{testimonial.review}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4 pt-6 border-t border-slate-100">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full border-2 border-amber-100"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/testimonial/submit"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-amber-600 text-white px-10 py-5 rounded-[2rem] font-bold hover:shadow-2xl transition-all group"
          >
            <span className="text-lg">Share Your Experience</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
};

// Social Actions Component
const SocialActions = ({ settings }: { settings: any }) => {
  const { showSuccess } = useToast();

  const handleAction = (type: string, value: string, label: string) => {
    if (type === 'info') {
      navigator.clipboard.writeText(value);
      showSuccess(`${label} copied: ${value}`);
    } else if (type === 'link') {
      window.open(value, '_blank');
    }
  };

  // Use settings from API or fallback to defaults
  const socialLinks = [
    {
      icon: Phone,
      label: 'Phone',
      type: 'info',
      value: settings?.phone || '+251 98 302 0552'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      type: 'link',
      value: settings?.instagram || 'https://instagram.com'
    },
    {
      icon: Facebook,
      label: 'Facebook',
      type: 'link',
      value: settings?.facebook || 'https://facebook.com'
    },
    {
      icon: Send,
      label: 'Telegram',
      type: 'link',
      value: settings?.telegram || 'https://t.me/mesay'
    },
    {
      icon: Mail,
      label: 'Email',
      type: 'info',
      value: settings?.email || 'info@ghionhomes.com'
    }
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((item, i) => (
        <button
          key={i}
          onClick={() => handleAction(item.type, item.value, item.label)}
          className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-amber-600 hover:-translate-y-1 transition-all cursor-pointer shadow-lg shadow-slate-900/10"
          title={item.type === 'info' ? `Click to copy ${item.label}` : `Visit ${item.label}`}
        >
          <item.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};
