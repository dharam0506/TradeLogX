# MongoDB Atlas Quick Start

## Get Your Connection String

1. Go to https://www.mongodb.com/cloud/atlas and sign up (free tier)
2. Create a cluster (choose FREE M0 tier)
3. Create database user: Database Access → Add New Database User
4. Whitelist IP: Network Access → Add IP Address → "Allow Access from Anywhere" (for dev)
5. Get connection string: Database → Connect → Connect your application → Node.js

## Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.xxxxx.mongodb.net/tradelogx?retryWrites=true&w=majority
```

Replace:
- `USERNAME` - Your database username
- `PASSWORD` - Your database password  
- `CLUSTER.xxxxx.mongodb.net` - Your cluster address

## Add to .env File

Create `server/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/tradelogx?retryWrites=true&w=majority
JWT_SECRET=tradelogx-super-secret-jwt-key-change-in-production-2024
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

That's it! Start your server and it will connect to Atlas.

