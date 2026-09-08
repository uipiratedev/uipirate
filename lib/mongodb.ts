import dns from "node:dns";

import mongoose from "mongoose";

// A local stub resolver (VPN client, Docker, corporate proxy) or a router that
// only advertises a link-local IPv6 DNS server makes Node's resolver fail the
// mongodb+srv SRV lookup with `querySrv ECONNREFUSED`. When the only configured
// resolvers are loopback, fall back to public DNS for the SRV lookup.
// Override the fallback list with MONGODB_DNS_SERVERS="1.1.1.1,8.8.8.8".
const dnsOverride = process.env.MONGODB_DNS_SERVERS?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const currentServers = dns.getServers();
const onlyLoopback =
  currentServers.length === 0 ||
  currentServers.every((s) => s.startsWith("127.") || s === "::1");

if (dnsOverride?.length) {
  dns.setServers(dnsOverride);
} else if (onlyLoopback) {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

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
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
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
