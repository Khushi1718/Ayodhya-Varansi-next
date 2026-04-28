# CMS & MongoDB Integration Setup Guide

## ✅ System Status

### Backend Connection
- **Status**: ✅ Running on port 17182
- **MongoDB**: ✅ Connected
- **Cache Headers**: ✅ Configured (no-cache)

### Database Collections
- `packages` - Package details from CMS
- `blogs` - Blog articles  
- `enquiries` - User inquiries
- `custom_packages` - Custom package requests

---

## 🔧 Updates Made

### 1. **Cache-Control Headers** 
✅ All API responses now include:
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### 2. **Frontend Data Fetching**
✅ Package detail page (`/app/packages/[slug]/page.tsx`):
- Uses Next.js API route `/api/packages/[slug]` (not direct backend calls)
- Includes cache-busting with timestamp parameter
- Added "Refresh" button for manual data refresh
- FAQ data loads from CMS automatically

### 3. **Next.js API Route**
✅ Created `/app/api/packages/[slug]/route.ts`:
- Sets `revalidate: 0` (no caching)
- Returns proper no-cache headers
- Routes requests through Next.js

### 4. **Automatic Revalidation**
✅ When a package is updated in CMS:
1. Backend updates MongoDB
2. Backend triggers `/api/revalidate-package` endpoint
3. Next.js purges cached data
4. Frontend gets fresh data on next request

---

## 🚀 How to Test CMS Updates

### Test 1: Update a Package via API
```bash
# Get a package
curl http://localhost:17182/admin/packages | jq '.data[0]'

# Update it with new FAQ
curl -X PUT http://localhost:17182/packages/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "faq": [
      {"q": "Is this dynamic?", "a": "Yes, from CMS!"},
      {"q": "Does it update?", "a": "Yes, automatically!"}
    ]
  }'
```

### Test 2: Verify Frontend Refresh
1. Open package in browser: `http://localhost:3000/packages/draft-package`
2. Check that FAQ loads from CMS
3. Click "Refresh" button to force fresh data
4. Update package via CMS
5. Click "Refresh" again - should see new data

### Test 3: Check Cache Headers
```bash
# Verify no-cache headers
curl -I http://localhost:17182/packages/draft-package

# Should show:
# Cache-Control: no-cache, no-store, must-revalidate
# Pragma: no-cache
# Expires: 0
```

---

## 📋 CMS Package Fields

When creating/updating packages in CMS, use this structure:

```json
{
  "title": "Package Name",
  "destination": "City/Region",
  "duration": "5 Days / 4 Nights",
  "durationCategory": "4-5",
  "rating": 4.9,
  "reviews": 128,
  "price": "₹18,500",
  "originalPrice": "₹24,000",
  "savings": "₹5,500",
  "about": "Detailed description...",
  "highlights": ["Point 1", "Point 2", "Point 3"],
  "itinerary": [
    {"day": "Day 1", "title": "Title", "desc": "Description"},
    {"day": "Day 2", "title": "Title", "desc": "Description"}
  ],
  "included": ["Item 1", "Item 2"],
  "excluded": ["Item 1", "Item 2"],
  "faq": [
    {"q": "Question?", "a": "Answer."},
    {"q": "Question?", "a": "Answer."}
  ],
  "images": {
    "main": "https://url.jpg",
    "gallery": ["https://url1.jpg", "https://url2.jpg", "https://url3.jpg", "https://url4.jpg"]
  },
  "status": "published"
}
```

---

## 🔄 FAQ Section Update Flow

### What Updates Dynamically (from CMS):
✅ Package title, description, price
✅ Highlights, itinerary, inclusions/exclusions
✅ **FAQ Questions and Answers** (from `.faq` field)
✅ Images and gallery

### What Stays Static (for all packages):
✅ Testimonials (from dummy data)
✅ Review stats distribution (from dummy data)
✅ Stats section data (from dummy data)

To make testimonials/stats dynamic, add these fields to your package schema and CMS.

---

## 🛠️ Environment Variables

**Frontend (.env.local)**:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:17182
NEXT_PUBLIC_APP_URL=http://localhost:3000
REVALIDATE_SECRET=your_revalidate_secret_change_in_production
MONGODB_URI=your_mongodb_connection_string
```

**Backend (.env)**:
```
MONGODB_URI=your_mongodb_connection_string
NEXT_APP_URL=http://localhost:3000
REVALIDATE_SECRET=your_revalidate_secret_change_in_production
```

---

## 🎯 Next Steps for Production

1. **Change REVALIDATE_SECRET**: Use a strong, unique value
2. **Update NEXT_PUBLIC_APP_URL**: Set to your production domain
3. **MongoDB**: Already configured with proper connection
4. **Deploy**: Backend and Frontend can be deployed separately
5. **Cache Strategy**: Adjust ISR revalidation times as needed

---

## 🐛 Troubleshooting

### Package updates not showing:
- [ ] Check browser cache (Cmd+Shift+R hard refresh)
- [ ] Click "Refresh" button on package page
- [ ] Verify REVALIDATE_SECRET is same in both .env files
- [ ] Check backend is running: `curl http://localhost:17182/health`

### FAQ not displaying:
- [ ] Ensure FAQ data is in the correct format
- [ ] Check that `faq` field is not null/empty
- [ ] Verify package was created with FAQ data

### Revalidation not triggering:
- [ ] Check backend console for revalidation logs
- [ ] Verify Next.js app is running on correct URL
- [ ] Check NEXT_APP_URL in backend .env

---

## 📊 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/packages` | GET | Get all published packages |
| `/packages/:id` | GET | Get single package by ID or slug |
| `/packages/:id` | PUT | Update package (triggers revalidation) |
| `/admin/packages` | GET | Get all packages (including drafts) |
| `/api/packages/[slug]` | GET | Next.js API route (with cache control) |
| `/api/revalidate-package` | POST | Trigger Next.js ISR revalidation |

---

Generated: April 28, 2026
