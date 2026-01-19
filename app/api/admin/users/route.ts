import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

// GET - Fetch all users
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

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean()

    const transformedUsers = users.map((user) => ({
      id: user._id?.toString(),
      email: user.email,
      name: user.name || null,
      image: user.image || null,
      role: user.role,
      created_at: user.createdAt?.toISOString() || new Date().toISOString(),
      updated_at: user.updatedAt?.toISOString() || new Date().toISOString(),
    }))

    return NextResponse.json({ success: true, data: transformedUsers })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// PUT - Update user role
export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    await connectDB()

    const { userId, role } = await request.json()

    if (!userId || !role || !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid userId or role' },
        { status: 400 }
      )
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    )
      .select('-password')
      .lean()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        id: user._id?.toString(),
        email: user.email,
        name: user.name || null,
        image: user.image || null,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}
