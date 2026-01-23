# Azure Setup Guide - Cosmos DB & Blob Storage

This guide will help you set up Azure Cosmos DB for MongoDB and Azure Blob Storage for your Next.js travel website application.

## Prerequisites

- An Azure account (sign up at [https://azure.microsoft.com](https://azure.microsoft.com) - free tier available)
- Azure CLI or Azure Portal access
- Your Next.js application

## Part 1: Azure Cosmos DB for MongoDB Setup

### Step 1: Create Azure Cosmos DB Account

1. Log in to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource** → Search for **Azure Cosmos DB**
3. Click **Create** and select **Azure Cosmos DB for MongoDB**
4. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing
   - **Account Name**: Choose a unique name (e.g., `travel-website-cosmos`)
   - **Location**: Select the closest region
   - **Capacity mode**: Choose **Provisioned throughput** (or Serverless for development)
   - **Version**: Select **4.0** or **5.0** (recommended)
5. Click **Review + create** → **Create**
6. Wait for deployment to complete (2-5 minutes)

### Step 2: Get Connection String

1. Go to your Cosmos DB account in Azure Portal
2. Navigate to **Connection strings** in the left menu
3. Copy the **Primary connection string** (it looks like):
   ```
   mongodb://travel-website-cosmos:xxxxx@travel-website-cosmos.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@travel-website-cosmos@
   ```

### Step 3: Create Database and Collections

The application will automatically create collections when you first use them. However, you can also create them manually:

1. Go to **Data Explorer** in your Cosmos DB account
2. Click **New Database**
3. Enter database name (e.g., `travel-website`)
4. Click **OK**
5. Collections will be created automatically when models are used

## Part 2: Azure Blob Storage Setup

### Step 1: Create Storage Account

1. In Azure Portal, click **Create a resource** → Search for **Storage account**
2. Click **Create** and fill in:
   - **Subscription**: Select your subscription
   - **Resource Group**: Use the same as Cosmos DB
   - **Storage account name**: Choose a unique name (e.g., `travelwebsitestorage`)
   - **Region**: Select the same region as Cosmos DB
   - **Performance**: Standard
   - **Redundancy**: LRS (Locally-redundant storage) for development, or GRS for production
3. Click **Review + create** → **Create**
4. Wait for deployment (1-2 minutes)

### Step 2: Get Connection String

1. Go to your Storage Account in Azure Portal
2. Navigate to **Access keys** in the left menu
3. Click **Show** next to **key1** connection string
4. Copy the connection string (it looks like):
   ```
   DefaultEndpointsProtocol=https;AccountName=travelwebsitestorage;AccountKey=xxxxx;EndpointSuffix=core.windows.net
   ```

### Step 3: Create Container

1. Go to **Containers** in your Storage Account
2. Click **+ Container**
3. Enter container name: `travel-website`
4. Set **Public access level** to **Blob** (for public read access to images)
5. Click **Create**

## Part 3: Configure Environment Variables

### For Local Development

1. Create or update `.env.local` file in your project root:

```env
# Azure Cosmos DB for MongoDB
AZURE_COSMOS_DB_CONNECTION_STRING=mongodb://your-account:your-key@your-account.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@your-account@

# Or use MONGODB_URI (backward compatible)
MONGODB_URI=mongodb://your-account:your-key@your-account.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@your-account@

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=your-account;AccountKey=your-key;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=travel-website

# NextAuth (keep existing)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (optional, keep existing)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### For Azure Web App Deployment

1. Go to your Azure Web App in Azure Portal
2. Navigate to **Configuration** → **Application settings**
3. Add the following environment variables:
   - `AZURE_COSMOS_DB_CONNECTION_STRING` = your Cosmos DB connection string
   - `AZURE_STORAGE_CONNECTION_STRING` = your Storage account connection string
   - `AZURE_STORAGE_CONTAINER_NAME` = `travel-website`
   - Keep all existing environment variables (NEXTAUTH_URL, NEXTAUTH_SECRET, etc.)
4. Click **Save**

### For GitHub Actions (if using)

Add these secrets to your GitHub repository:
1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. Add new secrets:
   - `AZURE_COSMOS_DB_CONNECTION_STRING`
   - `AZURE_STORAGE_CONNECTION_STRING`
   - `AZURE_STORAGE_CONTAINER_NAME`

## Part 4: Install Dependencies

Run the following command to install Azure Blob Storage SDK:

```bash
npm install @azure/storage-blob
```

The package.json has already been updated with this dependency.

## Part 5: Verify Setup

### Test Cosmos DB Connection

1. Start your development server: `npm run dev`
2. Check the console for: `✅ Azure Cosmos DB for MongoDB connected successfully`
3. Visit any page that uses the database to verify connection

### Test Blob Storage

1. Log in to your admin panel
2. Try uploading an image through any admin form
3. Check that the image URL is an Azure Blob Storage URL (format: `https://your-account.blob.core.windows.net/travel-website/images/...`)

## Migration from Cloudinary (Optional)

If you have existing images in Cloudinary:

1. **Option 1**: Keep Cloudinary URLs in database (they will still work)
2. **Option 2**: Migrate images:
   - Download images from Cloudinary
   - Upload to Azure Blob Storage
   - Update database records with new URLs

## Cost Optimization Tips

### Cosmos DB:
- Use **Serverless** mode for development/testing
- Use **Provisioned throughput** with autoscale for production
- Start with 400 RU/s and adjust based on usage
- Enable **Analytical Store** only if needed

### Blob Storage:
- Use **Hot** access tier for frequently accessed images
- Use **Cool** or **Archive** for old/unused images
- Enable **Lifecycle management** to automatically move old blobs to cheaper tiers
- Use **LRS** (Locally-redundant storage) for development
- Use **ZRS** or **GRS** for production

## Security Best Practices

1. **Never commit connection strings to Git**
   - Always use `.env.local` for local development
   - Use Azure Key Vault for production secrets

2. **Use Managed Identity** (recommended for production):
   - Enable Managed Identity on your Azure Web App
   - Grant access to Cosmos DB and Storage Account
   - Remove connection strings from environment variables

3. **Network Security**:
   - Use **Private Endpoints** for production
   - Configure **Firewall rules** to restrict access
   - Enable **Azure Defender** for Cosmos DB

4. **Access Control**:
   - Use **Role-Based Access Control (RBAC)** in Azure
   - Limit permissions to minimum required
   - Rotate access keys regularly

## Troubleshooting

### Cosmos DB Connection Issues

**Error: "Connection timeout"**
- Check firewall rules in Cosmos DB account
- Verify connection string is correct
- Ensure SSL is enabled in connection string

**Error: "Authentication failed"**
- Verify connection string includes correct account name and key
- Check if account key has been rotated

### Blob Storage Issues

**Error: "Container not found"**
- The container will be created automatically on first upload
- Or create it manually in Azure Portal

**Error: "Access denied"**
- Verify connection string is correct
- Check container public access level (should be "Blob" for public images)
- Verify storage account access keys

**Images not displaying**
- Check CORS settings in Storage Account
- Verify container public access level
- Check blob URLs are correct

### General Issues

**Error: "Module not found: @azure/storage-blob"**
- Run `npm install` to install dependencies

**Environment variables not loading**
- Restart development server after adding `.env.local`
- Verify variable names match exactly (case-sensitive)
- Check `.env.local` is in project root

## Next Steps

1. ✅ Create Azure Cosmos DB account
2. ✅ Create Azure Storage Account
3. ✅ Get connection strings
4. ✅ Add environment variables
5. ✅ Install dependencies (`npm install`)
6. ✅ Test the application
7. ✅ Deploy to Azure Web App

## Additional Resources

- [Azure Cosmos DB Documentation](https://docs.microsoft.com/azure/cosmos-db/)
- [Azure Blob Storage Documentation](https://docs.microsoft.com/azure/storage/blobs/)
- [Azure Cosmos DB for MongoDB API](https://docs.microsoft.com/azure/cosmos-db/mongodb/)
- [Azure Storage Node.js SDK](https://docs.microsoft.com/javascript/api/@azure/storage-blob/)

## Support

If you encounter issues:
1. Check Azure Portal for service status
2. Review application logs in Azure Web App
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly
