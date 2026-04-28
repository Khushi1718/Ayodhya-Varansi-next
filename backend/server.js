import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase, closeDatabase, getDb } from './db.js';
import { ObjectId } from 'mongodb';

const app = express();
const PORT = 17182;

// Middleware
app.use(cors());
// Increase payload size limit to 50MB to handle base64 encoded images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Add no-cache headers to all responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// DATABASE CONNECTION 
// Initialize database connection on server start

let db = null;

async function initializeDatabase() {
  try {
    const { db: database } = await connectToDatabase();
    db = database;
    
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    if (!collectionNames.includes('blogs')) {
      await db.createCollection('blogs');
      console.log('Created "blogs" collection');
      
      // Insert sample blog if collection is empty
      const blogsCollection = db.collection('blogs');
      await blogsCollection.insertOne({
        id: 'blog-1',
        slug: 'ganga-aarti-guide',
        title: 'The Mystical Ganga Aarti: A Complete Guide to the Evening Ritual',
        subtitle: 'Discover the centuries-old evening ritual that transforms the banks of Varanasi',
        preview: 'Discover the centuries-old evening ritual that transforms the banks of Varanasi into a realm of divine light and spiritual awakening.',
        category: 'Varanasi',
        author: 'Divine Journeys Editorial',
        authorRole: 'Spiritual Travel Expert',
        date: 'October 15, 2024',
        readTime: '5 min read',
        thumbnailImage: 'https://images.unsplash.com/photo-1599299810694-b5ac2dd579c0?w=500&h=300',
        coverImage: 'https://images.unsplash.com/photo-1599299810694-b5ac2dd579c0?w=1200&h=600',
        tags: ['Spirituality', 'Ghats', 'Evening Ritual', 'Varanasi'],
        content: `As the sun begins to set over the ancient city of Varanasi, a profound transformation takes place along the banks of the sacred river.

The Ganga Aarti is not merely a visual spectacle; it is a meticulously choreographed sequence of offerings. Young priests, draped in traditional saffron and white silks, take their positions on elevated wooden platforms facing the river.

The ritual begins with the blowing of a conch shell, a sound that cuts through the chatter of the crowd and signals the start of the divine communion. What follows is an offering of the five elements to the river goddess: space, wind, fire, water, and earth.

To witness the Aarti is to see devotion made visible. It is the moment when the eternal soul of India speaks through fire and water.`,
        quotes: [
          'To witness the Aarti is to see devotion made visible. It is the moment when the eternal soul of India speaks through fire and water.'
        ],
        additionalImages: [
          'https://images.unsplash.com/photo-1599299810694-b5ac2dd579c0?w=800&h=600'
        ],
        createdAt: new Date().toISOString(),
        status: 'published'
      });
      console.log(' Inserted sample blog');
    }

    if (!collectionNames.includes('enquiries')) {
      await db.createCollection('enquiries');
      console.log('Created "enquiries" collection');
    }

    if (!collectionNames.includes('custom_packages')) {
      await db.createCollection('custom_packages');
      console.log('Created "custom_packages" collection');
    }

    if (!collectionNames.includes('packages')) {
      await db.createCollection('packages');
      console.log('Created "packages" collection');
      
      // Insert sample package if collection is empty
      const packagesCollection = db.collection('packages');
      await packagesCollection.insertOne({
        id: 'pkg-1',
        slug: 'divine-ayodhya-kashi-pilgrimage',
        title: 'Divine Ayodhya & Kashi Pilgrimage',
        destination: 'Ayodhya & Varanasi',
        duration: '5 Days / 4 Nights',
        durationCategory: '4-5',
        rating: 4.9,
        reviews: 128,
        price: '₹18,500',
        originalPrice: '₹24,000',
        savings: '₹5,500',
        about: "Embark on a deeply moving spiritual journey through two of India's most sacred cities. This curated experience takes you from the birthplace of Lord Rama in Ayodhya to the eternal ghats of Varanasi. Witness the spectacular Ganga Aarti, enjoy VIP darshan at key temples, and find peace with expert local guides who understand the true essence of these holy sites.",
        highlights: [
          "VIP Darshan at Ram Mandir, Ayodhya",
          "Private boat ride during the mesmerizing Ganga Aarti",
          "Exclusive Kashi Vishwanath Temple corridor tour",
          "Premium Heritage Hotel stays",
          "Chauffeur-driven AC vehicle for all transfers"
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Arrival in Ayodhya & Evening Aarti",
            desc: "Upon arrival in Ayodhya, our representative will greet you and transfer you to your premium hotel. In the evening, witness the divine Saryu River Aarti, a deeply peaceful experience to begin your pilgrimage."
          },
          {
            day: "Day 2",
            title: "Ram Mandir Darshan & Travel to Varanasi",
            desc: "Early morning VIP access to the grand Ram Mandir. After breakfast, we drive to Varanasi (approx 4 hours). Check into your heritage property by the ghats."
          }
        ],
        included: [
          "4 Nights premium accommodation",
          "Daily buffet breakfast",
          "Private AC vehicle for all transfers and sightseeing",
          "Expert English/Hindi speaking local guide",
          "VIP Darshan arrangements",
          "Private boat ride in Varanasi"
        ],
        excluded: [
          "Flight / Train tickets",
          "Lunch and Dinner",
          "Personal expenses",
          "Camera fees at monuments"
        ],
        faq: [
          {
            q: "Is the VIP Darshan guaranteed?",
            a: "Yes, our team pre-arranges the VIP access passes to ensure you have a smooth and uncrowded darshan experience."
          }
        ],
        images: {
          main: 'https://images.unsplash.com/photo-1599299810694-b5ac2dd579c0?w=1200&h=800',
          gallery: [
            'https://images.unsplash.com/photo-1599299810694-b5ac2dd579c0?w=600&h=400',
            'https://images.unsplash.com/photo-1599299810694-b5ac2dd579c0?w=600&h=400',
            'https://images.unsplash.com/photo-1599299810694-b5ac2dd579c0?w=600&h=400',
            'https://images.unsplash.com/photo-1599299810694-b5ac2dd579c0?w=600&h=400'
          ]
        },
        status: 'published',
        createdAt: new Date().toISOString()
      });
      console.log(' Inserted sample package');
    }
  } catch (error) {
    console.error(' Error initializing database:', error.message);
    throw error;
  }
}

