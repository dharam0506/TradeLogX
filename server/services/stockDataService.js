import axios from 'axios'

/**
 * Stock Data Service
 * Fetches Indian stock market data using Yahoo Finance API
 */

/**
 * Convert Indian stock symbol to Yahoo Finance format
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE")
 * @param {string} exchange - Exchange ("NSE" or "BSE")
 * @returns {string} Yahoo Finance symbol (e.g., "RELIANCE.NS")
 */
const formatSymbolForYahoo = (symbol, exchange) => {
    const cleanSymbol = symbol.toUpperCase().trim()
    if (exchange === 'BSE') {
        return `${cleanSymbol}.BO` // BSE format
    }
    return `${cleanSymbol}.NS` // NSE format (default)
}

/**
 * Get current stock price and basic data
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE")
 * @param {string} exchange - Exchange ("NSE" or "BSE")
 * @returns {Object} Stock data with current price and metadata
 */
export const getStockData = async (symbol, exchange = 'NSE') => {
    console.log(`[Stock Data] Fetching data for ${symbol} (${exchange})...`)

    try {
        const yahooSymbol = formatSymbolForYahoo(symbol, exchange)

        // Yahoo Finance API endpoint
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`

        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        })

        if (!response.data || !response.data.chart || !response.data.chart.result) {
            throw new Error(`No data found for ${symbol} on ${exchange}`)
        }

        const result = response.data.chart.result[0]
        const meta = result.meta || {}
        const currentPrice = meta.regularMarketPrice || meta.previousClose || 0

        console.log(`[Stock Data] ✓ Retrieved data for ${symbol}: ₹${currentPrice}`)

        return {
            symbol: symbol.toUpperCase(),
            exchange,
            currentPrice: parseFloat(currentPrice.toFixed(2)),
            previousClose: meta.previousClose ? parseFloat(meta.previousClose.toFixed(2)) : null,
            open: meta.regularMarketOpen ? parseFloat(meta.regularMarketOpen.toFixed(2)) : null,
            high: meta.regularMarketDayHigh ? parseFloat(meta.regularMarketDayHigh.toFixed(2)) : null,
            low: meta.regularMarketDayLow ? parseFloat(meta.regularMarketDayLow.toFixed(2)) : null,
            volume: meta.regularMarketVolume || null,
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        console.error(`[Stock Data] ❌ Error fetching data for ${symbol}:`, error.message)

        if (error.response?.status === 404) {
            throw new Error(`Stock ${symbol} not found on ${exchange}. Please check the symbol and exchange.`)
        }

        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please try again.')
        }

        throw new Error(`Failed to fetch stock data: ${error.message}`)
    }
}

/**
 * Get historical stock data for technical analysis
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE")
 * @param {string} exchange - Exchange ("NSE" or "BSE")
 * @param {string} period - Period: "1mo", "3mo", "6mo", "1y", "2y" (default: "6mo")
 * @returns {Array} Array of price data points with timestamp, open, high, low, close, volume
 */
export const getHistoricalData = async (symbol, exchange = 'NSE', period = '6mo') => {
    console.log(`[Stock Data] Fetching historical data for ${symbol} (${exchange}), period: ${period}...`)

    try {
        const yahooSymbol = formatSymbolForYahoo(symbol, exchange)

        // Valid periods: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
        const validPeriods = ['1mo', '3mo', '6mo', '1y', '2y']
        const dataPeriod = validPeriods.includes(period) ? period : '6mo'

        // Yahoo Finance API endpoint for historical data
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=${dataPeriod}`

        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        })

        if (!response.data || !response.data.chart || !response.data.chart.result) {
            throw new Error(`No historical data found for ${symbol} on ${exchange}`)
        }

        const result = response.data.chart.result[0]
        const timestamps = result.timestamp || []
        const indicators = result.indicators || {}
        const quote = indicators.quote?.[0] || {}

        const opens = quote.open || []
        const highs = quote.high || []
        const lows = quote.low || []
        const closes = quote.close || []
        const volumes = quote.volume || []

        // Build historical data array
        const historicalData = []
        for (let i = 0; i < timestamps.length; i++) {
            if (closes[i] !== null && closes[i] !== undefined) {
                historicalData.push({
                    timestamp: timestamps[i] * 1000, // Convert to milliseconds
                    date: new Date(timestamps[i] * 1000).toISOString(),
                    open: parseFloat((opens[i] || closes[i]).toFixed(2)),
                    high: parseFloat((highs[i] || closes[i]).toFixed(2)),
                    low: parseFloat((lows[i] || closes[i]).toFixed(2)),
                    close: parseFloat(closes[i].toFixed(2)),
                    volume: volumes[i] || 0
                })
            }
        }

        // Sort by date (oldest first)
        historicalData.sort((a, b) => a.timestamp - b.timestamp)

        console.log(`[Stock Data] ✓ Retrieved ${historicalData.length} data points for ${symbol}`)

        return historicalData
    } catch (error) {
        console.error(`[Stock Data] ❌ Error fetching historical data for ${symbol}:`, error.message)

        if (error.response?.status === 404) {
            throw new Error(`Stock ${symbol} not found on ${exchange}. Please check the symbol and exchange.`)
        }

        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please try again.')
        }

        throw new Error(`Failed to fetch historical data: ${error.message}`)
    }
}

/**
 * Get both current and historical data in one call
 * @param {string} symbol - Stock symbol
 * @param {string} exchange - Exchange
 * @param {string} period - Historical period
 * @returns {Object} Combined current and historical data
 */
export const getStockDataWithHistory = async (symbol, exchange = 'NSE', period = '6mo') => {
    try {
        const [currentData, historicalData] = await Promise.all([
            getStockData(symbol, exchange),
            getHistoricalData(symbol, exchange, period)
        ])

        return {
            ...currentData,
            historicalData
        }
    } catch (error) {
        console.error(`[Stock Data] ❌ Error in getStockDataWithHistory:`, error.message)
        throw error
    }
}

