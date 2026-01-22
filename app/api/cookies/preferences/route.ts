import { NextRequest, NextResponse } from 'next/server'
import { getServerCookie, setServerCookie } from '@/lib/cookies-server'

/**
 * GET - Get user preferences (from client-side cookie, read via API)
 */
export async function GET(request: NextRequest) {
  try {
    // Note: Preferences are stored in client-side cookies
    // This endpoint is for server-side access if needed
    // Client should use getPreferences() from cookies-client.ts directly

    return NextResponse.json({
      success: true,
      message: 'Use client-side getPreferences() function to access preferences',
    })
  } catch (error) {
    console.error('Error getting preferences:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get preferences',
      },
      { status: 500 }
    )
  }
}

/**
 * POST - Update user preferences (sync to server if needed)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currency, theme, language } = body

    // Validate preferences
    const validCurrencies = ['USD', 'INR', 'EUR']
    const validThemes = ['light', 'dark', 'system']

    if (currency && !validCurrencies.includes(currency)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid currency',
        },
        { status: 400 }
      )
    }

    if (theme && !validThemes.includes(theme)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid theme',
        },
        { status: 400 }
      )
    }

    // Note: Preferences are primarily stored client-side
    // This endpoint can be used to sync preferences to server if needed
    // For now, client-side storage is sufficient

    return NextResponse.json({
      success: true,
      message: 'Preferences should be set client-side using setPreferences()',
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update preferences',
      },
      { status: 500 }
    )
  }
}
