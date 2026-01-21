import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Story from '@/models/Story'

// GET - public stories list
// supports: ?limit=4, ?q=search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const q = searchParams.get('q')?.trim()

    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 0, 1), 50) : 20

    await connectDB()

    const filter: any = {}
    if (q) {
      filter.$text = { $search: q }
    }

    const items = await Story.find(filter)
      .sort(q ? { score: { $meta: 'textScore' }, createdAt: -1 } : { createdAt: -1 })
      .limit(limit)
      .lean()

    const data = items.map((s: any) => ({
      id: s._id?.toString(),
      title: s.title,
      slug: s.slug,
      excerpt: s.excerpt || '',
      content: s.content || '',
      image: s.image || '',
      images: s.images || [],
      category: s.category || 'Travel',
      readTimeMinutes: s.readTimeMinutes ?? 5,
      authorName: s.authorName || 'Anonymous',
      authorImage: s.authorImage || '',
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch stories', data: [] }, { status: 500 })
  }
}

