import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Trip from '@/models/Trip'

// GET - Public trips list (supports filtering by activity/type/q)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activity = searchParams.get('activity') || undefined
    const type = searchParams.get('type') || undefined
    const q = searchParams.get('q') || undefined
    const limitParam = searchParams.get('limit')
    const limit = Math.min(Math.max(parseInt(limitParam || '50', 10) || 50, 1), 200)

    await connectDB()

    const filter: any = {}
    if (activity) filter.activity = activity
    if (type) filter.type = type

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i')
      filter.$or = [
        { title: regex },
        { location: regex },
        { country: regex },
        { description: regex },
        { highlights: { $in: [regex] } },
      ]
    }

    // Fetch all trips (Cosmos DB doesn't support composite sort without indexes)
    let trips = await Trip.find(filter).lean()
    
    // Sort in memory
    trips.sort((a: any, b: any) => {
      const orderA = a.order || 0
      const orderB = b.order || 0
      if (orderA !== orderB) return orderA - orderB
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
    
    // Apply limit after sorting
    trips = trips.slice(0, limit)

    const data = trips.map((t: any) => {
      const images =
        Array.isArray(t.images) && t.images.length > 0 ? t.images.filter(Boolean) : (t.image ? [t.image] : [])
      return {
        id: t._id?.toString(),
        slug: t.slug,
        title: t.title,
        activity: t.activity,
        location: t.location,
        country: t.country || '',
        duration: t.duration,
        price: t.price,
        rating: t.rating ?? 4.5,
        reviewCount: t.reviewCount ?? 0,
        image: images[0] || '/placeholder.svg',
        images,
        description: t.description || '',
        highlights: t.highlights || [],
        difficulty: t.difficulty || '',
        groupSize: t.groupSize || '',
        type: t.type || 'domestic',
        order: t.order ?? 0,
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trips', data: [] },
      { status: 500 }
    )
  }
}

