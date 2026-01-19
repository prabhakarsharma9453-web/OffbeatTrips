import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/jwt'

export async function POST(request: Request) {
  try {
    await connectDB()

    const { username, email, password } = await request.json()

    // Accept either username or email
    const loginIdentifier = username || email

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Username/email and password are required' },
        { status: 400 }
      )
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: loginIdentifier },
        { email: loginIdentifier },
      ],
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (!user.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email || undefined,
      username: user.username,
      role: user.role || 'user',
    })

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
      },
    })
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    )
  }
}
