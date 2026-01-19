import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Resort from '@/models/Resort'

function parsePriceNumber(value: string): number | null {
  if (!value) return null
  const cleaned = value.replace(/[^\d.]/g, '')
  const num = Number(cleaned)
  return Number.isFinite(num) && num > 0 ? num : null
}

function formatPriceByType(type: 'domestic' | 'international', raw?: string): string {
  if (!raw || !raw.trim()) return 'Contact for pricing'
  const priceStr = raw.trim()
  if (type === 'domestic') {
    if (priceStr.startsWith('₹')) return priceStr
    if (priceStr.startsWith('$')) return '₹' + priceStr.substring(1)
    return `₹${priceStr}`
  }
  if (priceStr.startsWith('$')) return priceStr
  if (priceStr.startsWith('₹')) return '$' + priceStr.substring(1)
  return `$${priceStr}`
}

// GET - Fetch single resort by ID (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
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

    const resort = await Resort.findById(resortId).lean()

    if (!resort) {
      return NextResponse.json(
        { success: false, error: 'Resort not found' },
        { status: 404 }
      )
    }

    // Collect all amenities
    const amenities: string[] = []
    const amenityFields = [
      resort.roomAmenities1,
      resort.roomAmenities2,
      resort.roomAmenities3,
      resort.roomAmenities4,
      resort.resortAmenities1,
      resort.resortAmenities2,
      resort.resortAmenities3,
      resort.resortAmenities4,
    ]

    amenityFields.forEach((field) => {
      if (field) {
        try {
          const parsed = JSON.parse(field)
          if (Array.isArray(parsed)) {
            amenities.push(...parsed)
          } else if (typeof parsed === 'string') {
            amenities.push(parsed)
          }
        } catch {
          const items = field.split(',').map((a: string) => a.trim()).filter(Boolean)
          amenities.push(...items)
        }
      }
    })

    // Parse activities
    let activities: string[] = []
    if (resort.activities) {
      try {
        const parsed = JSON.parse(resort.activities)
        if (Array.isArray(parsed)) {
          activities = parsed
        } else if (typeof parsed === 'string') {
          activities = [parsed]
        }
      } catch {
        activities = resort.activities.split(',').map((a: string) => a.trim()).filter(Boolean)
      }
    }

    const tags = resort.tags?.toLowerCase() || ''
    const featured = tags.includes('featured')
    const popular = tags.includes('popular') || tags.includes('trending')

    // Use stored type, fallback to inference if not set
    let type = resort.type || 'domestic'
    const location = resort.addressTile || resort.shortDescription || ''
    if (!resort.type) {
      const domesticKeywords = ['india', 'indian', 'goa', 'kerala', 'rajasthan', 'himachal', 'uttarakhand', 'ladakh']
      type = domesticKeywords.some(keyword => location.toLowerCase().includes(keyword))
        ? 'domestic'
        : 'international'
    }

    // Build room types (new system) with fallback to old fields
    const dbRoomTypes = Array.isArray((resort as any).roomTypes) ? (resort as any).roomTypes : []
    const fallbackRoomAmenities: string[] = []
    ;[resort.roomAmenities1, resort.roomAmenities2, resort.roomAmenities3, resort.roomAmenities4].forEach((field) => {
      if (!field) return
      try {
        const parsed = JSON.parse(field)
        if (Array.isArray(parsed)) fallbackRoomAmenities.push(...parsed)
        else if (typeof parsed === 'string') fallbackRoomAmenities.push(parsed)
      } catch {
        fallbackRoomAmenities.push(...field.split(',').map((a: string) => a.trim()).filter(Boolean))
      }
    })

    const roomTypes =
      dbRoomTypes.length > 0
        ? dbRoomTypes.map((rt: any) => ({
            name: String(rt?.name || 'Room').trim(),
            price: formatPriceByType(type, String(rt?.price || '').trim()),
            rawPrice: String(rt?.price || '').trim(),
            image: String(rt?.image || rt?.Image || '').trim(),
            description: String(rt?.description || rt?.Description || '').trim(),
            amenities: Array.isArray(rt?.amenities) ? rt.amenities.filter(Boolean) : [],
          }))
        : [
            {
              name: 'Standard Room',
              price: formatPriceByType(type, resort.price || ''),
              rawPrice: String(resort.price || '').trim(),
              image: '',
              description: '',
              amenities: Array.from(new Set(fallbackRoomAmenities)).filter(Boolean),
            },
          ]

    // Determine default displayed price (minimum room type price)
    let defaultRaw = roomTypes[0]?.rawPrice || String(resort.price || '').trim()
    const priced = roomTypes
      .map((rt: any) => ({ raw: String(rt.rawPrice || '').trim(), num: parsePriceNumber(String(rt.rawPrice || '').trim()) }))
      .filter((x: any) => x.raw && x.num !== null)
      .sort((a: any, b: any) => (a.num as number) - (b.num as number))
    if (priced.length > 0) defaultRaw = priced[0].raw
    const formattedPrice = formatPriceByType(type, defaultRaw)

    // Build images array - use images array if available, otherwise use image as first item
    let images: string[] = []
    if (resort.images && Array.isArray(resort.images) && resort.images.length > 0) {
      images = resort.images.filter(Boolean)
    } else if (resort.image) {
      images = [resort.image]
    }

    // Ensure we have at least one image
    if (images.length === 0) {
      images = ['/placeholder.svg']
    }

    return NextResponse.json({
      success: true,
      data: {
        id: resort._id?.toString(),
        title: resort.resortsName || resort.name || 'Unnamed Resort',
        name: resort.name || '',
        location: location.split(',')[0] || 'Unknown Location',
        fullLocation: location,
        price: formattedPrice,
        rating: 4.5,
        image: images[0] || '/placeholder.svg', // First image for card display
        images: images, // All images for gallery
        roomTypes: roomTypes.map((rt: any) => ({
          name: rt.name,
          price: rt.price,
          image: rt.image || '',
          description: rt.description || '',
          amenities: rt.amenities || [],
        })),
        amenities: Array.from(new Set(amenities)).filter(Boolean),
        activities: activities,
        description: resort.shortDescription || '',
        addressTile: resort.addressTile || '',
        tags: resort.tags || '',
        mood: resort.mood || '',
        featured,
        popular,
        type,
        order: resort.order || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching resort:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch resort',
      },
      { status: 500 }
    )
  }
}
