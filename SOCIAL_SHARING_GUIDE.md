# 📱 Telegram/WhatsApp Sharing Integration Guide

## 🎯 Goal
When someone shares a property link on Telegram or WhatsApp, they should see:
- ✅ Property image preview
- ✅ Property title
- ✅ Price and location
- ✅ "View Property" button

---

## 🔧 Implementation

### Step 1: Update Your `index.html`

Your existing `index.html` already has basic meta tags. Update it to be **dynamic** based on the property being viewed.

**File: `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title id="page-title">Homezy - Luxury Real Estate in Addis Ababa</title>
  <meta name="title" content="Homezy - Luxury Real Estate in Addis Ababa">
  <meta name="description" content="Discover premium properties in Addis Ababa with Mesay Werku">
  
  <!-- Open Graph / Facebook / Telegram -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://homezy.com/">
  <meta property="og:title" id="og-title" content="Homezy - Luxury Real Estate">
  <meta property="og:description" id="og-description" content="Discover premium properties in Addis Ababa">
  <meta property="og:image" id="og-image" content="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://homezy.com/">
  <meta property="twitter:title" id="twitter-title" content="Homezy - Luxury Real Estate">
  <meta property="twitter:description" id="twitter-description" content="Discover premium properties">
  <meta property="twitter:image" id="twitter-image" content="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80">
  
  <!-- WhatsApp Specific -->
  <meta property="og:site_name" content="Homezy Real Estate">
  <meta property="og:locale" content="en_US">
  
  <link rel="icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>
```

---

### Step 2: Create Dynamic Meta Tag Updater

**File: `utils/metaTags.ts`** (Create this new file)

```typescript
interface MetaTagsConfig {
  title: string;
  description: string;
  image: string;
  url: string;
}

export const updateMetaTags = (config: MetaTagsConfig) => {
  // Update page title
  document.title = config.title;
  
  // Update meta tags
  const metaTags = {
    'og:title': config.title,
    'og:description': config.description,
    'og:image': config.image,
    'og:url': config.url,
    'twitter:title': config.title,
    'twitter:description': config.description,
    'twitter:image': config.image,
    'twitter:url': config.url,
  };
  
  Object.entries(metaTags).forEach(([property, content]) => {
    let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    
    if (!element) {
      element = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
    }
    
    if (element) {
      element.setAttribute('content', content);
    }
  });
};

export const formatPriceETB = (price: number) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0
  }).format(price);
};
```

---

### Step 3: Update PropertyDetail Page

**File: `pages/PropertyDetail.tsx`**

Add this code at the top of your component:

```typescript
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateMetaTags, formatPriceETB } from '../utils/metaTags';
import api from '../services/api';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.properties.getById(id);
        const prop = response.data.property;
        setProperty(prop);

        // Update meta tags for social sharing
        updateMetaTags({
          title: `${prop.title} - ${formatPriceETB(prop.price)} | Homezy`,
          description: `${prop.bedrooms} Bed, ${prop.bathrooms} Bath • ${prop.size}sqm • ${prop.locationId.name} • ${prop.purpose} - ${prop.description.substring(0, 150)}...`,
          image: prop.images[0].url, // Use Cloudinary URL
          url: window.location.href
        });
      } catch (error) {
        console.error('Failed to load property:', error);
      }
    };

    fetchProperty();
  }, [id]);

  // Rest of your component...
};
```

---

### Step 4: Cloudinary Image Optimization

When uploading images via Cloudinary, ensure they're optimized for social sharing:

**Server: `server/config/cloudinary.js`**

The existing code already handles this, but here's the key part:

```javascript
transformation: [
  { 
    width: 1200, 
    height: 630,  // Perfect for Open Graph
    crop: 'fill', 
    quality: 'auto:good',
    format: 'jpg'  // Better compatibility
  }
]
```

---

### Step 5: Generate Share Links with Previews

**Update your PropertyDetail component:**

```typescript
// WhatsApp share link
const shareOnWhatsApp = () => {
  const text = `🏠 ${property.title}\n\n💰 Price: ${formatPriceETB(property.price)}\n📍 Location: ${property.locationId.name}\n🛏️ ${property.bedrooms} Bed | 🚿 ${property.bathrooms} Bath\n\nView Details: ${window.location.href}`;
  
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

// Telegram share link
const shareOnTelegram = () => {
  const text = `${property.title} - ${formatPriceETB(property.price)}`;
  const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

// Add share buttons to your UI
<div className="flex gap-4">
  <button onClick={shareOnWhatsApp} className="btn-share">
    📱 Share on WhatsApp
  </button>
  <button onClick={shareOnTelegram} className="btn-share">
    ✈️ Share on Telegram
  </button>
</div>
```

---

## 🧪 Testing Social Previews

