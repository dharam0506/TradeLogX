/**
 * Psychology Analysis Service
 * Analyzes trading psychology patterns, emotions, and behavioral patterns
 */

/**
 * Analyze emotion distribution from user trades
 * @param {Array} userTrades - Array of user's trades
 * @returns {Object} Emotion distribution data
 */
export const analyzeEmotionPatterns = (userTrades) => {
  console.log('[Psychology Service] Analyzing emotion patterns...')
  
  if (!userTrades || userTrades.length === 0) {
    return {
      emotionDistribution: [],
      totalTradesWithEmotions: 0
    }
  }

  // Filter trades with emotions
  const tradesWithEmotions = userTrades.filter(t => t.emotion && t.emotion !== '')
  
  // Initialize emotion counts
  const emotionCounts = {
    fear: 0,
    greed: 0,
    confidence: 0,
    anxiety: 0,
    calm: 0
  }

  // Count emotions
  tradesWithEmotions.forEach(trade => {
    if (emotionCounts.hasOwnProperty(trade.emotion)) {
      emotionCounts[trade.emotion]++
    }
  })

  const totalEmotions = tradesWithEmotions.length

  // Calculate emotion percentages
  const emotionDistribution = Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count,
    percentage: totalEmotions > 0 ? parseFloat((count / totalEmotions * 100).toFixed(1)) : '0.0'
  }))

  console.log(`[Psychology Service] Found ${totalEmotions} trades with emotions`)

  return {
    emotionDistribution,
    totalTradesWithEmotions: totalEmotions
  }
}

/**
 * Identify behavioral patterns in trading
 * @param {Array} userTrades - Array of user's trades
 * @returns {Object} Behavioral patterns data
 */
export const identifyBehaviorPatterns = (userTrades) => {
  console.log('[Psychology Service] Identifying behavior patterns...')
  
  if (!userTrades || userTrades.length === 0) {
    return {
      fearExits: 0,
      revengeTrades: 0,
      overtradingPatterns: 0,
      bestEmotionalState: null
    }
  }

  // Get closed trades sorted by exit date
  const closedTrades = userTrades.filter(t => t.status === 'closed' && t.exitDate)
  const sortedTrades = [...closedTrades].sort((a, b) => new Date(a.exitDate) - new Date(b.exitDate))

  // 1. Fear exits - Exiting with small profit after a loss (too early exits)
  let fearExits = 0
  let previousLoss = false
  for (let i = 0; i < sortedTrades.length; i++) {
    const trade = sortedTrades[i]
    const profitLoss = trade.profitLoss || 0
    
    if (profitLoss < 0) {
      previousLoss = true
    } else if (previousLoss && profitLoss > 0) {
      // Check if this is a small profit exit (less than 1% of entry price)
      const profitPercent = (profitLoss / (trade.entryPrice * trade.quantity)) * 100
      if (profitPercent < 1.0 && profitPercent > 0) {
        fearExits++
      }
      previousLoss = false
    }
  }

  // 2. Revenge trading - Trading immediately after a loss (within 24 hours)
  let revengeTrades = 0
  let revengeTradePairs = []
  
  for (let i = 1; i < sortedTrades.length; i++) {
    const prevTrade = sortedTrades[i - 1]
    const currentTrade = sortedTrades[i]
    
    if (prevTrade.exitDate && currentTrade.entryDate) {
      const timeDiff = new Date(currentTrade.entryDate) - new Date(prevTrade.exitDate)
      const hoursDiff = timeDiff / (1000 * 60 * 60) // Convert to hours
      
      const prevProfitLoss = prevTrade.profitLoss || 0
      
      // Revenge trade: trading within 24 hours after a loss
      if (prevProfitLoss < 0 && hoursDiff < 24 && hoursDiff >= 0) {
        revengeTrades++
        revengeTradePairs.push({
          previousTrade: prevTrade.symbol,
          currentTrade: currentTrade.symbol,
          hoursAfter: Math.round(hoursDiff * 10) / 10
        })
      }
    }
  }

  // 3. Overtrading patterns - Too many trades in a short period
  let overtradingPatterns = 0
  const tradesByDate = {}
  
  userTrades.forEach(trade => {
    if (trade.entryDate) {
      const date = new Date(trade.entryDate).toDateString()
      if (!tradesByDate[date]) {
        tradesByDate[date] = []
      }
      tradesByDate[date].push(trade)
    }
  })
  
  // Check for days with 5+ trades (overtrading)
  Object.entries(tradesByDate).forEach(([date, trades]) => {
    if (trades.length >= 5) {
      overtradingPatterns++
    }
  })

  // 4. Best emotional state for profitable trades
  const emotionPerformance = {}
  closedTrades.forEach(trade => {
    if (trade.emotion && trade.emotion !== '' && trade.profitLoss !== null && trade.profitLoss !== undefined) {
      if (!emotionPerformance[trade.emotion]) {
        emotionPerformance[trade.emotion] = {
          totalPnL: 0,
          count: 0,
          wins: 0,
          losses: 0
        }
      }
      emotionPerformance[trade.emotion].totalPnL += trade.profitLoss
      emotionPerformance[trade.emotion].count++
      if (trade.profitLoss > 0) {
        emotionPerformance[trade.emotion].wins++
      } else if (trade.profitLoss < 0) {
        emotionPerformance[trade.emotion].losses++
      }
    }
  })

  // Calculate best emotional state
  let bestEmotionalState = null
  let bestAvgPnL = -Infinity
  
  Object.entries(emotionPerformance).forEach(([emotion, data]) => {
    const avgPnL = data.totalPnL / data.count
    if (avgPnL > bestAvgPnL && data.count >= 2) { // At least 2 trades for statistical significance
      bestAvgPnL = avgPnL
      bestEmotionalState = {
        emotion,
        avgPnL: parseFloat(avgPnL.toFixed(2)),
        winRate: parseFloat(((data.wins / data.count) * 100).toFixed(1)),
        count: data.count,
        totalPnL: parseFloat(data.totalPnL.toFixed(2))
      }
    }
  })

  // Get top 3 emotions by average P&L
  const bestEmotions = Object.entries(emotionPerformance)
    .map(([emotion, data]) => ({
      emotion,
      avgPnL: parseFloat((data.totalPnL / data.count).toFixed(2)),
      winRate: parseFloat(((data.wins / data.count) * 100).toFixed(1)),
      count: data.count,
      totalPnL: parseFloat(data.totalPnL.toFixed(2))
    }))
    .filter(e => e.count >= 2) // At least 2 trades
    .sort((a, b) => b.avgPnL - a.avgPnL)
    .slice(0, 3)

  console.log(`[Psychology Service] Patterns found - Fear exits: ${fearExits}, Revenge trades: ${revengeTrades}, Overtrading: ${overtradingPatterns}`)

  return {
    fearExits,
    revengeTrades,
    revengeTradePairs,
    overtradingPatterns,
    bestEmotionalState,
    bestEmotions
  }
}

