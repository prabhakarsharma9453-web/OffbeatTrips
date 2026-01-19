import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Resort from '@/models/Resort'
import { requireAdmin } from '@/lib/auth-middleware'

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
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
  }
  return []
}

function normalizeRoomTypes(
  value: any
): Array<{ name: string; price?: string; image?: string; description?: string; amenities?: string[] }> {
  if (!value) return []
  const raw = Array.isArray(value) ? value : (typeof value === 'string' ? (() => { try { return JSON.parse(value) } catch { return null } })() : null)
  if (!raw || !Array.isArray(raw)) return []

  return raw
    .map((rt: any) => {
      const name = rt?.name ?? rt?.Name ?? rt?.title ?? rt?.Title
      const price = rt?.price ?? rt?.Price ?? ''
      const image = rt?.image ?? rt?.Image ?? rt?.roomImage ?? rt?.RoomImage ?? ''
      const description = rt?.description ?? rt?.Description ?? ''
      const amenities = rt?.amenities ?? rt?.Amenities ?? rt?.roomAmenities ?? rt?.RoomAmenities
      const cleanedName = String(name || '').trim()
      if (!cleanedName) return null
      return {
        name: cleanedName,
        price: String(price || '').trim(),
        image: String(image || '').trim(),
        description: String(description || '').trim(),
        amenities: normalizeStringArray(amenities),
      }
    })
    .filter(Boolean) as Array<{ name: string; price?: string; image?: string; description?: string; amenities?: string[] }>
}

// PUT - Update resort
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    await connectDB()

    // Handle params as Promise or object (Next.js 16 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const resortId = resolvedParams.id

    // Validate ObjectId format
    const mongoose = await import('mongoose')
    if (!mongoose.default.Types.ObjectId.isValid(resortId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid resort ID format' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      Name,
      Resorts_Name,
      Image,
      Images, // Array of image URLs
      Room_Types,
      Short_Description,
      address_tile,
      Room_Amenities1,
      Room_Amenities2,
      Room_Amenities3,
      Room_Amenities4,
      Resort_Amenities1,
      Resort_Amenities2,
      Resort_Amenities3,
      Resort_Amenities4,
      Tags,
      Mood,
      Activities,
      Price,
      Type,
      order,
    } = body

    // Handle images: prioritize Images array, fallback to Image string
    let mainImage = ''
    let imagesArray: string[] = []

    if (Images && Array.isArray(Images) && Images.length > 0) {
      // Use Images array - filter out empty strings
      imagesArray = Images.filter((img: string) => img && typeof img === 'string' && img.trim())
      mainImage = imagesArray[0] || ''
    } else if (Image) {
      // Use single Image string
      mainImage = typeof Image === 'string' ? Image : JSON.stringify(Image)
      imagesArray = [mainImage]
    } else {
      // Try to preserve existing images if no new images provided
      const existingResort = await Resort.findById(resortId).lean()
      if (existingResort) {
        if (existingResort.images && Array.isArray(existingResort.images) && existingResort.images.length > 0) {
          imagesArray = existingResort.images.filter((img: string) => img && img.trim())
          mainImage = imagesArray[0] || ''
        } else if (existingResort.image) {
          mainImage = existingResort.image
          imagesArray = [mainImage]
        }
      }
    }

    if (!mainImage || imagesArray.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one image is required' },
        { status: 400 }
      )
    }

    console.log('Updating resort with images:', {
      totalImages: imagesArray.length,
      images: imagesArray,
      mainImage: mainImage,
      receivedImages: Images,
      receivedImage: Image
    })

    // Ensure images array is valid
    if (!Array.isArray(imagesArray) || imagesArray.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid images array. At least one image is required.' },
        { status: 400 }
      )
    }

    const updateDoc: any = {
      name: Name || '',
      resortsName: Resorts_Name || Name || '',
      image: mainImage,
      images: imagesArray, // Save all images to database
      shortDescription: Short_Description || '',
      addressTile: address_tile || '',
      roomAmenities1: Room_Amenities1 || undefined,
      roomAmenities2: Room_Amenities2 || undefined,
      roomAmenities3: Room_Amenities3 || undefined,
      roomAmenities4: Room_Amenities4 || undefined,
      resortAmenities1: Resort_Amenities1 || undefined,
      resortAmenities2: Resort_Amenities2 || undefined,
      resortAmenities3: Resort_Amenities3 || undefined,
      resortAmenities4: Resort_Amenities4 || undefined,
      tags: Tags || undefined,
      mood: Mood || undefined,
      activities: Activities || undefined,
      price: Price?.trim() || undefined,
      type: Type || 'domestic',
      order: order ? parseInt(order) : 0,
    }
    if (Room_Types !== undefined) {
      updateDoc.roomTypes = normalizeRoomTypes(Room_Types)
    }

    const resort = await Resort.findByIdAndUpdate(
      resortId,
      updateDoc,
      { new: true, runValidators: true }
    )

    if (!resort) {
      return NextResponse.json(
        { success: false, error: 'Resort not found' },
        { status: 404 }
      )
    }

    // Verify images were saved
    const savedResort = await Resort.findById(resortId).lean()
    console.log('Resort updated. Images in database:', {
      image: savedResort?.image,
      images: savedResort?.images,
      imagesCount: savedResort?.images?.length || 0
    })

    return NextResponse.json({
      success: true,
      message: 'Resort updated successfully',
      data: resort,
      imagesCount: imagesArray.length,
    })
  } catch (error) {
    console.error('Error updating resort:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const mongooseError = error as any
      const errorMessages = Object.values(mongooseError.errors || {}).map((err: any) => err.message)
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessages.length > 0 ? errorMessages.join(', ') : 'Validation failed' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update resort' 
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete resort
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authResult = await requireAdmin(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    await connectDB()

    // Handle params as Promise or object (Next.js 16 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const resortId = resolvedParams.id

    // Validate ObjectId format
    const mongoose = await import('mongoose')
    if (!mongoose.default.Types.ObjectId.isValid(resortId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid resort ID format' },
        { status: 400 }
      )
    }

    const resort = await Resort.findByIdAndDelete(resortId)

    if (!resort) {
      return NextResponse.json(
        { success: false, error: 'Resort not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Resort deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting resort:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid resort ID format' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete resort' 
      },
      { status: 500 }
    )
  }
}
