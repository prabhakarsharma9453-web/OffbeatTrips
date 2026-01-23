# Quick Fix: Wire Version Error

## The Problem

Your Azure Cosmos DB account uses MongoDB API 3.2/3.6 (wire version 6), but Mongoose 9.x needs MongoDB 4.2+ (wire version 8+).

## Quick Fix Options

### Option 1: Upgrade Cosmos DB (Best) ⭐

**Create a new Cosmos DB account with API 5.0:**

1. Azure Portal → Create resource → Azure Cosmos DB for MongoDB
2. Set **API version to 5.0** (or 4.0 minimum)
3. Copy new connection string
4. Update `.env.local`:
   ```env
   AZURE_COSMOS_DB_CONNECTION_STRING=mongodb://new-account:key@new-account.mongo.cosmos.azure.com:10255/db?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@new-account@
   ```
5. Restart server: `npm run dev`

### Option 2: Downgrade Mongoose (Temporary)

```bash
npm install mongoose@^6.13.0
npm run dev
```

⚠️ **Not recommended** - you'll lose Mongoose 9 features.

## Why This Happened

- Your Cosmos DB account: MongoDB API 3.2/3.6 (old)
- Mongoose 9.x: Requires MongoDB 4.2+ (new)
- **Solution**: Upgrade Cosmos DB to API 4.0 or 5.0

## See Full Guide

See `FIX_WIRE_VERSION_ERROR.md` for detailed instructions.
