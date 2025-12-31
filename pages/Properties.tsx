
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PropertyCard } from '../components/PropertyCard';
import { MapView } from '../components/MapView';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { INITIAL_PROPERTIES, INITIAL_LOCATIONS } from '../constants';
import api from '../services/api';

export const Properties = () => {
  const { location: locationSlug } = useParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyTypes, setPropertyTypes] = useState<string[]>(['Apartment', 'Villa', 'Commercial', 'Consultancy']);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propsRes, locsRes, settingsRes] = await Promise.all([
        api.properties.getAll(),
        api.locations.getAll(),
        api.settings.get()
      ]);

      // Use API data if available, otherwise fallback to dummy data
      setProperties(propsRes.data.properties.length > 0 ? propsRes.data.properties : INITIAL_PROPERTIES);
      setLocations(locsRes.data.locations.length > 0 ? locsRes.data.locations : INITIAL_LOCATIONS);

      if (settingsRes.data.settings?.propertyTypes?.length > 0) {
        setPropertyTypes(settingsRes.data.settings.propertyTypes);
      }
    } catch (error) {
      console.error('Failed to load data, using dummy data:', error);
      // Fallback to dummy data on error
      setProperties(INITIAL_PROPERTIES);
      setLocations(INITIAL_LOCATIONS);
    } finally {
      setLoading(false);
    }
  };

  const currentLocation = useMemo(() => {
    return locations.find(l => l.slug === locationSlug);
  }, [locationSlug, locations]);

  const filteredProperties = useMemo(() => {
    let filtered = properties;

    // Filter by location slug
    if (locationSlug && currentLocation) {
      filtered = filtered.filter(p => p.locationId?._id === currentLocation._id);
    }

    // Filter by type
    if (selectedType !== 'All') {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [locationSlug, currentLocation, properties, selectedType, searchTerm]);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Section */}
      <section className="bg-white border-b border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <nav className="flex text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-slate-900">Properties</span>
              {currentLocation && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-amber-600">{currentLocation.name}</span>
                </>
              )}
            </nav>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
              {currentLocation ? `Properties in ${currentLocation.name}` : 'All Luxury Listings'}
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              {currentLocation
                ? currentLocation.description
                : "Explore our curated collection of the finest real estate opportunities in Addis Ababa, from luxury penthouses to strategic commercial spaces."}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-amber-600 transition-all">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {['All', ...propertyTypes].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-5 py-2 rounded-full text-xs font-bold border-2 transition-all whitespace-nowrap ${selectedType === type
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'border-slate-100 text-slate-500 hover:border-slate-900 hover:text-slate-900'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Property List */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProperties.length > 0 ? (
                filteredProperties.map(prop => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    locationName={locations.find(l => l._id === prop.locationId)?.name || 'Addis Ababa'}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="text-slate-300 mb-4">
                    <Filter className="w-16 h-16 mx-auto opacity-20" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No properties found</h3>
                  <p className="text-slate-400">Try adjusting your filters or location.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Map (For Location Pages) */}
          <div className="lg:col-span-4">
            <div className="sticky top-44 space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
                  Area Overview
                </h3>
                {currentLocation?.mapIframe ? (
                  <div className="rounded-2xl overflow-hidden shadow-lg sidebar-iframe">
                    <div dangerouslySetInnerHTML={{ __html: currentLocation.mapIframe }} />
                    <style>{`
                      .sidebar-iframe iframe {
                        width: 100% !important;
                        height: 300px !important;
                        border: 0;
                      }
                    `}</style>
                  </div>
                ) : (
                  <MapView
                    lat={currentLocation?.lat || 8.9806}
                    lng={currentLocation?.lng || 38.7578}
                    height="300px"
                  />
                )}
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {currentLocation?.description || `Showing properties in ${currentLocation?.name || 'Addis Ababa'}. This area is currently experiencing high demand for luxury living and commercial opportunities.`}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                <h3 className="text-xl font-serif font-bold mb-4">Investment Opportunity</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Properties in this sector have seen an average of 12% annual appreciation over the last 3 years.
                </p>
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-amber-500 transition-colors">
                  Contact Advisor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
