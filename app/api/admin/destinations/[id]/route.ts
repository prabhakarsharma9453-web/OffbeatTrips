import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Destination from '@/models/Destination'
import DestinationTrip from '@/models/DestinationTrip'
import { requireAdmin } from '@/lib/auth-middleware'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
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
    const destinationId = resolvedParams.id

    const mongoose = await import('mongoose')
    if (!mongoose.default.Types.ObjectId.isValid(destinationId)) {
      return NextResponse.json({ success: false, error: 'Invalid destination ID format' }, { status: 400 })
    }

    const existing = await Destination.findById(destinationId).lean()
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Destination not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, country, trips, image, slug, isPopular, order } = body

    const finalName = name !== undefined ? String(name).trim() : existing.name
    const finalSlug = slug && String(slug).trim() ? slugify(String(slug).trim()) : slugify(finalName)

    const updated = await Destination.findByIdAndUpdate(
      destinationId,
      {
        name: finalName,
        country: country !== undefined ? String(country).trim() : existing.country,
        trips: trips !== undefined ? Number(trips) || 0 : (existing.trips ?? 0),
        image: image !== undefined ? String(image).trim() : existing.image,
        slug: finalSlug,
        isPopular: isPopular !== undefined ? Boolean(isPopular) : (existing.isPopular ?? true),
        order: order !== undefined ? parseInt(String(order), 10) : (existing.order ?? 0),
      },
      { new: true, runValidators: true }
    ).lean()

    // Keep destination trips linked if slug/name changes
    if (existing.slug !== finalSlug || existing.name !== finalName) {
      await DestinationTrip.updateMany(
        { destinationSlug: existing.slug },
        {
          $set: {
            destinationSlug: finalSlug,
            destinationName: finalName,
          },
        }
      )
    }

    return NextResponse.json({ success: true, message: 'Destination updated', data: updated })
  } catch (error: any) {
    console.error('Error updating destination:', error)
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Destination slug already exists. Use a different slug.' },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update destination' }, { status: 500 })
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
    const destinationId = resolvedParams.id

    const mongoose = await import('mongoose')
    if (!mongoose.default.Types.ObjectId.isValid(destinationId)) {
      return NextResponse.json({ success: false, error: 'Invalid destination ID format' }, { status: 400 })
    }

    const deleted = await Destination.findByIdAndDelete(destinationId)
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Destination not found' }, { status: 404 })
    }

    // Cleanup linked trips
    try {
      await DestinationTrip.deleteMany({ destinationSlug: deleted.slug })
    } catch (e) {
      console.error('Failed to cleanup destination trips for deleted destination:', e)
    }

    return NextResponse.json({ success: true, message: 'Destination deleted' })
  } catch (error: any) {
    console.error('Error deleting destination:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Failed to delete destination' }, { status: 500 })
  }
}

