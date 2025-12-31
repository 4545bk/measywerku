import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/User.js';
import Location from './models/Location.js';
import Property from './models/Property.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Location.deleteMany({});
        await Property.deleteMany({});

        console.log('👤 Creating admin user...');
        const admin = await User.create({
            name: 'Mesay',
            email: 'admin@homezy.com',
            password: 'mesay123',
            role: 'admin',
            phone: '098 302 0552'
        });

        console.log('📍 Creating locations...');
        const locations = await Location.insertMany([
            {
                name: 'Bole',
                description: 'The heart of Addis Ababa, home to luxury residences and thriving commercial spaces.',
                lat: 8.995,
                lng: 38.788,
                slug: 'bole',
                seoTitle: 'Luxury Properties in Bole - Addis Ababa Real Estate',
                seoDescription: 'Discover premium apartments, villas, and commercial properties in Bole, the most sought-after location in Addis Ababa.'
            },
            {
                name: 'Kazanchis',
                description: 'The diplomatic quarter with modern high-rises and international organizations.',
                lat: 9.020,
                lng: 38.765,
                slug: 'kazanchis',
                seoTitle: 'Kazanchis Real Estate - Diplomatic Area Properties',
                seoDescription: 'Explore exclusive real estate opportunities in Kazanchis, home to embassies and international businesses.'
            },
            {
                name: 'Piazza',
                description: 'A historic district blending heritage architecture with new developments.',
                lat: 9.034,
                lng: 38.751,
                slug: 'piazza',
                seoTitle: 'Piazza Properties - Historic Addis Ababa Real Estate',
                seoDescription: 'Find unique properties in Piazza, where historic charm meets modern development.'
            },
            {
                name: 'CMC Figa',
                description: 'Emerging residential area with modern developments and great connectivity.',
                lat: 8.920,
                lng: 38.730,
                slug: 'cmc-figa',
                seoTitle: 'CMC Figa Real Estate - Modern Residential Properties',
                seoDescription: 'Affordable and modern properties in CMC Figa, perfect for families and investors.'
            },
            {
                name: 'Ayat Zone 5',
                description: 'Rapidly growing condominium area with excellent infrastructure.',
                lat: 8.885,
                lng: 38.745,
                slug: 'ayat-zone-5',
                seoTitle: 'Ayat Zone 5 Condominiums - Affordable Housing Solutions',
                seoDescription: 'Great value condominiums in Ayat Zone 5 with modern amenities and infrastructure.'
            }
        ]);

        console.log('🏠 Creating properties...');
        const properties = await Property.insertMany([
            {
                title: 'Luxury Penthouse with City View',
                description: 'An exquisite penthouse located in the premium area of Bole Atlas. Features 360-degree city views, smart home technology, and Italian marble finishes.',
                price: 45000000,
                size: 320,
                bedrooms: 4,
                bathrooms: 4,
                amenities: ['24/7 Security', 'Gym', 'Swimming Pool', 'Backup Generator', 'Underground Parking'],
                type: 'Apartment',
                purpose: 'Sale',
                locationId: locations[0]._id,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                        publicId: 'homezy/sample1',
                        isPrimary: true
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                        publicId: 'homezy/sample1b',
                        isPrimary: false
                    }
                ],
                featured: true,
                views: 1250,
                inquiries: 45
            },
            {
                title: 'Modern Villa in Old Airport',
                description: 'Spacious 5-bedroom villa with a private garden and staff quarters. Perfect for families seeking privacy and high security.',
                price: 85000000,
                size: 600,
                bedrooms: 5,
                bathrooms: 5,
                amenities: ['Large Garden', 'Guest House', 'Maid Quarters', 'Modern Kitchen', 'Security System'],
                type: 'Villa',
                purpose: 'Sale',
                locationId: locations[0]._id,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                        publicId: 'homezy/sample2',
                        isPrimary: true
                    }
                ],
                featured: true,
                views: 890,
                inquiries: 22
            },
            {
                title: 'Commercial Office Space - Kazanchis',
                description: 'Prime office space located in the heart of the business district. High foot traffic and visibility.',
                price: 150000,
                size: 150,
                bedrooms: 0,
                bathrooms: 2,
                amenities: ['Elevator', 'Fiber Internet', 'Security Cameras', 'Parking Space'],
                type: 'Commercial',
                purpose: 'Rent',
                locationId: locations[1]._id,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                        publicId: 'homezy/sample3',
                        isPrimary: true
                    }
                ],
                featured: false,
                views: 450,
                inquiries: 12
            },
            {
                title: 'Affordable 2BR Apartment - Ayat',
                description: 'Perfect starter home in the growing Ayat area. Close to schools, hospitals, and public transport.',
                price: 3500000,
                size: 85,
                bedrooms: 2,
                bathrooms: 1,
                amenities: ['Security', 'Water Supply', 'Electricity Backup'],
                type: 'Apartment',
                purpose: 'Sale',
                locationId: locations[4]._id,
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
                        publicId: 'homezy/sample4',
                        isPrimary: true
                    }
                ],
                featured: false,
                views: 320,
                inquiries: 18
            }
        ]);

        console.log('✅ Database seeded successfully!');
        console.log(`
    📊 Summary:
    - Users: ${await User.countDocuments()}
    - Locations: ${await Location.countDocuments()}
    - Properties: ${await Property.countDocuments()}
    
    🔐 Admin Credentials:
    Email: admin@homezy.com
    Password: mesay123
    `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
