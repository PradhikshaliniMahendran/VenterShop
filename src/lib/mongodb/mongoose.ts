import mongoose from 'mongoose';
import dns from 'dns';

// Ensure DNS servers resolve SRV records reliably across all platforms
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in environments where setServers is restricted
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless invocations. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const uri =
    process.env.MONGODB_URI ||
    'mongodb+srv://admin:QrHRyJyAtULbJ3oZ@cluster0.hkdskxf.mongodb.net/ventershop?retryWrites=true&w=majority&appName=Cluster0';

  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable in Vercel settings or .env.local');
  }

  if (cached && cached.conn) {
    return cached.conn;
  }

  if (cached && !cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    if (cached) {
      cached.conn = await cached.promise;
    }
  } catch (e) {
    if (cached) {
      cached.promise = null;
    }
    throw e;
  }

  return cached?.conn;
}
