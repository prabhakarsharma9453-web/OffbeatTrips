import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import DestinationTrip from '@/models/DestinationTrip'
import { requireAdmin } from '@/lib/auth-middleware'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeStringArray(value: any): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean)
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean)
    } catch {
      // ignore
    }
    return value.split(',').map((v) => v.trim()).filter(Boolean)
  }
  return []
}

// GET - list destination trips (admin). Optional ?destinationSlug=
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    await connectDB()

    const { searchParams } = new URL(request.url)
    const destinationSlug = searchParams.get('destinationSlug')

    const filter: any = {}
    if (destinationSlug) filter.destinationSlug = destinationSlug

    const items = await DestinationTrip.find(filter).sort({ order: 1, createdAt: -1 }).lean()

    const data = items.map((t: any) => ({
      ID: t._id?.toString(),
      slug: t.slug,
      destinationSlug: t.destinationSlug,
      destinationName: t.destinationName,
      title: t.title,
      location: t.location,
      duration: t.duration,
      price: t.price,
      rating: t.rating ?? 4.8,
      image: t.image,
      images: Array.isArray(t.images) && t.images.length > 0 ? t.images : (t.image ? [t.image] : []),
      description: t.description || '',
      highlights: t.highlights || [],
      inclusions: t.inclusions || [],
      exclusions: t.exclusions || [],
      mood: t.mood || '',
      activities: t.activities || [],
      type: t.type || 'international',
      order: t.order?.toString?.() ?? null,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching destination trips:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch destination trips' }, { status: 500 })
  }
}

// POST - create destination trip (admin)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    await connectDB()
    const body = await request.json()
    const {
      slug,
      destinationSlug,
      destinationName,
      title,
      location,
      duration,
      price,
      rating,
      image,
      images,
      description,
      highlights,
      inclusions,
      exclusions,
      mood,
      activities,
      type,
      order,
    } = body

    if (!destinationSlug || !String(destinationSlug).trim()) {
      return NextResponse.json({ success: false, error: 'Destination is required' }, { status: 400 })
    }
    if (!destinationName || !String(destinationName).trim()) {
      return NextResponse.json({ success: false, error: 'Destination name is required' }, { status: 400 })
    }
    if (!title || !String(title).trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    }
    if (!location || !String(location).trim()) {
      return NextResponse.json({ success: false, error: 'Location is required' }, { status: 400 })
    }
    if (!duration || !String(duration).trim()) {
      return NextResponse.json({ success: false, error: 'Duration is required' }, { status: 400 })
    }
    if (!price || !String(price).trim()) {
      return NextResponse.json({ success: false, error: 'Price is required' }, { status: 400 })
    }

    // Images
    let imagesArray: string[] = []
    if (images && Array.isArray(images) && images.length > 0) {
      imagesArray = images.map((v: any) => String(v).trim()).filter(Boolean)
    } else if (image) {
      imagesArray = [String(image).trim()].filter(Boolean)
    }
    const mainImage = imagesArray[0] || ''
    if (!mainImage) {
      return NextResponse.json({ success: false, error: 'At least one image is required' }, { status: 400 })
    }

    const finalSlug = slug && String(slug).trim()
      ? slugify(String(slug))
      : slugify(`${destinationSlug}-${title}`)

    const created = await DestinationTrip.create({
      slug: finalSlug,
      destinationSlug: String(destinationSlug).trim(),
      destinationName: String(destinationName).trim(),
      title: String(title).trim(),
      location: String(location).trim(),
      duration: String(duration).trim(),
      price: String(price).trim(),
      rating: rating !== undefined ? Number(rating) : 4.8,
      image: mainImage,
      images: imagesArray,
      description: description ? String(description) : '',
      highlights: normalizeStringArray(highlights),
      inclusions: normalizeStringArray(inclusions),
      exclusions: normalizeStringArray(exclusions),
      mood: mood ? String(mood) : '',
      activities: normalizeStringArray(activities),
      type: type || 'international',
      order: order ? parseInt(String(order), 10) : 0,
    })

    return NextResponse.json({ success: true, message: 'Destination trip created', id: created._id?.toString() })
  } catch (error: any) {
    console.error('Error creating destination trip:', error)
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Trip slug already exists. Use a different title/slug.' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create destination trip' },
      { status: 500 }
    )
  }
}

