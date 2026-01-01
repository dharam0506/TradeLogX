# API Integration Summary

This document summarizes how the backend API is integrated with the frontend application.

## Overview

The frontend is fully integrated with the backend API located in the `/server` folder. All authentication endpoints are connected and working.

## Backend API Endpoints

The backend provides the following API endpoints (base URL: `http://localhost:5000/api`):

### Authentication Endpoints (`/api/auth`)

1. **POST `/api/auth/signup`** - User Registration

   - Request body: `{ email, password, name? }`
   - Response: `{ success: true, message, data: { user, token } }`
   - Status codes: 201 (success), 400 (validation error), 500 (server error)

2. **POST `/api/auth/login`** - User Login

   - Request body: `{ email, password }`
   - Response: `{ success: true, message, data: { user, token } }`
   - Status codes: 200 (success), 400 (validation error), 401 (invalid credentials), 500 (server error)

3. **GET `/api/auth/me`** - Get Current User (Protected)

   - Headers: `Authorization: Bearer <token>`
   - Response: `{ success: true, data: { user } }`
   - Status codes: 200 (success), 401 (unauthorized), 404 (user not found)

4. **GET `/api/health`** - Health Check
   - Response: `{ success: true, message, timestamp }`

## Frontend Integration

### API Utility (`src/utils/api.js`)

The API utility file provides all the functions needed to interact with the backend:

- **`authAPI.signup(email, password, name)`** - Register a new user
- **`authAPI.login(email, password)`** - Login an existing user
- **`authAPI.getCurrentUser()`** - Get current authenticated user
- **`saveToken(token)`** - Save JWT token to localStorage
- **`removeToken()`** - Remove token from localStorage
- **`getToken()`** - Get token from localStorage
- **`isAuthenticated()`** - Check if token exists (synchronous)
- **`validateToken()`** - Validate token with backend (asynchronous)

### Features

1. **Automatic Token Management**

   - Tokens are automatically included in API requests via `Authorization` header
   - Invalid/expired tokens (401 errors) are automatically cleared
   - Token is stored in `localStorage` for persistence across sessions

2. **Error Handling**

   - Network errors are caught and user-friendly messages are displayed
   - 401 errors automatically clear the token and provide appropriate feedback
   - Validation errors from the backend are properly displayed to users
   - Status-specific error messages for better UX

3. **Token Validation**
   - Protected routes validate tokens with the backend before allowing access
   - Invalid tokens redirect users to the login page

## Integrated Pages

### 1. Signup Page (`src/pages/Signup.jsx`)

- ✅ Fully integrated with `/api/auth/signup`
- ✅ Validates user input
- ✅ Shows success/error messages
- ✅ Redirects to login page after successful registration
- ✅ Handles validation errors from backend

### 2. Login Page (`src/pages/Login.jsx`)

- ✅ Fully integrated with `/api/auth/login`
- ✅ Saves token to localStorage on successful login
- ✅ Redirects to dashboard after login
- ✅ Shows appropriate error messages for invalid credentials
- ✅ Displays success message when redirected from signup

### 3. Dashboard Page (`src/pages/Dashboard.jsx`)

- ✅ Fetches current user data using `/api/auth/me`
- ✅ Displays user information
- ✅ Handles logout functionality
- ✅ Redirects to login if token is invalid
- ✅ Shows loading state while fetching user data

### 4. Protected Route (`src/components/ProtectedRoute.jsx`)

- ✅ Validates token with backend before allowing access
- ✅ Shows loading state during validation
- ✅ Redirects to login page if not authenticated
- ✅ Protects dashboard and other authenticated routes

### 5. Navigation Component (`src/components/Navigation.jsx`)

- ✅ Shows/hides navigation items based on authentication status
- ✅ Displays login/signup buttons for unauthenticated users
- ✅ Shows dashboard/logout buttons for authenticated users
- ✅ Handles logout functionality

## How It Works

### User Registration Flow

1. User fills out signup form (email, password, optional name)
2. Form submits to `authAPI.signup()`
3. Backend validates data and creates user
4. Backend returns user data and JWT token
5. Frontend stores token in localStorage
6. User is redirected to login page (they need to log in)

### User Login Flow

1. User enters email and password
2. Form submits to `authAPI.login()`
3. Backend validates credentials
4. Backend returns user data and JWT token
5. Frontend saves token to localStorage
6. User is redirected to dashboard

### Protected Route Flow

1. User navigates to a protected route (e.g., `/dashboard`)
2. `ProtectedRoute` component checks if token exists
3. If token exists, validates it with backend via `/api/auth/me`
4. If valid, user is allowed to access the route
5. If invalid or missing, user is redirected to login

### API Request Flow

1. Every API request checks for token in localStorage
2. If token exists, it's added to `Authorization: Bearer <token>` header
3. Backend validates token on protected routes
4. If token is invalid (401), frontend automatically clears it
5. Response is parsed and returned to the calling component

## Environment Configuration

The API base URL can be configured using environment variables:

- **Development**: Defaults to `http://localhost:5000/api`
- **Production**: Set `VITE_API_URL` environment variable

Example `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

## Testing the Integration

### Start Backend Server

```bash
cd server
npm install  # If not already done
npm run dev
```

### Start Frontend

```bash
npm install  # If not already done
npm run dev
```

### Test Flow

1. Open `http://localhost:5173`
2. Click "Sign Up" and create an account
3. You'll be redirected to login page
4. Log in with your credentials
5. You'll be redirected to dashboard
6. User information should be displayed
7. Try logging out and logging back in

## Error Handling

The integration includes comprehensive error handling:

- **Network Errors**: Clear messages when backend is not reachable
- **Validation Errors**: Backend validation errors are displayed to users
- **Authentication Errors**: 401 errors clear token and redirect to login
- **Server Errors**: Generic error messages for 500 errors

## Security Features

1. **JWT Tokens**: Secure authentication using JSON Web Tokens
2. **Password Hashing**: Passwords are hashed on the backend (bcrypt)
3. **Token Expiration**: Tokens expire after 7 days (configured in backend)
4. **Automatic Token Cleanup**: Invalid tokens are automatically removed
5. **Protected Routes**: Routes are protected both on frontend and backend

## Next Steps

If you want to add more API endpoints in the future:

1. Add the route handler in `server/routes/`
2. Add the API function in `src/utils/api.js`
3. Use the API function in your React components
4. The `apiRequest` helper handles authentication automatically

## Notes

- All API calls use the `apiRequest` helper function which automatically:

  - Adds authentication headers
  - Handles errors
  - Parses JSON responses
  - Manages token cleanup on 401 errors

- The frontend and backend communicate via JSON
- CORS is configured on the backend to allow requests from `http://localhost:5173`
- Tokens are stored in localStorage (consider httpOnly cookies for production)
