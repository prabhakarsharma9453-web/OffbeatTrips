/**
 * Test script to verify Azure Cosmos DB for MongoDB connection
 * Run with: node scripts/test-cosmos-connection.js
 * 
 * Make sure .env.local exists with AZURE_COSMOS_DB_CONNECTION_STRING or MONGODB_URI
 */

// Try to load dotenv if available
try {
  require('dotenv').config({ path: '.env.local' })
} catch (e) {
  // dotenv not installed, try to read .env.local manually
  try {
    const fs = require('fs')
    const path = require('path')
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8')
      envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
          const key = match[1].trim()
          const value = match[2].trim().replace(/^["']|["']$/g, '')
          process.env[key] = value
        }
      })
    }
  } catch (err) {
    console.warn('⚠️  Could not load .env.local automatically. Set environment variables manually.')
  }
}

const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || process.env.AZURE_COSMOS_DB_CONNECTION_STRING

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI or AZURE_COSMOS_DB_CONNECTION_STRING not found in .env.local')
  process.exit(1)
}

const isCosmosDB = MONGODB_URI.includes('cosmos.azure.com') || 
                   MONGODB_URI.includes('mongocluster') || 
                   MONGODB_URI.includes('.mongo.cosmos.azure.com')

console.log('🔍 Testing Connection...')
console.log(`📍 Type: ${isCosmosDB ? 'Azure Cosmos DB for MongoDB' : 'MongoDB'}`)
console.log(`🔗 Connection String: ${MONGODB_URI.substring(0, 50)}...`)

// Check connection string format
console.log('\n📋 Connection String Validation:')
console.log(`  ✓ Contains 'cosmos.azure.com': ${MONGODB_URI.includes('cosmos.azure.com') || MONGODB_URI.includes('.mongo.cosmos.azure.com')}`)
console.log(`  ✓ Contains 'ssl=true': ${MONGODB_URI.includes('ssl=true')}`)
console.log(`  ✓ Contains 'retrywrites=false': ${MONGODB_URI.includes('retrywrites=false')}`)
console.log(`  ✓ Contains 'replicaSet=globaldb': ${MONGODB_URI.includes('replicaSet=globaldb')}`)
console.log(`  ✓ Port 10255: ${MONGODB_URI.includes(':10255')}`)

if (isCosmosDB) {
  if (!MONGODB_URI.includes('ssl=true')) {
    console.warn('  ⚠️  Warning: Connection string should include ssl=true for Cosmos DB')
  }
  if (MONGODB_URI.includes('retrywrites=true')) {
    console.warn('  ⚠️  Warning: Connection string should have retrywrites=false for Cosmos DB')
  }
}

const opts = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
}

if (isCosmosDB) {
  opts.ssl = true
  opts.retryWrites = false
  opts.appName = '@travel-website@'
}

console.log('\n🔄 Attempting to connect...')

mongoose.connect(MONGODB_URI, opts)
  .then(() => {
    console.log('✅ Connection successful!')
    console.log(`📊 Database: ${mongoose.connection.name}`)
    console.log(`🌐 Host: ${mongoose.connection.host}`)
    console.log(`🔌 Port: ${mongoose.connection.port}`)
    
    // Test a simple operation
    return mongoose.connection.db.admin().ping()
  })
  .then(() => {
    console.log('✅ Ping successful!')
    console.log('\n🎉 All tests passed! Your Cosmos DB connection is working.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Connection failed!')
    console.error(`Error: ${error.message}`)
    
    if (isCosmosDB) {
      console.error('\n💡 Troubleshooting tips for Azure Cosmos DB:')
      
      if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
        console.error('  • Check your connection string - verify account name and key are correct')
        console.error('  • Ensure you copied the PRIMARY connection string from Azure Portal')
      } else if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
        console.error('  • Check firewall rules in Azure Portal - ensure your IP is allowed')
        console.error('  • Verify the connection string hostname is correct')
        console.error('  • Try enabling "Allow access from Azure portal" in firewall settings')
      } else if (error.message.includes('SSL')) {
        console.error('  • Ensure ssl=true is in your connection string')
      } else if (error.message.includes('retryWrites')) {
        console.error('  • Ensure retrywrites=false is in your connection string')
      }
      
      console.error('\n📖 See AZURE_COSMOS_DB_TROUBLESHOOTING.md for detailed help')
    }
    
    process.exit(1)
  })
