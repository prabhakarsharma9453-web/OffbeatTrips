# Cookies Implementation Guide

This document explains how to use the cookie system implemented in this Next.js application.

## Overview

The cookie system consists of:

1. **Server-side cookies** - For secure session/visit data (httpOnly)
2. **Client-side cookies** - For user preferences (accessible via JavaScript)
3. **Cookie consent banner** - GDPR-compliant cookie consent

## Features

### ✅ Implemented

- ✅ Server-side cookie utilities (httpOnly, secure)
- ✅ Client-side cookie utilities for preferences
- ✅ Cookie consent banner with customization options
- ✅ Visit tracking (server-side)
- ✅ User preferences (currency, theme, language)
- ✅ Production-ready security settings

## File Structure

```
lib/
  ├── cookies-server.ts      # Server-side cookie utilities
  └── cookies-client.ts      # Client-side cookie utilities

components/
  ├── cookie-consent-banner.tsx  # Cookie consent UI
  └── visit-info-tracker.tsx     # Visit tracking component

app/api/cookies/
  ├── visit/route.ts         # Visit info API
  └── preferences/route.ts    # Preferences API

hooks/
  └── use-preferences.ts     # React hook for preferences
```

## Usage Examples

### 1. Server-Side Cookies (API Routes / Server Components)

```typescript
import { setServerCookie, getServerCookie, deleteServerCookie } from '@/lib/cookies-server'

// Set a cookie
await setServerCookie('session-id', 'abc123', {
  maxAge: 60 * 60 * 24, // 1 day
  httpOnly: true,
  secure: true,
})

// Get a cookie
const value = await getServerCookie('session-id')

// Delete a cookie
await deleteServerCookie('session-id')
```

### 2. Visit Tracking

```typescript
// In a Server Component or API Route
import { getVisitInfo, setVisitInfo } from '@/lib/cookies-server'

const visitInfo = await getVisitInfo()
if (!visitInfo) {
  // First visit
  await setVisitInfo(1, new Date())
} else {
  // Update visit count
  await setVisitInfo(visitInfo.count + 1, new Date(visitInfo.firstVisit))
}
```

Or use the API endpoint:

```typescript
// Client-side
const response = await fetch('/api/cookies/visit')
const { data } = await response.json()
console.log(`Visit #${data.count}`)
```

### 3. User Preferences (Client-Side)

```typescript
import { getPreferences, setPreferences } from '@/lib/cookies-client'

// Get preferences
const prefs = getPreferences()
console.log(prefs.currency) // 'INR', 'USD', or 'EUR'
console.log(prefs.theme)    // 'light', 'dark', or 'system'

// Update preferences
setPreferences({
  currency: 'USD',
  theme: 'dark',
})
```

### 4. Using the Preferences Hook

```typescript
"use client"

import { usePreferences } from '@/hooks/use-preferences'

export default function MyComponent() {
  const { preferences, updatePreferences, isLoading } = usePreferences()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <p>Current currency: {preferences.currency}</p>
      <button onClick={() => updatePreferences({ currency: 'USD' })}>
        Switch to USD
      </button>
    </div>
  )
}
```

### 5. Cookie Consent

The cookie consent banner appears automatically on first visit. Users can:

- **Accept All** - Accept all cookies
- **Reject All** - Reject non-essential cookies
- **Customize** - Choose specific preferences

Check consent status:

```typescript
import { hasCookieConsent, setCookieConsent } from '@/lib/cookies-client'

if (hasCookieConsent()) {
  // User has accepted cookies
  // You can set analytics cookies, etc.
}

// Programmatically set consent
setCookieConsent(true)
```

## Cookie Types

### Essential Cookies (Always Active)
- Session cookies (httpOnly, secure)
- Visit tracking cookies
- Authentication cookies

### Preference Cookies (Require Consent)
- Currency preference
- Theme preference
- Language preference

## Security Features

### Server-Side Cookies
- ✅ `httpOnly: true` - Not accessible via JavaScript
- ✅ `secure: true` - HTTPS only in production
- ✅ `sameSite: 'lax'` - CSRF protection

### Client-Side Cookies
- ✅ `secure: true` - HTTPS only in production
- ✅ `sameSite: 'lax'` - CSRF protection
- ✅ URL encoding for values

## Environment Variables

No additional environment variables needed. The system automatically:

- Uses `secure: true` in production
- Uses `secure: false` in development
- Sets appropriate `sameSite` values

## GDPR Compliance

The implementation includes:

1. ✅ Cookie consent banner on first visit
2. ✅ Option to reject non-essential cookies
3. ✅ Granular preference controls
4. ✅ Clear information about cookie usage
5. ✅ Link to privacy policy

## Testing

### Local Development

1. Clear browser cookies
2. Visit the site
3. Cookie banner should appear
4. Accept/reject cookies
5. Check browser DevTools → Application → Cookies

### Production (Vercel)

1. Deploy to Vercel
2. Cookies will automatically use `secure: true`
3. Test on HTTPS domain

## Customization

### Change Cookie Expiration

```typescript
// Server-side
await setServerCookie('name', 'value', {
  maxAge: 60 * 60 * 24 * 30, // 30 days
})

// Client-side
setCookie('name', 'value', {
  maxAge: 30, // 30 days
})
```

### Add New Preferences

1. Update `UserPreferences` interface in `lib/cookies-client.ts`
2. Add UI controls in `cookie-consent-banner.tsx`
3. Use `setPreferences()` to save

## Best Practices

1. **Server-side cookies** for sensitive data (sessions, tokens)
2. **Client-side cookies** for user preferences
3. **Always get consent** before setting non-essential cookies
4. **Respect user choices** - don't set cookies if user rejected
5. **Clear documentation** - inform users about cookie usage

## Troubleshooting

### Cookies not working in production

- Ensure you're using HTTPS
- Check that `secure: true` is set (automatic in production)
- Verify domain settings

### Consent banner not showing

- Clear browser cookies
- Check `hasCookieConsent()` returns `false`
- Verify component is in layout

### Preferences not saving

- Check browser allows cookies
- Verify `setPreferences()` is called
- Check browser DevTools for cookie value

## API Reference

### Server-Side (`lib/cookies-server.ts`)

- `setServerCookie(name, value, options?)` - Set server cookie
- `getServerCookie(name)` - Get server cookie
- `deleteServerCookie(name, path?)` - Delete server cookie
- `setVisitInfo(count, firstVisit)` - Set visit info
- `getVisitInfo()` - Get visit info

### Client-Side (`lib/cookies-client.ts`)

- `setCookie(name, value, options?)` - Set client cookie
- `getCookie(name)` - Get client cookie
- `deleteCookie(name, path?)` - Delete client cookie
- `getPreferences()` - Get user preferences
- `setPreferences(preferences)` - Set user preferences
- `hasCookieConsent()` - Check consent status
- `setCookieConsent(accepted)` - Set consent status

## Support

For issues or questions, check:
- Next.js Cookies API: https://nextjs.org/docs/app/api-reference/functions/cookies
- MDN Cookie Documentation: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
