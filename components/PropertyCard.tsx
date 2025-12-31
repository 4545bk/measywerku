
import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, Star } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  locationName: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, locationName }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle both string array and object array formats for images
  const getImageUrl = () => {
    if (!property.images || property.images.length === 0) {
      return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';
    }

    const firstImage = property.images[0];

    // If it's an object with url property (from database)
    if (typeof firstImage === 'object' && firstImage.url) {
      // Find primary image or use first one
      const primary = property.images.find((img: any) => img.isPrimary);
      return primary ? primary.url : firstImage.url;
    }

    // If it's a string (old format)
    return firstImage as string;
  };

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {property.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-lg">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>Featured</span>
            </span>
          </div>
        )}
      </div>

      <div className="p-7">
        <div className="flex flex-col mb-4">
          <span className="text-2xl font-bold text-slate-900">
            {formatPrice(property.price)}
            {property.purpose === 'Rent' && <span className="text-sm font-normal text-slate-400"> /month</span>}
          </span>
          <h3 className="text-lg font-bold text-slate-800 mt-1 line-clamp-1 group-hover:text-amber-600 transition-colors">
            {property.title}
          </h3>
          <span className="text-sm text-slate-400 mt-1 flex items-center">
            {locationName}, Addis Ababa
          </span>
        </div>

        <div className="flex items-center space-x-6 pt-4 border-t border-slate-50 text-slate-500 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <Bed className="w-4 h-4 text-slate-300" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Bath className="w-4 h-4 text-slate-300" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Maximize className="w-4 h-4 text-slate-300" />
            <span>{property.size}m²</span>
          </div>
        </div>

        <Link
          to={`/property/${property.id}`}
          className="mt-6 block w-full py-3 bg-slate-50 text-slate-900 text-center rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
