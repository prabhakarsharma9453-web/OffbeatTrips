import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Package from '@/models/Package'

// GET - Fetch all packages (public)
export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const typeFilter = searchParams.get('type')
    const locationFilter = searchParams.get('location')

    // Build query - filter by type if specified
    const query: any = {}
    if (typeFilter) {
      query.type = typeFilter
    }

    const packages = await Package.find(query).sort({ order: 1, createdAt: -1 }).lean()

    const transformedPackages = packages.map((pkg) => {
      // Get main image - prefer first image from images array, fallback to image field
      let mainImage = '/placeholder.svg'
      if (pkg.images && Array.isArray(pkg.images) && pkg.images.length > 0) {
        mainImage = pkg.images[0]
      } else if (pkg.image) {
        mainImage = typeof pkg.image === 'string' ? pkg.image : '/placeholder.svg'
      }

      return {
        id: pkg._id?.toString(),
        slug: pkg.slug,
        title: pkg.title || 'Unnamed Package',
        location: pkg.location || '',
        country: pkg.country || '',
        duration: pkg.duration || '',
        price: pkg.price || '',
        rating: pkg.rating || 4.5,
        reviewCount: pkg.reviewCount || 0,
        image: mainImage,
        highlights: pkg.highlights || [],
        activities: pkg.activities || [],
        type: pkg.type || 'domestic',
      }
    })

    // Type filtering is already done at database level, but ensure type matches
    let filteredPackages = transformedPackages
    if (typeFilter) {
      filteredPackages = filteredPackages.filter((pkg) => pkg.type === typeFilter)
    }

    // Filter by location if specified
    if (locationFilter && locationFilter !== 'All Locations') {
      const locationLower = locationFilter.toLowerCase()
      filteredPackages = filteredPackages.filter((pkg) => {
        const pkgLocationLower = (pkg.location || '').toLowerCase()
        const pkgCountryLower = (pkg.country || '').toLowerCase()
        return (
          pkgLocationLower.includes(locationLower) ||
          pkgCountryLower.includes(locationLower) ||
          locationLower.includes(pkgLocationLower) ||
          locationLower.includes(pkgCountryLower)
        )
      })
    }

    return NextResponse.json({ success: true, data: filteredPackages })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch packages',
      },
      { status: 500 }
    )
  }
}
