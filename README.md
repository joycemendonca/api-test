# TODO API Testing Playground

A simple and realistic TODO application API built with Node.js and Express, specifically designed for QA engineers to practice API testing scenarios.

## 🎯 Purpose

This project provides a complete backend API with authentication, validation, error handling, and various testing scenarios. It's perfect for learning and practicing:

- API testing fundamentals
- Authentication testing (JWT)
- Request validation testing
- Positive and negative test scenarios
- Boundary testing
- Authorization testing
- Error handling verification
- Response format validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

The default configuration should work for local development.

### 3. Initialize and Seed the Database

```bash
npm run db:seed
```

This will create the SQLite database, set up tables, and populate it with test data.

### 4. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:3000`

## 🗄️ Database Commands

- `npm run db:migrate` - Create/update database tables
- `npm run db:seed` - Populate database with test data
- `npm run db:reset` - Drop all tables, recreate, and seed

## 👤 Test User Credentials

After seeding, you can use these credentials:

- **Email:** `tester1@example.com` | **Password:** `password123`
- **Email:** `tester2@example.com` | **Password:** `password123`
- **Email:** `tester3@example.com` | **Password:** `password123`

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Response Format

All API responses follow this consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description",
  "message": "Optional error message"
}
```

### Response Headers

Every response includes:
- `X-Request-ID` - Unique identifier for each request
- `X-App-Version` - Current API version (1.0.0)

---

## 🔐 Authentication Endpoints

### Register User

**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Validation Rules:**
- Email must be valid format
- Password minimum 8 characters
- Name is required
- Email must be unique

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

---

### Login

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "tester1@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "tester1@example.com",
      "name": "Tester One"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

### Logout

**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

---

## 👥 User Endpoints

All user endpoints require authentication (Bearer token).

### Get Current User Profile

**GET** `/api/users/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "tester1@example.com",
      "name": "Tester One",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Update Profile

**PUT** `/api/users/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "tester1@example.com",
      "name": "Updated Name"
    }
  },
  "message": "Profile updated successfully"
}
```

---

### Delete Account

**DELETE** `/api/users/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": null,
  "message": "Account deleted successfully"
}
```

---

## ✅ Todo Endpoints

All todo endpoints require authentication (Bearer token).

### Create Todo

**POST** `/api/todos`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My new todo",
  "description": "Optional description",
  "completed": false
}
```

**Validation Rules:**
- Title is required
- Title max length: 100 characters
- Description is optional
- Description max length: 500 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "todo": {
      "id": 1,
      "userId": 1,
      "title": "My new todo",
      "description": "Optional description",
      "completed": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Todo created successfully"
}
```

---

### Get All Todos (with filtering)

