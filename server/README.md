# TradeLogX Backend API

Backend server for TradeLogX application with authentication system.

## Features

- User registration (signup)
- User authentication (login)
- JWT token-based authentication
- MongoDB database integration
- Password hashing with bcrypt
- Input validation
- CORS enabled for frontend integration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up MongoDB Atlas (Cloud Database - Recommended)

**Recommended**: Use MongoDB Atlas (free tier) - no local installation needed!

📖 **Detailed setup guide**: See [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

**Quick Steps:**

1. Sign up at https://www.mongodb.com/cloud/atlas (free tier)
2. Create a free cluster (M0)
3. Create database user and whitelist your IP
4. Get connection string from "Connect" → "Connect your application"

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

**For MongoDB Atlas (Recommended):**

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR-USERNAME:YOUR-PASSWORD@cluster0.xxxxx.mongodb.net/tradelogx?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=your-google-gemini-api-key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Replace `YOUR-USERNAME`, `YOUR-PASSWORD`, and the cluster address with your Atlas credentials.

**For Local MongoDB:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tradelogx
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=your-google-gemini-api-key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Note:** Get your free Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey). The AI Summarizer feature requires this API key to function.

**Important**:

- Change the `JWT_SECRET` to a secure random string in production!
- Never commit your `.env` file to version control (it's in `.gitignore`)

### 4. Start the Server

For development (with auto-reload):

```bash
npm run dev
```

For production:

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check

- **GET** `/api/health`
  - Returns server status

### Authentication

#### Signup

- **POST** `/api/auth/signup`
  - Body: `{ email: string, password: string, name?: string }`
  - Returns: `{ success: true, data: { user, token } }`

#### Login

- **POST** `/api/auth/login`
  - Body: `{ email: string, password: string }`
  - Returns: `{ success: true, data: { user, token } }`

#### Get Current User

- **GET** `/api/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success: true, data: { user } }`

## Authentication Flow

1. User signs up or logs in
2. Server validates credentials
3. Server returns a JWT token
4. Frontend stores the token in localStorage
5. Frontend includes the token in subsequent requests: `Authorization: Bearer <token>`
6. Server validates the token and processes the request

## Database Schema

### User Model

```javascript
{
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  name: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days
- Input validation on all endpoints
- CORS configured for frontend domain
- Passwords are excluded from API responses

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Validation errors if applicable
}
```
