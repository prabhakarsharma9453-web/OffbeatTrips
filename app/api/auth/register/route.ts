import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/jwt'

export async function POST(request: Request) {
  try {
    await connectDB()

    const { username, email, password, name, role } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const existingUsername = await User.findOne({ username })

    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      )
    }

    if (email) {
      const existingEmail = await User.findOne({ email })

      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userRole = role === 'admin' ? 'admin' : 'user'

    const user = new User({
      username,
      email: email || undefined,
      password: hashedPassword,
      name: name || undefined,
      role: userRole,
    })

    await user.save()

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email || undefined,
      username: user.username,
      role: userRole,
    })

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      userId: user._id.toString(),
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        name: user.name,
        role: userRole,
      },
    })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