// ============ BLOG API ============
app.get('/blogs', async (req, res) => {
  try {
    const blogsCollection = db.collection('blogs');
    const blogs = await blogsCollection.find({ status: 'published' }).toArray();
    const blogCards = blogs.map(blog => ({
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      subtitle: blog.subtitle,
      preview: blog.preview,
      category: blog.category,
      author: blog.author,
      date: blog.date,
      thumbnailImage: blog.thumbnailImage,
      status: blog.status || 'published'
    }));
    res.json({ success: true, data: blogCards, count: blogCards.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/blogs/:id', async (req, res) => {
  try {
    const blogsCollection = db.collection('blogs');
    const blog = await blogsCollection.findOne({
      $or: [{ id: req.params.id }, { slug: req.params.id }]
    });
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/blogs', async (req, res) => {
  try {
    const { title, subtitle, preview, category, author, authorRole = 'Travel Expert', date, readTime = '5 min read', thumbnailImage, coverImage, content, tags = [], quotes = [], additionalImages = [], status = 'published' } = req.body;
    if (!title || !subtitle || !author || !date) return res.status(400).json({ success: false, error: 'Missing required fields' });
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newBlog = { id: uuidv4(), slug, title, subtitle, preview: preview || subtitle, category: category || 'Travel', author, authorRole, date, readTime, thumbnailImage: thumbnailImage || coverImage || 'https://via.placeholder.com/500x300', coverImage: coverImage || thumbnailImage || 'https://via.placeholder.com/1200x600', content: content || '', tags: tags || [], quotes: quotes || [], additionalImages: additionalImages || [], status: status || 'published', createdAt: new Date().toISOString() };
    const blogsCollection = db.collection('blogs');
    await blogsCollection.insertOne(newBlog);
    res.status(201).json({ success: true, message: 'Blog created successfully', data: newBlog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/blogs/:id', async (req, res) => {
  try {
    const blogsCollection = db.collection('blogs');
    const existingBlog = await blogsCollection.findOne({ id: req.params.id });
    if (!existingBlog) return res.status(404).json({ success: false, error: 'Blog not found' });
    const updatedBlog = { ...existingBlog, ...req.body, id: req.params.id, updatedAt: new Date().toISOString() };
    await blogsCollection.updateOne({ id: req.params.id }, { $set: updatedBlog });
    res.json({ success: true, message: 'Blog updated successfully', data: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/blogs/:id', async (req, res) => {
  try {
    const blogsCollection = db.collection('blogs');
    await blogsCollection.deleteOne({ id: req.params.id });
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/admin/blogs', async (req, res) => {
  try {
    const blogsCollection = db.collection('blogs');
    const blogs = await blogsCollection.find().toArray();
    res.json({ success: true, data: blogs, count: blogs.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ PACKAGE API ============
app.get('/packages', async (req, res) => {
  try {
    const packagesCollection = db.collection('packages');
    const packages = await packagesCollection.find({ 
      $or: [
        { status: 'published' },
        { status: { $exists: false } }
      ]
    }).toArray();
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/packages/:id', async (req, res) => {
  try {
    const packagesCollection = db.collection('packages');
    // Try to find by custom id first, then by MongoDB _id
    const query = { $or: [{ id: req.params.id }, { slug: req.params.id }] };
    
    // Try MongoDB ObjectId if it matches the pattern
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: new ObjectId(req.params.id) });
    }
    
    const pkg = await packagesCollection.findOne(query);
    if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/packages', async (req, res) => {
  try {
    const pkgData = req.body;
    const slug = pkgData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newPackage = {
      ...pkgData,
      id: uuidv4(),
      slug,
      status: pkgData.status || 'published',
      createdAt: new Date().toISOString()
    };
    const packagesCollection = db.collection('packages');
    await packagesCollection.insertOne(newPackage);
    res.status(201).json({ success: true, data: newPackage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/packages/:id', async (req, res) => {
  try {
    const packagesCollection = db.collection('packages');
    
    // Build query to find by id or _id
    const query = { $or: [{ id: req.params.id }] };
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: new ObjectId(req.params.id) });
    }
    
    const existing = await packagesCollection.findOne(query);
    if (!existing) return res.status(404).json({ success: false, error: 'Package not found' });

    // Remove MongoDB-specific fields that shouldn't be updated
    const { _id, createdAt, ...updateData } = req.body;
    
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Remove _id from the update to prevent immutable field error
    delete updated._id;
    
    // Update by the same criteria used to find
    const updateQuery = existing.id 
      ? { id: existing.id }
      : { _id: existing._id };
    
    await packagesCollection.updateOne(updateQuery, { $set: updated });
    
    // Trigger Next.js revalidation for this package
    triggerRevalidation(updated.slug || updated.id || req.params.id);
    
    res.json({ success: true, data: updated, message: 'Package updated and cache cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to trigger Next.js ISR revalidation
async function triggerRevalidation(slug) {
  try {
    const nextAppUrl = process.env.NEXT_APP_URL || 'http://localhost:3000';
    const revalidateSecret = process.env.REVALIDATE_SECRET || 'your-secret-key';
    
    console.log(`🔄 Triggering revalidation for slug: ${slug}`);
    
    const response = await fetch(`${nextAppUrl}/api/revalidate-package`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, secret: revalidateSecret }),
    }).catch(err => {
      console.warn('⚠️ Could not trigger revalidation (Next.js app may be down):', err.message);
      return null;
    });
    
    if (response?.ok) {
      console.log(`✅ Revalidation triggered for: ${slug}`);
    }
  } catch (error) {
    console.warn('⚠️ Revalidation error (non-blocking):', error.message);
  }
}

app.delete('/packages/:id', async (req, res) => {
  try {
    const packagesCollection = db.collection('packages');
    
    // Build query to find by id or _id
    const query = { $or: [{ id: req.params.id }] };
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: new ObjectId(req.params.id) });
    }
    
    await packagesCollection.deleteOne(query);
    res.json({ success: true, message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/admin/packages', async (req, res) => {
  try {
    const packagesCollection = db.collection('packages');
    const packages = await packagesCollection.find().sort({ createdAt: -1 }).toArray();
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ ENQUIRY API ============
app.get('/enquiries', async (req, res) => {
  try {
    const enquiriesCollection = db.collection('enquiries');
    const enquiries = await enquiriesCollection.find().sort({ createdAt: -1 }).toArray();
    res.json({ success: true, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/enquiries', async (req, res) => {
  try {
    const enquiriesCollection = db.collection('enquiries');
    const newEnquiry = { ...req.body, id: uuidv4(), createdAt: new Date().toISOString(), status: 'pending' };
    await enquiriesCollection.insertOne(newEnquiry);
    res.status(201).json({ success: true, data: newEnquiry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/enquiries/:id', async (req, res) => {
  try {
    const enquiriesCollection = db.collection('enquiries');
    await enquiriesCollection.deleteOne({ id: req.params.id });
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ CUSTOM PACKAGES API ============
app.get('/custom-packages', async (req, res) => {
  try {
    const customPackagesCollection = db.collection('custom_packages');
    const packages = await customPackagesCollection.find().sort({ createdAt: -1 }).toArray();
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/custom-packages', async (req, res) => {
  try {
    const customPackagesCollection = db.collection('custom_packages');
    const newPackage = { ...req.body, id: uuidv4(), createdAt: new Date().toISOString(), status: 'pending' };
    await customPackagesCollection.insertOne(newPackage);
    res.status(201).json({ success: true, data: newPackage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/custom-packages/:id', async (req, res) => {
  try {
    const customPackagesCollection = db.collection('custom_packages');
    await customPackagesCollection.deleteOne({ id: req.params.id });
    res.json({ success: true, message: 'Custom package deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ HEALTH CHECK ============
app.get('/health', async (req, res) => {
  try {
    const blogsCollection = db.collection('blogs');
    const blogsCount = await blogsCollection.countDocuments();
    res.json({ success: true, message: 'Server is running', port: PORT, database: 'connected', blogsCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Health check failed', error: error.message });
  }
});

// ============ SERVER STARTUP ============
async function startServer() {
  try {
    await initializeDatabase();
    const server = app.listen(PORT, () => {
      console.log(`\n Backend running on http://localhost:${PORT}`);
    });

    process.on('SIGINT', async () => {
      server.close(async () => {
        await closeDatabase();
        process.exit(0);
      });
    });

    process.on('SIGTERM', async () => {
      server.close(async () => {
        await closeDatabase();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(' Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
