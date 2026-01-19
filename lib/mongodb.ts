// Check if we're in Edge Runtime (middleware)
// @ts-ignore - EdgeRuntime is available in Edge Runtime
const isEdgeRuntime = typeof EdgeRuntime !== 'undefined' || process.env.NEXT_RUNTIME === 'edge'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI && !isEdgeRuntime) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

interface MongooseCache {
  conn: any | null
  promise: Promise<any> | null
}

// Use global variable to cache the connection in development
declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function connectDB() {
  // Don't connect in Edge Runtime
  if (isEdgeRuntime) {
    throw new Error('MongoDB connection is not available in Edge Runtime')
  }

  // Dynamically import mongoose only when needed (not in Edge Runtime)
  const mongoose = await import('mongoose').then(m => m.default)

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((connectedMongoose: any) => {
      console.log('✅ MongoDB connected successfully')
      return connectedMongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
