import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { auth } from '@/auth'

// POST - Upload image file (for story cover images)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
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

    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'stories')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${session.user.id}-${timestamp}-${randomString}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    const publicPath = `/uploads/stories/${fileName}`

    return NextResponse.json({
      success: true,
      path: publicPath,
      message: 'File uploaded successfully',
    })
  } catch (error) {
    console.error('Error uploading story image:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    )
  }
}

