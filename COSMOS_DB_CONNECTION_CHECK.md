# Azure Cosmos DB Connection - Quick Check

## What I Fixed

I've updated the MongoDB connection code (`lib/mongodb.ts`) with:

1. ✅ **Better error handling** - More detailed error messages
2. ✅ **Cosmos DB detection** - Automatically detects Azure Cosmos DB
3. ✅ **Connection validation** - Checks for required parameters
4. ✅ **Helpful logging** - Shows connection progress and issues
5. ✅ **Cosmos DB-specific options** - SSL, retryWrites, etc.

## How to Debug

### Step 1: Check Your Connection String

1. Go to Azure Portal → Your Cosmos DB Account
2. Navigate to **Connection strings** (under Settings)
3. Copy the **Primary connection string**
4. Verify it looks like:
   ```
   mongodb://account-name:key@account-name.mongo.cosmos.azure.com:10255/database?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@account-name@
   ```

### Step 2: Verify Environment Variable

Check your `.env.local` file:

```env
AZURE_COSMOS_DB_CONNECTION_STRING=mongodb://...
```

OR

```env
MONGODB_URI=mongodb://...
```

**Important**: 
- No quotes around the connection string
- No spaces before or after the `=`
- Copy the entire string from Azure Portal

### Step 3: Test the Connection

**Option A: Run the test script**
```bash
npm run test:cosmos
```

**Option B: Start the dev server and check console**
```bash
npm run dev
```

Look for these messages:
- `🔄 Attempting to connect to Azure Cosmos DB for MongoDB...`
- `✅ Azure Cosmos DB for MongoDB connected successfully`

### Step 4: Check Firewall Settings

1. Go to Azure Portal → Your Cosmos DB Account
2. Navigate to **Firewall and virtual networks**
3. Ensure:
   - ✅ "Allow access from Azure portal" is enabled
   - ✅ Your IP address is in the allowed list (or enable "Accept connections from within public Azure datacenters" for testing)

## Common Issues

### Issue: "Authentication failed"
**Solution**: 
- Verify connection string is copied correctly from Azure Portal
- Check account name and primary key are correct
- Ensure no extra spaces or characters

### Issue: "Connection timeout"
**Solution**:
- Check firewall rules - add your IP address
- Verify hostname in connection string
- Check network connectivity

### Issue: "retryWrites not supported"
**Solution**:
- Ensure connection string includes `retrywrites=false`
- This is required for Azure Cosmos DB

### Issue: "SSL handshake failed"
**Solution**:
- Ensure connection string includes `ssl=true`
- Cosmos DB requires SSL

## What to Look For

When you start your dev server, you should see:

```
🔄 Attempting to connect to Azure Cosmos DB for MongoDB...
📍 Connection string: mongodb://account-name:key@account-name.mongo...
✅ Azure Cosmos DB for MongoDB connected successfully
📊 Database: your-database-name
```

If you see errors, check:
1. The error message in the console
2. The troubleshooting tips that appear
3. `AZURE_COSMOS_DB_TROUBLESHOOTING.md` for detailed help

## Still Having Issues?

1. **Run the test script**: `npm run test:cosmos`
2. **Check the troubleshooting guide**: `AZURE_COSMOS_DB_TROUBLESHOOTING.md`
3. **Verify in Azure Portal**:
   - Cosmos DB account is running
   - Connection string is correct
   - Firewall allows your IP

## Quick Checklist

- [ ] Connection string copied from Azure Portal
- [ ] Connection string includes `ssl=true`
- [ ] Connection string includes `retrywrites=false`
- [ ] Environment variable set in `.env.local` (no quotes)
- [ ] Server restarted after adding environment variable
- [ ] Firewall allows your IP address
- [ ] Account name and key are correct
