# Testing Examples

This file contains various testing examples you can use to test the API.

## Using cURL

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 3. Login (Save the token from response)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tester1@example.com",
    "password": "password123"
  }'
```

### 4. Create Todo (Replace YOUR_TOKEN with actual token)
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My test todo",
    "description": "Testing the API with curl"
  }'
```

### 5. Get All Todos
```bash
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Filter Completed Todos
```bash
curl -X GET "http://localhost:3000/api/todos?completed=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Search Todos
```bash
curl -X GET "http://localhost:3000/api/todos?search=test" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8. Update Todo
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Updated todo title",
    "completed": true
  }'
```

### 9. Mark Todo as Completed
```bash
curl -X PATCH http://localhost:3000/api/todos/1/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 10. Delete Todo
```bash
curl -X DELETE http://localhost:3000/api/todos/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing Error Scenarios

### Test 400 Error
```bash
curl http://localhost:3000/api/errors/400
```

### Test 500 Error
```bash
curl http://localhost:3000/api/errors/500
```

### Test Delayed Response
```bash
curl "http://localhost:3000/api/errors/delay?ms=3000"
```

## Negative Test Cases

### 1. Register with Invalid Email
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123",
    "name": "Test"
  }'
```

### 2. Register with Short Password
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "short",
    "name": "Test"
  }'
```

### 3. Create Todo Without Auth
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "This should fail"
  }'
```

### 4. Create Todo with Title Too Long (>100 chars)
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "This is a very long title that exceeds the maximum allowed length of 100 characters and should fail validation completely"
  }'
```

### 5. Login with Wrong Credentials
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tester1@example.com",
    "password": "wrongpassword"
  }'
```

## Boundary Testing

### 1. Title Exactly 100 Characters
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
  }'
```

### 2. Description Exactly 500 Characters
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test",
    "description": "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
  }'
```

## Using Postman

Import the `postman_collection.json` file into Postman:

1. Open Postman
2. Click "Import" button
3. Select the `postman_collection.json` file
4. The collection will include all endpoints with pre-configured requests
5. Use the "Login" request to automatically save the token to the collection variable

## Using HTTPie (if installed)

### Register
```bash
http POST http://localhost:3000/api/auth/register \
  email=test@example.com \
  password=password123 \
  name="Test User"
```

### Login
```bash
http POST http://localhost:3000/api/auth/login \
  email=tester1@example.com \
  password=password123
```

### Create Todo
```bash
http POST http://localhost:3000/api/todos \
  Authorization:"Bearer YOUR_TOKEN" \
  title="My todo" \
  description="Optional description"
```

## Response Validation Checklist

When testing, verify:

- [ ] Status code is correct
- [ ] Response has `success` field (true/false)
- [ ] Response has `data` field (on success)
- [ ] Response has `error` field (on failure)
- [ ] Response includes `X-Request-ID` header
- [ ] Response includes `X-App-Version` header
- [ ] Data types match expectations
- [ ] Timestamps are in ISO format
- [ ] Error messages are clear and helpful
