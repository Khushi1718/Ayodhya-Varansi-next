import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGODB_DB || "varanasi-ayodhya";

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI in environment variables.");
}

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

const client = new MongoClient(MONGO_URI, {
  maxPoolSize: 30,
  minPoolSize: 5,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
});

const clientPromise =
  global.__mongoClientPromise__ ?? (global.__mongoClientPromise__ = client.connect());

export async function getDb(): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(DB_NAME);
}

