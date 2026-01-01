# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas (cloud database) for the Trade Diary backend.

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Sign Up"
3. Create your account (it's free)

## Step 2: Create a Cluster

1. After signing in, click "Build a Database"
2. Choose the **FREE** (M0) tier
3. Choose a cloud provider and region (select the closest to you)
4. Click "Create Cluster"
5. Wait 3-5 minutes for the cluster to be created

## Step 3: Create Database User

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" as authentication method
4. Create a username and password (save these - you'll need them!)
5. Under "Database User Privileges", select "Atlas admin" (or "Read and write to any database")
6. Click "Add User"

**Important**: Save your username and password securely!

## Step 4: Whitelist Your IP Address

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development) OR add your current IP address
   - For production, only add specific IPs
   - For development, "Allow Access from Anywhere" (0.0.0.0/0) is okay
4. Click "Confirm"

## Step 5: Get Your Connection String

1. Go back to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver
5. Copy the connection string - it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

1. Open `server/.env` file
2. Replace the `MONGODB_URI` with your Atlas connection string
3. Replace `<username>` with your database username
4. Replace `<password>` with your database password
5. Add `/tradelogx` before the `?` to specify the database name

**Example:**
```env
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/tradelogx?retryWrites=true&w=majority
```

Your complete `.env` file should look like:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/tradelogx?retryWrites=true&w=majority
JWT_SECRET=tradelogx-super-secret-jwt-key-change-in-production-2024
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Step 7: Test the Connection

1. Make sure your `.env` file is saved
2. Start your backend server:
   ```bash
   cd server
   npm run dev
   ```
3. You should see: `MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net` (or similar)

## Troubleshooting

### Connection Error: "authentication failed"
- Double-check your username and password in the connection string
- Make sure there are no spaces or special characters causing issues
- Try URL-encoding special characters in your password (e.g., `@` becomes `%40`)

### Connection Error: "IP not whitelisted"
- Go to "Network Access" in Atlas
- Add your current IP address or use "Allow Access from Anywhere" (0.0.0.0/0) for development

### Connection Timeout
- Make sure your internet connection is stable
- Check if your firewall is blocking the connection
- Try the connection string format: `mongodb+srv://...` (make sure it starts with `mongodb+srv://`)

## Security Notes

- **Never commit your `.env` file** to version control (it's already in `.gitignore`)
- Change the default `JWT_SECRET` in production
- For production, use specific IP whitelisting instead of "Allow Access from Anywhere"
- Consider using environment variables on your hosting platform instead of `.env` files

## Quick Connection String Template

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER-NAME.xxxxx.mongodb.net/DATABASE-NAME?retryWrites=true&w=majority
```

Replace:
- `USERNAME` - Your database username
- `PASSWORD` - Your database password
- `CLUSTER-NAME` - Your cluster name (e.g., `cluster0`)
- `xxxxx` - Your cluster ID
- `DATABASE-NAME` - `tradelogx` (or your preferred database name)

