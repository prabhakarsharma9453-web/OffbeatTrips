# Troubleshooting Guide - Application Not Running

## Common Issues and Solutions

### 1. Missing Dependencies

**Error**: `Cannot find module 'mssql'` or `Cannot find module 'bcryptjs'`

**Solution**:
```bash
npm install mssql bcryptjs
npm install --save-dev @types/bcryptjs
```

### 2. "node:stream" Module Error

**Error**: `Cannot find module 'node:stream': Unsupported external type Url for commonjs reference`

**Solution**: 
- The `next.config.mjs` has been updated to fix this
- **Restart your dev server**:
  1. Stop the server (Ctrl+C)
  2. Delete `.next` folder: `rm -rf .next` (or delete manually)
  3. Restart: `npm run dev`

### 3. Database Connection Errors

**Error**: `Missing required database configuration`

**Solution**: 
- Create `.env.local` file in root directory with:
```env
DB_SERVER=your-server-name
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_CERT=true

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

### 5. TypeScript Errors

**Error**: Type errors during build

**Solution**: 
- TypeScript errors are ignored in `next.config.mjs`
- If you want to see them, remove `ignoreBuildErrors: true`
- Or fix the specific type errors

### 6. Module Resolution Errors

**Error**: `Module not found` or import errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules
rm -rf .next
npm install
npm run dev
```

### 7. NextAuth Configuration Errors

**Error**: `NEXTAUTH_SECRET is missing`

**Solution**:
- Add to `.env.local`:
```env
NEXTAUTH_SECRET=your-secret-here
```
- Generate a secret: `openssl rand -base64 32`

### 8. Database Table Missing

**Error**: `Invalid object name 'Users'` or `Invalid object name 'Packages'`

**Solution**:
- Run the SQL from `database-schema.sql` in your MSSQL database
- Ensure tables are created in the correct database

### 9. Build Errors

**Error**: Build fails with webpack errors

**Solution**:
```bash
# Clean build
rm -rf .next
npm run build
```

### 10. Runtime Errors After Changes

**Error**: Application crashes after code changes

**Solution**:
1. Stop the dev server
2. Delete `.next` folder
3. Restart: `npm run dev`

## Quick Diagnostic Steps

1. **Check if dependencies are installed**:
   ```bash
   npm list mssql bcryptjs
   ```

2. **Verify environment variables**:
   - Check `.env.local` exists
   - Verify all required variables are set

3. **Test database connection**:
   - Visit: `http://localhost:3000/test-db`
   - Or: `http://localhost:3000/api/test-db`

4. **Check for syntax errors**:
   ```bash
   npm run lint
   ```

5. **Clear all caches**:
   ```bash
   rm -rf .next
   rm -rf node_modules/.cache
   npm run dev
   ```

## Still Not Working?

1. **Check the terminal output** - Look for specific error messages
2. **Check browser console** - Look for client-side errors
3. **Verify Node.js version** - Should be 18+ (check with `node -v`)
4. **Check if MSSQL server is running** - Database must be accessible
5. **Verify firewall settings** - Port 1433 (MSSQL) and 3000 (Next.js) should be open

## Getting Help

If you're still experiencing issues, provide:
1. The exact error message from terminal
2. The error from browser console (if any)
3. Your Node.js version (`node -v`)
4. Your npm version (`npm -v`)
5. Contents of `.env.local` (without sensitive data)
