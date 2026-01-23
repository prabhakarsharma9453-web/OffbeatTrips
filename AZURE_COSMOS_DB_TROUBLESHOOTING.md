# Azure Cosmos DB for MongoDB - Troubleshooting Guide

## Common Connection Issues

### 1. Authentication Failed

**Error**: `authentication failed` or `bad auth`

**Solutions**:
- Verify your connection string is correct
- Check that the account name matches your Cosmos DB account name
- Ensure the primary key is correct (copy from Azure Portal → Keys)
- Make sure there are no extra spaces or special characters
- URL-encode special characters in the password/key if needed

**Connection String Format**:
```
mongodb://<account-name>:<primary-key>@<account-name>.mongo.cosmos.azure.com:10255/<database-name>?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<account-name>@
```

### 2. Connection Timeout

**Error**: `connection timeout` or `ECONNREFUSED`

**Solutions**:
- **Check Firewall Rules**: 
  - Go to Azure Portal → Your Cosmos DB Account → **Firewall and virtual networks**
  - Ensure "Allow access from Azure portal" is enabled
  - Add your current IP address to the allowed list
  - Or temporarily enable "Accept connections from within public Azure datacenters" for testing

- **Verify Connection String**:
  - Check the hostname is correct: `<account-name>.mongo.cosmos.azure.com`
  - Ensure port is `10255` (default for Cosmos DB)
  - Verify SSL is enabled: `ssl=true`

- **Network Issues**:
  - Check if you're behind a corporate firewall
  - Try from a different network
  - Verify DNS resolution works

### 3. SSL/TLS Errors

**Error**: `SSL handshake failed` or `certificate verification failed`

**Solutions**:
- Ensure `ssl=true` is in your connection string
- For Cosmos DB, SSL is required
- Check if your connection string includes: `?ssl=true&...`

### 4. RetryWrites Error

**Error**: `retryWrites not supported`

**Solutions**:
- Azure Cosmos DB requires `retrywrites=false` in the connection string
- Update your connection string to include: `&retrywrites=false`

### 5. Invalid Connection String Format

**Error**: `Invalid connection string` or parsing errors

**Solutions**:
- Copy the connection string directly from Azure Portal
- Don't modify the connection string manually
- Ensure all required parameters are present:
  - `ssl=true`
  - `replicaSet=globaldb`
  - `retrywrites=false`
  - `maxIdleTimeMS=120000`
  - `appName=@<account-name>@`

## Step-by-Step Debugging

### Step 1: Verify Connection String

1. Go to Azure Portal → Your Cosmos DB Account
2. Navigate to **Connection strings** (under Settings)
3. Copy the **Primary connection string**
4. Verify it includes:
   - Account name
   - Primary key (long string)
   - Hostname ending in `.mongo.cosmos.azure.com`
   - Port `10255`
   - Required query parameters

### Step 2: Check Environment Variables

1. Verify `.env.local` exists in your project root
2. Check the variable name is exactly:
   - `AZURE_COSMOS_DB_CONNECTION_STRING` OR
   - `MONGODB_URI`
3. Ensure there are no quotes around the connection string
4. No trailing spaces or newlines

**Correct format**:
```env
AZURE_COSMOS_DB_CONNECTION_STRING=mongodb://account:key@account.mongo.cosmos.azure.com:10255/dbname?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@account@
```

**Wrong format**:
```env
# Don't use quotes
AZURE_COSMOS_DB_CONNECTION_STRING="mongodb://..."
# Don't use single quotes
AZURE_COSMOS_DB_CONNECTION_STRING='mongodb://...'
# Don't add spaces
AZURE_COSMOS_DB_CONNECTION_STRING = mongodb://...
```

### Step 3: Test Connection

1. Restart your development server after changing `.env.local`
2. Check the console output for connection messages
3. Look for:
   - `🔄 Attempting to connect...`
   - `✅ Azure Cosmos DB for MongoDB connected successfully`
   - Or error messages with specific details

### Step 4: Check Firewall Settings

1. Go to Azure Portal → Your Cosmos DB Account
2. Navigate to **Firewall and virtual networks**
3. Check current settings:
   - **Allow access from Azure portal**: Should be enabled
   - **Allow access from Azure services**: Enable for Azure Web App deployment
   - **IP Address Range**: Add your current IP address

4. Click **Save** and wait 1-2 minutes for changes to propagate

### Step 5: Verify Database and Collections

1. Go to Azure Portal → Your Cosmos DB Account
2. Navigate to **Data Explorer**
3. Verify:
   - Database exists (or will be created automatically)
   - Collections will be created automatically when models are used

## Connection String Template

Replace the placeholders with your actual values:

```
mongodb://<ACCOUNT_NAME>:<PRIMARY_KEY>@<ACCOUNT_NAME>.mongo.cosmos.azure.com:10255/<DATABASE_NAME>?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<ACCOUNT_NAME>@
```

**Example**:
```
mongodb://travel-website-cosmos:AbCdEf123456==@travel-website-cosmos.mongo.cosmos.azure.com:10255/travel-website?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@travel-website-cosmos@
```

## Quick Checklist

- [ ] Connection string copied from Azure Portal (Connection strings section)
- [ ] Connection string includes `ssl=true`
- [ ] Connection string includes `retrywrites=false`
- [ ] Environment variable set in `.env.local` (no quotes)
- [ ] Development server restarted after adding environment variable
- [ ] Firewall allows your IP address
- [ ] Account name and key are correct
- [ ] Port is `10255` (default for Cosmos DB)
- [ ] Hostname ends with `.mongo.cosmos.azure.com`

## Testing Connection

You can test the connection by:

1. **Starting the dev server**:
   ```bash
   npm run dev
   ```

2. **Check console output** for connection messages

3. **Visit an API endpoint** that uses the database:
   - `http://localhost:3000/api/resorts`
   - `http://localhost:3000/api/packages`

4. **Check for errors** in:
   - Server console
   - Browser console
   - Network tab in browser DevTools

## Still Not Working?

1. **Check Azure Portal**:
   - Verify Cosmos DB account is running
   - Check service health status
   - Verify account is not paused or deleted

2. **Check Application Logs**:
   - Look for detailed error messages
   - Check if connection attempts are being made
   - Verify environment variables are loaded

3. **Try Alternative Connection Method**:
   - Use MongoDB Compass with the connection string
   - Test from a different machine/network
   - Try from Azure Cloud Shell

4. **Contact Support**:
   - Check Azure Service Health
   - Review Azure Cosmos DB documentation
   - Open a support ticket if needed

## Additional Resources

- [Azure Cosmos DB Connection String](https://docs.microsoft.com/azure/cosmos-db/mongodb/connect-mongodb-account)
- [Azure Cosmos DB Firewall Configuration](https://docs.microsoft.com/azure/cosmos-db/how-to-configure-firewall)
- [Troubleshooting Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/troubleshoot-common-errors)
