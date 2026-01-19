# Admin Account Creation with Username/Password

This guide explains how to create admin accounts using username and password authentication.

## Database Setup

### 1. Update Users Table

Run this SQL to add username and password fields (if not already done):

```sql
-- Add username and password columns if they don't exist
ALTER TABLE Users ADD username NVARCHAR(100) UNIQUE;
ALTER TABLE Users ADD password NVARCHAR(255);

-- Create index for username
CREATE INDEX IX_Users_Username ON Users(username);
```

## Creating an Admin Account

### Method 1: Using the Admin Creation Page (Recommended)

1. Navigate to `/create-admin` in your browser
2. Fill in the form:
   - **Username**: Choose a unique username
   - **Email**: (Optional) Your email address
   - **Full Name**: (Optional) Your full name
   - **Password**: At least 6 characters
   - **Confirm Password**: Re-enter your password
3. Click "Create Admin Account"
4. You'll be redirected to the login page
5. Log in with your username and password

### Method 2: Using SQL (Direct Database)

```sql
-- Hash your password first (use bcrypt with 10 rounds)
-- For example, password "admin123" would be hashed
-- You can use an online bcrypt generator or Node.js

-- Then insert:
INSERT INTO Users (id, username, email, password, name, role)
VALUES (
    'ADMIN_' + CAST(NEWID() AS NVARCHAR(36)),
    'admin',
    'admin@example.com',
    '$2a$10$hashedpasswordhere', -- Replace with actual bcrypt hash
    'Admin User',
    'admin'
);
```

## Login Methods

You can now log in using:

1. **Username/Password**: 
   - Go to `/login`
   - Enter your username (or email) and password
   - Click "Sign In"

2. **Google OAuth**: 
   - Still available as before
   - Click "Continue with Google"

## Authentication Flow

### For Username/Password:
- User enters username/password
- Credentials provider validates against database
- Password is verified using bcrypt
- Session is created with user role

### For Google OAuth:
- User clicks "Continue with Google"
- Google authentication happens
- User is created/updated in database
- Session is created with user role

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt (10 rounds)
- **Unique Usernames**: Database enforces unique username constraint
- **Role-Based Access**: Admin routes are protected by middleware
- **Session Management**: JWT tokens store user role securely

## API Endpoints

### Registration
- `POST /api/auth/register` - Register new user
  ```json
  {
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User",
    "role": "admin" // or "user"
  }
  ```

## Troubleshooting

### "Username already exists"
- Choose a different username
- Or use email as username

### "Password too short"
- Password must be at least 6 characters

### Can't login after creating admin
- Verify the user was created in database: `SELECT * FROM Users WHERE username = 'yourusername'`
- Check that password was hashed correctly
- Try logging in with email instead of username

### Forgot Password
- Currently, password reset is not implemented
- You can update password directly in database (remember to hash it first):
  ```sql
  UPDATE Users 
  SET password = '$2a$10$newhashedpassword' 
  WHERE username = 'yourusername';
  ```

## Notes

- Username and email are both unique in the database
- You can use either username or email to log in
- Admin accounts created via `/create-admin` automatically get `role = 'admin'`
- Regular signups via `/signup` get `role = 'user'` by default
