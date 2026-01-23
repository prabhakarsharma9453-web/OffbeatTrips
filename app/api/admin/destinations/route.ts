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

async function generateUniqueSlug(base: string): Promise<string> {
  const cleanedBase = slugify(base)
  if (!cleanedBase) return cleanedBase

  // If base is free, use it
  const existing = await Destination.findOne({ slug: cleanedBase }).select({ _id: 1 }).lean()
  if (!existing) return cleanedBase

  // Otherwise, append -2, -3...
  for (let i = 2; i <= 50; i++) {
    const candidate = `${cleanedBase}-${i}`
    const exists = await Destination.findOne({ slug: candidate }).select({ _id: 1 }).lean()
    if (!exists) return candidate
  }

  return `${cleanedBase}-${Date.now()}`
}

// GET - list destinations (admin)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    await connectDB()
    // Fetch all destinations (Cosmos DB doesn't support composite sort without indexes)
    let items = await Destination.find().lean()
    
    // Sort in memory
    items.sort((a: any, b: any) => {
      const orderA = a.order || 0
      const orderB = b.order || 0
      if (orderA !== orderB) return orderA - orderB
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    const slugs = items.map((d: any) => d.slug).filter(Boolean)
    let countsBySlug = new Map<string, number>()
    if (slugs.length > 0) {
      const counts = await DestinationTrip.aggregate([
        { $match: { destinationSlug: { $in: slugs } } },
        { $group: { _id: '$destinationSlug', count: { $sum: 1 } } },
      ])
      countsBySlug = new Map(counts.map((c: any) => [c._id, c.count]))
    }

    const data = items.map((d: any) => ({
      ID: d._id?.toString(),
      name: d.name,
      country: d.country,
      trips: countsBySlug.get(d.slug) ?? (d.trips ?? 0),
      image: d.image,
      slug: d.slug,
      isPopular: d.isPopular ?? true,
      order: d.order?.toString?.() ?? null,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch destinations' }, { status: 500 })
  }
}

// POST - create destination (admin)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    await connectDB()
    const body = await request.json()
    const { name, country, trips, image, slug, isPopular, order } = body

    console.log('Creating destination payload:', { name, country, trips, image, slug, isPopular, order })

    if (!name || !String(name).trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    }
    if (!country || !String(country).trim()) {
      return NextResponse.json({ success: false, error: 'Country/Region label is required' }, { status: 400 })
    }

    const requestedSlug = slug && String(slug).trim() ? String(slug).trim() : String(name)
    const finalSlug = await generateUniqueSlug(requestedSlug)
    if (!finalSlug) {
      return NextResponse.json({ success: false, error: 'Slug could not be generated' }, { status: 400 })
    }

    const created = await Destination.create({
      name: String(name).trim(),
      country: String(country).trim(),
      trips: Number(trips) || 0,
      image: String(image || '/placeholder.svg').trim(),
      slug: finalSlug,
      isPopular: isPopular !== undefined ? Boolean(isPopular) : true,
      order: order ? parseInt(String(order), 10) : 0,
    })

    return NextResponse.json({ success: true, message: 'Destination created', id: created._id?.toString() })
  } catch (error: any) {
    console.error('Error creating destination:', error)
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: 'Destination already exists. Try a different name/slug.' }, { status: 400 })
    }
    if (error?.name === 'ValidationError') {
      const details = Object.values(error.errors || {})
        .map((e: any) => e?.message)
        .filter(Boolean)
        .join(', ')
      return NextResponse.json({ success: false, error: details || 'Validation error' }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create destination' }, { status: 500 })
  }
}

