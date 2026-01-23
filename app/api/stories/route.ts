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

    // Fetch stories (Cosmos DB doesn't support text search sort without indexes)
    let items = await Story.find(filter).lean()
    
    // Sort in memory
    if (q) {
      // For text search, sort by relevance score first, then by date
      items.sort((a: any, b: any) => {
        const scoreA = a.score || 0
        const scoreB = b.score || 0
        if (scoreA !== scoreB) {
          return scoreB - scoreA // Higher score first
        }
        // Then by createdAt (newest first)
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
    } else {
      // Sort by createdAt (newest first)
      items.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
    }
    
    // Apply limit after sorting
    items = items.slice(0, limit)

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

