import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { uploadToBlobStorage, isBlobStorageConfigured } from '@/lib/azure-blob'

// POST - Upload image file (for story cover images) to Azure Blob Storage
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
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
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'File must be an image' }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Upload to Azure Blob Storage
    const blobUrl = await uploadToBlobStorage(file, 'stories')

    return NextResponse.json({
      success: true,
      path: blobUrl,
      url: blobUrl,
      message: 'File uploaded successfully to Azure Blob Storage',
    })
  } catch (error) {
    console.error('Error uploading story image:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    )
  }
}

