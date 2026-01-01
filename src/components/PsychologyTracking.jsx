import { useState, useEffect } from 'react'
import { tradeAPI } from '../utils/api'

const PsychologyTracking = ({ trades }) => {
  const [psychologyData, setPsychologyData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (trades && trades.length > 0) {
      analyzePsychology()
    }
  }, [trades])

  const analyzePsychology = async () => {
    setLoading(true)
    try {
      // Try to fetch from backend if available
      try {
        const response = await tradeAPI.getPsychologyPatterns()
        if (response.success) {
          setPsychologyData(response.data)
          return
        }
      } catch (error) {
        // If backend endpoint not available, calculate on frontend
        console.log('Backend psychology endpoint not available, calculating on frontend')
      }

      // Frontend calculation
      calculatePsychologyFrontend()
    } catch (error) {
      console.error('Error analyzing psychology:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePsychologyFrontend = () => {
    if (!trades || trades.length === 0) return

    const tradesWithEmotions = trades.filter(t => t.emotion)
    
    // Emotion distribution
    const emotionCounts = {
      fear: 0,
      greed: 0,
      confidence: 0,
      anxiety: 0,
      calm: 0
    }

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
      percentage: totalEmotions > 0 ? (count / totalEmotions * 100).toFixed(1) : 0
    }))

    // Analyze behavior patterns
    const closedTrades = trades.filter(t => t.status === 'closed')
    const sortedTrades = [...closedTrades].sort((a, b) => new Date(a.exitDate) - new Date(b.exitDate))

    // Fear exits (exiting with small profit after a loss)
    let fearExits = 0
    let previousLoss = false
    for (let i = 0; i < sortedTrades.length; i++) {
      const trade = sortedTrades[i]
      if (trade.profitLoss < 0) {
        previousLoss = true
      } else if (previousLoss && trade.profitLoss > 0 && trade.profitLoss < (trade.entryPrice * 0.01)) {
        fearExits++
        previousLoss = false
      }
    }

    // Revenge trading (trading immediately after a loss)
    let revengeTrades = 0
    for (let i = 1; i < sortedTrades.length; i++) {
      const prevTrade = sortedTrades[i - 1]
      const currentTrade = sortedTrades[i]
      const timeDiff = new Date(currentTrade.entryDate) - new Date(prevTrade.exitDate)
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      
      if (prevTrade.profitLoss < 0 && hoursDiff < 24) {
        revengeTrades++
      }
    }

    // Best emotional states for profitable trades
    const emotionPerformance = {}
    closedTrades.forEach(trade => {
      if (trade.emotion && trade.profitLoss !== null && trade.profitLoss !== undefined) {
        if (!emotionPerformance[trade.emotion]) {
          emotionPerformance[trade.emotion] = { totalPnL: 0, count: 0, wins: 0 }
        }
        emotionPerformance[trade.emotion].totalPnL += trade.profitLoss
        emotionPerformance[trade.emotion].count++
        if (trade.profitLoss > 0) {
          emotionPerformance[trade.emotion].wins++
        }
      }
    })

    const bestEmotions = Object.entries(emotionPerformance)
      .map(([emotion, data]) => ({
        emotion,
        avgPnL: data.totalPnL / data.count,
        winRate: (data.wins / data.count * 100).toFixed(1),
        count: data.count
      }))
      .sort((a, b) => b.avgPnL - a.avgPnL)

    setPsychologyData({
      emotionDistribution,
      behaviorPatterns: {
        fearExits,
        revengeTrades,
        totalTradesWithEmotions: totalEmotions
      },
      bestEmotions: bestEmotions.slice(0, 3),
      insights: generateInsights(emotionDistribution, fearExits, revengeTrades, bestEmotions)
    })
  }

  const generateInsights = (emotionDist, fearExits, revengeTrades, bestEmotions) => {
    const insights = []

    if (fearExits > 0) {
      insights.push({
        type: 'warning',
        title: 'Fear Exits Detected',
        message: `You've exited ${fearExits} trades early after losses. Consider holding winning positions longer.`
      })
    }

    if (revengeTrades > 0) {
      insights.push({
        type: 'danger',
        title: 'Revenge Trading Pattern',
        message: `You've made ${revengeTrades} trades within 24 hours after losses. Take time to analyze before trading again.`
      })
    }

    if (bestEmotions.length > 0) {
      insights.push({
        type: 'success',
        title: 'Best Trading Emotion',
        message: `Your most profitable trades come when you're feeling ${bestEmotions[0].emotion}.`
      })
    }

    if (emotionDist.find(e => e.emotion === 'anxiety' && parseFloat(e.percentage) > 30)) {
      insights.push({
        type: 'info',
        title: 'High Anxiety Levels',
        message: 'A significant portion of your trades were made with anxiety. Consider strategies to reduce trading anxiety.'
      })
    }

    return insights
  }

  const getEmotionColor = (emotion) => {
    const colors = {
      fear: 'bg-red-500/20 text-red-400 border-red-500/50',
      greed: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      confidence: 'bg-green-500/20 text-green-400 border-green-500/50',
      anxiety: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      calm: 'bg-blue-500/20 text-blue-400 border-blue-500/50'
    }
    return colors[emotion] || 'bg-slate-700 text-slate-300 border-slate-600'
  }

  const getEmotionLabel = (emotion) => {
    return emotion.charAt(0).toUpperCase() + emotion.slice(1)
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-slate-400">Analyzing psychology patterns...</span>
        </div>
      </div>
    )
  }

  if (!psychologyData || !trades || trades.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">Psychology Tracking</h2>
          <p className="text-slate-400">Track emotions and behavioral patterns in your trading</p>
        </div>
        <div className="text-center py-8 text-slate-400">
          Add trades with emotion tags to see psychology analysis
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Psychology Tracking</h2>
        <p className="text-slate-400">Track emotions and identify behavioral patterns</p>
      </div>

      {/* Emotion Distribution */}
      {psychologyData.emotionDistribution && psychologyData.emotionDistribution.length > 0 && (
        <div className="mb-6 bg-slate-900 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Emotion Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {psychologyData.emotionDistribution.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getEmotionColor(item.emotion)}`}
              >
                <div className="text-2xl font-bold mb-1">{item.percentage}%</div>
                <div className="text-sm font-medium mb-1">{getEmotionLabel(item.emotion)}</div>
                <div className="text-xs opacity-75">{item.count} trades</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Behavior Patterns */}
      <div className="mb-6 bg-slate-900 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Behavior Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800 rounded-lg border border-orange-500/50">
            <div className="text-sm text-orange-400 mb-2">Fear Exits</div>
            <div className="text-2xl font-bold text-white">{psychologyData.behaviorPatterns.fearExits}</div>
            <div className="text-xs text-slate-400 mt-1">Exiting early after losses</div>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg border border-red-500/50">
            <div className="text-sm text-red-400 mb-2">Revenge Trading</div>
            <div className="text-2xl font-bold text-white">{psychologyData.behaviorPatterns.revengeTrades}</div>
            <div className="text-xs text-slate-400 mt-1">Trades within 24h after loss</div>
          </div>
        </div>
      </div>

      {/* Best Emotional States */}
      {psychologyData.bestEmotions && psychologyData.bestEmotions.length > 0 && (
        <div className="mb-6 bg-slate-900 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Best Trading Emotions</h3>
          <div className="space-y-3">
            {psychologyData.bestEmotions.map((emotion, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getEmotionColor(emotion.emotion)}`}>
                    {getEmotionLabel(emotion.emotion)}
                  </span>
                  <span className="text-slate-400 text-sm">{emotion.count} trades</span>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${emotion.avgPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(emotion.avgPnL)}
                  </div>
                  <div className="text-xs text-slate-400">Avg P&L • {emotion.winRate}% win rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {psychologyData.insights && psychologyData.insights.length > 0 && (
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Insights & Recommendations</h3>
          <div className="space-y-3">
            {psychologyData.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === 'success' ? 'bg-green-500/10 border-green-500/50' :
                  insight.type === 'danger' ? 'bg-red-500/10 border-red-500/50' :
                  insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/50' :
                  'bg-blue-500/10 border-blue-500/50'
                }`}
              >
                <div className={`font-semibold mb-1 ${
                  insight.type === 'success' ? 'text-green-400' :
                  insight.type === 'danger' ? 'text-red-400' :
                  insight.type === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'
                }`}>
                  {insight.title}
                </div>
                <div className="text-slate-300 text-sm">{insight.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PsychologyTracking

