import express from 'express'
import { query } from 'express-validator'
import { authenticateToken } from '../middleware/auth.js'
import { predictDirection } from '../services/technicalAnalysisService.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// GET /api/market/predict/:symbol - Get prediction for a stock
router.get(
  '/predict/:symbol',
  [
    query('exchange')
      .optional()
      .isIn(['NSE', 'BSE'])
      .withMessage('Exchange must be NSE or BSE')
  ],
  async (req, res) => {
    const requestStartTime = Date.now()
    const symbol = req.params.symbol
    const exchange = req.query.exchange || 'NSE'
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`[API] GET /api/market/predict/${symbol}`)
    console.log(`[API] Exchange: ${exchange}`)
    console.log(`[API] Timestamp: ${new Date().toISOString()}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    try {
      // Validate symbol
      if (!symbol || symbol.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock symbol is required'
        })
      }

      // Get prediction
      console.log(`[API] Fetching prediction for ${symbol} (${exchange})...`)
      const prediction = await predictDirection(symbol.trim().toUpperCase(), exchange)
      console.log(`[API] ✓ Prediction generated successfully`)

      const duration = Date.now() - requestStartTime
      console.log(`[API] ✓ Request completed successfully in ${duration}ms`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

      res.json({
        success: true,
        message: 'Prediction generated successfully',
        data: prediction
      })
    } catch (error) {
      const duration = Date.now() - requestStartTime
      console.error(`[API] ❌ ERROR after ${duration}ms:`)
      console.error(`[API] Error type: ${error.name || 'Unknown'}`)
      console.error(`[API] Error message: ${error.message}`)
      if (error.stack) {
        console.error(`[API] Error stack:\n${error.stack}`)
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

      // Handle specific error cases
      if (error.message && error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        })
      }

      if (error.message && error.message.includes('timeout')) {
        return res.status(504).json({
          success: false,
          message: error.message
        })
      }

      if (error.message && error.message.includes('Insufficient')) {
        return res.status(400).json({
          success: false,
          message: error.message
        })
      }

      res.status(500).json({
        success: false,
        message: 'Server error while generating prediction',
        error: error.message || 'Unknown error occurred'
      })
    }
  }
)

// GET /api/market/predict/bulk - Get predictions for multiple stocks
router.post(
  '/predict/bulk',
  [
    query('exchange')
      .optional()
      .isIn(['NSE', 'BSE'])
      .withMessage('Exchange must be NSE or BSE')
  ],
  async (req, res) => {
    const requestStartTime = Date.now()
    const { symbols } = req.body
    const exchange = req.query.exchange || req.body.exchange || 'NSE'
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`[API] POST /api/market/predict/bulk`)
    console.log(`[API] Symbols: ${symbols?.join(', ') || 'none'}`)
    console.log(`[API] Exchange: ${exchange}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    try {
      // Validate symbols array
      if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Symbols array is required'
        })
      }

      if (symbols.length > 10) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 10 symbols allowed per request'
        })
      }

      // Get predictions for all symbols
      const predictions = []
      const errors = []

      for (const symbol of symbols) {
        try {
          console.log(`[API] Processing ${symbol}...`)
          const prediction = await predictDirection(symbol.trim().toUpperCase(), exchange)
          predictions.push(prediction)
        } catch (error) {
          console.error(`[API] Error processing ${symbol}:`, error.message)
          errors.push({
            symbol: symbol.trim().toUpperCase(),
            error: error.message
          })
        }
      }

      const duration = Date.now() - requestStartTime
      console.log(`[API] ✓ Bulk request completed in ${duration}ms`)
      console.log(`[API] Successful: ${predictions.length}, Failed: ${errors.length}`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

      res.json({
        success: true,
        message: `Retrieved ${predictions.length} predictions`,
        data: {
          predictions,
          errors: errors.length > 0 ? errors : undefined
        }
      })
    } catch (error) {
      const duration = Date.now() - requestStartTime
      console.error(`[API] ❌ ERROR after ${duration}ms:`, error.message)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

      res.status(500).json({
        success: false,
        message: 'Server error while generating bulk predictions',
        error: error.message || 'Unknown error occurred'
      })
    }
  }
)

export default router

