import { NextRequest, NextResponse } from 'next/server'
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

async function generateUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const cleanedBase = slugify(base)
  if (!cleanedBase) return cleanedBase

  const query: any = { slug: cleanedBase }
  if (excludeId) {
    query._id = { $ne: excludeId }
  }

  const existing = await Story.findOne(query).select({ _id: 1 }).lean()
  if (!existing) return cleanedBase

  for (let i = 2; i <= 50; i++) {
    const candidate = `${cleanedBase}-${i}`
    const candidateQuery: any = { slug: candidate }
    if (excludeId) {
      candidateQuery._id = { $ne: excludeId }
    }
    const exists = await Story.findOne(candidateQuery).select({ _id: 1 }).lean()
    if (!exists) return candidate
  }

  return `${cleanedBase}-${Date.now()}`
}

function calcReadTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

// PUT - update story
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = params instanceof Promise ? await params : params
    const storyId = resolvedParams.id

    if (!storyId || !String(storyId).trim()) {
      return NextResponse.json({ success: false, error: 'Story ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const { title, category, excerpt, content, image, images, authorName } = body || {}

    await connectDB()

    const existing = await Story.findById(storyId).lean()
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Story not found' }, { status: 404 })
    }

    // Verify ownership (admin can edit any story, regular users can only edit their own)
    const user = await User.findById(session.user.id).lean()
    const isAdmin = (user as any)?.role === 'admin'
    if (!isAdmin && (existing as any).authorId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    // Handle images
    let imagesArray: string[] = []
    let mainImage = ''
    
    if (images && Array.isArray(images) && images.length > 0) {
      imagesArray = images.filter((img: string) => img && typeof img === 'string' && img.trim())
      mainImage = imagesArray[0] || ''
    } else if (image) {
      mainImage = typeof image === 'string' ? image : String(image)
      imagesArray = [mainImage]
    } else if ((existing as any).images && Array.isArray((existing as any).images) && (existing as any).images.length > 0) {
      imagesArray = (existing as any).images
      mainImage = imagesArray[0] || ''
    } else if ((existing as any).image) {
      mainImage = (existing as any).image
      imagesArray = [mainImage]
    }

    if (!mainImage) {
      mainImage = ''
      imagesArray = []
    }

    // Handle title and slug
    let finalTitle = title ? String(title).trim() : (existing as any).title
    let finalSlug = (existing as any).slug

    // If title changed, regenerate slug
    if (title && String(title).trim() !== (existing as any).title) {
      finalSlug = await generateUniqueSlug(finalTitle, storyId)
    }

    // Handle content and excerpt
    const finalContent = content ? String(content).trim() : (existing as any).content
    const finalExcerpt =
      excerpt !== undefined
        ? excerpt && String(excerpt).trim()
          ? String(excerpt).trim()
          : finalContent.length > 140
            ? `${finalContent.slice(0, 140)}...`
            : finalContent
        : (existing as any).excerpt || ''

    // Update story
    const updated = await Story.findByIdAndUpdate(
      storyId,
      {
        title: finalTitle,
        slug: finalSlug,
        excerpt: finalExcerpt,
        content: finalContent,
        image: mainImage,
        images: imagesArray,
        category: category !== undefined ? (category ? String(category).trim() : 'Travel') : (existing as any).category || 'Travel',
        readTimeMinutes: calcReadTimeMinutes(finalContent),
        ...(authorName && String(authorName).trim() ? { authorName: String(authorName).trim() } : {}),
      },
      { new: true, runValidators: true }
    ).lean()

    return NextResponse.json({
      success: true,
      message: 'Story updated successfully',
      data: { id: (updated as any)._id?.toString(), slug: finalSlug },
    })
  } catch (error: any) {
    console.error('Error updating story:', error)
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: 'Story title already exists. Try a different title.' }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update story' }, { status: 500 })
  }
}

// DELETE - delete story
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = params instanceof Promise ? await params : params
    const storyId = resolvedParams.id

    if (!storyId || !String(storyId).trim()) {
      return NextResponse.json({ success: false, error: 'Story ID is required' }, { status: 400 })
    }

    await connectDB()

    const existing = await Story.findById(storyId).lean()
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Story not found' }, { status: 404 })
    }

    // Verify ownership (admin can delete any story, regular users can only delete their own)
    const user = await User.findById(session.user.id).lean()
    const isAdmin = (user as any)?.role === 'admin'
    if (!isAdmin && (existing as any).authorId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    await Story.findByIdAndDelete(storyId)

    return NextResponse.json({
      success: true,
      message: 'Story deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting story:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Failed to delete story' }, { status: 500 })
  }
}
