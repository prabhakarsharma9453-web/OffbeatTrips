// Check if we're in Edge Runtime (middleware)
// @ts-ignore - EdgeRuntime is available in Edge Runtime
const isEdgeRuntime = typeof EdgeRuntime !== 'undefined' || process.env.NEXT_RUNTIME === 'edge'

// Support both regular MongoDB and Azure Cosmos DB for MongoDB
// Azure Cosmos DB uses the same connection string format as MongoDB
const MONGODB_URI = process.env.MONGODB_URI || process.env.AZURE_COSMOS_DB_CONNECTION_STRING

if (!MONGODB_URI && !isEdgeRuntime) {
  throw new Error('Please define the MONGODB_URI or AZURE_COSMOS_DB_CONNECTION_STRING environment variable inside .env.local')
}

// Detect if this is Azure Cosmos DB
const isCosmosDB = MONGODB_URI?.includes('cosmos.azure.com') || 
                   MONGODB_URI?.includes('mongocluster') || 
                   MONGODB_URI?.includes('.mongo.cosmos.azure.com')

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

  if (!MONGODB_URI) {
    throw new Error('MongoDB connection string is not defined')
  }

  // Dynamically import mongoose only when needed (not in Edge Runtime)
  const mongoose = await import('mongoose').then(m => m.default)

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    // Azure Cosmos DB specific connection options
    const opts: any = {
      bufferCommands: false,
      // Server selection timeout
      serverSelectionTimeoutMS: 10000, // 10 seconds
      // Socket timeout
      socketTimeoutMS: 45000, // 45 seconds
    }

    // Add Cosmos DB specific options
    if (isCosmosDB) {
      opts.ssl = true
      opts.retryWrites = false // Cosmos DB doesn't support retryWrites
      opts.appName = '@travel-website@'
      
      // Ensure SSL is in connection string
      if (!MONGODB_URI.includes('ssl=true')) {
        console.warn('⚠️ Azure Cosmos DB connection string should include ssl=true')
      }
      
      // Ensure retryWrites=false is in connection string
      if (MONGODB_URI.includes('retrywrites=true')) {
        console.warn('⚠️ Azure Cosmos DB requires retrywrites=false in connection string')
      }
    }

    console.log(`🔄 Attempting to connect to ${isCosmosDB ? 'Azure Cosmos DB for MongoDB' : 'MongoDB'}...`)
    console.log(`📍 Connection string: ${MONGODB_URI.substring(0, 50)}...`)

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((connectedMongoose: any) => {
        console.log(`✅ ${isCosmosDB ? 'Azure Cosmos DB for MongoDB' : 'MongoDB'} connected successfully`)
        console.log(`📊 Database: ${connectedMongoose.connection.name || 'default'}`)
        return connectedMongoose
      })
      .catch((error: any) => {
        console.error('❌ Connection failed:', error.message)
        
        // Provide helpful error messages
        if (isCosmosDB) {
          if (error.message.includes('wire version') || error.message.includes('requires at least')) {
            console.error('\n🔴 CRITICAL: Wire Protocol Version Mismatch')
            console.error('Your Azure Cosmos DB account is using an older MongoDB API version.')
            console.error('This version of Mongoose requires MongoDB 4.2+ (wire protocol 8+)')
            console.error('\n📋 Solution: Upgrade your Azure Cosmos DB account to MongoDB API 4.0 or higher')
            console.error('   1. Go to Azure Portal → Your Cosmos DB Account')
            console.error('   2. Create a new Cosmos DB account with MongoDB API version 4.0 or 5.0')
            console.error('   3. Update your connection string in .env.local')
            console.error('\n💡 Note: Mongoose 6.x is currently installed for compatibility with older Cosmos DB versions')
          } else if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
            console.error('💡 Tip: Check your Azure Cosmos DB connection string - verify account name and key are correct')
          } else if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
            console.error('💡 Tip: Check firewall rules in Azure Portal - ensure your IP is allowed')
            console.error('💡 Tip: Verify the connection string hostname is correct')
          } else if (error.message.includes('SSL')) {
            console.error('💡 Tip: Ensure ssl=true is in your connection string')
          }
        }
        
        // Clear the promise so we can retry
        cached.promise = null
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    const error = e as Error
    throw new Error(
      `Failed to connect to ${isCosmosDB ? 'Azure Cosmos DB' : 'MongoDB'}: ${error.message}`
    )
  }

  return cached.conn
}

export default connectDB
