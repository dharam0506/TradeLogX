import express from 'express'
import { body, validationResult, query } from 'express-validator'
import Trade from '../models/Trade.js'
import { authenticateToken } from '../middleware/auth.js'
import { generateTradeSummary, isAIConfigured } from '../services/aiService.js'
import { analyzePsychology } from '../services/psychologyService.js'
import { analyzePerformance } from '../services/analyticsService.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// GET /api/trades - Get all user's trades with optional filters
router.get(
    '/',
    [
        query('status').optional().isIn(['open', 'closed']).withMessage('Status must be open or closed'),
        query('symbol').optional().trim(),
        query('exchange').optional().isIn(['NSE', 'BSE']).withMessage('Exchange must be NSE or BSE'),
        query('dateFrom').optional().isISO8601().withMessage('Invalid date format for dateFrom'),
        query('dateTo').optional().isISO8601().withMessage('Invalid date format for dateTo')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                })
            }

            const userId = req.user.userId
            const { status, symbol, exchange, dateFrom, dateTo } = req.query

            // Build query
            const queryObj = { user: userId }

            if (status) {
                queryObj.status = status
            }

            if (symbol) {
                queryObj.symbol = symbol.toUpperCase()
            }

            if (exchange) {
                queryObj.exchange = exchange
            }

            if (dateFrom || dateTo) {
                queryObj.entryDate = {}
                if (dateFrom) {
                    queryObj.entryDate.$gte = new Date(dateFrom)
                }
                if (dateTo) {
                    queryObj.entryDate.$lte = new Date(dateTo)
                }
            }

            // Fetch trades sorted by entry date (newest first)
            const trades = await Trade.find(queryObj)
                .sort({ entryDate: -1 })
                .select('-__v')

            res.json({
                success: true,
                data: {
                    trades,
                    count: trades.length
                }
            })
        } catch (error) {
            console.error('Error fetching trades:', error)
            res.status(500).json({
                success: false,
                message: 'Server error while fetching trades',
                error: error.message
            })
        }
    }
)

// GET /api/trades/:id - Get single trade
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.userId
        const tradeId = req.params.id

        const trade = await Trade.findOne({ _id: tradeId, user: userId })

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: 'Trade not found'
            })
        }

        res.json({
            success: true,
            data: { trade }
        })
    } catch (error) {
        console.error('Error fetching trade:', error)

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid trade ID'
            })
        }

        res.status(500).json({
            success: false,
            message: 'Server error while fetching trade',
            error: error.message
        })
    }
})

// POST /api/trades - Create new trade
router.post(
    '/',
    [
        body('symbol')
            .trim()
            .notEmpty()
            .withMessage('Stock symbol is required')
            .isLength({ min: 1, max: 20 })
            .withMessage('Symbol must be between 1 and 20 characters'),
        body('exchange')
            .isIn(['NSE', 'BSE'])
            .withMessage('Exchange must be NSE or BSE'),
        body('tradeType')
            .isIn(['long', 'short'])
            .withMessage('Trade type must be long or short'),
        body('entryPrice')
            .isFloat({ min: 0 })
            .withMessage('Entry price must be a positive number'),
        body('exitPrice')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Exit price must be a positive number'),
        body('quantity')
            .isInt({ min: 1 })
            .withMessage('Quantity must be a positive integer'),
        body('entryDate')
            .isISO8601()
            .withMessage('Entry date must be a valid ISO 8601 date'),
        body('exitDate')
            .optional()
            .isISO8601()
            .withMessage('Exit date must be a valid ISO 8601 date'),
        body('fees')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Fees must be a positive number'),
        body('notes')
            .optional()
            .trim(),
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
        body('emotion')
            .optional()
            .isIn(['fear', 'greed', 'confidence', 'anxiety', 'calm', ''])
            .withMessage('Invalid emotion value'),
        body('status')
            .optional()
            .isIn(['open', 'closed'])
            .withMessage('Status must be open or closed')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                })
            }

            const userId = req.user.userId
            const tradeData = {
                ...req.body,
                symbol: req.body.symbol.toUpperCase(),
                user: userId
            }

            // If exit price and exit date are provided, ensure status is closed
            if (tradeData.exitPrice && tradeData.exitDate) {
                tradeData.status = 'closed'
            } else if (!tradeData.exitPrice) {
                tradeData.status = 'open'
            }

            const trade = new Trade(tradeData)
            await trade.save()

            res.status(201).json({
                success: true,
                message: 'Trade created successfully',
                data: { trade }
            })
        } catch (error) {
            console.error('Error creating trade:', error)
            res.status(500).json({
                success: false,
                message: 'Server error while creating trade',
                error: error.message
            })
        }
    }
)

