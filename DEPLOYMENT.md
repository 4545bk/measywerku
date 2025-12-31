# 🚀 Homezy Deployment Guide

Complete guide to deploy your Homezy Real Estate Platform to production.

---

## 📦 What You'll Deploy

- **Frontend:** React + Vite (Static files)
- **Backend:** Express.js API + MongoDB
- **Images:** Cloudinary (already cloud-based)

---

## 🎯 Recommended Hosting

### Frontend Options
1. **Vercel** (Recommended) - Free tier, automatic deployments
2. **Netlify** - Free tier, easy setup
3. **GitHub Pages** - Free, but requires routing config

### Backend Options
1. **Render** (Recommended) - Free tier, MongoDB support
2. **Railway** - Free $5 credit monthly
3. **Heroku** - Paid plans only now

### Database
1. **MongoDB Atlas** (Recommended) - Free 512MB cluster
2. **Self-hosted** - DigitalOcean, AWS EC2

---

## 🔧 Step-by-Step Deployment

## Part 1: Setup MongoDB Atlas (Database)

### 1. Create Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for free account
- Create organization and project

### 2. Create Cluster
```
1. Click "Build a Database"
2. Choose "FREE" (M0 Sandbox)
3. Select region (choose closest to Ethiopia, e.g., Frankfurt or Mumbai)
4. Cluster Name: "homezy-prod"
5. Click "Create"
```

### 3. Configure Database

**Create Database User:**
```
Security → Database Access → Add New Database User
- Authentication: Password
- Username: homezy_admin
- Password: [Generate secure password - SAVE THIS!]
- Database User Privileges: Atlas Admin
- Add User
```

**Whitelist IP Addresses:**
```
Security → Network Access → Add IP Address
- Access List Entry: 0.0.0.0/0 (Allow from anywhere)
- Comment: "Production Access"
- Confirm
```

### 4. Get Connection String
```
Database → Connect → Connect your application
- Driver: Node.js
- Version: 4.1 or later
- Copy connection string:

mongodb+srv://homezy_admin:<password>@homezy-prod.xxxxx.mongodb.net/?retryWrites=true&w=majority

Replace <password> with your actual password!
```

---

## Part 2: Deploy Backend (Render)

### 1. Prepare Code

**Create `render.yaml` in your `server/` folder:**

```yaml
services:
  - type: web
    name: homezy-api
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

### 2. Push to GitHub

```powershell
# Initialize git in server folder
cd server
git init
git add .
git commit -m "Initial backend commit"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/homezy-backend.git
git branch -M main
git push -u origin main
```

### 3. Deploy on Render

```
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your homezy-backend repository
5. Configure:
   - Name: homezy-api
   - Region: Frankfurt (closest to Ethiopia)
   - Branch: main
   - Root Directory: . (or leave blank)
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm start
   - Plan: Free
```

### 4. Add Environment Variables

```
Environment → Add Environment Variable

Add each of these:

MONGODB_URI = [Your MongoDB Atlas connection string]
JWT_SECRET = [Generate random 64-character string]
CLOUDINARY_CLOUD_NAME = [From cloudinary.com]
CLOUDINARY_API_KEY = [From cloudinary.com]
CLOUDINARY_API_SECRET = [From cloudinary.com]
CLIENT_URL = https://homezy.vercel.app
NODE_ENV = production
PORT = 10000
```

**Generate JWT Secret:**
```powershell
# Run in PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### 5. Deploy
```
Click "Create Web Service"
Wait 3-5 minutes for deployment
Your API will be at: https://homezy-api.onrender.com
```

### 6. Seed Database

```powershell
# SSH into Render (or use Render Shell)
npm run seed

# Or manually via MongoDB Compass:
# Connect using Atlas connection string
# Import data from local database
```

---

## Part 3: Deploy Frontend (Vercel)

### 1. Update Frontend Environment

**Edit `.env.local`:**
```env
VITE_API_URL=https://homezy-api.onrender.com/api
VITE_BASE_URL=https://homezy.vercel.app
```

### 2. Update CORS in Backend

**Edit `server/server.js`:**
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://homezy.vercel.app',
    'https://www.homezy.com'  // If using custom domain
  ],
  credentials: true
}));
```

**Push update to GitHub:**
```powershell
git add server/server.js
git commit -m "Update CORS for production"
git push
```

### 3. Build Frontend Locally (Test)

```powershell
cd C:\Users\Biruh\Downloads\addis-luxury-estates

# Test production build
npm run build

# Preview production build
npm run preview
```

### 4. Push Frontend to GitHub

```powershell
# Initialize git in root folder
git init
git add .
git commit -m "Initial frontend commit"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/homezy-frontend.git
git branch -M main
git push -u origin main
```

### 5. Deploy on Vercel

```
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import homezy-frontend repository
5. Configure:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install
```

### 6. Add Environment Variables on Vercel

```
Settings → Environment Variables

Add:
VITE_API_URL = https://homezy-api.onrender.com/api
VITE_BASE_URL = https://homezy.vercel.app
```

### 7. Deploy

```
Click "Deploy"
Wait 2-3 minutes
Your site will be at: https://homezy.vercel.app
```

---

## Part 4: Custom Domain (Optional)

### Vercel (Frontend)

```
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Vercel → Settings → Domains
3. Add domain: homezy.com
4. Update DNS records:

Type  | Name | Value
------|------|-------
A     | @    | 76.76.21.21
CNAME | www  | cname.vercel-dns.com
```

### Render (Backend)

```
1. Render → Settings → Custom Domains
2. Add: api.homezy.com
3. Update DNS:

