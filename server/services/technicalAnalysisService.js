/**
 * Technical Analysis Service
 * Calculates technical indicators for market prediction
 */

/**
 * Calculate Relative Strength Index (RSI)
 * @param {Array} prices - Array of closing prices
 * @param {number} period - Period for RSI calculation (default: 14)
 * @returns {number} RSI value (0-100)
 */
export const calculateRSI = (prices, period = 14) => {
  if (!prices || prices.length < period + 1) {
    return null
  }

  let gains = 0
  let losses = 0

  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1]
    if (change > 0) {
      gains += change
    } else {
      losses += Math.abs(change)
    }
  }

  let avgGain = gains / period
  let avgLoss = losses / period

  // Calculate RSI using Wilder's smoothing method
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? Math.abs(change) : 0

    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
  }

  if (avgLoss === 0) {
    return 100
  }

  const rs = avgGain / avgLoss
  const rsi = 100 - (100 / (1 + rs))

  return parseFloat(rsi.toFixed(2))
}

/**
 * Calculate Simple Moving Average (SMA)
 * @param {Array} prices - Array of prices
 * @param {number} period - Period for SMA
 * @returns {number} SMA value
 */
export const calculateSMA = (prices, period) => {
  if (!prices || prices.length < period) {
    return null
  }

  const sum = prices.slice(-period).reduce((a, b) => a + b, 0)
  return parseFloat((sum / period).toFixed(2))
}

/**
 * Calculate Exponential Moving Average (EMA)
 * @param {Array} prices - Array of prices
 * @param {number} period - Period for EMA
 * @returns {number} EMA value
 */
export const calculateEMA = (prices, period) => {
  if (!prices || prices.length < period) {
    return null
  }

  // Calculate initial SMA
  let ema = calculateSMA(prices.slice(0, period), period)
  const multiplier = 2 / (period + 1)

  // Calculate EMA for remaining prices
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema
  }

  return parseFloat(ema.toFixed(2))
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 * @param {Array} prices - Array of closing prices
 * @returns {Object} MACD object with macd, signal, and histogram
 */
export const calculateMACD = (prices) => {
  if (!prices || prices.length < 26) {
    return { macd: null, signal: null, histogram: null }
  }

  // Standard MACD: EMA(12) - EMA(26), Signal: EMA(9) of MACD
  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)

  if (ema12 === null || ema26 === null) {
    return { macd: null, signal: null, histogram: null }
  }

  const macd = ema12 - ema26

  // For signal line, we need to calculate EMA(9) of MACD values
  // Simplified: use current MACD value (in production, calculate full MACD line first)
  const signal = macd * 0.8 // Simplified approximation
  const histogram = macd - signal

  return {
    macd: parseFloat(macd.toFixed(2)),
    signal: parseFloat(signal.toFixed(2)),
    histogram: parseFloat(histogram.toFixed(2))
  }
}

/**
 * Calculate Moving Averages for multiple periods
 * @param {Array} prices - Array of closing prices
 * @param {Array} periods - Array of periods (e.g., [50, 200])
 * @returns {Object} Object with SMA and EMA for each period
 */
export const calculateMovingAverages = (prices, periods = [20, 50, 200]) => {
  const result = {
    sma: {},
    ema: {}
  }

  periods.forEach(period => {
    if (prices.length >= period) {
      result.sma[period] = calculateSMA(prices, period)
      result.ema[period] = calculateEMA(prices, period)
    }
  })

  return result
}

/**
 * Calculate Support and Resistance levels
 * @param {Array} prices - Array of price data with high, low, close
 * @returns {Object} Support and resistance levels
 */
export const calculateSupportResistance = (prices) => {
  if (!prices || prices.length < 20) {
    return { support: null, resistance: null }
  }

  // Extract highs and lows
  const highs = prices.map(p => p.high || p.close || p).filter(v => v !== null && v !== undefined)
  const lows = prices.map(p => p.low || p.close || p).filter(v => v !== null && v !== undefined)

  if (highs.length === 0 || lows.length === 0) {
    return { support: null, resistance: null }
  }

  // Use recent 20% of data for more relevant levels
  const recentHighs = highs.slice(-Math.floor(highs.length * 0.2))
  const recentLows = lows.slice(-Math.floor(lows.length * 0.2))

  // Calculate resistance (recent highs)
  const sortedHighs = [...recentHighs].sort((a, b) => b - a)
  const resistance = sortedHighs[0] // Highest high in recent period

  // Calculate support (recent lows)
  const sortedLows = [...recentLows].sort((a, b) => a - b)
  const support = sortedLows[0] // Lowest low in recent period

  return {
    support: parseFloat(support.toFixed(2)),
    resistance: parseFloat(resistance.toFixed(2))
  }
}

