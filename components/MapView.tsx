
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  lat: number;
  lng: number;
  markers?: { lat: number; lng: number; label: string }[];
  height?: string;
}

export const MapView: React.FC<MapViewProps> = ({ lat, lng, markers = [], height = '400px' }) => {
  // In a real production app, we would use @react-google-maps/api
  // For this environment, we simulate the visual map experience.
  return (
    <div 
      className="relative bg-slate-200 rounded-2xl overflow-hidden border border-slate-300"
      style={{ height }}
    >
      {/* Visual representation of a map */}
      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/38.78,8.99,12/800x600?access_token=none')] bg-cover bg-center">
        {/* Placeholder for markers */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
           <div className="relative">
             <MapPin className="w-10 h-10 text-amber-600 fill-amber-100" />
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded shadow-lg text-xs font-bold whitespace-nowrap">
               Location Area
             </div>
           </div>
        </div>
        
        {markers.map((m, i) => (
          <div 
            key={i} 
            className="absolute" 
            style={{ 
              top: `${50 + (m.lat - lat) * 100}%`, 
              left: `${50 + (m.lng - lng) * 100}%` 
            }}
          >
            <MapPin className="w-6 h-6 text-slate-900 fill-white" />
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-lg text-[10px] text-slate-500 font-mono shadow-sm">
        LAT: {lat.toFixed(4)} | LNG: {lng.toFixed(4)}
      </div>
      
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 flex items-center space-x-2 shadow-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>Live Map View Integration</span>
      </div>
    </div>
  );
};
