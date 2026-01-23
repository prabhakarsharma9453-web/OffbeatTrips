# Fix: Images Not Displaying on Resort Detail Page

## Problem

Images uploaded to Azure Blob Storage are not displaying on the resort detail page, showing an empty image area instead.

## Root Cause

1. **Next.js Image Component**: Even with `unoptimized: true`, Next.js Image component may need explicit domain configuration for external images
2. **Missing Error Handling**: No fallback when images fail to load
3. **CORS Issues**: Azure Blob Storage might have CORS restrictions

## Solutions Applied

### 1. Updated `next.config.mjs`

Added Azure Blob Storage domains to `remotePatterns`:

```javascript
images: {
  unoptimized: true,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.blob.core.windows.net',
    },
    {
      protocol: 'https',
      hostname: '*.azureedge.net',
    },
  ],
}
```

### 2. Added Error Handling to Image Components

Added `onError` handlers to fallback to placeholder:

```typescript
<Image
  src={imageUrl}
  onError={(e) => {
    console.error('Image failed to load:', imageUrl)
    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
  }}
/>
```

## Additional Checks

### Verify Image URLs in Database

Check that images are stored correctly:

1. Go to Azure Portal → Your Storage Account
2. Navigate to **Containers** → Your container
3. Verify images exist in the `images/` folder
4. Check the URLs in your database match the blob URLs

### Check CORS Settings

1. Go to Azure Portal → Your Storage Account
2. Navigate to **Resource sharing (CORS)**
3. Add CORS rule:
   - **Allowed origins**: `*` (or your domain)
   - **Allowed methods**: `GET, HEAD`
   - **Allowed headers**: `*`
   - **Exposed headers**: `*`
   - **Max age**: `3600`

### Verify Container Public Access

1. Go to Azure Portal → Your Storage Account
2. Navigate to **Containers**
3. Click on your container
4. Go to **Change access level**
5. Set to **Blob** (public read access for blobs)

## Testing

After making these changes:

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Check browser console** for any image loading errors

3. **Verify image URLs**:
   - Open browser DevTools → Network tab
   - Reload the resort detail page
   - Check if image requests are successful (200 status)
   - If 403/404, check CORS and container access settings

4. **Test image upload**:
   - Upload a new image through admin panel
   - Verify it appears on the detail page

## Debugging Steps

### 1. Check Image URL Format

The URL should look like:
```
https://your-storage-account.blob.core.windows.net/container-name/images/timestamp-random.jpg
```

### 2. Test Image URL Directly

Copy the image URL from the database and paste it in a browser:
- If it loads → CORS/Next.js config issue
- If it doesn't load → Azure Storage access issue

### 3. Check Browser Console

Look for errors like:
- `Failed to load resource` → CORS or access issue
- `Image optimization error` → Next.js config issue
- `403 Forbidden` → Container access level issue

## Quick Fix Checklist

- [ ] Updated `next.config.mjs` with remotePatterns
- [ ] Added error handling to Image components
- [ ] Verified container public access is "Blob"
- [ ] Added CORS rules in Azure Portal
- [ ] Restarted dev server
- [ ] Tested image URL directly in browser
- [ ] Checked browser console for errors

## Alternative: Use Regular img Tags

If Next.js Image still doesn't work, you can use regular `img` tags:

```typescript
<img
  src={imageUrl}
  alt="Resort image"
  className="w-full h-full object-cover"
  onError={(e) => {
    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
  }}
/>
```

This bypasses Next.js image optimization but ensures images display.
