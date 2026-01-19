# Postman Guide: Insert Resort via API

## Overview
This guide shows you how to insert a resort into the database using Postman.

## Prerequisites
1. Your Next.js server must be running (usually `npm run dev` on `http://localhost:3000`)
2. You need to authenticate and get a JWT token (recommended) OR use session cookie

---

## Authentication Methods

### Method 1: JWT Token (Recommended for API)

JWT tokens are easier to use in Postman and don't expire as quickly as session cookies.

#### Step 1: Login to Get JWT Token

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "admin",
  "password": "your-password"
}
```

**OR using email:**
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Copy the `token` value from the response!**

#### Step 2: Register New User (Alternative)

If you don't have an account, register first:

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`

**Body (JSON):**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "admin"
}
```

**Response includes JWT token:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "507f1f77bcf86cd799439011",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

### Method 2: Session Cookie (Alternative)

If you prefer using session cookies:

#### Step 1: Get Your Session Cookie

### Option A: From Browser (Recommended)

1. **Login as Admin** in your browser:
   - Go to `http://localhost:3000/login`
   - Login with your admin credentials
   - Make sure your user has `role: "admin"` in the database

2. **Open Browser Developer Tools**:
   - Press `F12` or `Right-click → Inspect`
   - Go to **Application** tab (Chrome) or **Storage** tab (Firefox)

3. **Copy the Session Cookie**:
   - In Chrome: Application → Cookies → `http://localhost:3000` → Find `authjs.session-token` or `__Secure-authjs.session-token`
   - In Firefox: Storage → Cookies → `http://localhost:3000` → Find the session cookie
   - Copy the **Value** of the cookie

### Option B: Check Network Tab
1. Open Developer Tools → **Network** tab
2. Login to your app
3. Find any API request to `/api/admin/...`
4. Check **Request Headers** → Look for `Cookie:` header
5. Copy the entire cookie value

---

## Step 2: Setup Postman Request

### Request Configuration

**Method:** `POST`

**URL:** 
```
http://localhost:3000/api/admin/resorts
```
*(Replace with your server URL if different)*

### Headers

Add these headers:

| Key | Value |
|-----|-------|
| `Content-Type` | `application/json` |
| `Cookie` | `authjs.session-token=YOUR_SESSION_TOKEN_HERE` |

**OR** if using secure cookie:
```
Cookie: __Secure-authjs.session-token=YOUR_SESSION_TOKEN_HERE
```

---

## Step 3: Request Body

### Required Fields
- `Name` (string) - Resort name
- `Resorts_Name` (string) - Display name for resort
- `Image` (string) - Image URL or path (e.g., `/uploads/image.jpg`)

### Optional Fields
- `Short_Description` (string) - Brief description
- `address_tile` (string) - Location/address
- `Price` (string) - Price per night (e.g., "5000" or "₹5000")
- `Type` (string) - Either `"domestic"` or `"international"` (default: "domestic")
- `Room_Amenities1` (string) - Room amenities (JSON array or comma-separated)
- `Room_Amenities2` (string)
- `Room_Amenities3` (string)
- `Room_Amenities4` (string)
- `Resort_Amenities1` (string) - Resort amenities
- `Resort_Amenities2` (string)
- `Resort_Amenities3` (string)
- `Resort_Amenities4` (string)
- `Tags` (string) - Tags like "featured, popular"
- `Mood` (string) - Mood description
- `Activities` (string) - Activities available
- `order` (number/string) - Display order (default: 0)

### Example JSON Body (Domestic Resort)

```json
{
  "Name": "Taj Mahal Palace",
  "Resorts_Name": "Taj Mahal Palace Resort",
  "Image": "/uploads/taj-palace.jpg",
  "Short_Description": "Luxurious heritage resort with world-class amenities",
  "address_tile": "Mumbai, Maharashtra, India",
  "Price": "15000",
  "Type": "domestic",
  "Room_Amenities1": "[\"WiFi\", \"Air Conditioning\", \"Mini Bar\", \"Room Service\"]",
  "Room_Amenities2": "[\"TV\", \"Safe\", \"Balcony\"]",
  "Resort_Amenities1": "[\"Swimming Pool\", \"Spa\", \"Gym\", \"Restaurant\"]",
  "Resort_Amenities2": "[\"Concierge\", \"Parking\", \"Business Center\"]",
  "Tags": "featured, popular",
  "Mood": "Luxury, Heritage, Elegant",
  "Activities": "Sightseeing, Shopping, Fine Dining",
  "order": 1
}
```

### Example JSON Body (International Resort)

