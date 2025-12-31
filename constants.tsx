
import { Property, Location } from './types';

export const INITIAL_LOCATIONS: Location[] = [
  {
    id: 'loc-1',
    name: 'Bole',
    description: 'The heart of Addis Ababa, home to luxury residences and thriving commercial spaces.',
    lat: 8.995,
    lng: 38.788,
    slug: 'bole'
  },
  {
    id: 'loc-2',
    name: 'Kazanchis',
    description: 'The diplomatic quarter with modern high-rises and international organizations.',
    lat: 9.020,
    lng: 38.765,
    slug: 'kazanchis'
  },
  {
    id: 'loc-3',
    name: 'Piazza',
    description: 'A historic district blending heritage architecture with new developments.',
    lat: 9.034,
    lng: 38.751,
    slug: 'piazza'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Luxury Penthouse with City View',
    description: 'An exquisite penthouse located in the premium area of Bole Atlas. Features 360-degree city views, smart home technology, and Italian marble finishes.',
    price: 45000000,
    size: 320,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ['24/7 Security', 'Gym', 'Swimming Pool', 'Backup Generator', 'Underground Parking'],
    type: 'Apartment',
    purpose: 'Sale',
    locationId: 'loc-1',
    images: ['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=11'],
    featured: true,
    views: 1250,
    inquiries: 45,
    createdAt: '2023-10-01T10:00:00Z'
  },
  {
    id: 'prop-2',
    title: 'Modern Villa in Old Airport',
    description: 'Spacious 5-bedroom villa with a private garden and staff quarters. Perfect for families seeking privacy and high security.',
    price: 85000000,
    size: 600,
    bedrooms: 5,
    bathrooms: 5,
    amenities: ['Large Garden', 'Guest House', 'Maid Quarters', 'Modern Kitchen'],
    type: 'Villa',
    purpose: 'Sale',
    locationId: 'loc-1',
    images: ['https://picsum.photos/800/600?random=2'],
    featured: true,
    views: 890,
    inquiries: 22,
    createdAt: '2023-11-15T10:00:00Z'
  },
  {
    id: 'prop-3',
    title: 'Commercial Office Space - Kazanchis',
    description: 'Prime office space located in the heart of the business district. High foot traffic and visibility.',
    price: 150000,
    size: 150,
    bedrooms: 0,
    bathrooms: 2,
    amenities: ['Elevator', 'Fiber Internet', 'Security Cameras'],
    type: 'Commercial',
    purpose: 'Rent',
    locationId: 'loc-2',
    images: ['https://picsum.photos/800/600?random=3'],
    featured: false,
    views: 450,
    inquiries: 12,
    createdAt: '2024-01-05T10:00:00Z'
  }
];

export const BUSINESS_INFO = {
  name: "Mesay Real Estate",
  tagline: "Your Trusted Partner in Prime Real Estate",
  agent: "Mesay",
  phone: "098 302 0552",
  phoneFormatted: "+251 98 302 0552",
  whatsapp: "251983020552",
  email: "info@mesayrealestate.com",
  address: "Bole, Addis Ababa, Ethiopia",
  category: "Estate Agent",
  description: "We are a trusted real estate agency based in Bole, specializing in the sale and leasing of luxury apartments, affordable homes, commercial shops, offices, and high-value investment properties. We serve both individual buyers and investors looking for quality real estate opportunities in prime and emerging locations. With strong local market knowledge and a client-first approach, we provide professional guidance throughout the entire process—from property selection and valuation to negotiation and successful closing. Our commitment to transparency, reliability, and personalized service ensures smooth and secure real estate transactions for every client.",
  serviceAreas: [
    "Addis Ababa",
    "Bole",
    "Piazza",
    "CMC Figa",
    "Kazanchis",
    "Ayat Zone 5"
  ],
  hours: "Open 24 Hours",
  hoursDetail: "Monday–Sunday: Open 24 hours",
  specialties: [
    "Luxury Apartments",
    "Affordable Homes",
    "Commercial Shops",
    "Office Spaces",
    "Investment Properties"
  ],
  services: [
    "Property Sales",
    "Property Leasing",
    "Property Valuation",
    "Investment Consultation",
    "Negotiation Services",
    "Market Analysis"
  ]
};

