# Backend Setup Guide

## Quick Start

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running on your system. If you don't have it installed:

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud) - free tier available

**Using MongoDB Atlas (Recommended for beginners):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster (free tier)
4. Get your connection string
5. Update `MONGODB_URI` in `server/.env`

### 3. Configure Environment

The `.env` file is already created in the `server` directory with default values. Update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tradelogx
JWT_SECRET=tradelogx-super-secret-jwt-key-change-in-production-2024
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Start Backend Server

```bash
cd server
npm run dev
```

The backend will run on `http://localhost:5000`

### 5. Start Frontend (in a separate terminal)

```bash
# From project root
npm run dev
```

The frontend will run on `http://localhost:5173`

## Testing the API

You can test the endpoints using:
- Postman
- curl
- The frontend application

### Example Signup Request:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Example Login Request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Project Structure

```
server/
├── config/
│   └── database.js       # MongoDB connection
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/
│   └── User.js           # User database model
├── routes/
│   └── auth.js           # Authentication routes
├── .env                  # Environment variables
├── .gitignore
├── package.json
├── server.js             # Main server file
└── README.md             # Detailed backend documentation
```

## Notes

- The backend uses JWT tokens for authentication (7-day expiration)
- Passwords are hashed using bcrypt before storage
- All user inputs are validated
- CORS is enabled for the frontend URL