```json
{
  "Name": "Bali Beach Resort",
  "Resorts_Name": "Bali Beach Luxury Resort",
  "Image": "/uploads/bali-beach.jpg",
  "Short_Description": "Stunning beachfront resort with private villas",
  "address_tile": "Bali, Indonesia",
  "Price": "200",
  "Type": "international",
  "Room_Amenities1": "[\"Ocean View\", \"Private Pool\", \"Butler Service\"]",
  "Resort_Amenities1": "[\"Beach Access\", \"Spa\", \"Multiple Restaurants\"]",
  "Tags": "featured",
  "Mood": "Tropical, Relaxing, Exotic",
  "Activities": "Surfing, Snorkeling, Yoga",
  "order": 2
}
```

### Minimal Example (Only Required Fields)

```json
{
  "Name": "Test Resort",
  "Resorts_Name": "Test Resort Name",
  "Image": "/placeholder.svg"
}
```

---

## Step 4: Send Request

1. Click **Send** in Postman
2. Check the response:

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Resort created successfully",
  "id": "507f1f77bcf86cd799439011"
}
```

### Error Responses

**401/403 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized. Admin access required."
}
```
**Solution:** Make sure you're logged in as admin and the cookie is correct.

**500 Server Error:**
```json
{
  "success": false,
  "error": "Failed to create resort"
}
```
**Solution:** Check server logs for validation errors (e.g., missing required fields).

---

## Step 5: Verify Resort Created

### Option 1: Check Admin Dashboard
- Go to `http://localhost:3000/admin`
- Navigate to Resorts section
- Your new resort should appear in the list

### Option 2: GET Request in Postman

**Method:** `GET`

**URL:** 
```
http://localhost:3000/api/admin/resorts
```

**Headers:**
```
Cookie: authjs.session-token=YOUR_SESSION_TOKEN_HERE
```

This will return all resorts including your newly created one.

---

## Troubleshooting

### Issue: "Unauthorized. Authentication required." or "Unauthorized. Admin access required."

**Solutions:**
1. **For JWT Token:**
   - Verify you copied the complete token from login/register response
   - Check Authorization header format: `Bearer YOUR_TOKEN` or just `YOUR_TOKEN`
   - Token might be expired (default: 7 days) - login again to get a new token
   - Make sure there are no extra spaces in the token

2. **For Session Cookie:**
   - Verify your user has `role: "admin"` in MongoDB
   - Check that the session cookie is valid and not expired
   - Make sure you're copying the entire cookie value
   - Try logging out and logging back in to get a fresh cookie

3. **General:**
   - Verify your user has `role: "admin"` in MongoDB
   - Make sure you're using an admin account, not a regular user

### Issue: "Failed to create resort"

**Solutions:**
1. Check that required fields (`Name`, `Resorts_Name`, `Image`) are provided
2. Verify the image path exists (if using local path)
3. Check server console for detailed error messages
4. Ensure MongoDB connection is working

### Issue: Cookie not working

**Solutions:**
1. Make sure you're using the correct cookie name:
   - Development: `authjs.session-token`
   - Production: `__Secure-authjs.session-token`
2. Include the full cookie string including any prefixes
3. Try using Postman's "Intercept" feature to capture cookies automatically

---

## Alternative: Using Postman Environment Variables

1. Create a Postman Environment:
   - Click **Environments** → **+**
   - Add variable: `base_url` = `http://localhost:3000`
   - Add variable: `session_cookie` = `YOUR_COOKIE_VALUE`

2. Use in Request:
   - URL: `{{base_url}}/api/admin/resorts`
   - Cookie Header: `authjs.session-token={{session_cookie}}`

This makes it easier to switch between environments (dev, staging, production).

---

## Quick Test Scripts

### Using JWT Token (Recommended)

```bash
# First, login to get token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}' \
  | jq -r '.token')

# Then use token to create resort
curl -X POST http://localhost:3000/api/admin/resorts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "Name": "Test Resort",
    "Resorts_Name": "Test Resort Name",
    "Image": "/placeholder.svg",
    "Type": "domestic",
    "Price": "5000"
  }'
```

### Using Session Cookie

```bash
curl -X POST http://localhost:3000/api/admin/resorts \
  -H "Content-Type: application/json" \
  -H "Cookie: authjs.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "Name": "Test Resort",
    "Resorts_Name": "Test Resort Name",
    "Image": "/placeholder.svg",
    "Type": "domestic",
    "Price": "5000"
  }'
```

---

## Notes

### JWT Token (Recommended)
- JWT tokens expire after 7 days (configurable via `JWT_EXPIRES_IN` env variable)
- Tokens are stateless and don't require server-side session storage
- Easier to use in Postman and API clients
- Set `JWT_SECRET` environment variable for production (default: insecure secret)

### Session Cookie
- The session cookie expires after a certain time (default NextAuth session duration)
- Requires browser-based login to obtain cookie
- More complex to use in Postman

### General
- If you get unauthorized errors, refresh your authentication (login again)
- Image paths should be relative to the `public` folder (e.g., `/uploads/image.jpg`)
- The `Type` field determines currency display: `domestic` = ₹, `international` = $
- Amenities can be JSON arrays or comma-separated strings
- Both authentication methods work - JWT is recommended for API usage
