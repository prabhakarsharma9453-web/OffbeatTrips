import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Trip from '@/models/Trip'
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
      // fallthrough
    }
    return value.split(',').map((v) => v.trim()).filter(Boolean)
  }
  return []
}

// GET - List all trips (admin)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    await connectDB()

    const trips = await Trip.find().sort({ order: 1, createdAt: -1 }).lean()

    const transformed = trips.map((t: any) => ({
      ID: t._id?.toString(),
      slug: t.slug,
      title: t.title,
      activity: t.activity,
      location: t.location,
      country: t.country || '',
      duration: t.duration,
      price: t.price,
      rating: t.rating ?? 4.5,
      reviewCount: t.reviewCount ?? 0,
      image: t.image,
      images: Array.isArray(t.images) && t.images.length > 0 ? t.images : (t.image ? [t.image] : []),
      description: t.description || '',
      highlights: t.highlights || [],
      difficulty: t.difficulty || '',
      groupSize: t.groupSize || '',
      type: t.type || 'domestic',
      order: t.order?.toString?.() ?? null,
    }))

    return NextResponse.json({ success: true, data: transformed })
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trips' },
      { status: 500 }
    )
  }
}

// POST - Create trip (admin)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    await connectDB()

    const body = await request.json()
    const {
      slug,
      title,
      activity,
      location,
      country,
      duration,
      price,
      rating,
      reviewCount,
      image,
      images,
      description,
      highlights,
      difficulty,
      groupSize,
      type,
      order,
    } = body

    const finalSlug = (slug && String(slug).trim()) ? slugify(String(slug)) : slugify(String(title || ''))

    // Images: prefer array, fallback to single image
    let imagesArray: string[] = []
    if (images && Array.isArray(images) && images.length > 0) {
      imagesArray = images.map((v: any) => String(v).trim()).filter(Boolean)
    } else if (image) {
      imagesArray = [String(image).trim()].filter(Boolean)
    }
    const mainImage = imagesArray[0] || ''

    if (!title || !String(title).trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    }
    if (!activity) {
      return NextResponse.json({ success: false, error: 'Activity is required' }, { status: 400 })
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
    if (!mainImage) {
      return NextResponse.json({ success: false, error: 'At least one image is required' }, { status: 400 })
    }
    if (!finalSlug) {
      return NextResponse.json({ success: false, error: 'Slug could not be generated' }, { status: 400 })
    }

    const trip = await Trip.create({
      slug: finalSlug,
      title: String(title).trim(),
      activity,
      location: String(location).trim(),
      country: country ? String(country).trim() : '',
      duration: String(duration).trim(),
      price: String(price).trim(),
      rating: rating ? Number(rating) : 4.5,
      reviewCount: reviewCount ? Number(reviewCount) : 0,
      image: mainImage,
      images: imagesArray,
      description: description ? String(description) : '',
      highlights: normalizeStringArray(highlights),
      difficulty: difficulty ? String(difficulty) : '',
      groupSize: groupSize ? String(groupSize) : '',
      type: type || 'domestic',
      order: order ? parseInt(String(order), 10) : 0,
    })

    return NextResponse.json({
      success: true,
      message: 'Trip created successfully',
      id: trip._id?.toString(),
    })
  } catch (error: any) {
    console.error('Error creating trip:', error)
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Trip slug already exists. Please use a different title/slug.' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create trip' },
      { status: 500 }
    )
  }
}

