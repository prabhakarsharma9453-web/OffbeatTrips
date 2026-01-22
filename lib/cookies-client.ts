/**
 * Client-side cookie utilities for user preferences
 * Use these in Client Components
 */

export interface CookieOptions {
  maxAge?: number // in days
  expires?: Date
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  path?: string
}

const defaultOptions: CookieOptions = {
  maxAge: 365, // 1 year in days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
}

/**
 * Set a client-side cookie
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof window === 'undefined') return

  const mergedOptions = { ...defaultOptions, ...options }
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (mergedOptions.maxAge) {
    const expires = new Date()
    expires.setTime(expires.getTime() + mergedOptions.maxAge * 24 * 60 * 60 * 1000)
    cookieString += `; expires=${expires.toUTCString()}`
  }

  if (mergedOptions.expires) {
    cookieString += `; expires=${mergedOptions.expires.toUTCString()}`
  }

  if (mergedOptions.path) {
    cookieString += `; path=${mergedOptions.path}`
  }

  if (mergedOptions.secure) {
    cookieString += `; secure`
  }

  if (mergedOptions.sameSite) {
    cookieString += `; samesite=${mergedOptions.sameSite}`
  }

  document.cookie = cookieString
}

/**
 * Get a client-side cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null

  const nameEQ = encodeURIComponent(name) + '='
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i]
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length)
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length))
    }
  }

  return null
}

/**
 * Delete a client-side cookie
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (typeof window === 'undefined') return

  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  currency: 'USD' | 'INR' | 'EUR'
  theme: 'light' | 'dark' | 'system'
  language?: string
}

const PREFERENCES_COOKIE_NAME = 'user-preferences'

/**
 * Get user preferences from cookie
 */
export function getPreferences(): UserPreferences {
  const prefsJson = getCookie(PREFERENCES_COOKIE_NAME)
  if (!prefsJson) {
    return {
      currency: 'INR',
      theme: 'system',
      language: 'en',
    }
  }

  try {
    return JSON.parse(prefsJson)
  } catch {
    return {
      currency: 'INR',
      theme: 'system',
      language: 'en',
    }
  }
}

/**
 * Set user preferences in cookie
 */
export function setPreferences(preferences: Partial<UserPreferences>): void {
  const current = getPreferences()
  const updated = { ...current, ...preferences }

  setCookie(PREFERENCES_COOKIE_NAME, JSON.stringify(updated), {
    maxAge: 365, // 1 year
    sameSite: 'lax',
  })
}

/**
 * Check if cookie consent has been given
 */
export function hasCookieConsent(): boolean {
  return getCookie('cookie-consent') === 'accepted'
}

/**
 * Set cookie consent
 */
export function setCookieConsent(accepted: boolean): void {
  if (accepted) {
    setCookie('cookie-consent', 'accepted', {
      maxAge: 365, // 1 year
      sameSite: 'lax',
    })
  } else {
    deleteCookie('cookie-consent')
  }
}
