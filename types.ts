
export type PropertyType = 'Apartment' | 'Villa' | 'Commercial' | 'Consultancy';
export type PropertyPurpose = 'Sale' | 'Rent' | 'Investment';

export interface Location {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  slug: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  type: PropertyType;
  purpose: PropertyPurpose;
  locationId: string;
  images: string[];
  featured: boolean;
  views: number;
  inquiries: number;
  createdAt: string;
}

export interface AnalyticsData {
  dailyTraffic: { date: string; views: number }[];
  inquiryClicks: { type: 'Call' | 'WhatsApp'; count: number }[];
  propertyPerformance: { id: string; title: string; score: number }[];
}
