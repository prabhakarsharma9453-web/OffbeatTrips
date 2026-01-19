import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Package from '@/models/Package'

// GET - Fetch single package by slug (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    await connectDB()

    // Handle params as Promise or object (Next.js 16 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const packageSlug = resolvedParams.slug

    const pkg = await Package.findOne({ slug: packageSlug }).lean()

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      )
    }

    // Build images array - use images array if available, otherwise use image as first item
    let images: string[] = []
    if (pkg.images && Array.isArray(pkg.images) && pkg.images.length > 0) {
      images = pkg.images.filter(Boolean)
    } else if (pkg.image) {
      images = [pkg.image]
    }

    // Ensure we have at least one image
    if (images.length === 0) {
      images = ['/placeholder.svg']
    }

    return NextResponse.json({
      success: true,
      data: {
        id: pkg._id?.toString(),
        slug: pkg.slug,
        title: pkg.title || 'Unnamed Package',
        location: pkg.location || '',
        country: pkg.country || '',
        duration: pkg.duration || '',
        price: pkg.price || '',
        rating: pkg.rating || 4.5,
        reviewCount: pkg.reviewCount || 0,
        image: images[0] || '/placeholder.svg', // First image for card display
        images: images, // All images for gallery
        highlights: pkg.highlights || [],
        activities: pkg.activities || [],
        type: pkg.type || 'domestic',
        overview: pkg.overview || '',
        itinerary: pkg.itinerary || [],
        inclusions: pkg.inclusions || [],
        exclusions: pkg.exclusions || [],
        whyChoose: pkg.whyChoose || [],
        whatsappMessage: pkg.whatsappMessage || `Hi, I am interested in the ${pkg.title}`,
        metaDescription: pkg.metaDescription || '',
        order: pkg.order || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch package',
      },
      { status: 500 }
    )
  }
}
