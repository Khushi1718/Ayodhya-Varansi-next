import { MongoClient, Db } from "mongodb";

const DB_NAME = process.env.MONGODB_DB || "varanasi-ayodhya";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

function getClientPromise() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("Please define MONGO_URI (or MONGODB_URI) in environment variables.");
  }

  if (!global.__mongoClientPromise__) {
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 30,
      minPoolSize: 5,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
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
