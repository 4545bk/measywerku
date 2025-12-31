# ⚡ QUICK START - Get Running in 5 Minutes

This guide gets Homezy running on your local machine **fast**.

---

## ✅ Prerequisites Check

Before starting, ensure you have:

- [ ] **Node.js** installed (v18+) - Check: `node --version`
- [ ] **MongoDB** installed OR **MongoDB Atlas** account
- [ ] **Cloudinary** account (free tier) - [Sign up](https://cloudinary.com)

---

## 🚀 5-Minute Setup

### Step 1: Get Cloudinary Credentials (2 minutes)

1. Go to https://cloudinary.com/users/register/free
2. Sign up for free account
3. After login, go to **Dashboard**
4. Copy these three values:
   ```
   Cloud Name: _______________
   API Key: _______________
   API Secret: _______________
   ```

---

### Step 2: Setup Backend (2 minutes)

```powershell
# Navigate to server folder
cd C:\Users\Biruh\Downloads\addis-luxury-estates\server

# Install dependencies (takes ~1 minute)
npm install

# Create environment file
Copy-Item .env.example .env

# Edit .env file (paste your Cloudinary credentials)
notepad .env
```

**Paste this into `.env`** (update with your Cloudinary values):

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/homezy

# JWT Secret
JWT_SECRET=homezy_secret_key_12345_change_in_production

# Cloudinary (UPDATE THESE!)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Server Config
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Save and close** (`Ctrl+S`, then `Alt+F4`)

---

### Step 3: Start MongoDB (30 seconds)

**Option A: Local MongoDB**
```powershell
# Check if MongoDB is running
net start MongoDB
```

**Option B: Use MongoDB Atlas (Cloud)**
If you prefer cloud database:
1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` with your Atlas connection string

---

### Step 4: Seed Database (30 seconds)

```powershell
# Still in server/ folder
npm run seed
```

**Expected output:**
```
✅ MongoDB Connected
✅ Database seeded successfully!

🔐 Admin Credentials:
Email: admin@homezy.com
Password: mesay123
```

---

### Step 5: Start Backend (10 seconds)

```powershell
npm run dev
```

**Expected output:**
```
╔═══════════════════════════════════════╗
║     🏠 HOMEZY API SERVER READY 🏠    ║
║  Port: 5000                           ║
╚═══════════════════════════════════════╝
```

✅ **Backend is now running at:** http://localhost:5000

**Leave this terminal open!**

---

### Step 6: Start Frontend (30 seconds)

**Open a NEW PowerShell terminal:**

```powershell
# Go back to root folder
cd C:\Users\Biruh\Downloads\addis-luxury-estates

# Install frontend dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Expected output:**
```
VITE v6.x.x  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ **Frontend is now running at:** http://localhost:5173

---

## 🎯 Test Your Setup

### 1. Visit Frontend
Open browser: http://localhost:5173

You should see the **Homezy** homepage with:
- Agent profile (Mesay Werku)
- Featured properties
- Navigation menu

### 2. Test Admin Panel
1. Click **Admin** or go to: http://localhost:5173/admin
2. **Login with:**
   - Email: `admin@homezy.com`
   - Password: `mesay123`
3. You should see the **Analytics Dashboard**

### 3. Test API
Open: http://localhost:5000/health

You should see:
```json
{
  "success": true,
  "message": "Homezy API is running"
}
```

---

## ✅ Success! What's Next?

Your setup is complete! Here's what you can do now:

### Explore Features

1. **Browse Properties**
   - Visit http://localhost:5173/properties
   - Try filters (type, location)

2. **View Property Details**
   - Click any property
   - Check image gallery
   - See location info

3. **Admin Dashboard**
   - View analytics
   - Check property stats
   - See location distribution

### Start Development

Read the integration guides:

1. **INTEGRATION_GUIDE.md** - How to connect frontend to API
2. **SOCIAL_SHARING_GUIDE.md** - Setup Telegram/WhatsApp previews
3. **DEPLOYMENT.md** - Deploy to production when ready

---

## 🛑 Troubleshooting

### Error: MongoDB Connection Failed

**Problem:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```powershell
# Start MongoDB service
net start MongoDB

# Or use MongoDB Atlas (cloud) instead
```

### Error: Port 5000 Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in server/.env
# PORT=5001
```

### Error: Cloudinary Upload Fails

**Problem:** `401 Unauthorized`

**Solution:**
- Double-check credentials in `server/.env`
- Ensure Cloud Name, API Key, API Secret are correct
- Verify Cloudinary account is active

### Frontend Shows "Failed to fetch"

**Problem:** `TypeError: Failed to fetch`

**Solution:**
```powershell
# Ensure backend is running
# Check http://localhost:5000/health

# If not running:
cd server
npm run dev
```

---

## 📝 Quick Reference

### Admin Credentials
```
Email: admin@homezy.com
Password: mesay123
```

### URLs
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
Admin:    http://localhost:5173/admin
API Docs: See README.md
```

### Commands
```powershell
# Start Backend
cd server
npm run dev

# Start Frontend
cd ..
npm run dev

# Reseed Database
cd server
npm run seed
```

---

## 🎉 You're All Set!

Both frontend and backend are running. Your beautiful UI is connected to a powerful backend with:

✅ MongoDB database
✅ Cloudinary image storage
✅ JWT authentication
✅ RESTful API
✅ Advanced analytics

**Next:** Read `INTEGRATION_GUIDE.md` to start integrating the API into your frontend pages.

---

**Need help?** Check the troubleshooting section above or refer to:
- `README.md` - Full documentation
- `INTEGRATION_GUIDE.md` - Code examples
- `PROJECT_SUMMARY.md` - Complete feature list