// PUT /api/trades/:id - Update trade
router.put(
    '/:id',
    [
        body('symbol')
            .optional()
            .trim()
            .isLength({ min: 1, max: 20 })
            .withMessage('Symbol must be between 1 and 20 characters'),
        body('exchange')
            .optional()
            .isIn(['NSE', 'BSE'])
            .withMessage('Exchange must be NSE or BSE'),
        body('tradeType')
            .optional()
            .isIn(['long', 'short'])
            .withMessage('Trade type must be long or short'),
        body('entryPrice')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Entry price must be a positive number'),
        body('exitPrice')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Exit price must be a positive number'),
        body('quantity')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Quantity must be a positive integer'),
        body('entryDate')
            .optional()
            .isISO8601()
            .withMessage('Entry date must be a valid ISO 8601 date'),
        body('exitDate')
            .optional()
            .isISO8601()
            .withMessage('Exit date must be a valid ISO 8601 date'),
        body('fees')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Fees must be a positive number'),
        body('notes')
            .optional()
            .trim(),
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
        body('emotion')
            .optional()
            .isIn(['fear', 'greed', 'confidence', 'anxiety', 'calm', ''])
            .withMessage('Invalid emotion value'),
        body('status')
            .optional()
            .isIn(['open', 'closed'])
            .withMessage('Status must be open or closed')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                })
            }

            const userId = req.user.userId
            const tradeId = req.params.id

            // Check if trade exists and belongs to user
            const trade = await Trade.findOne({ _id: tradeId, user: userId })
            if (!trade) {
                return res.status(404).json({
                    success: false,
                    message: 'Trade not found'
                })
            }

            // Update trade data
            const updateData = { ...req.body }

            // Uppercase symbol if provided
            if (updateData.symbol) {
                updateData.symbol = updateData.symbol.toUpperCase()
            }

            // If exit price and exit date are provided, ensure status is closed
            if (updateData.exitPrice && updateData.exitDate) {
                updateData.status = 'closed'
            } else if (updateData.exitPrice && !trade.exitDate) {
                // If only exit price is provided without exit date, keep current status or set to closed
                updateData.status = 'closed'
            }

            // Update the trade (mongoose pre-save hook will recalculate P&L)
            Object.assign(trade, updateData)
            await trade.save()

            res.json({
                success: true,
                message: 'Trade updated successfully',
                data: { trade }
            })
        } catch (error) {
            console.error('Error updating trade:', error)

            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid trade ID'
                })
            }

            res.status(500).json({
                success: false,
                message: 'Server error while updating trade',
                error: error.message
            })
        }
    }
)

// DELETE /api/trades/:id - Delete trade
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.userId
        const tradeId = req.params.id

        const trade = await Trade.findOneAndDelete({ _id: tradeId, user: userId })

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: 'Trade not found'
            })
        }

        res.json({
            success: true,
            message: 'Trade deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting trade:', error)

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid trade ID'
            })
        }

        res.status(500).json({
            success: false,
            message: 'Server error while deleting trade',
            error: error.message
        })
    }
})

