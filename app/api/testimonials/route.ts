import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'

// Public GET - testimonials for homepage
export async function GET() {
  try {
    await connectDB()

    const items = await Testimonial.find().sort({ createdAt: -1 }).limit(20).lean()

    const data = items.map((t: any) => ({
      id: t._id?.toString(),
      name: t.name,
      location: t.location || '',
      rating: t.rating || 5,
      image: t.image || '',
      text: t.text,
      package: t.packageName || '',
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching testimonials (public):', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials', data: [] },
      { status: 500 },
    )
  }
}

