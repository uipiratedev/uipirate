import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;

    // Auto-migration: rename "blogs" collection to "posts" if needed
    const db = cached.conn.connection.db;

    if (db) {
      const collections = await db.listCollections().toArray();
      const hasBlogs = collections.some((c) => c.name === "blogs");
      const hasPosts = collections.some((c) => c.name === "posts");

      if (hasBlogs && !hasPosts) {
        console.log(
          "Migration: Renaming database collection 'blogs' to 'posts'...",
        );
        await db.renameCollection("blogs", "posts").catch((err) => {
          console.error("Migration warning during collection rename:", err);
        });
      }
    }
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
