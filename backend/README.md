# Backend API Server

Divine Journeys CMS Backend - Express API running on port 17182

##  Quick Start

### Installation

```bash
npm install
```

### Start Server

```bash
npm start
```

Or with auto-reload:

```bash
npm run dev
```

Server runs on: **http://localhost:17182**

##  API Endpoints

### Get All Blogs
```bash
GET /blogs
```
Returns: Array of blog cards (id, slug, title, subtitle, author, date, thumbnail)

### Get Single Blog
```bash
GET /blogs/:id
GET /blogs/:slug
```
Returns: Full blog object with content, tags, quotes, images

### Create Blog
```bash
POST /blogs
Content-Type: application/json

{
  "title": "Blog Title",
  "subtitle": "Description",
  "category": "Travel",
  "author": "Author Name",
  "date": "2024-10-15",
  "thumbnailImage": "https://...",
  "coverImage": "https://...",
  "content": "Blog content",
  "tags": ["tag1", "tag2"],
  "quotes": ["quote1"],
  "additionalImages": ["image1"]
}
```

### Update Blog
```bash
PUT /blogs/:id
Content-Type: application/json

{ ...updated fields... }
```

### Delete Blog
```bash
DELETE /blogs/:id
```

### Get All Blogs (Admin)
```bash
GET /admin/blogs
```
Returns: All blogs including full content (for admin panel)

### Health Check
```bash
GET /health
```

## 💾 Data Storage

Data is stored in memory (in `blogs` array).

**Important**: Data will be lost when server restarts. For persistent storage, add a database.

## 🔧 Configuration

In `server.js`:

```javascript
const PORT = 17182; // Change this to use different port
```

### CORS

Currently allows requests from any origin. In production, restrict this:

```javascript
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
```

## 📦 Dependencies

- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `uuid` - Generate unique IDs

## 🧪 Test the API

### Using cURL

```bash
# Get all blogs
curl http://localhost:17182/blogs

# Create a blog
curl -X POST http://localhost:17182/blogs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","subtitle":"Description","author":"John","date":"2024-10-15"}'
```

### Using Postman

1. Import these endpoints into Postman
2. Send requests to `http://localhost:17182/...`

## 📝 Sample Request/Response

### Request
```json
POST /blogs
{
  "title": "The Mystical Ganga Aarti",
  "subtitle": "A complete guide to the evening ritual",
  "category": "Varanasi",
  "author": "Travel Expert",
  "date": "2024-10-15",
  "content": "As the sun sets over Varanasi..."
}
```

### Response
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "slug": "the-mystical-ganga-aarti",
    "title": "The Mystical Ganga Aarti",
    ...
  }
}
```

## 🛠️ Troubleshooting

### Port Already in Use

If port 17182 is in use, change it in `server.js`:

```bash
# Find what's using the port
lsof -i :17182

# Or use a different port
const PORT = 17183;
```

### Module Not Found

```bash
npm install
```

### Cannot POST /blogs

Make sure you're sending correct Content-Type header:
```
Content-Type: application/json
```

## 📖 Documentation

See [CMS-SETUP.md](../CMS-SETUP.md) for full system documentation
