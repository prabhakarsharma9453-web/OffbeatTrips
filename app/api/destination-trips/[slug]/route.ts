import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import DestinationTrip from '@/models/DestinationTrip'

// GET - public single destination trip by slug
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
    const trip = await DestinationTrip.findOne({ slug: String(slug).trim() }).lean()

    if (!trip) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 })
    }

    const data = {
      id: (trip as any)._id?.toString(),
      slug: (trip as any).slug,
      destinationSlug: (trip as any).destinationSlug,
      destinationName: (trip as any).destinationName,
      title: (trip as any).title,
      location: (trip as any).location,
      duration: (trip as any).duration,
      price: (trip as any).price,
      rating: (trip as any).rating ?? 4.8,
      image: (trip as any).image || '/placeholder.svg',
      images:
        Array.isArray((trip as any).images) && (trip as any).images.length > 0
          ? (trip as any).images
          : (trip as any).image
            ? [(trip as any).image]
            : [],
      description: (trip as any).description || '',
      highlights: (trip as any).highlights || [],
      inclusions: (trip as any).inclusions || [],
      exclusions: (trip as any).exclusions || [],
      mood: (trip as any).mood || '',
      activities: (trip as any).activities || [],
      type: (trip as any).type || 'international',
      order: (trip as any).order ?? 0,
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching destination trip:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch trip' }, { status: 500 })
  }
}

