# Azure Quick Start Guide

## Quick Setup Checklist

### 1. Azure Cosmos DB for MongoDB
- [ ] Create Cosmos DB account in Azure Portal
- [ ] Copy connection string from **Connection strings** section
- [ ] Add to `.env.local`: `AZURE_COSMOS_DB_CONNECTION_STRING=...`

### 2. Azure Blob Storage
- [ ] Create Storage Account in Azure Portal
- [ ] Create container named `travel-website` with **Blob** public access
- [ ] Copy connection string from **Access keys** section
- [ ] Add to `.env.local`: `AZURE_STORAGE_CONNECTION_STRING=...`

### 3. Install Dependencies
```bash
npm install
```

### 4. Test
```bash
npm run dev
```

Check console for: `✅ Azure Cosmos DB for MongoDB connected successfully`

## Environment Variables Template

```env
# Azure Cosmos DB
AZURE_COSMOS_DB_CONNECTION_STRING=mongodb://account:key@account.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@account@

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=account;AccountKey=key;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=travel-website

# NextAuth (existing)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
```

## What Changed?

✅ **Database**: Now uses Azure Cosmos DB for MongoDB (MongoDB-compatible)
✅ **File Storage**: Now uses Azure Blob Storage instead of Cloudinary
✅ **All upload routes**: Updated to use Azure Blob Storage
✅ **Backward compatible**: Existing MongoDB connection strings still work

## Need Help?

See `AZURE_SETUP_GUIDE.md` for detailed instructions.
