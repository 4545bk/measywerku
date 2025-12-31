# 🏠 Homezy Real Estate Platform

A modern, full-stack real estate platform built with React (Frontend) and Express + MongoDB (Backend) featuring Cloudinary image management and AI-powered property descriptions.

---

## 🎯 Features

### Frontend (React)
- ✨ Beautiful luxury UI with Tailwind CSS
- 🎨 Professional property listings with advanced filtering
- 📱 Fully responsive design
- 🔐 Protected admin dashboard
- 📊 Real-time analytics and insights
- 🤖 Google Gemini AI integration for property descriptions
- 🗺️ Location-based property browsing

### Backend (Express + MongoDB)
- 🔒 JWT authentication with role-based access control
- 📦 MongoDB database with Mongoose ORM
- ☁️ Cloudinary integration for image uploads
- 📊 Advanced analytics API
- 🔍 Property filtering and search
- ⚡ RESTful API design

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud database)
- **Cloudinary Account** - [Sign up free](https://cloudinary.com/users/register/free)
- **Google Gemini API Key** - [Get API key](https://makersuite.google.com/app/apikey)

---

## 🚀 Installation & Setup

### Step 1: Clone or Navigate to Project

```powershell
cd C:\Users\Biruh\Downloads\addis-luxury-estates
```

### Step 2: Setup Backend

```powershell
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env
```

### Step 3: Configure Environment Variables

Edit `server/.env` file with your credentials:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/homezy
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/homezy

# JWT Secret (Generate random string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Cloudinary Configuration (Get from cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Config
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Google Gemini API (Optional - if using AI features)
GEMINI_API_KEY=your_gemini_key
```

### Step 4: Seed Database with Initial Data

```powershell
npm run seed
```

This will create:
- ✅ Admin user (email: `admin@homezy.com`, password: `mesay123`)
- ✅ 5 Locations (Bole, Kazanchis, Piazza, CMC Figa, Ayat Zone 5)
- ✅ 4 Sample properties with images

### Step 5: Start Backend Server

```powershell
npm run dev
```

Backend will run at: **http://localhost:5000**

---

### Step 6: Setup Frontend

Open a **new terminal** window:

```powershell
cd C:\Users\Biruh\Downloads\addis-luxury-estates

# Install frontend dependencies
npm install

# Create .env.local file for frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:5173**

---

## 🔑 Default Admin Credentials

```
Email: admin@homezy.com
Password: mesay123
```

**⚠️ IMPORTANT:** Change these credentials in production!

---

## 📁 Project Structure

```
addis-luxury-estates/
├── server/                  # Backend (Express + MongoDB)
│   ├── config/             # Configuration files
│   │   ├── cloudinary.js   # Cloudinary setup
│   │   └── database.js     # MongoDB connection
│   ├── models/             # Mongoose schemas
│   │   ├── Property.js     # Property model
│   │   ├── Location.js     # Location model
│   │   └── User.js         # User model
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── properties.js   # Property CRUD
│   │   ├── locations.js    # Location CRUD
│   │   └── analytics.js    # Analytics data
│   ├── middleware/         # Express middleware
│   │   ├── auth.js         # JWT authentication
│   │   └── upload.js       # Multer file upload
│   ├── server.js           # Main server file
│   ├── seed.js             # Database seeder
│   └── package.json
│
├── components/             # React components
│   ├── Layout.tsx
│   ├── MapView.tsx
│   └── PropertyCard.tsx
├── pages/                  # Page components
│   ├── Home.tsx
│   ├── Properties.tsx
│   ├── PropertyDetail.tsx
│   ├── AdminDashboard.tsx
│   └── Login.tsx
├── services/              # API services
│   └── api.ts            # API client
├── App.tsx               # Main app component
├── index.tsx             # Entry point
└── package.json
```

---

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Properties
- `GET /api/properties` - Get all properties (with optional filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (admin only)
- `PUT /api/properties/:id` - Update property (admin only)
- `DELETE /api/properties/:id` - Delete property (admin only)
- `POST /api/properties/:id/inquire` - Record inquiry

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:slug` - Get location by slug with properties
- `POST /api/locations` - Create location (admin only)
- `PUT /api/locations/:id` - Update location (admin only)
- `DELETE /api/locations/:id` - Delete location (admin only)

### Analytics
- `GET /api/analytics/overview` - Get dashboard analytics (admin only)
- `GET /api/analytics/property/:id` - Get property-specific analytics (admin only)

---

## 🎨 Google Maps Integration

To add Google Maps:

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Maps JavaScript API" and "Places API"
3. Add key to `.env.local`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```
4. Update `MapView.tsx` to use the API

---

## 📤 Image Upload Guide

### Using Cloudinary Dashboard (Quick Method)

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Click **Media Library** → **Upload**
3. Upload property images
4. Copy the image URL
5. When creating properties via API, use these URLs

### Using API (Recommended)

Send POST request with `multipart/form-data`:

```javascript
const formData = new FormData();
formData.append('title', 'Luxury Apartment');
formData.append('price', '5000000');
formData.append('images', file1);
formData.append('images', file2);

// API will auto-upload to Cloudinary
```

---

## 🚢 Deployment

### Backend (Render/Railway/Heroku)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Add environment variables
4. Deploy!

### Frontend (Vercel/Netlify)

1. Update `VITE_API_URL` to production backend URL
2. Deploy via:
   ```powershell
   npm run build
   ```
3. Upload `dist/` folder to hosting

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```powershell
# Start MongoDB service (Windows)
net start MongoDB

# OR use MongoDB Atlas cloud database
```

### Cloudinary Upload Fails

**Problem:** `401 Unauthorized`

**Solution:** Verify credentials in `.env` are correct from [Cloudinary Console](https://cloudinary.com/console)

### JWT Authentication Error

**Problem:** `Invalid token`

**Solution:** Clear browser localStorage and login again

---

## 📞 Business Information

- **Business:** Addis Luxury Estates
- **Agent:** Mesay Werku
- **Phone:** 098 302 0552
- **Location:** Bole Road, Addis Ababa, Ethiopia

---

## 📝 License

This project is proprietary and confidential.

---

## 🤝 Support

For technical support, contact the development team.

**Built with ❤️ for luxury real estate in Addis Ababa**

