# Setup Instructions

## Quick Setup Guide

### Step 1: Install Frontend Dependencies
```bash
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### Step 3: Set Up MongoDB Atlas (Cloud Database)

**Recommended**: Use MongoDB Atlas (free tier) - no local installation needed!

See detailed instructions in [server/MONGODB_ATLAS_SETUP.md](server/MONGODB_ATLAS_SETUP.md)

**Quick Steps:**
1. Sign up at https://www.mongodb.com/cloud/atlas (free tier)
2. Create a free cluster (M0)
3. Create a database user (save username & password!)
4. Whitelist your IP address (or use "Allow Access from Anywhere" for development)
5. Get your connection string from "Connect" → "Connect your application"
6. The connection string looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tradelogx?retryWrites=true&w=majority`

### Step 4: Create Backend Environment File

Create a file named `.env` in the `server` directory with the following content:

**For MongoDB Atlas (Recommended):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR-USERNAME:YOUR-PASSWORD@cluster0.xxxxx.mongodb.net/tradelogx?retryWrites=true&w=majority
JWT_SECRET=tradelogx-super-secret-jwt-key-change-in-production-2024
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Replace:
- `YOUR-USERNAME` - Your MongoDB Atlas database username
- `YOUR-PASSWORD` - Your MongoDB Atlas database password
- `cluster0.xxxxx.mongodb.net` - Your cluster connection string from Atlas

**If using Local MongoDB instead:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tradelogx
JWT_SECRET=tradelogx-super-secret-jwt-key-change-in-production-2024
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Step 5: Start the Backend Server

**Note**: No need to start MongoDB locally if using Atlas - it's in the cloud!

Open a terminal and run:
```bash
cd server
npm run dev
```

You should see:
```
MongoDB Connected: localhost (or your Atlas host)
Server running on port 5000
Environment: development
```

### Step 6: Start the Frontend

Open a **new terminal** (keep backend running) and run:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Step 7: Test the Application

1. Navigate to `http://localhost:5173/login`
2. Click "Register" to create a new account
3. Fill in the form:
   - Name (optional)
   - Email
   - Password (minimum 6 characters)
4. Click "Sign Up"
5. You should be redirected to the home page
6. Try logging out and logging back in with your credentials

## Troubleshooting

### Backend won't start
- **Error: "Cannot connect to MongoDB"**
  - For Atlas: Check your `MONGODB_URI` in `server/.env` - make sure username and password are correct
  - For Atlas: Make sure your IP is whitelisted in Atlas Network Access settings
  - For Atlas: Verify your connection string format: `mongodb+srv://...`
  - For Local MongoDB: Make sure MongoDB service is running
  - Check for typos in the connection string

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify `CLIENT_URL` in `server/.env` matches your frontend URL

### Authentication not working
- Check browser console for errors
- Verify token is being saved in localStorage
- Make sure backend is receiving requests (check backend console logs)

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `GET /api/health` - Health check

For more details, see [server/README.md](server/README.md)

