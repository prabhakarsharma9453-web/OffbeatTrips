import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { verifyToken, extractTokenFromHeader, JWTPayload } from '@/lib/jwt'

export interface AuthUser {
  id: string
  email?: string
  username?: string
  role: string
}

/**
 * Verify authentication from either session cookie or JWT token
 * Returns the authenticated user or null
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  // First, try NextAuth session (for browser-based requests)
  try {
    const session = await auth()
    if (session?.user) {
      return {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      }
    }
  } catch (error) {
    // Session check failed, try JWT token
  }

  // Try JWT token from Authorization header (for API requests)
  const authHeader = request.headers.get('authorization')
  const token = extractTokenFromHeader(authHeader)

  if (token) {
    const payload = verifyToken(token)
    if (payload) {
      return {
        id: payload.id,
        email: payload.email,
        username: payload.username,
        role: payload.role,
      }
    }
  }

  return null
}

/**
 * Middleware to require authentication
 * Returns the authenticated user or sends 401 response
 */
export async function requireAuth(request: NextRequest): Promise<{ user: AuthUser } | NextResponse> {
  const user = await verifyAuth(request)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Authentication required.' },
      { status: 401 }
    )
  }

  return { user }
}

/**
 * Middleware to require admin role
 * Returns the authenticated admin user or sends 403 response
 */
export async function requireAdmin(request: NextRequest): Promise<{ user: AuthUser } | NextResponse> {
  const authResult = await requireAuth(request)

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  if (user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin access required.' },
      { status: 403 }
    )
  }

  return { user }
}
