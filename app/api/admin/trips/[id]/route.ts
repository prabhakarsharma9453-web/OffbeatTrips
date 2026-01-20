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

// PUT - Update trip (admin)
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

    const existing = await Trip.findById(tripId).lean()
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 })
    }

    const finalTitle = title !== undefined ? String(title).trim() : existing.title
    const finalSlug =
      slug && String(slug).trim()
        ? slugify(String(slug))
        : slugify(finalTitle || existing.title)

    // Images handling
    let imagesArray: string[] = []
    if (images && Array.isArray(images) && images.length > 0) {
      imagesArray = images.map((v: any) => String(v).trim()).filter(Boolean)
    } else if (image) {
      imagesArray = [String(image).trim()].filter(Boolean)
    } else if (existing.images && Array.isArray(existing.images) && existing.images.length > 0) {
      imagesArray = existing.images.filter((v: any) => v && String(v).trim()).map((v: any) => String(v).trim())
    } else if (existing.image) {
      imagesArray = [String(existing.image).trim()].filter(Boolean)
    }
    const mainImage = imagesArray[0] || existing.image || '/placeholder.svg'

    if (!finalTitle) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    }
    if (!activity && !existing.activity) {
      return NextResponse.json({ success: false, error: 'Activity is required' }, { status: 400 })
    }
    if (!location && !existing.location) {
      return NextResponse.json({ success: false, error: 'Location is required' }, { status: 400 })
    }
    if (!duration && !existing.duration) {
      return NextResponse.json({ success: false, error: 'Duration is required' }, { status: 400 })
    }
    if (!price && !existing.price) {
      return NextResponse.json({ success: false, error: 'Price is required' }, { status: 400 })
    }
    const updated = await Trip.findByIdAndUpdate(
      tripId,
      {
        slug: finalSlug,
        title: finalTitle,
        activity: activity || existing.activity,
        location: location !== undefined ? String(location).trim() : existing.location,
        country: country !== undefined ? String(country).trim() : existing.country || '',
        duration: duration !== undefined ? String(duration).trim() : existing.duration,
        price: price !== undefined ? String(price).trim() : existing.price,
        rating: rating !== undefined ? Number(rating) : existing.rating ?? 4.5,
        reviewCount: reviewCount !== undefined ? Number(reviewCount) : existing.reviewCount ?? 0,
        image: mainImage,
        images: imagesArray,
        description: description !== undefined ? String(description) : existing.description || '',
        highlights: highlights !== undefined ? normalizeStringArray(highlights) : (existing.highlights || []),
        difficulty: difficulty !== undefined ? String(difficulty) : existing.difficulty || '',
        groupSize: groupSize !== undefined ? String(groupSize) : existing.groupSize || '',
        type: type !== undefined ? type : existing.type || 'domestic',
        order: order !== undefined ? parseInt(String(order), 10) : existing.order ?? 0,
      },
      { new: true, runValidators: true }
    ).lean()

    return NextResponse.json({
      success: true,
      message: 'Trip updated successfully',
      data: updated,
    })
  } catch (error: any) {
    console.error('Error updating trip:', error)
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Trip slug already exists. Please use a different title/slug.' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update trip' },
      { status: 500 }
    )
  }
}

// DELETE - Delete trip (admin)
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

    const deleted = await Trip.findByIdAndDelete(tripId)
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Trip deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting trip:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete trip' },
      { status: 500 }
    )
  }
}

