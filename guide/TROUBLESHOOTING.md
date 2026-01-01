# Troubleshooting "Failed to Fetch" Error

## Common Causes

The "Failed to fetch" error typically occurs when the frontend cannot connect to the backend server. Here are the most common causes and solutions:

---

## ✅ Solution 1: Start the Backend Server

**The backend server must be running before you can use the app.**

### Steps:

1. **Open a new terminal/command prompt**

2. **Navigate to the server directory:**

   ```bash
   cd server
   ```

3. **Install dependencies (if not already installed):**

   ```bash
   npm install
   ```

4. **Create a `.env` file in the `server` folder** (if it doesn't exist):

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

5. **Start the backend server:**

   ```bash
   npm run dev
   ```

   You should see:

   ```
   Server running on port 5000
   MongoDB Connected: ...
   ```

6. **Keep this terminal open** - the server must stay running

---

## ✅ Solution 2: Check MongoDB Connection

The backend requires MongoDB to be connected. Make sure:

1. **You have a MongoDB connection string** in your `.env` file

   - Local MongoDB: `mongodb://localhost:27017/tradelogx`
   - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/tradelogx`

2. **MongoDB is running** (if using local MongoDB)

   - Start MongoDB service on your system

3. **The connection string is correct** in `server/.env`

---

## ✅ Solution 3: Check Port Configuration

**Backend should run on port 5000, Frontend on port 5173**

1. **Backend:** Default port is 5000 (check `server/server.js`)
2. **Frontend:** Default port is 5173 (Vite default)

If ports are different, update:

- `src/utils/api.js` - Change `API_BASE_URL` if backend uses different port
- `server/server.js` - Check `PORT` environment variable

---

## ✅ Solution 4: Check CORS Settings

CORS is already configured in `server/server.js` to allow `http://localhost:5173`.

If you're using a different frontend URL, update `CLIENT_URL` in `server/.env`.

---

## ✅ Solution 5: Verify API Endpoint

The frontend makes requests to: `http://localhost:5000/api/auth/signup`

Test if the backend is reachable:

1. Open browser and go to: `http://localhost:5000/api/health`
2. You should see: `{"success":true,"message":"Server is running",...}`

If this doesn't work, the backend isn't running or isn't accessible.

---

## 🔍 Quick Diagnostic Checklist

- [ ] Backend server is running (`npm run dev` in server folder)
- [ ] MongoDB is connected (check terminal for connection message)
- [ ] `.env` file exists in `server` folder with `MONGODB_URI` and `JWT_SECRET`
- [ ] No errors in backend terminal
- [ ] Frontend is running on `http://localhost:5173`
- [ ] Backend health check works: `http://localhost:5000/api/health`

---

## 🐛 Still Having Issues?

1. **Check browser console** (F12) for detailed error messages
2. **Check backend terminal** for server errors
3. **Verify MongoDB connection** - check if MongoDB Atlas cluster is accessible
4. **Try restarting both servers** - stop and start again

---

## 📝 Example .env File

Create `server/.env`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/tradelogx?retryWrites=true&w=majority

# JWT Secret (use a long random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random_123456789

# Server Port
PORT=5000

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

---

**Most likely issue: Backend server is not running!** Start it with `npm run dev` in the `server` folder.