// GET /api/trades/stats/summary - Get trading statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const userId = req.user.userId

        // Get all trades for the user
        const trades = await Trade.find({ user: userId })

        // Calculate statistics
        const totalTrades = trades.length
        const openTrades = trades.filter(t => t.status === 'open').length
        const closedTrades = trades.filter(t => t.status === 'closed').length

        // Calculate P&L statistics for closed trades
        const closedTradesList = trades.filter(t => t.status === 'closed')
        const totalProfitLoss = closedTradesList.reduce((sum, t) => sum + (t.profitLoss || 0), 0)
        const winningTrades = closedTradesList.filter(t => (t.profitLoss || 0) > 0)
        const losingTrades = closedTradesList.filter(t => (t.profitLoss || 0) < 0)
        const breakevenTrades = closedTradesList.filter(t => (t.profitLoss || 0) === 0)

        const winRate = closedTrades > 0
            ? ((winningTrades.length / closedTrades) * 100).toFixed(2)
            : 0

        const averageWin = winningTrades.length > 0
            ? winningTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / winningTrades.length
            : 0

        const averageLoss = losingTrades.length > 0
            ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / losingTrades.length)
            : 0

        const profitFactor = averageLoss > 0 && averageWin > 0
            ? (averageWin / averageLoss).toFixed(2)
            : (averageLoss === 0 && averageWin > 0 ? '∞' : '0')

        // Best and worst trades
        const bestTrade = closedTradesList.length > 0
            ? closedTradesList.reduce((best, t) => (t.profitLoss || 0) > (best.profitLoss || 0) ? t : best)
            : null

        const worstTrade = closedTradesList.length > 0
            ? closedTradesList.reduce((worst, t) => (t.profitLoss || 0) < (worst.profitLoss || 0) ? t : worst)
            : null

        // Performance by exchange
        const tradesByExchange = {
            NSE: closedTradesList.filter(t => t.exchange === 'NSE').length,
            BSE: closedTradesList.filter(t => t.exchange === 'BSE').length
        }

        // Performance by trade type
        const longTrades = closedTradesList.filter(t => t.tradeType === 'long')
        const shortTrades = closedTradesList.filter(t => t.tradeType === 'short')
        const longPnL = longTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)
        const shortPnL = shortTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)

        res.json({
            success: true,
            data: {
                // Basic stats for StatsCards component
                totalPnL: parseFloat(totalProfitLoss.toFixed(2)),
                winRate: parseFloat(winRate),
                totalTrades,
                openPositions: openTrades,
                
                // Detailed summary
                summary: {
                    totalTrades,
                    openTrades,
                    closedTrades,
                    totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
                    winRate: parseFloat(winRate),
                    winningTrades: winningTrades.length,
                    losingTrades: losingTrades.length,
                    breakevenTrades: breakevenTrades.length,
                    averageWin: parseFloat(averageWin.toFixed(2)),
                    averageLoss: parseFloat(averageLoss.toFixed(2)),
                    profitFactor
                },
                bestTrade: bestTrade ? {
                    symbol: bestTrade.symbol,
                    exchange: bestTrade.exchange,
                    profitLoss: bestTrade.profitLoss
                } : null,
                worstTrade: worstTrade ? {
                    symbol: worstTrade.symbol,
                    exchange: worstTrade.exchange,
                    profitLoss: worstTrade.profitLoss
                } : null,
                byExchange: tradesByExchange,
                byTradeType: {
                    long: {
                        count: longTrades.length,
                        totalPnL: parseFloat(longPnL.toFixed(2))
                    },
                    short: {
                        count: shortTrades.length,
                        totalPnL: parseFloat(shortPnL.toFixed(2))
                    }
                }
            }
        })
    } catch (error) {
        console.error('Error fetching trade statistics:', error)
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics',
            error: error.message
        })
    }
})

