# Quick Start Guide

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Seed the database:**
   ```bash
   npm run db:seed
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Server will be running at:**
   ```
   http://localhost:3000
   ```

5. **Test the health endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```

6. **Login with test credentials:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "tester1@example.com", "password": "password123"}'
   ```

## Test Credentials

- Email: `tester1@example.com` | Password: `password123`
- Email: `tester2@example.com` | Password: `password123`
- Email: `tester3@example.com` | Password: `password123`

## Useful Commands

- `npm start` - Run in production mode
- `npm run dev` - Run with auto-reload (nodemon)
- `npm run db:seed` - Populate database with test data
- `npm run db:reset` - Reset database (drop, recreate, seed)
- `npm run db:migrate` - Run migrations only

For complete API documentation, see [README.md](./README.md)
