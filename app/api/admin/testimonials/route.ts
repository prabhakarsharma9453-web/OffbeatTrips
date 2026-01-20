import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'
import { requireAdmin } from '@/lib/auth-middleware'

// GET - list all testimonials (admin view)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    await connectDB()

    const items = await Testimonial.find().sort({ createdAt: -1 }).lean()

    const data = items.map((t: any) => ({
      id: t._id?.toString(),
      name: t.name,
      location: t.location || '',
      rating: t.rating || 5,
      image: t.image || '',
      text: t.text,
      packageName: t.packageName || '',
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 },
    )
  }
}

// POST - create testimonial
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    await connectDB()

    const body = await request.json()
    const { name, location, rating, image, text, packageName } = body || {}

    if (!name || !String(name).trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    }
    if (!text || !String(text).trim()) {
      return NextResponse.json({ success: false, error: 'Review text is required' }, { status: 400 })
    }

    const created = await Testimonial.create({
      name: String(name).trim(),
      location: location ? String(location).trim() : '',
      rating: typeof rating === 'number' ? Math.min(Math.max(rating, 1), 5) : 5,
      image: image ? String(image).trim() : '',
      text: String(text).trim(),
      packageName: packageName ? String(packageName).trim() : '',
    })

    return NextResponse.json({
      success: true,
      message: 'Testimonial created',
      data: { id: created._id?.toString() },
    })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 },
    )
  }
}

// PUT - update testimonial
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    await connectDB()

    const body = await request.json()
    const { id, name, location, rating, image, text, packageName } = body || {}

    if (!id || !String(id).trim()) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
    }

    const existing = await Testimonial.findById(id)
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 })
    }

    if (name) existing.name = String(name).trim()
    if (location !== undefined) existing.location = String(location || '').trim()
    if (typeof rating === 'number') existing.rating = Math.min(Math.max(rating, 1), 5)
    if (image !== undefined) existing.image = String(image || '').trim()
    if (text) existing.text = String(text).trim()
    if (packageName !== undefined) existing.packageName = String(packageName || '').trim()

    await existing.save()

    return NextResponse.json({ success: true, message: 'Testimonial updated' })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 },
    )
  }
}

// DELETE - delete testimonial
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) return authResult

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id || !String(id).trim()) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
    }

    await connectDB()
    await Testimonial.findByIdAndDelete(id)

    return NextResponse.json({ success: true, message: 'Testimonial deleted' })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 },
    )
  }
}