/**
 * Generate psychology insights and recommendations
 * @param {Array} userTrades - Array of user's trades
 * @param {Object} emotionPatterns - Results from analyzeEmotionPatterns
 * @param {Object} behaviorPatterns - Results from identifyBehaviorPatterns
 * @returns {Array} Array of insight objects
 */
export const getPsychologyInsights = (userTrades, emotionPatterns, behaviorPatterns) => {
  console.log('[Psychology Service] Generating psychology insights...')
  
  const insights = []

  // Insight 1: Fear exits
  if (behaviorPatterns.fearExits > 0) {
    insights.push({
      type: 'warning',
      title: 'Fear Exits Detected',
      message: `You've exited ${behaviorPatterns.fearExits} trade(s) early after losses, taking small profits when you should hold. This suggests fear-based decision making. Consider trusting your analysis and letting winning trades run.`,
      severity: behaviorPatterns.fearExits > 3 ? 'high' : 'medium'
    })
  }

  // Insight 2: Revenge trading
  if (behaviorPatterns.revengeTrades > 0) {
    insights.push({
      type: 'danger',
      title: 'Revenge Trading Pattern Detected',
      message: `You've made ${behaviorPatterns.revengeTrades} trade(s) within 24 hours after losses. Revenge trading often leads to more losses. Take time to analyze and cool down before trading again after a loss.`,
      severity: behaviorPatterns.revengeTrades > 2 ? 'high' : 'medium'
    })
  }

  // Insight 3: Overtrading
  if (behaviorPatterns.overtradingPatterns > 0) {
    insights.push({
      type: 'warning',
      title: 'Overtrading Detected',
      message: `You've had ${behaviorPatterns.overtradingPatterns} day(s) with 5 or more trades. Quality over quantity - focus on high-probability setups rather than frequent trading.`,
      severity: 'medium'
    })
  }

  // Insight 4: Best emotional state
  if (behaviorPatterns.bestEmotionalState) {
    insights.push({
      type: 'success',
      title: 'Your Best Trading Emotion',
      message: `Your most profitable trades occur when you're feeling ${behaviorPatterns.bestEmotionalState.emotion} (avg P&L: ₹${behaviorPatterns.bestEmotionalState.avgPnL}, win rate: ${behaviorPatterns.bestEmotionalState.winRate}%). Try to cultivate this emotional state before trading.`,
      severity: 'low'
    })
  }

  // Insight 5: High anxiety levels
  const anxietyTrade = emotionPatterns.emotionDistribution?.find(e => e.emotion === 'anxiety')
  if (anxietyTrade && parseFloat(anxietyTrade.percentage) > 30) {
    insights.push({
      type: 'info',
      title: 'High Anxiety Levels',
      message: `${anxietyTrade.percentage}% of your trades were made with anxiety. High anxiety often leads to poor decisions. Consider meditation, reducing position sizes, or taking breaks when feeling anxious.`,
      severity: 'medium'
    })
  }

  // Insight 6: High greed levels
  const greedTrade = emotionPatterns.emotionDistribution?.find(e => e.emotion === 'greed')
  if (greedTrade && parseFloat(greedTrade.percentage) > 30) {
    insights.push({
      type: 'warning',
      title: 'High Greed Levels',
      message: `${greedTrade.percentage}% of your trades were made with greed. Greed can lead to overtrading and ignoring risk management. Stick to your trading plan regardless of emotions.`,
      severity: 'medium'
    })
  }

  // Insight 7: Best emotions performance
  if (behaviorPatterns.bestEmotions && behaviorPatterns.bestEmotions.length > 0) {
    const topEmotion = behaviorPatterns.bestEmotions[0]
    if (topEmotion.avgPnL > 0) {
      insights.push({
        type: 'success',
        title: 'Emotional Performance Analysis',
        message: `Top performing emotion: ${topEmotion.emotion} with average P&L of ₹${topEmotion.avgPnL} and ${topEmotion.winRate}% win rate across ${topEmotion.count} trades.`,
        severity: 'low'
      })
    }
  }

  // Insight 8: No emotions tracked
  if (emotionPatterns.totalTradesWithEmotions === 0 && userTrades.length > 0) {
    insights.push({
      type: 'info',
      title: 'Start Tracking Emotions',
      message: 'You haven\'t tracked emotions for your trades yet. Adding emotion tags to your trades will help identify psychological patterns and improve your trading performance.',
      severity: 'low'
    })
  }

  console.log(`[Psychology Service] Generated ${insights.length} insights`)
  
  return insights
}

