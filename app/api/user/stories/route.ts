import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/mongodb'
import Story from '@/models/Story'
import User from '@/models/User'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function generateUniqueSlug(base: string): Promise<string> {
  const cleanedBase = slugify(base)
  if (!cleanedBase) return cleanedBase

  const existing = await Story.findOne({ slug: cleanedBase }).select({ _id: 1 }).lean()
  if (!existing) return cleanedBase

  for (let i = 2; i <= 50; i++) {
    const candidate = `${cleanedBase}-${i}`
    const exists = await Story.findOne({ slug: candidate }).select({ _id: 1 }).lean()
    if (!exists) return candidate
  }

  return `${cleanedBase}-${Date.now()}`
}

function calcReadTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

// GET - list current user's stories
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized', data: [] }, { status: 401 })
    }

    await connectDB()
    const items = await Story.find({ authorId: session.user.id }).sort({ createdAt: -1 }).lean()

    const data = items.map((s: any) => ({
      id: s._id?.toString(),
      title: s.title,
      slug: s.slug,
      excerpt: s.excerpt || '',
      image: s.image,
      category: s.category || 'Travel',
      readTimeMinutes: s.readTimeMinutes ?? 5,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching user stories:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch stories', data: [] }, { status: 500 })
  }
}

// POST - create story (authenticated user)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, category, excerpt, content, image } = body || {}

    if (!title || !String(title).trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    }
    if (!content || !String(content).trim()) {
      return NextResponse.json({ success: false, error: 'Story content is required' }, { status: 400 })
    }

    await connectDB()

    const user = await User.findById(session.user.id).lean()
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const finalTitle = String(title).trim()
    const finalSlug = await generateUniqueSlug(finalTitle)
    if (!finalSlug) {
      return NextResponse.json({ success: false, error: 'Slug could not be generated' }, { status: 400 })
    }

    const finalContent = String(content).trim()
    const finalExcerpt =
      excerpt && String(excerpt).trim()
        ? String(excerpt).trim()
        : finalContent.length > 140
          ? `${finalContent.slice(0, 140)}...`
          : finalContent

    const created = await Story.create({
      title: finalTitle,
      slug: finalSlug,
      excerpt: finalExcerpt,
      content: finalContent,
      image: image && String(image).trim() ? String(image).trim() : '',
      category: category && String(category).trim() ? String(category).trim() : 'Travel',
      readTimeMinutes: calcReadTimeMinutes(finalContent),
      authorId: session.user.id,
      authorName: (user as any).name || (user as any).username || (user as any).email || 'Anonymous',
      authorImage: (user as any).image || '',
    })

    return NextResponse.json({
      success: true,
      message: 'Story published',
      data: { id: created._id?.toString(), slug: finalSlug },
    })
  } catch (error: any) {
    console.error('Error creating story:', error)
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: 'Story title already exists. Try a different title.' }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: error?.message || 'Failed to publish story' }, { status: 500 })
  }
}

