import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Log AI service initialization status
const apiKey = process.env.GEMINI_API_KEY || ''
if (apiKey) {
    console.log('✅ [AI Service] Google Gemini API key found - AI Summarizer enabled')
    console.log(`   [AI Service] API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`)
} else {
    console.warn('⚠️  [AI Service] GEMINI_API_KEY not found in environment variables')
    console.warn('   [AI Service] AI Summarizer feature will be disabled')
    console.warn('   [AI Service] Get your free API key from: https://makersuite.google.com/app/apikey')
}

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(apiKey)

/**
 * List available models (for debugging)
 * This helps identify which models are available with your API key
 */
export const listAvailableModels = async () => {
    try {
        console.log('[AI Service] Fetching list of available models...')
        const models = await genAI.listModels()
        console.log('[AI Service] Available models:')
        models.forEach(model => {
            console.log(`  - ${model.name}`)
        })
        return models
    } catch (error) {
        console.error('[AI Service] Error listing models:', error.message)
        return []
    }
}

/**
 * Try to generate content with multiple models until one works
 * Returns the first successful response
 */
const tryGenerateContent = async (prompt, modelNamesToTry) => {
    let lastError = null

    for (const modelName of modelNamesToTry) {
        try {
            console.log(`[AI Service] Trying model: ${modelName}...`)
            const model = genAI.getGenerativeModel({ model: modelName })
            const result = await model.generateContent(prompt)
            const response = await result.response
            console.log(`[AI Service] ✓ Model ${modelName} worked!`)
            return { text: response.text(), modelName }
        } catch (error) {
            console.log(`[AI Service] ✗ Model ${modelName} failed: ${error.message.substring(0, 100)}`)
            lastError = error
            // Continue to next model
            continue
        }
    }

    // If all models failed, throw the last error
    throw lastError || new Error('All models failed. Please check your API key.')
}

/**
 * Generate AI-powered trade summary using Google Gemini
 * @param {Object} tradeData - The trade to analyze
 * @param {Array} userTrades - User's trading history for context
 * @returns {Object} AI-generated analysis with summary, patterns, strengths, weaknesses, and insights
 */