/**
 * Main function to analyze all psychology aspects
 * @param {Array} userTrades - Array of user's trades
 * @returns {Object} Complete psychology analysis
 */
export const analyzePsychology = (userTrades) => {
  console.log(`[Psychology Service] Starting comprehensive psychology analysis for ${userTrades?.length || 0} trades...`)
  
  if (!userTrades || userTrades.length === 0) {
    return {
      emotionDistribution: [],
      behaviorPatterns: {
        fearExits: 0,
        revengeTrades: 0,
        overtradingPatterns: 0,
        totalTradesWithEmotions: 0
      },
      bestEmotions: [],
      insights: []
    }
  }

  // Analyze emotion patterns
  const emotionPatterns = analyzeEmotionPatterns(userTrades)
  
  // Identify behavior patterns
  const behaviorPatterns = identifyBehaviorPatterns(userTrades)
  
  // Generate insights
  const insights = getPsychologyInsights(userTrades, emotionPatterns, behaviorPatterns)

  // Combine all results
  const result = {
    emotionDistribution: emotionPatterns.emotionDistribution,
    behaviorPatterns: {
      fearExits: behaviorPatterns.fearExits,
      revengeTrades: behaviorPatterns.revengeTrades,
      overtradingPatterns: behaviorPatterns.overtradingPatterns,
      totalTradesWithEmotions: emotionPatterns.totalTradesWithEmotions
    },
    bestEmotions: behaviorPatterns.bestEmotions || [],
    bestEmotionalState: behaviorPatterns.bestEmotionalState,
    insights
  }

  console.log('[Psychology Service] ✓ Analysis completed successfully')
  
  return result
}

