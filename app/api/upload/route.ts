import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { uploadToCloudinary } from '@/lib/cloudinary'

// POST - Upload image file to Cloudinary
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.' 
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

    // Validate file size (max 10MB for Cloudinary)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const secureUrl = await uploadToCloudinary(file, 'travel-website')

    // Return the secure URL
    return NextResponse.json({
      success: true,
      path: secureUrl, // Return Cloudinary URL as path for backward compatibility
      url: secureUrl, // Also return as url for clarity
      message: 'File uploaded successfully to Cloudinary',
    })
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file to Cloudinary',
      },
      { status: 500 }
    )
  }
}
