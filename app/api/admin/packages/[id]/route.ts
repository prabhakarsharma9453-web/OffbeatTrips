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

// PUT - Update package
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    await connectDB()

    // Handle params as Promise or object (Next.js 16 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const packageId = resolvedParams.id

    // Validate ObjectId format
    const mongoose = await import('mongoose')
    if (!mongoose.default.Types.ObjectId.isValid(packageId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid package ID format' },
        { status: 400 }
      )
    }

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

    // Handle images: prioritize images array, fallback to image string
    let mainImage = ''
    let imagesArray: string[] = []

    if (images && Array.isArray(images) && images.length > 0) {
      imagesArray = images.filter((img: string) => img && typeof img === 'string' && img.trim())
      mainImage = imagesArray[0] || ''
    } else if (image) {
      mainImage = typeof image === 'string' ? image : JSON.stringify(image)
      imagesArray = [mainImage]
    } else {
      // Try to preserve existing images if no new images provided
      const existingPackage = await Package.findById(packageId).lean()
      if (existingPackage) {
        if (existingPackage.images && Array.isArray(existingPackage.images) && existingPackage.images.length > 0) {
          imagesArray = existingPackage.images.filter((img: string) => img && img.trim())
          mainImage = imagesArray[0] || ''
        } else if (existingPackage.image) {
          mainImage = existingPackage.image
          imagesArray = [mainImage]
        }
      }
    }

    // If no images were provided, keep existing image or fallback to placeholder
    if (!mainImage || imagesArray.length === 0) {
      const existingPackage = await Package.findById(packageId).lean()
      const existingImages = (existingPackage?.images as string[]) || []
      const existingImage = (existingPackage?.image as string) || ''

      if (existingImages.length > 0) {
        imagesArray = existingImages.filter((img) => img && img.trim())
        mainImage = imagesArray[0] || existingImage || '/placeholder.svg'
      } else if (existingImage) {
        mainImage = existingImage
        imagesArray = [existingImage]
      } else {
        mainImage = '/placeholder.svg'
        imagesArray = []
      }
    }

    // Normalize array fields to ensure they're arrays of strings
    const normalizedHighlights = normalizeToStringArray(highlights)
    const normalizedActivities = normalizeToStringArray(activities)
    const normalizedInclusions = normalizeToStringArray(inclusions)
    const normalizedExclusions = normalizeToStringArray(exclusions)
    const normalizedWhyChoose = normalizeToStringArray(whyChoose)

    console.log('Updating package with images:', {
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

    const pkg = await Package.findByIdAndUpdate(
      packageId,
      {
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
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
        whatsappMessage: whatsappMessage || undefined,
        metaDescription: metaDescription || undefined,
        order: order ? parseInt(order) : 0,
      },
      { new: true, runValidators: true }
    )

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      )
    }

    // Verify images were saved
    const savedPackage = await Package.findById(packageId).lean()
    console.log('Package updated. Images in database:', {
      image: savedPackage?.image,
      images: savedPackage?.images,
      imagesCount: savedPackage?.images?.length || 0
    })

    return NextResponse.json({
      success: true,
      message: 'Package updated successfully',
      data: pkg,
      imagesCount: imagesArray.length,
    })
  } catch (error) {
    console.error('Error updating package:', error)
    
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
      
      // Cast error (invalid ObjectId)
      if ((error as any).name === 'CastError') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid package ID format',
            details: (error as any).message
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to update package',
          details: error.stack
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update package',
        details: String(error)
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete package
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    await connectDB()

    // Handle params as Promise or object (Next.js 16 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const packageId = resolvedParams.id

    // Validate ObjectId format
    const mongoose = await import('mongoose')
    if (!mongoose.default.Types.ObjectId.isValid(packageId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid package ID format' },
        { status: 400 }
      )
    }

    const pkg = await Package.findByIdAndDelete(packageId)

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting package:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid package ID format' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete package' 
      },
      { status: 500 }
    )
  }
}
