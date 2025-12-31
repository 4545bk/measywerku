# 🚀 Vercel Environment Variables Guide

When deploying your project to **Vercel**, you need to add "Environment Variables" so your app knows how to connect to the database, upload images, and secure passwords.

## 1️⃣ Go to Vercel Settings
1.  Open your project in the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Go to **Settings** (top tab).
3.  Click **Environment Variables** (side menu).

## 2️⃣ Add These Variables to "Production" & "Preview"

Copy these names and values from your local `.env` setup.

### **🅰️ Frontend Variables**
| Variable Name | Value Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | The URL of your backend API. | `https://your-backend.onrender.com/api` (or `/api` if deployed together) |

---

### **🅱️ Backend Variables** (If deploying backend to Vercel too)
*If you are deploying the backend separately (e.g. on Render), add these there instead!*

| Variable Name | Value Description |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB Connection String (from Atlas) |
| `JWT_SECRET` | A long random password (e.g. `mysecret123!@#`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary Secret |
| `CLIENT_URL` | Your Vercel Frontend URL (e.g. `https://ghion-homes.vercel.app`) |
| `GEMINI_API_KEY` | (Optional) Your Google Gemini API Key |

## 💡 Important Notes
- **Do not use quotes** around values in Vercel.
- After adding variables, **Redeploy** your project for changes to take effect (Deployment tab -> Redeploy).