Type  | Name | Value
------|------|-------
CNAME | api  | [provided by Render]
```

### Update Environment Variables

**Vercel:**
```
VITE_API_URL = https://api.homezy.com/api
VITE_BASE_URL = https://homezy.com
```

**Render:**
```
CLIENT_URL = https://homezy.com
```

---

## 🔒 Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Generate strong JWT secret (64+ characters)
- [ ] Enable HTTPS only (automatic on Vercel/Render)
- [ ] Restrict MongoDB network access to specific IPs if possible
- [ ] Set up MongoDB database backups (Atlas auto-backups)
- [ ] Add rate limiting to API (express-rate-limit)
- [ ] Enable Cloudinary signed uploads
- [ ] Remove console.logs from production code
- [ ] Add error monitoring (Sentry.io)

---

## 📊 Post-Deployment

### 1. Test Everything

```
✅ Visit https://homezy.vercel.app
✅ Login with admin@homezy.com
✅ Create new property with image upload
✅ View property on public site
✅ Test filters and search
✅ Share property on WhatsApp/Telegram (check preview)
✅ Check analytics dashboard
✅ Test on mobile device
```

### 2. Setup Monitoring

**Render:**
- Free tier sleeps after 15 min inactivity
- Use UptimeRobot.com to ping API every 5 min

**Vercel:**
- Check Analytics dashboard for traffic
- Enable Web Analytics (free)

### 3. Database Backup

**MongoDB Atlas:**
```
Atlas → Backup → Configure
- Continuous Backup (M10+) or
- Serverless Snapshots (M0 Free Tier)
```

**Manual Backup:**
```powershell
# Export database
mongodump --uri="mongodb+srv://..." --out=./backup

# Import database
mongorestore --uri="mongodb+srv://..." ./backup
```

---

## 🐛 Common Deployment Issues

### Issue: Render Backend Sleeps (Free Tier)

**Problem:** API slow on first request (cold start)

**Solution:**
```
1. Use UptimeRobot to ping every 5 minutes:
   https://homezy-api.onrender.com/health

2. Or upgrade to paid plan ($7/month for always-on)
```

### Issue: Build Fails on Vercel

**Error:** `Module not found`

**Solution:**
```powershell
# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules, package-lock.json

# Reinstall
npm install

# Test build locally
npm run build

# Commit and push
git add .
git commit -m "Fix build"
git push
```

### Issue: CORS Errors in Production

**Error:** `Access to fetch has been blocked by CORS policy`

**Solution:**
```javascript
// server/server.js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Redeploy backend
git push
```

### Issue: Images Not Loading

**Error:** `Failed to load image`

**Solution:**
```
1. Check Cloudinary URLs are HTTPS
2. Verify Cloudinary API credentials
3. Check browser console for exact error
4. Test image URL directly in browser
```

### Issue: MongoDB Connection Failed

**Error:** `MongoServerError: authentication failed`

**Solution:**
```
1. Verify MongoDB Atlas connection string
2. Check username/password (no special characters without encoding)
3. Verify IP whitelist (0.0.0.0/0 for all IPs)
4. Check cluster is not paused (Atlas free tier auto-pauses after 60 days inactivity)
```

---

## 📈 Scaling Tips

### When Traffic Grows:

**Frontend (Vercel):**
- Auto-scales infinitely
- Add Vercel Pro for advanced analytics ($20/month)

**Backend (Render):**
- Upgrade to Standard ($7/month) for 24/7 uptime
- Upgrade to Standard Plus ($25/month) for auto-scaling

**Database (MongoDB Atlas):**
- M0 Free: 512MB storage
- M10 ($0.08/hr = ~$57/month): 10GB storage + backups
- M20 ($0.20/hr = ~$145/month): 20GB storage + advanced features

**Cloudinary:**
- Free: 25GB storage, 25GB bandwidth/month
- Paid plans from $99/month for higher limits

---

## 🎯 Performance Optimization

### Frontend

```javascript
// Enable code splitting
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// In router:
<Suspense fallback={<Loading />}>
  <AdminDashboard />
</Suspense>
```

### Backend

```javascript
// Add caching
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 }); // 10 min cache

router.get('/properties', async (req, res) => {
  const cacheKey = 'properties_' + JSON.stringify(req.query);
  
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);
  
  const data = await Property.find(query);
  cache.set(cacheKey, data);
  
  res.json(data);
});
```

### Images

```javascript
// Lazy load images
<img loading="lazy" src={url} alt={title} />

// Use Cloudinary auto-format
cloudinary.url(publicId, {
  fetch_format: 'auto',
  quality: 'auto:eco'
});
```

---

## ✅ Final Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Database on MongoDB Atlas
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active (auto on Vercel/Render)
- [ ] Environment variables set correctly
- [ ] Database seeded with initial data
- [ ] Admin credentials changed from defaults
- [ ] Social sharing tested (WhatsApp/Telegram previews)
- [ ] All features working in production
- [ ] Error monitoring setup
- [ ] Uptime monitoring setup
- [ ] Backup strategy in place

---

**🎉 Congratulations! Your Homezy platform is now LIVE!**

**Production URLs:**
- Frontend: https://homezy.vercel.app
- Backend API: https://homezy-api.onrender.com
- API Health: https://homezy-api.onrender.com/health

---

Need help? Check troubleshooting section or contact support.
