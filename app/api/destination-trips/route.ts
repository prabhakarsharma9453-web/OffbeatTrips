import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import DestinationTrip from '@/models/DestinationTrip'

// GET - public destination trips list
// required: ?destination=<destinationSlug>
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const destination = searchParams.get('destination')
    const type = searchParams.get('type')
    const q = searchParams.get('q')

    if (!destination || !destination.trim()) {
      return NextResponse.json({ success: false, error: 'destination is required', data: [] }, { status: 400 })
    }

    await connectDB()

    const filter: any = { destinationSlug: destination.trim() }
    if (type) filter.type = type
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i')
      filter.$or = [{ title: regex }, { location: regex }, { mood: regex }, { highlights: { $in: [regex] } }]
    }

    const items = await DestinationTrip.find(filter).sort({ order: 1, createdAt: -1 }).lean()

    const data = items.map((t: any) => ({
      id: t._id?.toString(),
      slug: t.slug,
      destinationSlug: t.destinationSlug,
      destinationName: t.destinationName,
      title: t.title,
      location: t.location,
      duration: t.duration,
      price: t.price,
      rating: t.rating ?? 4.8,
      image: t.image || '/placeholder.svg',
      images: Array.isArray(t.images) && t.images.length > 0 ? t.images : (t.image ? [t.image] : []),
      description: t.description || '',
      highlights: t.highlights || [],
      inclusions: t.inclusions || [],
      exclusions: t.exclusions || [],
      mood: t.mood || '',
      activities: t.activities || [],
      type: t.type || 'international',
      order: t.order ?? 0,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching destination trips:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch destination trips', data: [] }, { status: 500 })
  }
}