### Method 1: Telegram Bot
1. Send property link to yourself via Telegram
2. Link should show image preview automatically

### Method 2: WhatsApp
1. Share link via WhatsApp
2. Preview appears after a few seconds

### Method 3: Facebook Debugger (Also works for Telegram/WhatsApp)
1. Go to: https://developers.facebook.com/tools/debug/
2. Paste your property URL
3. Click "Scrape Again" to refresh cache
4. View preview

### Method 4: LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/

---

## 🔍 Debug Checklist

If previews don't show:

✅ **Image URL is publicly accessible**
```javascript
// Test by opening image URL in browser
console.log(property.images[0].url);
```

✅ **Image dimensions are correct**
- Minimum: 200x200px
- Recommended: 1200x630px (our setting)

✅ **Meta tags are in `<head>`**
```html
<!-- Must be in <head>, not <body> -->
```

✅ **HTTPS (for production)**
```
http://localhost:5173 ← Works for testing
https://homezy.com ← Required for production
```

✅ **Clear cache**
```
WhatsApp/Telegram cache previews for 7 days.
Use Facebook Debugger to force refresh.
```

---

## 📸 Cloudinary Image Best Practices

### For Social Sharing

```javascript
// When creating property, transform images
const optimizedUrl = cloudinary.url('homezy/property-1.jpg', {
  width: 1200,
  height: 630,
  crop: 'fill',
  quality: 'auto:best',
  format: 'jpg',
  secure: true  // Use HTTPS
});
```

### For Property Gallery

```javascript
// Thumbnail
const thumbnail = cloudinary.url(publicId, {
  width: 400,
  height: 300,
  crop: 'fill',
  quality: 'auto:good'
});

// Full size
const fullSize = cloudinary.url(publicId, {
  width: 1920,
  height: 1080,
  crop: 'limit',
  quality: 'auto:best'
});
```

---

## 🌐 Production Deployment Notes

### Before Deploying:

1. **Update base URL in meta tags**
```typescript
// Instead of window.location.href
const productionUrl = `https://homezy.com/property/${id}`;
```

2. **Use environment variable**
```typescript
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';
updateMetaTags({
  url: `${BASE_URL}/property/${id}`
});
```

3. **Add canonical URL**
```html
<link rel="canonical" href="https://homezy.com/property/123">
```

---

## 📊 Analytics for Shares

### Track Social Shares

**Backend: Add endpoint to track shares**

```javascript
// routes/analytics.js
router.post('/properties/:id/share', async (req, res) => {
  const { platform } = req.body; // 'whatsapp', 'telegram', 'facebook'
  
  // Log share event
  await Property.findByIdAndUpdate(req.params.id, {
    $inc: { [`shares.${platform}`]: 1 }
  });
  
  res.json({ success: true });
});
```

**Frontend: Call when sharing**

```typescript
const shareOnWhatsApp = async () => {
  // Record share
  await api.analytics.recordShare(property.id, 'whatsapp');
  
  // Open WhatsApp
  window.open(shareUrl, '_blank');
};
```

---

## 🎨 Share Button Component

Create a reusable share component:

**File: `components/ShareButtons.tsx`**

```typescript
import { Share2, MessageCircle, Send } from 'lucide-react';

interface ShareButtonsProps {
  property: {
    title: string;
    price: number;
    location: string;
    url: string;
  };
}

export const ShareButtons = ({ property }: ShareButtonsProps) => {
  const shareText = `🏠 ${property.title}\n💰 ${formatPrice(property.price)}\n📍 ${property.location}\n\nView: ${property.url}`;

  const platforms = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      color: 'bg-green-500'
    },
    {
      name: 'Telegram',
      icon: Send,
      url: `https://t.me/share/url?url=${encodeURIComponent(property.url)}&text=${encodeURIComponent(property.title)}`,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="flex gap-3">
      {platforms.map((platform) => (
        <button
          key={platform.name}
          onClick={() => window.open(platform.url, '_blank')}
          className={`${platform.color} text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition`}
        >
          <platform.icon size={18} />
          {platform.name}
        </button>
      ))}
    </div>
  );
};
```

---

## ✅ Final Verification

Test your implementation:

1. **Create a property** with real Cloudinary image
2. **Visit property detail page**
3. **Check meta tags** (View Page Source, look for `<meta property="og:image">`)
4. **Share on Telegram** - Should show image preview
5. **Share on WhatsApp** - Should show image preview

**Expected Result:**
```
┌─────────────────────────┐
│  [Property Image]       │
│                         │
│  Luxury Penthouse...    │
│  ETB 45,000,000         │
│  Bole • 4 Bed • 4 Bath  │
│                         │
│  [View Property] →      │
└─────────────────────────┘
```

---

🎉 **You're all set! Your property links will now show beautiful previews when shared on Telegram and WhatsApp!**
