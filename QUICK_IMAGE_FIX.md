# Quick Fix: Images Not Displaying

## ✅ Changes Made

1. **Updated `next.config.mjs`** - Added Azure Blob Storage domains
2. **Added error handling** - Images will fallback to placeholder if they fail to load
3. **Added console logging** - Will show which images fail to load

## 🔧 What You Need to Do

### Step 1: Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 2: Check Azure Blob Storage Settings

1. **Container Public Access**:
   - Azure Portal → Storage Account → Containers
   - Click your container → **Change access level**
   - Set to **Blob** (public read access)

2. **CORS Settings** (if images still don't load):
   - Azure Portal → Storage Account → **Resource sharing (CORS)**
   - Add rule:
     - Allowed origins: `*`
     - Allowed methods: `GET, HEAD`
     - Allowed headers: `*`
     - Max age: `3600`

### Step 3: Test

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Visit a resort detail page
4. Check for any error messages
5. Go to **Network** tab and reload
6. Look for image requests - check if they return 200 (success) or 403/404 (error)

## 🐛 If Images Still Don't Load

### Check Image URL Format

The URL should be:
```
https://your-storage-account.blob.core.windows.net/container/images/timestamp-random.jpg
```

### Test URL Directly

1. Copy the image URL from the database
2. Paste it in a new browser tab
3. If it loads → Next.js config issue (should be fixed now)
4. If it doesn't load → Azure Storage access issue

### Common Issues

**403 Forbidden**:
- Container access level not set to "Blob"
- CORS not configured

**404 Not Found**:
- Image doesn't exist at that URL
- Check container name and folder path

**CORS Error**:
- Add CORS rules in Azure Portal
- Or use `unoptimized` images (already set)

## 📝 Debug Checklist

- [ ] Restarted dev server
- [ ] Container access level is "Blob"
- [ ] CORS rules added (if needed)
- [ ] Image URL works in browser directly
- [ ] Checked browser console for errors
- [ ] Checked Network tab for failed requests

## 🎯 Expected Result

After these changes:
- ✅ Images should display on resort detail pages
- ✅ If image fails, placeholder will show
- ✅ Console will log which images failed (for debugging)
