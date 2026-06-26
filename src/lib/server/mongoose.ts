import mongoose from 'mongoose';
import { env } from '@/config/env';

/**
 * Global is used here to maintain a cached connection across hot-reloads
 * in development. This prevents connections from growing exponentially.
 */
interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseGlobal: MongooseGlobal | undefined;
}

let cached = global.mongooseGlobal;

if (!cached) {
  cached = global.mongooseGlobal = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Pooling for high concurrent user support
      autoIndex: true, // Auto build indexes in development
    };

    console.log('🔄 Connecting to MongoDB database...');
    cached!.promise = mongoose.connect(env.MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB database connected successfully');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ MongoDB database connection error:', err);
      cached!.promise = null; // Reset promise to allow retrying
      throw err;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.conn = null;
    throw e;
  }

  return cached!.conn;
}

export async function disconnectDB() {
  if (cached!.conn) {
    await mongoose.disconnect();
    cached!.conn = null;
    cached!.promise = null;
    console.log('🔌 MongoDB database disconnected');
  }
}