export const generateTradeSummary = async (tradeData, userTrades = []) => {
    const startTime = Date.now()
    console.log(`[AI Service] Starting trade analysis for: ${tradeData.symbol} (${tradeData.exchange})`)
    console.log(`[AI Service] Trade ID: ${tradeData._id}, User ID: ${tradeData.user}`)

    try {
        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            console.error('[AI Service] ❌ ERROR: GEMINI_API_KEY is not configured')
            throw new Error('GEMINI_API_KEY is not configured in environment variables')
        }

        console.log('[AI Service] ✓ API key check passed')

          // List of models to try in order (most common/widely available first)
          const modelNamesToTry = [
             'gemini-3-flash',              // Original model (most widely available)
             'gemini-2.5-flash',         // Newer, more capable model
             'gemini-2.0-flash',       // Faster, cheaper model
         ]

        console.log('[AI Service] Will try models in order until one works...')

        // Prepare trade context
        const tradeContext = {
            symbol: tradeData.symbol,
            exchange: tradeData.exchange,
            tradeType: tradeData.tradeType,
            entryPrice: tradeData.entryPrice,
            exitPrice: tradeData.exitPrice || 'Not exited yet',
            quantity: tradeData.quantity,
            entryDate: new Date(tradeData.entryDate).toLocaleDateString('en-IN'),
            exitDate: tradeData.exitDate ? new Date(tradeData.exitDate).toLocaleDateString('en-IN') : 'Still open',
            profitLoss: tradeData.profitLoss !== null && tradeData.profitLoss !== undefined
                ? `₹${tradeData.profitLoss.toFixed(2)}`
                : 'Not calculated',
            fees: tradeData.fees || 0,
            emotion: tradeData.emotion || 'Not specified',
            notes: tradeData.notes || 'No notes',
            tags: tradeData.tags || [],
            status: tradeData.status
        }

        // Calculate user's trading statistics for context
        const closedTrades = userTrades.filter(t => t.status === 'closed')
        const totalTrades = closedTrades.length
        const winningTrades = closedTrades.filter(t => (t.profitLoss || 0) > 0).length
        const losingTrades = closedTrades.filter(t => (t.profitLoss || 0) < 0).length
        const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0
        const totalPnL = closedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)

        // Get recent similar trades (same symbol or same trade type)
        const similarTrades = userTrades
            .filter(t =>
                t._id.toString() !== tradeData._id.toString() &&
                (t.symbol === tradeData.symbol || t.tradeType === tradeData.tradeType)
            )
            .slice(0, 5)
            .map(t => ({
                symbol: t.symbol,
                tradeType: t.tradeType,
                profitLoss: t.profitLoss || 0,
                status: t.status
            }))

        // Construct the prompt for Gemini
        const prompt = `You are an expert Indian stock market trading analyst. Analyze the following trade and provide comprehensive insights.

TRADE DETAILS:
- Symbol: ${tradeContext.symbol}
- Exchange: ${tradeContext.exchange}
- Trade Type: ${tradeContext.tradeType.toUpperCase()}
- Entry Price: ₹${tradeContext.entryPrice}
- Exit Price: ${tradeContext.exitPrice}
- Quantity: ${tradeContext.quantity} shares
- Entry Date: ${tradeContext.entryDate}
- Exit Date: ${tradeContext.exitDate}
- Profit/Loss: ${tradeContext.profitLoss}
- Fees: ₹${tradeContext.fees}
- Emotion: ${tradeContext.emotion}
- Status: ${tradeContext.status.toUpperCase()}
- Tags: ${tradeContext.tags.join(', ') || 'None'}
- Notes: ${tradeContext.notes}

USER'S TRADING STATISTICS:
- Total Closed Trades: ${totalTrades}
- Win Rate: ${winRate}%
- Total P&L: ₹${totalPnL.toFixed(2)}
- Similar Recent Trades: ${similarTrades.length > 0 ? JSON.stringify(similarTrades, null, 2) : 'None'}

Please provide a comprehensive analysis in the following JSON format (respond ONLY with valid JSON, no additional text):
{
  "summary": "A 2-3 sentence summary of this trade analyzing its performance, entry/exit timing, and key outcomes.",
  "patterns": [
    "Pattern 1: Description of any trading patterns identified",
    "Pattern 2: Description of behavioral patterns",
    "Pattern 3: Any recurring strategies or mistakes"
  ],
  "strengths": [
    "Strength 1: What went well in this trade",
    "Strength 2: Good decision-making or execution",
    "Strength 3: Positive aspects to replicate"
  ],
  "weaknesses": [
    "Weakness 1: Areas that could be improved",
    "Weakness 2: Mistakes or missed opportunities",
    "Weakness 3: What to avoid in future trades"
  ],
  "insights": "A paragraph (3-4 sentences) with actionable insights, lessons learned, and recommendations for future similar trades. Be specific and practical."
}

Important Guidelines:
- Focus on Indian stock market context (NSE/BSE)
- Be constructive and actionable
- If trade is still open, focus on entry analysis and management
- Compare with user's historical performance when relevant
- Consider the emotion and psychological aspects
- Keep responses concise but insightful
- Use Indian Rupee (₹) for all monetary values

Respond with ONLY the JSON object, no markdown, no code blocks, just the raw JSON.`

        // Generate content using Gemini (tries multiple models until one works)
        console.log('[AI Service] Sending request to Google Gemini API...')
        console.log(`[AI Service] Prompt length: ${prompt.length} characters`)

        const { text, modelName } = await tryGenerateContent(prompt, modelNamesToTry)
        console.log(`[AI Service] ✓ Received response from Gemini using model: ${modelName}`)
        console.log(`[AI Service] Response length: ${text.length} characters`)

        // Parse the JSON response from Gemini
        let analysis
        try {
            // Clean the response in case Gemini adds markdown formatting
            let cleanedText = text.trim()

            // Remove markdown code blocks if present
            cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

            // Extract JSON if there's extra text
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                cleanedText = jsonMatch[0]
            }

            analysis = JSON.parse(cleanedText)
            console.log('[AI Service] ✓ Successfully parsed JSON response')
        } catch (parseError) {
            console.error('[AI Service] ❌ ERROR parsing Gemini JSON response:', parseError.message)
            console.error('[AI Service] Raw response (first 500 chars):', text.substring(0, 500))
            // Fallback to structured response if parsing fails
            analysis = {
                summary: text.substring(0, 300) || 'Analysis generated successfully. Please review the trade details.',
                patterns: [],
                strengths: [],
                weaknesses: [],
                insights: 'The AI analysis encountered a formatting issue. Please review your trade manually.'
            }
        }

        // Validate and ensure required fields exist
        if (!analysis.summary) {
            analysis.summary = 'Trade analysis completed. Review the details below.'
        }
        if (!Array.isArray(analysis.patterns)) {
            analysis.patterns = []
        }
        if (!Array.isArray(analysis.strengths)) {
            analysis.strengths = []
        }
        if (!Array.isArray(analysis.weaknesses)) {
            analysis.weaknesses = []
        }
        if (!analysis.insights) {
            analysis.insights = 'Review your trade strategy and risk management approach.'
        }

        const duration = Date.now() - startTime
        console.log(`[AI Service] ✓ Analysis completed successfully in ${duration}ms`)
        console.log(`[AI Service] Analysis summary: ${analysis.summary?.substring(0, 100)}...`)

        return analysis
    } catch (error) {
        const duration = Date.now() - startTime
        console.error(`[AI Service] ❌ ERROR after ${duration}ms:`, error.message)
        console.error('[AI Service] Error stack:', error.stack)

        // Handle specific error cases
        if (error.message && error.message.includes('API key')) {
            throw new Error('Google Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.')
        }

        if (error.message && error.message.includes('quota')) {
            throw new Error('Google Gemini API quota exceeded. Please try again later.')
        }

        if (error.message && error.message.includes('safety')) {
            throw new Error('Content safety filters blocked the request. Please try again with different trade details.')
        }

        // Handle model not found errors specifically
        if (error.message && error.message.includes('404') && error.message.includes('not found')) {
            throw new Error(
                'No compatible Gemini model found. ' +
                'This usually means:\n' +
                '1. Your API key may have restrictions\n' +
                '2. Your API key might be from a different region\n' +
                '3. The models available might be different\n\n' +
                'Try:\n' +
                '- Check your API key at: https://makersuite.google.com/app/apikey\n' +
                '- Make sure you\'re using the latest API key\n' +
                '- Original error: ' + error.message
            )
        }

        // Generic error
        throw new Error(`AI analysis failed: ${error.message || 'Unknown error occurred'}`)
    }
}

/**
 * Check if AI service is properly configured
 * @param {boolean} silent - If true, don't log the status check
 * @returns {boolean} True if API key is configured
 */
export const isAIConfigured = (silent = false) => {
    const configured = !!process.env.GEMINI_API_KEY
    if (!configured && !silent) {
        console.log('[AI Service] Status check: NOT CONFIGURED - GEMINI_API_KEY missing')
    }
    return configured
}

