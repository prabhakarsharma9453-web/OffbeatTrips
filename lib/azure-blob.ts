import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'

// Azure Blob Storage configuration
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING
const AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'travel-website'

if (!AZURE_STORAGE_CONNECTION_STRING) {
  console.warn('⚠️ Azure Storage connection string is not configured')
}

/**
 * Get or create a BlobServiceClient instance
 */
function getBlobServiceClient(): BlobServiceClient {
  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is not set')
  }
  return BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
}

/**
 * Get or create a container client
 */
async function getContainerClient(): Promise<ContainerClient> {
  const blobServiceClient = getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME)
  
  // Create container if it doesn't exist
  const exists = await containerClient.exists()
  if (!exists) {
    await containerClient.create({
      access: 'blob', // Public read access
    })
  }
  
  return containerClient
}

/**
 * Upload a file to Azure Blob Storage
 * @param file - The file to upload (File or Buffer)
 * @param folder - Optional folder path in the container
 * @returns The public URL of the uploaded file
 */
export async function uploadToBlobStorage(
  file: File | Buffer,
  folder: string = 'images'
): Promise<string> {
  try {
    if (!AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error('Azure Storage is not configured. Please set AZURE_STORAGE_CONNECTION_STRING environment variable.')
    }

    // Convert File to buffer if needed
    let buffer: Buffer
    let mimeType: string = 'image/jpeg'
    let originalFileName: string = 'image.jpg'
    
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
      mimeType = file.type || 'image/jpeg'
      originalFileName = file.name || 'image.jpg'
    } else {
      buffer = file
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = originalFileName.split('.').pop() || 'jpg'
    const blobName = `${folder}/${timestamp}-${randomString}.${fileExtension}`

    // Get container client
    const containerClient = await getContainerClient()
    
    // Get block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    // Upload the file
    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: {
        blobContentType: mimeType,
      },
    })

    // Return the public URL
    return blockBlobClient.url
  } catch (error) {
    console.error('Azure Blob Storage upload error:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to upload file: ${error.message}` 
        : 'Failed to upload file to Azure Blob Storage'
    )
  }
}

/**
 * Delete a file from Azure Blob Storage using its URL
 * @param blobUrl - The URL of the blob to delete
 */
export async function deleteFromBlobStorage(blobUrl: string): Promise<void> {
  try {
    if (!AZURE_STORAGE_CONNECTION_STRING) {
      console.warn('Azure Storage not configured, skipping delete')
      return
    }

    // Extract blob name from URL
    // Format: https://{account}.blob.core.windows.net/{container}/{blob-name}
    const url = new URL(blobUrl)
    const pathParts = url.pathname.split('/').filter(part => part)
    
    if (pathParts.length < 2) {
      throw new Error('Invalid blob URL format')
    }

    const containerName = pathParts[0]
    const blobName = pathParts.slice(1).join('/')

    const containerClient = await getContainerClient()
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    // Delete the blob
    await blockBlobClient.delete()
  } catch (error) {
    console.error('Azure Blob Storage delete error:', error)
    // Don't throw - deletion failures shouldn't break the app
  }
}

/**
 * Check if Azure Blob Storage is configured
 */
export function isBlobStorageConfigured(): boolean {
  return !!AZURE_STORAGE_CONNECTION_STRING
}

export default {
  uploadToBlobStorage,
  deleteFromBlobStorage,
  isBlobStorageConfigured,
}