/**
 * Predict market direction based on technical indicators
 * @param {string} symbol - Stock symbol
 * @param {string} exchange - Exchange (NSE/BSE)
 * @returns {Object} Prediction with direction, confidence, and indicators
 */
export const predictDirection = async (symbol, exchange = 'NSE') => {
  console.log(`[Technical Analysis] Predicting direction for ${symbol} (${exchange})...`)
  
  try {
    // Import here to avoid circular dependencies
    const { getStockDataWithHistory } = await import('./stockDataService.js')
    
    // Fetch stock data and historical prices
    const stockData = await getStockDataWithHistory(symbol, exchange, '6mo')
    
    if (!stockData.historicalData || stockData.historicalData.length < 50) {
      throw new Error('Insufficient historical data for technical analysis. Need at least 50 data points.')
    }

    // Extract closing prices
    const closes = stockData.historicalData.map(d => d.close)
    const currentPrice = stockData.currentPrice

    // Calculate technical indicators
    console.log('[Technical Analysis] Calculating RSI...')
    const rsi = calculateRSI(closes, 14)

    console.log('[Technical Analysis] Calculating MACD...')
    const macdData = calculateMACD(closes)

    console.log('[Technical Analysis] Calculating Moving Averages...')
    const movingAverages = calculateMovingAverages(closes, [50, 200])
    const sma50 = movingAverages.sma[50]
    const sma200 = movingAverages.sma[200]

    console.log('[Technical Analysis] Calculating Support/Resistance...')
    const supportResistance = calculateSupportResistance(stockData.historicalData)

    // Combine signals to predict direction
    let bullishSignals = 0
    let bearishSignals = 0
    let totalSignals = 0

    // RSI signals
    if (rsi !== null) {
      totalSignals++
      if (rsi < 30) {
        bullishSignals++ // Oversold - bullish
      } else if (rsi > 70) {
        bearishSignals++ // Overbought - bearish
      } else if (rsi > 50) {
        bullishSignals += 0.5 // Neutral-bullish
      } else {
        bearishSignals += 0.5 // Neutral-bearish
      }
    }

    // MACD signals
    if (macdData.macd !== null) {
      totalSignals++
      if (macdData.macd > 0) {
        bullishSignals++
      } else {
        bearishSignals++
      }
    }

    // Moving Average signals
    if (sma50 !== null && sma200 !== null) {
      totalSignals++
      if (currentPrice > sma50 && sma50 > sma200) {
        bullishSignals++ // Golden cross - bullish
      } else if (currentPrice < sma50 && sma50 < sma200) {
        bearishSignals++ // Death cross - bearish
      } else if (currentPrice > sma50) {
        bullishSignals += 0.5
      } else {
        bearishSignals += 0.5
      }
    }

    // Price vs Support/Resistance
    if (supportResistance.support && supportResistance.resistance) {
      totalSignals++
      const priceRange = supportResistance.resistance - supportResistance.support
      const pricePosition = (currentPrice - supportResistance.support) / priceRange
      
      if (pricePosition > 0.7) {
        bearishSignals++ // Near resistance - bearish
      } else if (pricePosition < 0.3) {
        bullishSignals++ // Near support - bullish
      } else {
        bullishSignals += 0.5 // Mid-range - neutral-bullish
      }
    }

    // Determine direction and confidence
    const bullishScore = (bullishSignals / totalSignals) * 100
    const bearishScore = (bearishSignals / totalSignals) * 100

    let direction = 'neutral'
    let confidence = 50

    if (bullishScore > bearishScore + 10) {
      direction = 'bullish'
      confidence = Math.min(95, Math.max(55, bullishScore))
    } else if (bearishScore > bullishScore + 10) {
      direction = 'bearish'
      confidence = Math.min(95, Math.max(55, bearishScore))
    } else {
      direction = 'neutral'
      confidence = 50
    }

    console.log(`[Technical Analysis] ✓ Prediction: ${direction} (${confidence.toFixed(1)}% confidence)`)

    return {
      symbol: symbol.toUpperCase(),
      exchange,
      direction,
      confidence: parseFloat(confidence.toFixed(1)),
      indicators: {
        rsi: rsi,
        macd: macdData.macd,
        macdSignal: macdData.signal,
        macdHistogram: macdData.histogram,
        sma50: sma50,
        sma200: sma200,
        currentPrice: currentPrice
      },
      support: supportResistance.support,
      resistance: supportResistance.resistance,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error(`[Technical Analysis] ❌ Error predicting direction:`, error.message)
    throw error
  }
}

