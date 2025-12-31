# 🔧 Homezy Backend Integration - Complete Setup Guide

## 📊 What We've Built

You now have a **production-grade full-stack real estate platform** with:

### ✅ Backend Features
- **Express.js API** with RESTful architecture
- **MongoDB Database** with Mongoose ORM
- **JWT Authentication** with role-based access (Admin/Agent)
- **Cloudinary Integration** for professional image management
- **Advanced Analytics** API with aggregation pipelines
- **File Upload System** with validation and optimization
- **Error Handling** and request validation

### ✅ Frontend Integration Ready
- **API Service Layer** (`services/api.ts`)
- **Type-Safe Interfaces** matching backend models
- **Authentication Flow** ready for JWT tokens
- **Existing Beautiful UI** remains untouched

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Install MongoDB

**Option A: Local Installation (Windows)**
```powershell
# Download from: https://www.mongodb.com/try/download/community
# After installation, start MongoDB:
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Whitelist your IP address
6. Create database user

### Step 2: Get Cloudinary Credentials

1. Sign up at https://cloudinary.com/users/register/free
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

### Step 3: Setup Backend

```powershell
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env
notepad .env
```

**Edit `.env` with your credentials:**

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/homezy

# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/homezy

JWT_SECRET=change_this_to_random_string_123456789

CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Step 4: Seed Database

```powershell
npm run seed
```

**Expected Output:**
```
✅ MongoDB Connected
✅ Database seeded successfully!

📊 Summary:
- Users: 1
- Locations: 5
- Properties: 4

🔐 Admin Credentials:
Email: admin@homezy.com
Password: mesay123
```

### Step 5: Start Backend

```powershell
npm run dev
```

**You should see:**
```
╔═══════════════════════════════════════╗
║     🏠 HOMEZY API SERVER READY 🏠    ║
║  Port: 5000                           ║
╚═══════════════════════════════════════╝
```

### Step 6: Test API (Optional)

Open new terminal:

```powershell
# Test health check
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@homezy.com","password":"mesay123"}'
```

### Step 7: Update Frontend Environment

```powershell
# Back to root directory
cd ..

# Create frontend environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start frontend
npm run dev
```

---

## 🔌 Integrating API into Your Existing Frontend

### Current vs New Architecture

**BEFORE (Current):**
```typescript
// constants.tsx
export const INITIAL_PROPERTIES = [...];  // ← Hardcoded data
```

**AFTER (With Backend):**
```typescript
// Using API service
import api from './services/api';

const properties = await api.properties.getAll();
```

---

## 📝 Implementation Examples

### 1. Update Login Page

**File: `pages/Login.tsx`**

Replace the existing login logic with:

```typescript
import api from '../services/api';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await api.auth.login(email, password);
    
    // Store authentication
    localStorage.setItem('isAdminAuthenticated', 'true');
    localStorage.setItem('authToken', response.data.token);
    
    // Navigate to admin
    navigate('/admin');
  } catch (error) {
    alert(error.message);
  }
};
```

### 2. Update Properties Page

**File: `pages/Properties.tsx`**

```typescript
import { useState, useEffect } from 'react';
import api from '../services/api';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.properties.getAll({
          type: selectedType,
          location: selectedLocation
        });
        setProperties(response.data.properties);
      } catch (error) {
        console.error('Failed to load properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [selectedType, selectedLocation]);

  if (loading) return <div>Loading...</div>;

  return (
    // Your existing JSX with {properties.map(...)}
  );
};
```

### 3. Update Admin Dashboard

**File: `pages/AdminDashboard.tsx`**

```typescript
import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.analytics.getOverview();
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div>
      <h1>Total Properties: {analytics?.overview.totalProperties}</h1>
      <h2>Total Views: {analytics?.overview.totalViews}</h2>
      {/* Rest of your beautiful UI */}
    </div>
  );
};
```

### 4. Record Inquiries on Property Detail

**File: `pages/PropertyDetail.tsx`**

```typescript
import api from '../services/api';

