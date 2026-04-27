import 'dotenv/config';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Create a single MongoClient instance for the entire application
// This enables connection reuse and pooling
let cachedClient = null;
let cachedDb = null;

/**
 * Connects to MongoDB with optimized pooling configuration
 * 
 * Connection pool is configured for a traditional long-running server (OLTP workload):
 * - maxPoolSize: 50 - supports typical concurrent requests with headroom
 * - minPoolSize: 15 - pre-warmed connections ready for incoming traffic
 * - maxIdleTimeMS: 600000 (10 min) - maintains stable connections on a persistent server
 * - connectTimeoutMS: 10000 (10s) - fail fast on connection issues
 * - socketTimeoutMS: 30000 (30s) - prevent hanging queries typical of OLTP operations
 */
export async function connectToDatabase() {
  // Return cached client if already connected
  if (cachedClient) {
    console.log('Using cached MongoDB client');
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 50,           // Supports ~40 concurrent operations with 20% buffer
    minPoolSize: 15,           // Pre-warmed connections for traffic spikes
    maxIdleTimeMS: 600000,     // Release unused connections after 10 minutes
    connectTimeoutMS: 10000,   // Fail fast if connection can't be established
    socketTimeoutMS: 30000,    // Timeout for operations (typical OLTP duration)
    serverSelectionTimeoutMS: 5000, // Quick failover for replica set changes
    retryWrites: true,         // Enable automatic retries (already in connection string)
  });

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');

    // Verify connection by pinging the database
    const adminDb = client.db('admin');
    await adminDb.command({ ping: 1 });
    console.log('✅ MongoDB ping successful - connection verified');

    // Cache the client and database for reuse
    cachedClient = client;
    cachedDb = client.db('varanasi-ayodhya');

    return { client: cachedClient, db: cachedDb };
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

/**
 * Closes the MongoDB connection gracefully
 * Call this on application shutdown
 */
export async function closeDatabase() {
  if (cachedClient) {
    console.log('Closing MongoDB connection...');
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('MongoDB connection closed');
  }
}

export async function getDb() {
  if (!cachedDb) {
    const { db } = await connectToDatabase();
    return db;
  }
  return cachedDb;
}