// POST /api/trades/:id/analyze - Trigger AI analysis for a trade
router.post('/:id/analyze', async (req, res) => {
    const requestStartTime = Date.now()
    const userId = req.user.userId
    const tradeId = req.params.id
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`[API] POST /api/trades/${tradeId}/analyze`)
    console.log(`[API] User ID: ${userId}`)
    console.log(`[API] Timestamp: ${new Date().toISOString()}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    try {
        // Check if AI is configured
        console.log('[API] Step 1: Checking AI service configuration...')
        if (!isAIConfigured()) {
            console.error('[API] ❌ AI service not configured - returning 503')
            const duration = Date.now() - requestStartTime
            console.log(`[API] Request failed after ${duration}ms`)
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
            return res.status(503).json({
                success: false,
                message: 'AI service is not configured. Please add GEMINI_API_KEY to your server .env file. Get your free API key from https://makersuite.google.com/app/apikey'
            })
        }
        console.log('[API] ✓ AI service is configured')

        // Check if trade exists and belongs to user
        console.log(`[API] Step 2: Fetching trade ${tradeId} for user ${userId}...`)
        const trade = await Trade.findOne({ _id: tradeId, user: userId })
        if (!trade) {
            console.error(`[API] ❌ Trade ${tradeId} not found for user ${userId}`)
            const duration = Date.now() - requestStartTime
            console.log(`[API] Request failed after ${duration}ms`)
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
            return res.status(404).json({
                success: false,
                message: 'Trade not found'
            })
        }
        console.log(`[API] ✓ Trade found: ${trade.symbol} (${trade.exchange}) - ${trade.tradeType}`)

        // Get user's recent trades for context (last 20 closed trades)
        console.log('[API] Step 3: Fetching user trading history for context...')
        const userTrades = await Trade.find({ 
            user: userId,
            _id: { $ne: tradeId } // Exclude current trade
        })
        .sort({ entryDate: -1 })
        .limit(20)
        .select('-__v')
        console.log(`[API] ✓ Found ${userTrades.length} historical trades for context`)

        // Generate AI summary
        console.log('[API] Step 4: Calling AI service to generate analysis...')
        const analysis = await generateTradeSummary(trade.toObject(), userTrades)
        console.log('[API] ✓ AI analysis generated successfully')

        // Store analysis in trade document
        console.log('[API] Step 5: Saving analysis to database...')
        trade.aiAnalysis = analysis
        await trade.save()
        console.log('[API] ✓ Analysis saved to trade document')

        // Return analysis to frontend
        const duration = Date.now() - requestStartTime
        console.log(`[API] ✓ Request completed successfully in ${duration}ms`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        
        res.json({
            success: true,
            message: 'Trade analyzed successfully',
            data: {
                analysis
            }
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

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid trade ID'
            })
        }

        // Handle AI-specific errors
        if (error.message && error.message.includes('API key')) {
            return res.status(503).json({
                success: false,
                message: error.message
            })
        }

        if (error.message && error.message.includes('quota')) {
            return res.status(429).json({
                success: false,
                message: 'AI service quota exceeded. Please try again later.'
            })
        }

        res.status(500).json({
            success: false,
            message: 'Server error while analyzing trade',
            error: error.message || 'Unknown error occurred'
        })
    }
})

// GET /api/trades/psychology/patterns - Get psychology patterns
router.get('/psychology/patterns', async (req, res) => {
    const requestStartTime = Date.now()
    const userId = req.user.userId
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('[API] GET /api/trades/psychology/patterns')
    console.log(`[API] User ID: ${userId}`)
    console.log(`[API] Timestamp: ${new Date().toISOString()}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    try {
        // Get all user trades (not just those with emotions, for comprehensive analysis)
        console.log('[API] Fetching all user trades for psychology analysis...')
        const trades = await Trade.find({ user: userId })
            .sort({ entryDate: -1 })
            .select('-__v')
        
        console.log(`[API] ✓ Found ${trades.length} total trades`)

        // Analyze psychology using the service
        console.log('[API] Analyzing psychology patterns...')
        const psychologyAnalysis = analyzePsychology(trades)
        console.log('[API] ✓ Psychology analysis completed')

        const duration = Date.now() - requestStartTime
        console.log(`[API] ✓ Request completed successfully in ${duration}ms`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        res.json({
            success: true,
            message: 'Psychology patterns retrieved successfully',
            data: psychologyAnalysis
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
        
        res.status(500).json({
            success: false,
            message: 'Server error while fetching psychology patterns',
            error: error.message
        })
    }
})

// GET /api/trades/analytics/insights - Get performance insights
router.get('/analytics/insights', async (req, res) => {
    const requestStartTime = Date.now()
    const userId = req.user.userId
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('[API] GET /api/trades/analytics/insights')
    console.log(`[API] User ID: ${userId}`)
    console.log(`[API] Timestamp: ${new Date().toISOString()}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    try {
        // Get all user trades (not just closed, for comprehensive analysis)
        console.log('[API] Fetching all user trades for analytics...')
        const trades = await Trade.find({ user: userId })
            .sort({ entryDate: -1 })
            .select('-__v')
        
        console.log(`[API] ✓ Found ${trades.length} total trades`)

        // Analyze performance using the service
        console.log('[API] Analyzing performance metrics...')
        const analyticsData = analyzePerformance(trades)
        console.log('[API] ✓ Performance analysis completed')

        const duration = Date.now() - requestStartTime
        console.log(`[API] ✓ Request completed successfully in ${duration}ms`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        res.json({
            success: true,
            message: 'Analytics insights retrieved successfully',
            data: analyticsData
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
        
        res.status(500).json({
            success: false,
            message: 'Server error while fetching analytics insights',
            error: error.message
        })
    }
})

export default router
