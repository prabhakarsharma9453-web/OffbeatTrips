import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/mongodb'
import Package from '@/models/Package'

// Helper function to normalize array fields to string arrays
function normalizeToStringArray(value: any): string[] {
  if (!value) return []
  
  // If already an array of strings, return as is
  if (Array.isArray(value)) {
    return value
      .map(item => {
        // If item is a string, return it
        if (typeof item === 'string') return item.trim()
        // If item is an object with nested array (e.g., { inclusions: [...] })
        if (typeof item === 'object' && item !== null) {
          // Check for common nested structures
          if (item.inclusions && Array.isArray(item.inclusions)) {
            return item.inclusions.map((i: any) => String(i).trim())
          }
          if (item.exclusions && Array.isArray(item.exclusions)) {
            return item.exclusions.map((i: any) => String(i).trim())
          }
          // If object has array values, extract them
          const arrayValues = Object.values(item).filter(v => Array.isArray(v))
          if (arrayValues.length > 0 && Array.isArray(arrayValues[0])) {
            return (arrayValues[0] as any[]).map((i: any) => String(i).trim())
          }
        }
        return String(item).trim()
      })
      .filter(Boolean)
  }
  
  // If it's a string, try to parse as JSON
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return normalizeToStringArray(parsed)
    } catch {
      // If not JSON, treat as comma-separated
      return value.split(',').map(v => v.trim()).filter(Boolean)
    }
  }
  
  // If it's an object, try to extract array values
  if (typeof value === 'object' && value !== null) {
    // Check for nested inclusions/exclusions
    if (value.inclusions && Array.isArray(value.inclusions)) {
      return value.inclusions.map((i: any) => String(i).trim()).filter(Boolean)
    }
    if (value.exclusions && Array.isArray(value.exclusions)) {
      return value.exclusions.map((i: any) => String(i).trim()).filter(Boolean)
    }
    // If object has array values, extract them
    const arrayValues = Object.values(value).filter(v => Array.isArray(v))
    if (arrayValues.length > 0 && Array.isArray(arrayValues[0])) {
      return (arrayValues[0] as any[]).map((i: any) => String(i).trim()).filter(Boolean)
    }
  }
  
  return []
}

// GET - Fetch all packages (admin view)
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    await connectDB()

    const packages = await Package.find().sort({ order: 1, createdAt: -1 }).lean()

    const transformedPackages = packages.map((pkg) => ({
      ID: pkg._id?.toString(),
      slug: pkg.slug,
      title: pkg.title,
      location: pkg.location,
      country: pkg.country,
      duration: pkg.duration,
      price: pkg.price,
      rating: pkg.rating,
      reviewCount: pkg.reviewCount,
      image: pkg.image,
      images: pkg.images || [],
      highlights: pkg.highlights || [],
      activities: pkg.activities || [],
      type: pkg.type,
      overview: pkg.overview,
      itinerary: pkg.itinerary || [],
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      whyChoose: pkg.whyChoose || [],
      whatsappMessage: pkg.whatsappMessage || '',
      metaDescription: pkg.metaDescription || '',
      order: pkg.order?.toString() || null,
    }))

    return NextResponse.json({ success: true, data: transformedPackages })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}

// POST - Create new package
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    await connectDB()

    const body = await request.json()
    const {
      slug,
      title,
      location,
      country,
      duration,
      price,
      rating,
      reviewCount,
      image,
      images,
      highlights,
      activities,
      type,
      overview,
      itinerary,
      inclusions,
      exclusions,
      whyChoose,
      whatsappMessage,
      metaDescription,
      order,
    } = body

    const packageSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    // Handle images: prioritize images array, fallback to image string.
    // Images are optional - if none provided, we fall back to a placeholder.
    let mainImage = ''
    let imagesArray: string[] = []

    if (images && Array.isArray(images) && images.length > 0) {
      imagesArray = images.filter((img: string) => img && typeof img === 'string' && img.trim())
      mainImage = imagesArray[0] || ''
    } else if (image) {
      mainImage = typeof image === 'string' ? image : JSON.stringify(image)
      imagesArray = [mainImage]
    }

    if (!mainImage) {
      mainImage = '/placeholder.svg'
      imagesArray = []
    }

    // Normalize array fields to ensure they're arrays of strings
    const normalizedHighlights = normalizeToStringArray(highlights)
    const normalizedActivities = normalizeToStringArray(activities)
    const normalizedInclusions = normalizeToStringArray(inclusions)
    const normalizedExclusions = normalizeToStringArray(exclusions)
    const normalizedWhyChoose = normalizeToStringArray(whyChoose)

    console.log('Saving package with images:', {
      totalImages: imagesArray.length,
      images: imagesArray,
      mainImage: mainImage
    })
    console.log('Normalized fields:', {
      highlights: normalizedHighlights,
      activities: normalizedActivities,
      inclusions: normalizedInclusions,
      exclusions: normalizedExclusions,
      whyChoose: normalizedWhyChoose
    })

    const pkg = new Package({
      slug: packageSlug,
      title: title || '',
      location: location || '',
      country: country || '',
      duration: duration || '',
      price: price || '',
      rating: rating || 4.5,
      reviewCount: reviewCount || 0,
      image: mainImage,
      images: imagesArray, // Save all images to database
      highlights: normalizedHighlights,
      activities: normalizedActivities,
      type: type || 'domestic',
      overview: overview || '',
      itinerary: itinerary || [],
      inclusions: normalizedInclusions,
      exclusions: normalizedExclusions,
      whyChoose: normalizedWhyChoose,
      whatsappMessage: whatsappMessage || `Hi, I am interested in the ${title}`,
      metaDescription: metaDescription || undefined,
      order: order ? parseInt(order) : 0,
    })

    await pkg.save()

    // Verify images were saved
    const savedPackage = await Package.findById(pkg._id).lean()
    console.log('Package saved. Images in database:', {
      image: savedPackage?.image,
      images: savedPackage?.images,
      imagesCount: savedPackage?.images?.length || 0
    })

    return NextResponse.json({
      success: true,
      message: 'Package created successfully',
      id: pkg._id.toString(),
      imagesCount: imagesArray.length,
    })
  } catch (error) {
    console.error('Error creating package:', error)
    
    // Handle validation errors
    if (error instanceof Error) {
      // Mongoose validation error
      if ((error as any).name === 'ValidationError') {
        const validationErrors = Object.values((error as any).errors || {}).map((err: any) => err.message)
        return NextResponse.json(
          { 
            success: false, 
            error: `Validation error: ${validationErrors.join(', ')}`,
            details: validationErrors
          },
          { status: 400 }
        )
      }
      
      // Duplicate key error
      if ((error as any).code === 11000) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Package with this slug already exists',
            details: (error as any).keyPattern
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to create package',
          details: error.stack
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create package',
        details: String(error)
      },
      { status: 500 }
    )
  }
}
