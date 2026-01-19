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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    await connectDB()

    const resolvedParams = params instanceof Promise ? await params : params
    const tripId = resolvedParams.id

    const mongoose = await import('mongoose')
    if (!mongoose.default.Types.ObjectId.isValid(tripId)) {
      return NextResponse.json({ success: false, error: 'Invalid trip ID format' }, { status: 400 })
    }

    const existing = await DestinationTrip.findById(tripId).lean()
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 })
    }

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

    // Images
    let imagesArray: string[] = []
    if (images && Array.isArray(images) && images.length > 0) {
      imagesArray = images.map((v: any) => String(v).trim()).filter(Boolean)
    } else if (image) {
      imagesArray = [String(image).trim()].filter(Boolean)
    } else if (existing.images && Array.isArray(existing.images) && existing.images.length > 0) {
      imagesArray = existing.images.map((v: any) => String(v).trim()).filter(Boolean)
    } else if (existing.image) {
      imagesArray = [String(existing.image).trim()].filter(Boolean)
    }
    const mainImage = imagesArray[0] || ''
    if (!mainImage) {
      return NextResponse.json({ success: false, error: 'At least one image is required' }, { status: 400 })
    }

    const finalDestinationSlug = destinationSlug !== undefined ? String(destinationSlug).trim() : existing.destinationSlug
    const finalTitle = title !== undefined ? String(title).trim() : existing.title
    const finalSlug =
      slug && String(slug).trim()
        ? slugify(String(slug))
        : slugify(`${finalDestinationSlug}-${finalTitle}`)

    const updated = await DestinationTrip.findByIdAndUpdate(
      tripId,
      {
        slug: finalSlug,
        destinationSlug: finalDestinationSlug,
        destinationName: destinationName !== undefined ? String(destinationName).trim() : existing.destinationName,
        title: finalTitle,
        location: location !== undefined ? String(location).trim() : existing.location,
        duration: duration !== undefined ? String(duration).trim() : existing.duration,
        price: price !== undefined ? String(price).trim() : existing.price,
        rating: rating !== undefined ? Number(rating) : (existing.rating ?? 4.8),
        image: mainImage,
        images: imagesArray,
        description: description !== undefined ? String(description) : (existing.description || ''),
        highlights: highlights !== undefined ? normalizeStringArray(highlights) : (existing.highlights || []),
        inclusions: inclusions !== undefined ? normalizeStringArray(inclusions) : (existing.inclusions || []),
        exclusions: exclusions !== undefined ? normalizeStringArray(exclusions) : (existing.exclusions || []),
        mood: mood !== undefined ? String(mood) : (existing.mood || ''),
        activities: activities !== undefined ? normalizeStringArray(activities) : (existing.activities || []),
        type: type !== undefined ? type : (existing.type || 'international'),
        order: order !== undefined ? parseInt(String(order), 10) : (existing.order ?? 0),
      },
      { new: true, runValidators: true }
    ).lean()

    return NextResponse.json({ success: true, message: 'Destination trip updated', data: updated })
  } catch (error: any) {
    console.error('Error updating destination trip:', error)
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Trip slug already exists. Use a different title/slug.' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update destination trip' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    await connectDB()

    const resolvedParams = params instanceof Promise ? await params : params
    const tripId = resolvedParams.id

    const mongoose = await import('mongoose')
    if (!mongoose.default.Types.ObjectId.isValid(tripId)) {
      return NextResponse.json({ success: false, error: 'Invalid trip ID format' }, { status: 400 })
    }

    const deleted = await DestinationTrip.findByIdAndDelete(tripId)
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Destination trip deleted' })
  } catch (error: any) {
    console.error('Error deleting destination trip:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete destination trip' },
      { status: 500 }
    )
  }
}

