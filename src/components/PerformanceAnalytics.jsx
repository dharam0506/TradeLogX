import { useState, useEffect } from 'react'
import StatsCards from './StatsCards'
import { tradeAPI } from '../utils/api'

const PerformanceAnalytics = ({ stats, loading, trades }) => {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  useEffect(() => {
    if (trades && trades.length > 0) {
      calculateAnalytics()
    }
  }, [trades])

  const calculateAnalytics = () => {
    if (!trades || trades.length === 0) return

    // Calculate win/loss distribution
    const closedTrades = trades.filter(t => t.status === 'closed' && t.profitLoss !== null && t.profitLoss !== undefined)
    const wins = closedTrades.filter(t => t.profitLoss > 0).length
    const losses = closedTrades.filter(t => t.profitLoss < 0).length
    const breakeven = closedTrades.filter(t => t.profitLoss === 0).length

    // Calculate performance by stock
    const stockPerformance = {}
    trades.forEach(trade => {
      if (trade.status === 'closed' && trade.profitLoss !== null && trade.profitLoss !== undefined) {
        if (!stockPerformance[trade.symbol]) {
          stockPerformance[trade.symbol] = { symbol: trade.symbol, pnl: 0, count: 0 }
        }
        stockPerformance[trade.symbol].pnl += trade.profitLoss
        stockPerformance[trade.symbol].count += 1
      }
    })

    // Sort stocks by P&L
    const sortedStocks = Object.values(stockPerformance)
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 10) // Top 10

    // Calculate equity curve (cumulative P&L over time)
    const equityCurve = []
    let cumulativePnL = 0
    const sortedTrades = [...trades]
      .filter(t => t.status === 'closed' && t.exitDate)
      .sort((a, b) => new Date(a.exitDate) - new Date(b.exitDate))
    
    sortedTrades.forEach(trade => {
      cumulativePnL += trade.profitLoss || 0
      equityCurve.push({
        date: new Date(trade.exitDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        pnl: cumulativePnL,
        dateValue: new Date(trade.exitDate)
      })
    })

    setAnalyticsData({
      winLossDistribution: { wins, losses, breakeven },
      stockPerformance: sortedStocks,
      equityCurve,
      strengths: sortedStocks.filter(s => s.pnl > 0).slice(0, 5),
      weaknesses: sortedStocks.filter(s => s.pnl < 0).slice(-5).reverse()
    })
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Performance Analytics</h2>
        <p className="text-slate-400">Track your trading performance metrics and insights</p>
      </div>

      {/* Statistics Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Charts Section - Will be enhanced with recharts in full implementation */}
      {analyticsData && trades.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* Win/Loss Distribution */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Win/Loss Distribution</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/50">
                <div className="text-3xl font-bold text-green-400 mb-1">{analyticsData.winLossDistribution.wins}</div>
                <div className="text-slate-400 text-sm">Winning Trades</div>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/50">
                <div className="text-3xl font-bold text-red-400 mb-1">{analyticsData.winLossDistribution.losses}</div>
                <div className="text-slate-400 text-sm">Losing Trades</div>
              </div>
              <div className="text-center p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="text-3xl font-bold text-slate-300 mb-1">{analyticsData.winLossDistribution.breakeven}</div>
                <div className="text-slate-400 text-sm">Breakeven</div>
              </div>
            </div>
          </div>

          {/* Performance by Stock */}
          {analyticsData.stockPerformance.length > 0 && (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Performance by Stock</h3>
              <div className="space-y-2">
                {analyticsData.stockPerformance.slice(0, 5).map((stock, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">{stock.symbol}</span>
                      <span className="text-slate-400 text-sm">({stock.count} trades)</span>
                    </div>
                    <span className={`font-bold ${stock.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(stock.pnl)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            {analyticsData.strengths.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-green-400 mb-4">💰 Strengths</h3>
                <ul className="space-y-2">
                  {analyticsData.strengths.map((stock, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                      <span className="text-white">{stock.symbol}</span>
                      <span className="text-green-400 font-semibold">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(stock.pnl)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {analyticsData.weaknesses.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Weaknesses</h3>
                <ul className="space-y-2">
                  {analyticsData.weaknesses.map((stock, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                      <span className="text-white">{stock.symbol}</span>
                      <span className="text-red-400 font-semibold">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(stock.pnl)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {trades.length === 0 && !loading && (
        <div className="mt-6 text-center py-8 text-slate-400">
          Add some trades to see performance analytics
        </div>
      )}
    </div>
  )
}

export default PerformanceAnalytics

