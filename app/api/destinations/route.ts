import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Destination from '@/models/Destination'
import DestinationTrip from '@/models/DestinationTrip'

// GET - public destinations list
// supports: ?popular=true
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const popularParam = searchParams.get('popular')
    const isPopular = popularParam === null ? undefined : popularParam === 'true'

    await connectDB()

    const filter: any = {}
    if (isPopular !== undefined) filter.isPopular = isPopular

    // Fetch all destinations first (Cosmos DB doesn't support composite sort without indexes)
    let items = await Destination.find(filter).lean()
    
    // Sort in memory
    items.sort((a: any, b: any) => {
      // First by order field
      const orderA = a.order || 0
      const orderB = b.order || 0
      if (orderA !== orderB) {
        return orderA - orderB
      }
      // Then by createdAt (newest first)
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    // If we have destination trips, prefer showing the real count
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
      id: d._id?.toString(),
      name: d.name,
      country: d.country,
      trips: countsBySlug.get(d.slug) ?? (d.trips ?? 0),
      image: d.image,
      slug: d.slug,
      order: d.order ?? 0,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch destinations', data: [] },
      { status: 500 }
    )
  }
}

