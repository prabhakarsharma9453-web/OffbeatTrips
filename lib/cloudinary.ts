import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload an image file to Cloudinary
 * @param file - The file to upload (File or Buffer)
 * @param folder - Optional folder path in Cloudinary
 * @returns The secure URL of the uploaded image
 */
export async function uploadToCloudinary(
  file: File | Buffer,
  folder: string = 'travel-website'
): Promise<string> {
  try {
    // Convert File to buffer if needed
    let buffer: Buffer
    let mimeType: string = 'image/jpeg'
    
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
      mimeType = file.type || 'image/jpeg'
    } else {
      buffer = file
    }

    // Convert buffer to base64 data URI
    const base64 = buffer.toString('base64')
    const dataURI = `data:${mimeType};base64,${base64}`

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ],
          // Add timestamp to filename for uniqueness
          public_id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve(result as { secure_url: string })
          } else {
            reject(new Error('Upload failed: No result returned'))
          }
        }
      )
    })

    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to upload image: ${error.message}` 
        : 'Failed to upload image to Cloudinary'
    )
  }
}

/**
 * Delete an image from Cloudinary using its URL
 * @param imageUrl - The Cloudinary URL of the image to delete
 */
export async function deleteFromCloudinary(imageUrl: string): Promise<void> {
  try {
    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{folder}/{filename}
    const urlParts = imageUrl.split('/')
    const uploadIndex = urlParts.findIndex(part => part === 'upload')
    
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL')
    }

    // Get the path after 'upload' (version/folder/filename)
    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/')
    
    // Remove file extension to get public_id
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '')

    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    // Don't throw - deletion failures shouldn't break the app
  }
}

export default cloudinary