const handleWhatsAppClick = async () => {
  // Record inquiry in database
  try {
    await api.properties.recordInquiry(propertyId);
  } catch (error) {
    console.error('Failed to record inquiry:', error);
  }
  
  // Open WhatsApp
  window.open(`https://wa.me/251983020552?text=...`);
};
```

---

## 🎨 Creating Property with Image Upload

### Admin Form Example

```typescript
const handleCreateProperty = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('size', size);
  formData.append('bedrooms', bedrooms);
  formData.append('bathrooms', bathrooms);
  formData.append('type', type);
  formData.append('purpose', purpose);
  formData.append('locationId', locationId);
  formData.append('featured', featured);
  formData.append('amenities', JSON.stringify(amenities));
  
  // Add images
  for (let i = 0; i < imageFiles.length; i++) {
    formData.append('images', imageFiles[i]);
  }
  
  try {
    const response = await api.properties.create(formData);
    alert('Property created successfully!');
    // Refresh list or navigate
  } catch (error) {
    alert('Failed to create property: ' + error.message);
  }
};
```

---

## 🗺️ Adding Google Maps

### 1. Get API Key
https://console.cloud.google.com/

Enable:
- Maps JavaScript API
- Places API

### 2. Add to Frontend Environment

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### 3. Install React Google Maps

```powershell
npm install @react-google-maps/api
```

### 4. Update MapView Component

```typescript
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapView = ({ lat, lng }) => {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        center={{ lat, lng }}
        zoom={15}
        mapContainerStyle={{ width: '100%', height: '400px' }}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </LoadScript>
  );
};
```

---

## 📊 Database Models Reference

### Property Schema
```javascript
{
  title: String,
  description: String,
  price: Number,
  size: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  type: 'Apartment' | 'Villa' | 'Commercial' | 'Consultancy',
  purpose: 'Sale' | 'Rent' | 'Investment',
  locationId: ObjectId,
  images: [{
    url: String,
    publicId: String,
    isPrimary: Boolean
  }],
  featured: Boolean,
  views: Number,
  inquiries: Number,
  status: 'active' | 'sold' | 'rented' | 'inactive'
}
```

### Location Schema
```javascript
{
  name: String,
  description: String,
  lat: Number,
  lng: Number,
  slug: String,
  seoTitle: String,
  seoDescription: String
}
```

### User Schema
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: 'admin' | 'agent',
  avatar: { url, publicId },
  phone: String,
  isActive: Boolean
}
```

---

## 🔒 Authentication Flow

### How JWT Works

1. **User logs in** → Backend verifies credentials
2. **Backend generates JWT token** with userId
3. **Frontend stores token** in localStorage
4. **All protected requests** include token in header:
   ```
   Authorization: Bearer <token>
   ```
5. **Backend validates token** before processing request

### Protecting Routes

```typescript
// In your route guard
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// In your admin routes
if (!isAuthenticated()) {
  navigate('/login');
}
```

---

## 🚀 Next Steps

### Phase 1: Basic Integration ✅
- [x] Backend setup
- [x] Database models
- [x] API routes
- [x] Authentication
- [x] Cloudinary integration

### Phase 2: Frontend Integration (Your Task)
- [ ] Update Login page to use API
- [ ] Update Properties page to fetch from API
- [ ] Update Admin Dashboard with real analytics
- [ ] Create Property Management forms
- [ ] Create Location Management forms
- [ ] Update PropertyDetail to show database properties

### Phase 3: Advanced Features
- [ ] Add Google Maps integration
- [ ] Implement property favorites
- [ ] Add property comparison feature
- [ ] Email notifications via Nodemailer
- [ ] SMS notifications via Twilio

---

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# If not started:
net start MongoDB
```

### Issue: Cloudinary Upload 401

**Error:** `Cloudinary upload failed: 401 Unauthorized`

**Solution:**
- Double-check credentials in `.env`
- Ensure no extra spaces
- Verify API key is not expired

### Issue: CORS Error

**Error:** `Access to fetch has been blocked by CORS policy`

**Solution:**
Edit `server/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  credentials: true
}));
```

### Issue: JWT Invalid Token

**Error:** `Invalid token`

**Solution:**
```javascript
// Clear localStorage and login again
localStorage.clear();
```

---

## 📞 Support & Resources

- **MongoDB Docs:** https://docs.mongodb.com/
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Express.js Guide:** https://expressjs.com/en/guide/routing.html
- **JWT.io:** https://jwt.io/ (debug tokens)

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] MongoDB is connected
- [ ] Cloudinary credentials work
- [ ] Can login with admin credentials
- [ ] Can create property with image
- [ ] Can view properties on frontend
- [ ] Analytics dashboard shows data
- [ ] JWT authentication works
- [ ] Inquiries are recorded
- [ ] Location-based filtering works

---

**🎉 Congratulations! Your backend is ready. Now integrate it with your beautiful frontend UI!**

Need help? Review the code examples above or check the API documentation in the main README.

