# Complete Admin Management Guide

## Overview

The admin dashboard allows you to manage all content on your travel website:
- **Resorts**: Add, edit, and delete resort listings
- **Packages**: Add, edit, and delete travel packages
- **Users**: Manage user roles and permissions

## Accessing the Admin Dashboard

1. **Login as Admin**:
   - Go to `/login`
   - Use your admin username/password OR Google OAuth
   - Your account must have `role = 'admin'` in the database

2. **Navigate to Dashboard**:
   - Click "Admin" link in the navbar (only visible to admins)
   - Or go directly to `/admin`

## Features

### 1. Resorts Management

**Location**: Admin Dashboard → Resorts Tab

**Capabilities**:
- ✅ View all resorts
- ✅ Add new resorts
- ✅ Edit existing resorts
- ✅ Delete resorts

**Fields**:
- Name, Resorts Name
- Image (URL or JSON object)
- Short Description
- Address/Location
- Room Amenities (4 fields)
- Resort Amenities (4 fields)
- Tags (for featured/popular)
- Mood, Activities
- Order (for sorting)

### 2. Packages Management

**Location**: Admin Dashboard → Packages Tab

**Capabilities**:
- ✅ View all packages
- ✅ Add new packages
- ✅ Edit existing packages
- ✅ Delete packages

**Fields**:
- Title, Slug (auto-generated)
- Location, Country
- Duration, Price
- Rating, Review Count
- Images (main + gallery)
- Overview
- Highlights, Activities
- Itinerary (JSON array with day-by-day details)
- Inclusions, Exclusions
- Why Choose
- WhatsApp Message
- Type (Domestic/International)
- Order (for sorting)

### 3. Users Management

**Location**: Admin Dashboard → Users Tab

**Capabilities**:
- ✅ View all users
- ✅ Change user roles (user ↔ admin)
- ✅ View user details

## Database Setup

### 1. Create Packages Table

Run this SQL in your MSSQL database:

```sql
CREATE TABLE Packages (
    ID NVARCHAR(100) PRIMARY KEY,
    slug NVARCHAR(255) NOT NULL UNIQUE,
    title NVARCHAR(255) NOT NULL,
    location NVARCHAR(255) NOT NULL,
    country NVARCHAR(100) NOT NULL,
    duration NVARCHAR(50) NOT NULL,
    price NVARCHAR(50) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 4.5,
    reviewCount INT DEFAULT 0,
    image NVARCHAR(500) NOT NULL,
    images NVARCHAR(MAX), -- JSON array
    highlights NVARCHAR(MAX), -- JSON array
    activities NVARCHAR(MAX), -- JSON array
    type NVARCHAR(20) CHECK (type IN ('domestic', 'international')) DEFAULT 'domestic',
    overview NVARCHAR(MAX) NOT NULL,
    itinerary NVARCHAR(MAX), -- JSON array
    inclusions NVARCHAR(MAX), -- JSON array
    exclusions NVARCHAR(MAX), -- JSON array
    whyChoose NVARCHAR(MAX), -- JSON array
    whatsappMessage NVARCHAR(500),
    metaDescription NVARCHAR(500),
    [order] NVARCHAR(10),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Indexes
CREATE INDEX IX_Packages_Slug ON Packages(slug);
CREATE INDEX IX_Packages_Type ON Packages(type);
CREATE INDEX IX_Packages_Order ON Packages([order]);
```

### 2. Verify Resorts Table

Ensure your `dbo.Resorts` table exists with the structure from `DATABASE_SETUP.md`.

### 3. Verify Users Table

Ensure your `Users` table exists with:
- `id`, `username`, `email`, `password`, `name`, `image`, `role`

## API Endpoints

### Resorts
- `GET /api/admin/resorts` - List all resorts
- `POST /api/admin/resorts` - Create resort
- `PUT /api/admin/resorts/[id]` - Update resort
- `DELETE /api/admin/resorts/[id]` - Delete resort

### Packages
- `GET /api/admin/packages` - List all packages
- `POST /api/admin/packages` - Create package
- `PUT /api/admin/packages/[id]` - Update package
- `DELETE /api/admin/packages/[id]` - Delete package

### Users
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users` - Update user role

## JSON Field Format

Many fields accept JSON arrays. You can input them in two ways:

### Method 1: JSON Array
```json
["Item 1", "Item 2", "Item 3"]
```

### Method 2: Comma-Separated
```
Item 1, Item 2, Item 3
```

The system will automatically parse comma-separated values into JSON arrays.

## Itinerary Format

The itinerary field expects a JSON array of day objects:

```json
[
  {
    "day": 1,
    "title": "Day 1: Arrival",
    "description": "Arrive at destination...",
    "activities": ["Airport pickup", "Hotel check-in"],
    "meals": ["Breakfast", "Lunch"]
  },
  {
    "day": 2,
    "title": "Day 2: Sightseeing",
    "description": "Explore the city...",
    "activities": ["City tour", "Museum visit"],
    "meals": ["Breakfast", "Dinner"]
  }
]
```

## Troubleshooting

### Error: "Cannot find module 'node:stream'"

**Solution**: This is fixed in `next.config.mjs`. If you still see it:
1. Restart your dev server
2. Clear `.next` folder: `rm -rf .next` (or delete it manually)
3. Run `npm run dev` again

### Error: "Unauthorized. Admin access required"

**Solution**:
1. Verify your user has `role = 'admin'` in the database
2. Log out and log back in
3. Check your session: `/api/auth/session`

### Packages not showing

**Solution**:
1. Verify Packages table exists
2. Check API endpoint: `/api/admin/packages`
3. Check browser console for errors
4. Verify database connection: `/test-db`

### Images not displaying

**Solution**:
1. Use absolute URLs (starting with `http://` or `https://`)
2. Or use relative paths from `/public` folder (starting with `/`)
3. For JSON image objects, ensure they have `src` or `url` property

## Best Practices

1. **Always test after changes**: View the frontend to ensure changes appear correctly
2. **Use descriptive slugs**: Auto-generated slugs work, but custom ones are better for SEO
3. **Fill all required fields**: Missing data can cause display issues
4. **Use proper JSON format**: For complex fields like itinerary
5. **Set order values**: Helps control display order on frontend
6. **Regular backups**: Backup your database before major changes

## Next Steps

After setting up:
1. Create your first package
2. Test the frontend to see packages displayed
3. Update existing packages as needed
4. Manage user roles as your team grows
