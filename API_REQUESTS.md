# API Request Guide for Admin Registration

## HTTP Request to Register Admin

### Endpoint
```
POST http://localhost:3000/api/auth/register
```

### Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "admin"
}
```

### Using cURL
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "admin"
  }'
```

### Using JavaScript/Fetch
```javascript
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Using Postman
1. Method: `POST`
2. URL: `http://localhost:3000/api/auth/register`
3. Headers:
   - Key: `Content-Type`
   - Value: `application/json`
4. Body (raw JSON):
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "admin"
}
```

### Response (Success)
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "USER_1234567890_abc123"
}
```

### Response (Error)
```json
{
  "success": false,
  "error": "Username already exists"
}
```

## Field Requirements

- **username** (required): Unique username, must not exist in database
- **password** (required): Minimum 6 characters
- **email** (optional): Email address, must be unique if provided
- **name** (optional): Full name
- **role** (optional): Either "user" or "admin" (defaults to "user" if not provided)

## Notes

- Passwords are automatically hashed using bcrypt
- Username must be unique
- Email must be unique (if provided)
- Role must be exactly "admin" to create admin account
- After registration, you can login at `/login` with username/password
