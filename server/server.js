import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import authRoutes from './routes/auth.js'
import tradeRoutes from './routes/trades.js'
import marketRoutes from './routes/market.js'
import { isAIConfigured } from './services/aiService.js'

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// Log server startup information
console.log('\n🚀 Starting TradeLogX Backend Server...')
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
console.log(`📍 Port: ${process.env.PORT || 5000}`)
console.log(`📍 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`)
console.log(`📍 MongoDB URI: ${process.env.MONGODB_URI ? '✓ Configured' : '✗ Not configured'}`)
console.log(`📍 JWT Secret: ${process.env.JWT_SECRET ? '✓ Configured' : '✗ Not configured'}`)

// Check AI service configuration (this will trigger the AI service initialization logs)
const aiConfigured = isAIConfigured()
console.log(`📍 AI Service: ${aiConfigured ? '✓ Configured and ready' : '✗ Not configured - AI features disabled'}`)
if (!aiConfigured) {
  console.log('   → To enable AI Summarizer: Add GEMINI_API_KEY to server/.env')
  console.log('   → Get free API key: https://makersuite.google.com/app/apikey')
}

// Connect to database
connectDB()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  if (req.path !== '/api/health') { // Skip health check logs
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  }
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/trades', tradeRoutes)
app.use('/api/market', marketRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('\n✅ Server started successfully!')
  console.log(`🌐 Server running on: http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`)
  console.log(`📊 Trade endpoints: http://localhost:${PORT}/api/trades`)
  console.log('\n📝 Logs will appear below:\n')
})



