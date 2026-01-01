import mongoose from 'mongoose'

const tradeSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Stock symbol is required'],
    trim: true,
    uppercase: true
  },
  exchange: {
    type: String,
    enum: ['NSE', 'BSE'],
    default: 'NSE',
    required: [true, 'Exchange is required']
  },
  tradeType: {
    type: String,
    enum: ['long', 'short'],
    required: [true, 'Trade type is required']
  },
  entryPrice: {
    type: Number,
    required: [true, 'Entry price is required'],
    min: [0, 'Entry price must be positive']
  },
  exitPrice: {
    type: Number,
    min: [0, 'Exit price must be positive']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  entryDate: {
    type: Date,
    required: [true, 'Entry date is required']
  },
  exitDate: {
    type: Date
  },
  profitLoss: {
    type: Number,
    default: 0
  },
  fees: {
    type: Number,
    default: 0,
    min: [0, 'Fees cannot be negative']
  },
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  emotion: {
    type: String,
    enum: ['fear', 'greed', 'confidence', 'anxiety', 'calm', ''],
    default: ''
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  aiAnalysis: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better query performance
tradeSchema.index({ user: 1, entryDate: -1 })
tradeSchema.index({ user: 1, symbol: 1 })
tradeSchema.index({ user: 1, status: 1 })
tradeSchema.index({ user: 1, exchange: 1 })

// Pre-save hook to calculate profitLoss automatically
tradeSchema.pre('save', function(next) {
  // Calculate P&L if exit price is provided
  if (this.exitPrice && this.entryPrice && this.quantity) {
    let pnl = 0
    
    if (this.tradeType === 'long') {
      // For long: profit = (exitPrice - entryPrice) * quantity - fees
      pnl = (this.exitPrice - this.entryPrice) * this.quantity - this.fees
    } else if (this.tradeType === 'short') {
      // For short: profit = (entryPrice - exitPrice) * quantity - fees
      pnl = (this.entryPrice - this.exitPrice) * this.quantity - this.fees
    }
    
    this.profitLoss = pnl
    
    // If exit price and exit date are set, mark as closed
    if (this.exitPrice && this.exitDate) {
      this.status = 'closed'
    }
  } else if (!this.exitPrice) {
    // If no exit price, P&L is 0 (unrealized)
    this.profitLoss = 0
    this.status = 'open'
  }
  
  next()
})

// Update updatedAt before saving
tradeSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

const Trade = mongoose.model('Trade', tradeSchema)

export default Trade
