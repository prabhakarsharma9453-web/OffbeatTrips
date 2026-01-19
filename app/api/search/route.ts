import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Package from '@/models/Package'
import Resort from '@/models/Resort'
import Trip from '@/models/Trip'

// GET - Search across packages, resorts, trips, and other content
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          packages: [],
          resorts: [],
          total: 0,
        },
      })
    }

    await connectDB()

    const searchTerm = query.trim().toLowerCase()
    const searchRegex = new RegExp(searchTerm, 'i') // Case-insensitive regex

    // Search packages
    const packages = await Package.find({
      $or: [
        { title: searchRegex },
        { location: searchRegex },
        { country: searchRegex },
        { overview: searchRegex },
        { slug: searchRegex },
        { highlights: { $in: [searchRegex] } },
        { activities: { $in: [searchRegex] } },
      ],
    })
      .select('title location country type slug image')
      .limit(10)
      .lean()

    // Search resorts
    const resorts = await Resort.find({
      $or: [
        { name: searchRegex },
        { resortsName: searchRegex },
        { addressTile: searchRegex },
        { shortDescription: searchRegex },
        { tags: searchRegex },
        { activities: searchRegex },
        { mood: searchRegex },
      ],
    })
      .select('name resortsName addressTile type image _id')
      .limit(10)
      .lean()

    // Search trips
    const trips = await Trip.find({
      $or: [
        { title: searchRegex },
        { location: searchRegex },
        { country: searchRegex },
        { description: searchRegex },
        { slug: searchRegex },
        { highlights: { $in: [searchRegex] } },
        { activity: searchRegex },
      ],
    })
      .select('title location country type activity slug image')
      .limit(10)
      .lean()

    // Transform packages for frontend
    const transformedPackages = packages.map((pkg) => ({
      id: `package-${pkg._id?.toString()}`,
      title: pkg.title,
      location: pkg.location || '',
      country: pkg.country || '',
      type: pkg.type || 'domestic',
      category: 'package' as const,
      url: `/packages/${pkg.slug}`,
      image: pkg.image || '/placeholder.svg',
    }))

    // Transform resorts for frontend
    const transformedResorts = resorts.map((resort) => ({
      id: `resort-${resort._id?.toString()}`,
      title: resort.resortsName || resort.name,
      location: resort.addressTile || '',
      type: resort.type || 'domestic',
      category: 'resort' as const,
      url: `/resorts/${resort._id?.toString()}`,
      image: resort.image || '/placeholder.svg',
    }))

    // Transform trips for frontend
    const transformedTrips = trips.map((trip: any) => ({
      id: `trip-${trip._id?.toString()}`,
      title: trip.title,
      location: trip.location || '',
      country: trip.country || '',
      type: trip.type || 'domestic',
      category: 'trip' as const,
      url: `/activities/${trip.activity}`,
      image: trip.image || '/placeholder.svg',
    }))

    // Combine and limit total results
    const allResults = [...transformedPackages, ...transformedResorts, ...transformedTrips].slice(0, 12)

    return NextResponse.json({
      success: true,
      data: {
        packages: transformedPackages,
        resorts: transformedResorts,
        trips: transformedTrips,
        all: allResults,
        total: allResults.length,
      },
    })
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform search',
        data: {
          packages: [],
          resorts: [],
          trips: [],
          all: [],
          total: 0,
        },
      },
      { status: 500 }
    )
  }
}
