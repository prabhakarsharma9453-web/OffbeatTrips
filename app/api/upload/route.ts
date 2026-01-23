import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { uploadToBlobStorage, isBlobStorageConfigured } from '@/lib/azure-blob'

// POST - Upload image file to Azure Blob Storage
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Check if Azure Blob Storage is configured
    if (!isBlobStorageConfigured()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Azure Blob Storage is not configured. Please set AZURE_STORAGE_CONNECTION_STRING environment variable.' 
        },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Upload to Azure Blob Storage
    const blobUrl = await uploadToBlobStorage(file, 'images')

    // Return the blob URL
    return NextResponse.json({
      success: true,
      path: blobUrl, // Return blob URL as path for backward compatibility
      url: blobUrl, // Also return as url for clarity
      message: 'File uploaded successfully to Azure Blob Storage',
    })
  } catch (error) {
    console.error('Error uploading file to Azure Blob Storage:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file to Azure Blob Storage',
      },
      { status: 500 }
    )
  }
}
