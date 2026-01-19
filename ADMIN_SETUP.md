# Admin Dashboard Setup Guide

This guide explains how to set up and use the role-based admin system for managing resorts.

## Database Setup

### 1. Create Users Table

Run the SQL script in `database-schema.sql` to create the Users table:

```sql
CREATE TABLE Users (
    id NVARCHAR(100) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    name NVARCHAR(255),
    image NVARCHAR(500),
    role NVARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
```

### 2. Make a User an Admin

After a user signs up with Google OAuth, you can make them an admin by running:

```sql
UPDATE Users 
SET role = 'admin', updated_at = GETDATE()
WHERE email = 'admin@example.com';
```

Replace `'admin@example.com'` with the actual email address of the user you want to make an admin.

## Features

### Admin Dashboard (`/admin`)

The admin dashboard provides two main sections:

1. **Resorts Management**
   - View all resorts
   - Add new resorts
   - Edit existing resorts
   - Delete resorts
   - All data is saved directly to MSSQL database

2. **Users Management**
   - View all registered users
   - Change user roles (user/admin)
   - See user registration dates

### Access Control

- Only users with `role = 'admin'` can access `/admin`
- Admin API routes (`/api/admin/*`) are protected
- Middleware automatically redirects non-admin users

## Using the Admin Dashboard

### Adding a New Resort

1. Log in with a Google account that has admin role
2. Click "Admin" in the navbar (only visible to admins)
3. Go to "Resorts" tab
4. Click "Add New Resort"
5. Fill in the form:
   - **Name**: Resort name
   - **Resort Name**: Display name (can be same as Name)
   - **Image URL**: Image path (e.g., `/image.jpg`) or JSON object
   - **Location**: Resort location/address
   - **Description**: Short description
   - **Room Amenities**: JSON array or comma-separated (e.g., `["WiFi", "AC"]` or `WiFi, AC`)
   - **Resort Amenities**: Same format as Room Amenities
   - **Tags**: Comma-separated tags (e.g., `featured, popular`)
   - **Mood**: Resort mood/theme
   - **Activities**: Available activities
   - **Order**: Display order number
6. Click "Save"

### Editing a Resort

1. Find the resort in the list
2. Click the edit icon (pencil)
3. Modify the fields
4. Click "Save"

### Deleting a Resort

1. Find the resort in the list
2. Click the delete icon (trash)
3. Confirm deletion

### Managing User Roles

1. Go to "Users" tab in admin dashboard
2. Find the user
3. Select their role from the dropdown (User/Admin)
4. Role is updated immediately

## API Endpoints

### Admin Resorts API

- `GET /api/admin/resorts` - Get all resorts (admin only)
- `POST /api/admin/resorts` - Create new resort (admin only)
- `PUT /api/admin/resorts/[id]` - Update resort (admin only)
- `DELETE /api/admin/resorts/[id]` - Delete resort (admin only)

### Admin Users API

- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users` - Update user role (admin only)

## Security Notes

- All admin routes are protected by middleware
- Role is checked on both frontend and backend
- Users are automatically created in database on first Google sign-in
- Default role is 'user' for all new users

## Troubleshooting

### "Unauthorized" Error

- Make sure you're logged in
- Verify your user has `role = 'admin'` in the database
- Check that the Users table exists and has your user record

### Can't See Admin Link

- Verify you're logged in
- Check your role in the database: `SELECT email, role FROM Users WHERE email = 'your@email.com'`
- If role is 'user', update it to 'admin'

### Database Connection Issues

- Verify `.env.local` has correct database credentials
- Check that the Users table exists
- Ensure MSSQL server is running and accessible
