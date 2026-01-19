import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Story from '@/models/Story'

// GET - public single story by slug
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const slug = resolvedParams.slug

    if (!slug || !String(slug).trim()) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 })
    }

    await connectDB()
    const story = await Story.findOne({ slug: String(slug).trim() }).lean()

    if (!story) {
      return NextResponse.json({ success: false, error: 'Story not found' }, { status: 404 })
    }

    const data = {
      id: (story as any)._id?.toString(),
      title: (story as any).title,
      slug: (story as any).slug,
      excerpt: (story as any).excerpt || '',
      content: (story as any).content || '',
      image: (story as any).image,
      category: (story as any).category || 'Travel',
      readTimeMinutes: (story as any).readTimeMinutes ?? 5,
      authorName: (story as any).authorName || 'Anonymous',
      authorImage: (story as any).authorImage || '',
      createdAt: (story as any).createdAt,
      updatedAt: (story as any).updatedAt,
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching story:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch story' }, { status: 500 })
  }
}

