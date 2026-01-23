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
): Array<{ name: string; price?: string; image?: string; images?: string[]; description?: string; amenities?: string[] }> {
  if (!value) return []
  const raw = Array.isArray(value) ? value : (typeof value === 'string' ? (() => { try { return JSON.parse(value) } catch { return null } })() : null)
  if (!raw || !Array.isArray(raw)) return []

  return raw
    .map((rt: any) => {
      const name = rt?.name ?? rt?.Name ?? rt?.title ?? rt?.Title
      const price = rt?.price ?? rt?.Price ?? ''
      const image = rt?.image ?? rt?.Image ?? rt?.roomImage ?? rt?.RoomImage ?? ''
      const images = rt?.images ?? rt?.Images
      const imageArray = Array.isArray(images)
        ? images.map((v: any) => String(v || '').trim()).filter(Boolean)
        : image
          ? [String(image || '').trim()]
          : []
      const description = rt?.description ?? rt?.Description ?? ''
      const amenities = rt?.amenities ?? rt?.Amenities ?? rt?.roomAmenities ?? rt?.RoomAmenities
      const cleanedName = String(name || '').trim()
      if (!cleanedName) return null
      return {
        name: cleanedName,
        price: String(price || '').trim(),
        image: String(image || '').trim(),
        images: imageArray,
        description: String(description || '').trim(),
        amenities: normalizeStringArray(amenities),
      }
    })
    .filter(Boolean) as Array<{ name: string; price?: string; image?: string; images?: string[]; description?: string; amenities?: string[] }>
}

// GET - Fetch all resorts (admin view)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    await connectDB()

    // Fetch all resorts first (Cosmos DB doesn't support composite sort without indexes)
    let resorts = await Resort.find().lean()
    
    // Sort in memory
    resorts.sort((a: any, b: any) => {
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

    const transformedResorts = resorts.map((resort) => ({
      ID: resort._id?.toString(),
      Name: resort.name || '',
      Resorts_Name: resort.resortsName || '',
      Image: resort.image || '',
      Images: resort.images && Array.isArray(resort.images) ? resort.images : (resort.image ? [resort.image] : []),
      Room_Types: Array.isArray((resort as any).roomTypes) ? (resort as any).roomTypes : [],
      Short_Description: resort.shortDescription || '',
      address_tile: resort.addressTile || '',
      Room_Amenities1: resort.roomAmenities1 || null,
      Room_Amenities2: resort.roomAmenities2 || null,
      Room_Amenities3: resort.roomAmenities3 || null,
      Room_Amenities4: resort.roomAmenities4 || null,
      Resort_Amenities1: resort.resortAmenities1 || null,
      Resort_Amenities2: resort.resortAmenities2 || null,
      Resort_Amenities3: resort.resortAmenities3 || null,
      Resort_Amenities4: resort.resortAmenities4 || null,
      Tags: resort.tags || null,
      Mood: resort.mood || null,
      Activities: resort.activities || null,
      Price: resort.price || null,
      Type: resort.type || 'domestic',
      order: resort.order?.toString() || null,
    }))

    return NextResponse.json({ success: true, data: transformedResorts })
  } catch (error) {
    console.error('Error fetching resorts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resorts' },
      { status: 500 }
    )
  }
}

// POST - Create new resort
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    await connectDB()

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
    }

    // Images are optional; if none provided, use placeholder
    if (!mainImage) {
      mainImage = '/placeholder.svg'
      imagesArray = []
    }

    console.log('Saving resort with images:', {
      totalImages: imagesArray.length,
      images: imagesArray,
      mainImage: mainImage,
      receivedImages: Images,
      receivedImage: Image
    })

    const resort = new Resort({
      name: Name || '',
      resortsName: Resorts_Name || Name || '',
      image: mainImage,
      images: imagesArray, // Save all images to database
      roomTypes: normalizeRoomTypes(Room_Types),
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
    })

    await resort.save()

    // Verify images were saved
    const savedResort = await Resort.findById(resort._id).lean()
    console.log('Resort saved. Images in database:', {
      image: savedResort?.image,
      images: savedResort?.images,
      imagesCount: savedResort?.images?.length || 0
    })

    return NextResponse.json({
      success: true,
      message: 'Resort created successfully',
      id: resort._id.toString(),
      imagesCount: imagesArray.length,
    })
  } catch (error) {
    console.error('Error creating resort:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create resort' },
      { status: 500 }
    )
  }
}
