import { MongoClient, Db } from "mongodb";

const DB_NAME = process.env.MONGODB_DB || "varanasi-ayodhya";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
  var __dbIndexesEnsured__: boolean;
}

function getClientPromise() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("Please define MONGO_URI (or MONGODB_URI) in environment variables.");
  }

  if (!global.__mongoClientPromise__) {
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 50,
      minPoolSize: 5,
      connectTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      serverSelectionTimeoutMS: 5_000,
      readPreference: "nearest",
      retryWrites: true,
      retryReads: true,
    });
    global.__mongoClientPromise__ = client.connect();
  }

  return global.__mongoClientPromise__;
}

export async function getDb(): Promise<Db> {
  const clientPromise = getClientPromise();
  const connectedClient = await clientPromise;
  return connectedClient.db(DB_NAME);
}

/**
 * Ensures all performance-critical MongoDB indexes exist.
 * Idempotent — safe to call on every cold start.
 */
export async function ensureIndexes(): Promise<void> {
  if (global.__dbIndexesEnsured__) return;
  try {
    const db = await getDb();

    const blogs = db.collection("blogs");
    // Run each individually so one failure doesn't block the rest
    await Promise.allSettled([
      blogs.createIndex({ slug: 1 }, { unique: true, sparse: true }),
      blogs.createIndex({ id: 1 }, { unique: true, sparse: true }),
      blogs.createIndex({ status: 1, date: -1 }),
      blogs.createIndex({ title: "text" }),
    ]);

    const packages = db.collection("packages");
    await Promise.allSettled([
      packages.createIndex({ slug: 1 }, { unique: true, sparse: true }),
      packages.createIndex({ id: 1 }, { unique: true, sparse: true }),
      packages.createIndex({ status: 1, createdAt: -1 }),
    ]);

    const enquiries = db.collection("enquiries");
    await enquiries.createIndex({ createdAt: -1 }).catch(() => null);

    global.__dbIndexesEnsured__ = true;
    console.log("[DB] Indexes verified ✓");
  } catch (err) {
    console.error("[DB] Index creation warning:", err);
  }
}
