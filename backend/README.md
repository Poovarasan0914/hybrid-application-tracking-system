# Application Tracking System (ATS) Backend

A robust backend system for managing job applications, users, and recruitment processes. Built with Node.js, Express, and MongoDB.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Applicant, Admin, Bot)
- Secure password hashing with bcrypt
- Token-based session management

### User Management
- User registration with validation
- Secure login system
- Profile management
- Account activation/deactivation (Admin only)
- Role-based permissions

### Database
- MongoDB for data persistence
- Mongoose ODM for data modeling
- Data validation and sanitization
- Efficient querying and indexing

### Security
- Password hashing
- JWT token verification
- Role-based middleware
- Input validation and sanitization
- Protected routes
- CORS enabled

### Error Handling
- Centralized error handling
- Validation error responses
- Meaningful error messages
- Proper HTTP status codes

## API Endpoints

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "string",
    "email": "string",
    "password": "string"
}

Response: {
    "token": "string",
    "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "role": "string"
    }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}

Response: {
    "token": "string",
    "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "role": "string"
    }
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>

Response: {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "createdAt": "date",
    "lastLogin": "date"
}
```

### Admin Endpoints

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <token> (Admin only)

Response: [
    {
        "id": "string",
        "username": "string",
        "email": "string",
        "role": "string",
        "isActive": "boolean",
        "createdAt": "date",
        "lastLogin": "date"
    }
]
```

#### Activate/Deactivate User
```http
PUT /api/admin/users/:id/activate
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

{
    "isActive": "boolean"
}

Response: {
    "id": "string",
    "username": "string",
    "email": "string",
    "isActive": "boolean"
}
```

## Project Structure

```
backend/
├── config/
│   └── config.js         # Configuration settings
├── controllers/
│   └── userController.js # User-related controllers
├── middleware/
│   └── auth.js          # Authentication middleware
├── models/
│   └── User.js          # User model schema
├── routes/
│   └── userRoutes.js    # API routes
└── server.js            # Main application file
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/Poovarasan0914/hybrid-application-tracking-system.git
```

2. Install dependencies
```bash
cd application-tracking-system/backend
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ats
JWT_SECRET=your-secret-key
```

4. Start MongoDB server
Ensure MongoDB is running on your machine.

5. Start the application
```bash
npm start
```

## API Testing

You can test the API endpoints using tools like:
- Postman
- Thunder Client (VS Code Extension)
- cURL commands

### Example cURL Commands

1. Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

2. Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"password123"}'
```

3. Get Profile:
```bash
curl -X GET http://localhost:5000/api/auth/profile \
-H "Authorization: Bearer <your-token>"
```

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT implementation
- bcryptjs: Password hashing
- cors: CORS middleware
- dotenv: Environment variables
- express-validator: Input validation

## Security Features

- Password hashing using bcrypt
- JWT for secure authentication
- Input validation and sanitization
- Protected routes with middleware
- Role-based access control
- CORS protection
- Error handling

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Future Enhancements
- Email verification
- Password reset functionality
- OAuth integration
- Rate limiting
- Request logging
- API documentation with Swagger
- Unit and integration tests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.