# Google Authentication Setup Guide

This project uses NextAuth.js v5 with Google OAuth for authentication.

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External (or Internal for workspace accounts)
   - App name: OffbeatTrips (or your app name)
   - User support email: your email
   - Developer contact: your email
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: OffbeatTrips Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production URL (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the **Client ID** and **Client Secret**

### 2. Generate NextAuth Secret

Generate a random secret key for NextAuth.js:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

### 3. Create Environment File

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials in `.env.local`:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-generated-secret-here
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

### 4. Run the Application

```bash
npm run dev
```

The authentication should now work! Users can click "Continue with Google" on the login or signup pages to authenticate with their Google account.

## Notes

- For production, make sure to:
  - Update `NEXTAUTH_URL` to your production domain
  - Add your production domain to Google OAuth authorized origins and redirect URIs
  - Keep your `.env.local` file secure and never commit it to version control
  - Use environment variables in your hosting platform (Vercel, Netlify, etc.)
