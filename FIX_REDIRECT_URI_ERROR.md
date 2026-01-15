# Fix Redirect URI Mismatch Error

## The Problem
Error 400: redirect_uri_mismatch means the redirect URI in your Google Cloud Console doesn't match what NextAuth is sending.

## Solution (Step-by-Step)

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/apis/credentials
2. Make sure you're in the correct project

### Step 2: Find Your OAuth Client ID
1. Look for "OAuth 2.0 Client IDs" in the credentials list
2. Find the one you're using (it should have a Client ID that matches your app)
3. Click on the **pencil icon (Edit)** next to it

### Step 3: Add the Redirect URI
In the "Authorized redirect URIs" section, you MUST add EXACTLY this:

```
http://localhost:3000/api/auth/callback/google
```

**IMPORTANT:**
- Use `http://` (NOT `https://`)
- Use `localhost` (NOT `127.0.0.1`)
- Include the port `:3000`
- The path is `/api/auth/callback/google` (exact path, no trailing slash)

### Step 4: Also Add Authorized JavaScript Origins
In the "Authorized JavaScript origins" section, add:

```
http://localhost:3000
```

### Step 5: Save
1. Click **SAVE** at the bottom
2. Wait 1-2 minutes for changes to propagate

### Step 6: Try Again
1. Go back to your app at http://localhost:3000
2. Try signing in with Google again

## Common Mistakes to Avoid

❌ **DON'T add:**
- `http://localhost:3000/api/auth/callback/google/` (trailing slash)
- `https://localhost:3000/api/auth/callback/google` (https)
- `http://127.0.0.1:3000/api/auth/callback/google` (IP instead of localhost)
- `http://localhost/api/auth/callback/google` (missing port)

✅ **DO add:**
- `http://localhost:3000/api/auth/callback/google` (exact match)

## If It Still Doesn't Work

1. **Clear browser cache** - Sometimes browsers cache OAuth errors
2. **Try incognito/private window** - To rule out browser issues
3. **Double-check the URI** - Copy and paste it directly, don't type it
4. **Wait longer** - Google changes can take up to 5 minutes to propagate
5. **Check you're editing the correct OAuth client** - Make sure the Client ID matches what's in your code

## Verify Your Setup

Make sure you have a `.env.local` file with:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```
