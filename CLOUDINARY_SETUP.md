# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads in your Next.js application.

## Prerequisites

- A Cloudinary account (sign up at [https://cloudinary.com](https://cloudinary.com) - free tier available)
- Your Next.js application deployed on Vercel

## Step 1: Get Cloudinary Credentials

1. Log in to your [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Navigate to the **Dashboard** section
3. You'll find your credentials:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## Step 2: Configure Environment Variables

### For Local Development

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
4. Make sure to add them for all environments (Production, Preview, Development)
5. Redeploy your application after adding the variables

## Step 3: Verify Installation

The Cloudinary package is already installed. The upload functionality is ready to use!

## How It Works

1. **Upload API Route** (`/api/upload`):
   - Accepts image files via `multipart/form-data`
   - Validates file type (images only) and size (max 10MB)
   - Uploads to Cloudinary
   - Returns the secure URL

2. **Cloudinary Configuration** (`lib/cloudinary.ts`):
   - Reusable functions for uploading and deleting images
   - Automatic image optimization (quality: auto, format: auto)
   - Images are stored in the `travel-website` folder by default

3. **Frontend Forms**:
   - All admin forms already use the `/api/upload` endpoint
   - No changes needed to existing form components
   - Images are automatically saved to MongoDB as Cloudinary URLs

## Usage Example

The existing admin forms already use this:

```typescript
const formData = new FormData()
formData.append('file', file)

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
})

const result = await response.json()
if (result.success) {
  const imageUrl = result.path // Cloudinary secure URL
  // Save to MongoDB
}
```

## Image Storage Structure

Images are organized in Cloudinary as:
```
travel-website/
  ├── {timestamp}-{random}.jpg
  ├── {timestamp}-{random}.png
  └── ...
```

## Features

- ✅ Automatic image optimization
- ✅ Secure HTTPS URLs
- ✅ Works on Vercel (serverless)
- ✅ Supports all image formats (JPEG, PNG, WebP, etc.)
- ✅ Max file size: 10MB
- ✅ Backward compatible with existing code

## Troubleshooting

### Error: "Cloudinary is not configured"
- Make sure all three environment variables are set
- Restart your development server after adding `.env.local`
- Redeploy on Vercel after adding environment variables

### Error: "Upload failed"
- Check your Cloudinary credentials are correct
- Verify your Cloudinary account is active
- Check file size (must be < 10MB)
- Ensure file is a valid image format

### Images not displaying
- Cloudinary URLs are HTTPS and should work everywhere
- Check browser console for CORS errors
- Verify the URL is saved correctly in MongoDB

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