**GET** `/api/todos`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `completed` (optional) - Filter by completion status (true/false)
- `search` (optional) - Search todos by title
- `page` (optional) - Page number for pagination (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Examples:**
- `/api/todos?completed=true`
- `/api/todos?search=test`
- `/api/todos?page=2&limit=5`
- `/api/todos?completed=false&search=API`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "todos": [
      {
        "id": 1,
        "userId": 1,
        "title": "My todo",
        "description": "Description",
        "completed": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### Get Todo by ID

**GET** `/api/todos/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "todo": {
      "id": 1,
      "userId": 1,
      "title": "My todo",
      "description": "Description",
      "completed": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Update Todo

**PUT** `/api/todos/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "todo": {
      "id": 1,
      "userId": 1,
      "title": "Updated title",
      "description": "Updated description",
      "completed": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Todo updated successfully"
}
```

---

### Mark Todo as Completed

**PATCH** `/api/todos/:id/complete`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "todo": {
      "id": 1,
      "userId": 1,
      "title": "My todo",
      "description": "Description",
      "completed": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Todo marked as completed"
}
```

---

### Delete Todo

**DELETE** `/api/todos/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": null,
  "message": "Todo deleted successfully"
}
```

---

## ⚠️ Error Simulation Endpoints

These endpoints are specifically designed for testing error handling:

- **GET** `/api/errors/400` - Returns 400 Bad Request
- **GET** `/api/errors/401` - Returns 401 Unauthorized
- **GET** `/api/errors/403` - Returns 403 Forbidden
- **GET** `/api/errors/404` - Returns 404 Not Found
- **GET** `/api/errors/500` - Returns 500 Internal Server Error
- **GET** `/api/errors/delay?ms=2000` - Returns delayed response (max 10000ms)

---

## 🏥 Health Check

**GET** `/health`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "uptime": "123 seconds",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🧪 Testing Scenarios to Practice

### 1. Authentication Testing
- Valid registration
- Duplicate email registration
- Invalid email format
- Short password (< 8 characters)
- Valid login
- Invalid credentials
- Missing fields
- Logout functionality

### 2. Authorization Testing
- Access protected routes without token
- Access with invalid token
- Access with expired token
- Try to access another user's todos
- Use token after logout

### 3. CRUD Operations
- Create todos with valid data
- Create with missing required fields
- Create with fields exceeding max length
- Read single todo
- Read all todos
- Update todo
- Delete todo

### 4. Filtering and Pagination
- Filter completed todos
- Filter incomplete todos
- Search by title
- Test pagination with different page sizes
- Test edge cases (page 0, negative limit)

### 5. Validation Testing
- Test boundary values (exactly 100 chars for title)
- Test beyond boundaries (101 chars)
- Test empty strings
- Test special characters
- Test null values

### 6. Error Handling
- Verify all error responses return proper format
- Check HTTP status codes
- Validate error messages
- Test error simulation endpoints

### 7. Response Validation
- Verify response structure
- Check custom headers (X-Request-ID, X-App-Version)
- Validate data types
- Check timestamp formats

---

## 📖 Example cURL Commands

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tester1@example.com",
    "password": "password123"
  }'
```

### Create Todo (replace TOKEN with your actual token)
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Test todo from curl",
    "description": "Testing the API"
  }'
```

### Get All Todos
```bash
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer TOKEN"
```

### Get Todos with Filters
```bash
curl -X GET "http://localhost:3000/api/todos?completed=false&search=test" \
  -H "Authorization: Bearer TOKEN"
```

---

## 🏗️ Project Structure

```
test-api/
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize configuration
│   ├── models/
│   │   ├── index.js             # Model initialization
│   │   ├── User.js              # User model
│   │   └── Todo.js              # Todo model
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User operations
│   │   ├── todoController.js    # Todo operations
│   │   ├── errorController.js   # Error simulation
│   │   └── healthController.js  # Health check
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── users.js             # User routes
│   │   ├── todos.js             # Todo routes
│   │   ├── errors.js            # Error routes
│   │   └── health.js            # Health route
│   ├── middlewares/
│   │   ├── auth.js              # JWT verification
│   │   ├── requestMetadata.js   # Headers middleware
│   │   └── errorHandler.js      # Global error handler
│   ├── validations/
│   │   ├── auth.js              # Auth validation schemas
│   │   ├── todo.js              # Todo validation schemas
│   │   └── user.js              # User validation schemas
│   ├── utils/
│   │   ├── tokenBlacklist.js    # Token invalidation
│   │   └── responseFormatter.js # Response helpers
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── database/
│   ├── seeders/
│   │   └── seed.js              # Seed script
│   ├── migrate.js               # Migration script
│   ├── reset.js                 # Reset script
│   └── dev.sqlite               # SQLite database (generated)
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json
└── README.md
```

---

## 🔧 Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sequelize** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Validation
- **CORS** - Cross-origin support
- **UUID** - Request ID generation

---

## 📝 Notes

- This API is designed for **testing and learning purposes only**
- The SQLite database file is stored locally in the `database/` folder
- JWT tokens expire after 24 hours
- The token blacklist is stored in memory and will be cleared when the server restarts
- All passwords in seed data are hashed using bcrypt

---

## 🤝 Contributing

This is a learning project. Feel free to fork and modify for your own testing needs!

---

## 📄 License

ISC
