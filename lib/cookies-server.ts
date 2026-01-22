import { cookies } from 'next/headers'

/**
 * Server-side cookie utilities using Next.js cookies API
 * Use these in Server Components and API Routes
 */

export interface CookieOptions {
  maxAge?: number // in seconds
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  path?: string
}

const defaultOptions: CookieOptions = {
  maxAge: 60 * 60 * 24 * 365, // 1 year default
  httpOnly: true, // Secure by default for server-side cookies
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax',
  path: '/',
}

/**
 * Set a server-side cookie
 */
export async function setServerCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): Promise<void> {
  const cookieStore = await cookies()
  const mergedOptions = { ...defaultOptions, ...options }

  cookieStore.set(name, value, {
    maxAge: mergedOptions.maxAge,
    expires: mergedOptions.expires,
    httpOnly: mergedOptions.httpOnly,
    secure: mergedOptions.secure,
    sameSite: mergedOptions.sameSite,
    path: mergedOptions.path,
  })
}

/**
 * Get a server-side cookie value
 */
export async function getServerCookie(name: string): Promise<string | undefined> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(name)
  return cookie?.value
}

/**
 * Delete a server-side cookie
 */
export async function deleteServerCookie(name: string, path: string = '/'): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete({
    name,
    path,
  })
}

/**
 * Set visit info cookie (server-side, httpOnly)
 */
export async function setVisitInfo(visitCount: number, firstVisit: Date): Promise<void> {
  const visitData = {
    count: visitCount,
    firstVisit: firstVisit.toISOString(),
    lastVisit: new Date().toISOString(),
  }

  await setServerCookie('visit-info', JSON.stringify(visitData), {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

/**
 * Get visit info from cookie
 */
export async function getVisitInfo(): Promise<{
  count: number
  firstVisit: string
  lastVisit: string
} | null> {
  const visitData = await getServerCookie('visit-info')
  if (!visitData) return null

  try {
    return JSON.parse(visitData)
  } catch {
    return null
  }
}
