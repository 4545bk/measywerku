
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Share2, Heart, Phone, MessageCircle, Calendar, Shield, Coffee, Wifi, Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { INITIAL_PROPERTIES, INITIAL_LOCATIONS, BUSINESS_INFO } from '../constants';
import { MapView } from '../components/MapView';
import api from '../services/api';

export const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        const response = await api.properties.getById(id);
        setProperty(response.data.property);
      } catch (error) {
        console.log('Property not in database, checking dummy data...');
        // Fallback to dummy data if not found in API
        const dummyProperty = INITIAL_PROPERTIES.find(p => p.id === id);
        if (dummyProperty) {
          setProperty(dummyProperty);
        } else {
          setProperty(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (property) {
      document.title = `${property.title} | Ghion Homes by Mesay Werku`;
    }
  }, [property]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-amber-600"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!property) {
    return (
      <div className="bg-slate-50 min-h-screen pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Property Not Found</h1>
            <p className="text-slate-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/properties"
              className="inline-flex items-center space-x-2 bg-amber-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-amber-700 transition-all"
            >
              <span>View All Properties</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get location (handle both API and dummy data structures)
  const location = property.locationId?.name
    ? property.locationId
    : INITIAL_LOCATIONS.find(l => l.id === property.locationId);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  // Helper to get image URL (handle both API and dummy data)
  const getImageUrl = (img: any) => {
    return typeof img === 'string' ? img : img.url;
  };

  // Get video URL from property (supports multiple formats)
  const videoUrl = property.video?.url || property.videoUrl || null;

  // Debug logging
  console.log('Property video data:', {
    hasVideo: !!property.video,
    videoObj: property.video,
    videoUrl: property.videoUrl,
    finalVideoUrl: videoUrl
  });

  // Debug location data
  console.log('Location data:', {
    locationId: property.locationId,
    hasMapIframe: !!location?.mapIframe,
    mapIframe: location?.mapIframe
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex text-xs font-bold uppercase tracking-widest text-slate-400">
          <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/properties" className="hover:text-amber-600 transition-colors">Properties</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 truncate">{property.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Enhanced Gallery with Navigation */}
            <div className="space-y-4">
              <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white group">
                <img
                  src={getImageUrl(property.images[activeImage]) || 'https://picsum.photos/1200/800'}
                  alt={property.title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />

                {/* Navigation Arrows - Only show if multiple images */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6 text-slate-900" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6 text-slate-900" />
                    </button>
                    {/* Image Counter */}
                    <div className="absolute bottom-8 right-8 bg-black/70 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-bold">
                      {activeImage + 1} / {property.images.length}
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="absolute top-8 right-8 flex space-x-3">
                  <button className="p-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg hover:bg-white transition-all hover:scale-110">
                    <Heart className="w-5 h-5 text-slate-900" />
                  </button>
                  <button className="p-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg hover:bg-white transition-all hover:scale-110">
                    <Share2 className="w-5 h-5 text-slate-900" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Strip - Only show if multiple images */}
              {property.images.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto py-4 scrollbar-hide">
                  {property.images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`shrink-0 w-32 h-32 rounded-3xl overflow-hidden border-4 transition-all duration-300 ${activeImage === idx ? 'border-amber-500 scale-105 shadow-lg' : 'border-white opacity-60'
                        }`}
                    >
                      <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Video Section - Only if video exists */}
            {videoUrl && (
              <div className="bg-white rounded-[3rem] p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <Play className="w-6 h-6 text-amber-600 mr-3" />
                  <h3 className="text-2xl font-serif font-bold text-slate-900">Property Video Tour</h3>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-lg bg-slate-900">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full"
                    poster={getImageUrl(property.images[0])}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}

            {/* Title & Info */}
            <div>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">{property.purpose}</span>
                <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">{property.type}</span>
              </div>
              <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4 leading-tight">{property.title}</h1>
              <div className="flex items-center text-slate-500 mb-8">
                <MapPin className="w-6 h-6 mr-3 text-amber-600" />
                <span className="text-xl font-medium">{location?.name}, Addis Ababa</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-16 py-10 border-y border-slate-100 mb-10">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] mb-3">Investment Value</div>
                  <div className="text-4xl font-serif font-bold text-slate-900">{formatPrice(property.price)}</div>
                </div>
                <div className="flex space-x-10">
                  <div className="flex flex-col">
                    <div className="flex items-center text-slate-900 font-bold text-xl mb-1">
                      <Bed className="w-5 h-5 mr-2 text-slate-300" />
                      {property.bedrooms}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Beds</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-slate-900 font-bold text-xl mb-1">
                      <Bath className="w-5 h-5 mr-2 text-slate-300" />
                      {property.bathrooms}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Baths</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center text-slate-900 font-bold text-xl mb-1">
                      <Maximize className="w-5 h-5 mr-2 text-slate-300" />
                      {property.size}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">m² Area</span>
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="max-w-none bg-white rounded-[3rem] p-10 shadow-lg">
                <h3 className="text-2xl font-serif font-bold mb-6 text-slate-900">Property Description</h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-2xl font-serif font-bold mb-8 text-slate-900">World-Class Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {property.amenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-4 p-6 bg-white rounded-[2rem] border border-slate-50 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-amber-600">
                      {idx % 3 === 0 ? <Shield className="w-6 h-6" /> : idx % 3 === 1 ? <Wifi className="w-6 h-6" /> : <Coffee className="w-6 h-6" />}
                    </div>
                    <span className="text-slate-800 font-bold text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Map Section */}
            <div>
              <h3 className="text-2xl font-serif font-bold mb-8 text-slate-900">Location & Area</h3>

              {/* Area Overview Card */}
              <div className="bg-white rounded-[3rem] p-8 shadow-lg mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-5 h-5 text-amber-600" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Area Overview</span>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">{location?.name || 'Location Area'}</h4>
                    <p className="text-slate-500 font-medium">{location?.description || 'Prime location in Addis Ababa'}</p>
                  </div>
                </div>

                {/* Coordinates Display */}
                <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Latitude</div>
                    <div className="text-xl font-mono font-bold text-slate-900">{(location?.lat || 9.0).toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Longitude</div>
                    <div className="text-xl font-mono font-bold text-slate-900">{(location?.lng || 38.7).toFixed(4)}</div>
                  </div>
                </div>
              </div>

              {/* Live Map View */}
              {location?.mapIframe ? (
                <div className="rounded-2xl overflow-hidden shadow-lg map-iframe-container">
                  <div
                    dangerouslySetInnerHTML={{ __html: location.mapIframe }}
                  />
                </div>
              ) : (
                <MapView lat={location?.lat || 9.0} lng={location?.lng || 38.7} height="500px" />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Inquiry Form Card */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-50 sticky top-28">
              <h3 className="text-xl font-bold text-slate-900 mb-8">Consultancy Inquiry</h3>
              <div className="space-y-4 mb-10">
                <div className="p-6 bg-slate-50 rounded-[2rem] flex items-center space-x-5 border border-slate-100">
                  <div className="w-16 h-16 bg-amber-100 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-sm">
                    <img
                      src="/images/imagemesay.jpg"
                      className="w-full h-full object-cover"
                      alt="Mesay Werku"
                    />
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-900">Mesay Werku</div>
                    <div className="text-[10px] text-amber-600 uppercase font-bold tracking-[0.2em]">Lead Consultant</div>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-bold flex items-center justify-center space-x-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                >
                  <Phone className="w-5 h-5" />
                  <span>{BUSINESS_INFO.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=Hello Mesay, I'm interested in the ${property.title}`}
                  className="w-full bg-green-500 text-white py-5 rounded-[2rem] font-bold flex items-center justify-center space-x-3 hover:bg-green-600 transition-all shadow-xl shadow-green-900/10"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Inquiry</span>
                </a>
                <button className="w-full bg-slate-50 text-slate-900 py-5 rounded-[2rem] font-bold flex items-center justify-center space-x-3 hover:bg-slate-100 transition-all border border-slate-100">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <span>Schedule Visit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};
