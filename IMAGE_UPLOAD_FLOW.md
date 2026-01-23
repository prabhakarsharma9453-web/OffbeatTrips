# Image Upload Flow - Azure Blob Storage

## How It Works

### 1. Image Upload Process

```
User selects image → Upload to Azure Blob Storage → Get Blob URL → Save URL to Database
```

### 2. Step-by-Step Flow

#### Step 1: User Uploads Image
- User selects an image file in the admin form
- Frontend calls `/api/upload` endpoint

#### Step 2: Upload to Azure Blob Storage
- **Endpoint**: `POST /api/upload`
- **Location**: `app/api/upload/route.ts`
- **Process**:
  1. Validates file (image type, max 10MB)
  2. Uploads to Azure Blob Storage using `uploadToBlobStorage()`
  3. Returns blob URL: `https://your-storage.blob.core.windows.net/container/folder/filename.jpg`

#### Step 3: Save URL to Database
- The blob URL is returned to the frontend
- Frontend includes the URL in the form data
- When creating/updating records (resorts, packages, etc.):
  - The blob URL is saved to the database
  - Stored in `image` field (single image) or `images` array (multiple images)

### 3. Code Flow

**Upload Route** (`app/api/upload/route.ts`):
```typescript
// 1. Validate file
const file = formData.get('file') as File

// 2. Upload to blob storage
const blobUrl = await uploadToBlobStorage(file, 'images')

// 3. Return URL
return { success: true, path: blobUrl, url: blobUrl }
```

**Blob Storage Library** (`lib/azure-blob.ts`):
```typescript
// Uploads file to Azure Blob Storage
// Returns: https://account.blob.core.windows.net/container/folder/filename.jpg
export async function uploadToBlobStorage(file: File, folder: string): Promise<string>
```

**Save to Database** (e.g., `app/api/admin/resorts/route.ts`):
```typescript
// Images array contains blob URLs
const resort = new Resort({
  image: mainImage, // Blob URL
  images: imagesArray, // Array of blob URLs
  // ... other fields
})
await resort.save()
```

## Current Status

✅ **Image upload is working correctly!**

From your logs (line 834-853):
- ✅ Image uploaded to blob storage: `https://websiteimagestore.blob.core.windows.net/images/images/1769153067294-hnhxsccrgd5.jpg`
- ✅ Resort saved with image URL in database
- ✅ Images stored correctly

## Image Storage Structure

### Azure Blob Storage
```
Container: travel-website (or images)
├── images/
│   ├── 1769153067294-abc123.jpg
│   ├── 1769153067294-xyz789.png
│   └── ...
├── profiles/
│   └── user-profile-images...
└── stories/
    └── story-cover-images...
```

### Database Storage
```javascript
{
  image: "https://account.blob.core.windows.net/container/images/1769153067294-abc123.jpg",
  images: [
    "https://account.blob.core.windows.net/container/images/1769153067294-abc123.jpg",
    "https://account.blob.core.windows.net/container/images/1769153067294-xyz789.png"
  ]
}
```

## Environment Variables Required

```env
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=travel-website
```

## Troubleshooting

### Issue: "Azure Blob Storage is not configured"
**Solution**: Set `AZURE_STORAGE_CONNECTION_STRING` in `.env.local`

### Issue: "Container not found"
**Solution**: Container will be created automatically on first upload, or create it manually in Azure Portal

### Issue: Images not displaying
**Solution**: 
- Check container public access level is set to "Blob" (public read)
- Verify blob URLs are correct
- Check CORS settings in Azure Storage Account

### Issue: Upload fails
**Solution**:
- Check file size (max 10MB for admin, 5MB for users)
- Verify file is an image type
- Check Azure Storage account is accessible

## Best Practices

1. **Always upload to blob storage first**, then save URL to database
2. **Use unique filenames** (timestamp + random string)
3. **Organize by folder** (images/, profiles/, stories/)
4. **Validate file types** before upload
5. **Set size limits** to prevent abuse
6. **Store URLs, not files** in database

## Summary

✅ Images are uploaded to Azure Blob Storage
✅ Blob URLs are returned to frontend
✅ URLs are saved to Cosmos DB database
✅ Everything is working correctly!

The errors you're seeing are about **query sorting**, not image uploads. Those have been fixed by sorting in memory instead of using database composite indexes.
