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
  // international
  if (priceStr.startsWith('$')) return priceStr
  if (priceStr.startsWith('₹')) return '$' + priceStr.substring(1)
  return `$${priceStr}`
}

// GET - Fetch all resorts (public)
export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const locationFilter = searchParams.get('location')
    const typeFilter = searchParams.get('type')

    // Build query - filter by type if specified
    const query: any = {}
    if (typeFilter) {
      query.type = typeFilter
    }

    let resorts = await Resort.find(query).sort({ order: 1, createdAt: -1 }).lean()

    const transformedResorts = resorts.map((resort) => {
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

      // Format price with currency based on type
      // Prefer minimum room type price if available
      let basePrice: string | undefined = resort.price || undefined
      const roomTypes = Array.isArray((resort as any).roomTypes) ? (resort as any).roomTypes : []
      if (roomTypes.length > 0) {
        const priced = roomTypes
          .map((rt: any) => ({ raw: String(rt?.price || '').trim(), num: parsePriceNumber(String(rt?.price || '').trim()) }))
          .filter((x: any) => x.raw && x.num !== null)
          .sort((a: any, b: any) => (a.num as number) - (b.num as number))
        if (priced.length > 0) basePrice = priced[0].raw
      }
      const formattedPrice = formatPriceByType(type, basePrice)

      // Get main image - prefer first image from images array, fallback to image field
      let mainImage = '/placeholder.svg'
      if (resort.images && Array.isArray(resort.images) && resort.images.length > 0) {
        mainImage = resort.images[0]
      } else if (resort.image) {
        mainImage = typeof resort.image === 'string' ? resort.image : '/placeholder.svg'
      }

      return {
        id: resort._id?.toString(),
        title: resort.resortsName || resort.name || 'Unnamed Resort',
        location: location.split(',')[0] || 'Unknown Location',
        price: formattedPrice,
        rating: 4.5,
        image: mainImage,
        amenities: Array.from(new Set(amenities)).filter(Boolean).slice(0, 8),
        featured,
        popular,
        type,
      }
    })

    let filteredResorts = transformedResorts

    // Filter by location if specified
    if (locationFilter && locationFilter !== 'All Locations') {
      filteredResorts = filteredResorts.filter((resort) =>
        resort.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    // Type filtering is already done at database level, but ensure type matches
    if (typeFilter) {
      filteredResorts = filteredResorts.filter((resort) => resort.type === typeFilter)
    }

    filteredResorts.sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1
      }
      if (a.popular !== b.popular) {
        return a.popular ? -1 : 1
      }
      return b.rating - a.rating
    })

    return NextResponse.json({ success: true, data: filteredResorts })
  } catch (error) {
    console.error('Error fetching resorts:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch resorts',
      },
      { status: 500 }
    )
  }
}
