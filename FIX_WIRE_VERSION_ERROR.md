# Fix: Wire Protocol Version Mismatch Error

## The Error

```
Server at offbeattrips-mongodb.mongo.cosmos.azure.com:10255 reports maximum wire version 6, 
but this version of the Node.js Driver requires at least 8 (MongoDB 4.2)
```

## What This Means

- Your Azure Cosmos DB account is using **MongoDB API version 3.2 or 3.6** (wire protocol 6)
- Mongoose 9.x requires **MongoDB 4.2+** (wire protocol 8+)
- These versions are incompatible

## Solution 1: Upgrade Azure Cosmos DB (Recommended) ✅

### Option A: Upgrade Existing Account

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Cosmos DB account: `offbeattrips-mongodb`
3. Check the current API version:
   - Go to **Overview** → Look for "API" or "MongoDB API version"
   - Or go to **Features** → Check MongoDB version

4. **If you see version 3.2 or 3.6:**
   - Unfortunately, Azure Cosmos DB doesn't support in-place upgrades from 3.2/3.6 to 4.0+
   - You'll need to create a new account (see Option B)

### Option B: Create New Account with API 4.0+

1. **Create a new Cosmos DB account:**
   - Go to Azure Portal → **Create a resource**
   - Search for **Azure Cosmos DB**
   - Click **Create** → Select **Azure Cosmos DB for MongoDB**
   - Fill in details:
     - **Account Name**: `offbeattrips-mongodb-v4` (or similar)
     - **API Version**: Select **4.0** or **5.0** (recommended: **5.0**)
     - **Location**: Same region as your other resources
     - **Capacity mode**: Serverless (for dev) or Provisioned (for production)
   - Click **Review + create** → **Create**

2. **Get the new connection string:**
   - Go to the new Cosmos DB account
   - Navigate to **Connection strings**
   - Copy the **Primary connection string**

3. **Update your `.env.local`:**
   ```env
   AZURE_COSMOS_DB_CONNECTION_STRING=mongodb://new-account:key@new-account.mongo.cosmos.azure.com:10255/database?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@new-account@
   ```

4. **Migrate data (if needed):**
   - Export data from old account
   - Import to new account
   - Or use Azure Data Factory for migration

5. **Update your application:**
   - Restart your dev server
   - Test the connection

## Solution 2: Downgrade Mongoose (Not Recommended) ⚠️

If you can't upgrade Cosmos DB, you can downgrade Mongoose:

```bash
npm install mongoose@^6.13.0
```

**Note**: This is not recommended because:
- You'll lose features from Mongoose 9.x
- Older versions may have security issues
- Future updates will be harder

## Solution 3: Use MongoDB Atlas (Alternative)

If upgrading Cosmos DB is not possible, consider using MongoDB Atlas:

1. Create a free MongoDB Atlas account
2. Create a cluster (free tier available)
3. Get connection string
4. Update `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ```

## How to Check Your Current API Version

### Method 1: Azure Portal
1. Go to your Cosmos DB account
2. Check **Overview** page for API version
3. Or go to **Features** → Look for MongoDB version

### Method 2: Connection String
- If connection string has `mongocluster` → Likely 3.2
- If connection string has `.mongo.cosmos.azure.com` → Could be 3.6, 4.0, or 5.0
- Check Azure Portal to confirm

### Method 3: Test Connection
- The error message will tell you the wire version
- Wire version 6 = MongoDB 3.2/3.6
- Wire version 8+ = MongoDB 4.2+

## Recommended Action

**Create a new Cosmos DB account with MongoDB API 5.0:**

1. ✅ Best compatibility with Mongoose 9.x
2. ✅ Latest features and performance
3. ✅ Better security
4. ✅ Future-proof

## After Upgrading

1. Update `.env.local` with new connection string
2. Restart dev server: `npm run dev`
3. You should see: `✅ Azure Cosmos DB for MongoDB connected successfully`

## Need Help?

- [Azure Cosmos DB MongoDB API Versions](https://docs.microsoft.com/azure/cosmos-db/mongodb/feature-support-42)
- [Mongoose Compatibility](https://mongoosejs.com/docs/compatibility.html)
- [Azure Cosmos DB Upgrade Guide](https://docs.microsoft.com/azure/cosmos-db/mongodb/upgrade-account)
