import { useState, useEffect } from 'react'
import { 
  LineChart, Line, BarChart, Bar, Cell, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts'
import StatsCards from './StatsCards'
import { tradeAPI } from '../utils/api'

const PerformanceAnalytics = ({ stats, loading, trades }) => {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (trades && trades.length > 0) {
      fetchAnalytics()
    } else {
      setAnalyticsData(null)
    }
  }, [trades])

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    setError('')
    try {
      // Fetch from backend API
      const response = await tradeAPI.getAnalyticsInsights()
      if (response.success && response.data) {
        setAnalyticsData(response.data)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Error fetching analytics insights:', error)
      setError(error.message || 'Failed to load analytics insights. Please try again.')
      // Fallback to frontend calculation if backend fails
      if (trades && trades.length > 0) {
        calculateAnalyticsFrontend()
      }
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const calculateAnalyticsFrontend = () => {
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
      .slice(0, 10)

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
      weaknesses: sortedStocks.filter(s => s.pnl < 0).slice(-5).reverse(),
      insights: []
    })
  }

  // Prepare data for Performance by Stock Bar Chart
  const stockChartData = analyticsData?.stockPerformance 
    ? analyticsData.stockPerformance.slice(0, 10).map(stock => ({
        symbol: stock.symbol,
        pnl: stock.pnl,
        count: stock.count || 0
      }))
    : []

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Performance Analytics</h2>
        <p className="text-slate-400">Track your trading performance metrics and insights</p>
      </div>

      {/* Statistics Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Loading State */}
      {analyticsLoading && (
        <div className="mt-8 text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 mt-2">Loading analytics...</p>
        </div>
      )}

      {/* Error State */}
      {error && !analyticsLoading && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Charts Section */}
      {analyticsData && !analyticsLoading && trades.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* Equity Curve Chart */}
          {analyticsData.equityCurve && analyticsData.equityCurve.length > 0 && (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Equity Curve</h3>
              <p className="text-slate-400 text-sm mb-4">Cumulative P&L over time</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value) => [
                      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value),
                      'Cumulative P&L'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Win/Loss Distribution */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Win/Loss Distribution</h3>
            {analyticsData.winLossDistribution && (
              analyticsData.winLossDistribution.wins > 0 || 
              analyticsData.winLossDistribution.losses > 0 || 
              analyticsData.winLossDistribution.breakeven > 0
            ) ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/50">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {analyticsData.winLossDistribution.wins}
                  </div>
                  <div className="text-slate-400 text-sm">Winning Trades</div>
                </div>
                <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/50">
                  <div className="text-3xl font-bold text-red-400 mb-1">
                    {analyticsData.winLossDistribution.losses}
                  </div>
                  <div className="text-slate-400 text-sm">Losing Trades</div>
                </div>
                <div className="text-center p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="text-3xl font-bold text-slate-300 mb-1">
                    {analyticsData.winLossDistribution.breakeven}
                  </div>
                  <div className="text-slate-400 text-sm">Breakeven</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                No closed trades to display
              </div>
            )}
          </div>

          {/* Performance by Stock */}
          {stockChartData.length > 0 && (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Performance by Stock</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    type="number"
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="symbol" 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value, name) => [
                      name === 'pnl' 
                        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)
                        : value,
                      name === 'pnl' ? 'Total P&L' : 'Trades'
                    ]}
                  />
                  <Bar 
                    dataKey="pnl" 
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                  >
                    {stockChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Stock List */}
              <div className="mt-4 space-y-2">
                {analyticsData.stockPerformance.slice(0, 5).map((stock, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">{stock.symbol}</span>
                      <span className="text-slate-400 text-sm">({stock.count || 0} trades)</span>
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
            {analyticsData.strengths && analyticsData.strengths.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-green-400 mb-4">💰 Strengths</h3>
                <ul className="space-y-3">
                  {analyticsData.strengths.map((strength, index) => (
                    <li key={index} className="p-3 bg-slate-800 rounded-lg border border-green-500/20">
                      <div className="font-semibold text-white mb-1">{strength.title || strength.symbol}</div>
                      <div className="text-slate-400 text-sm">{strength.description || `P&L: ₹${strength.pnl?.toFixed(2) || 0}`}</div>
                      {strength.category && (
                        <div className="mt-2">
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                            {strength.category}
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {analyticsData.weaknesses && analyticsData.weaknesses.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Weaknesses</h3>
                <ul className="space-y-3">
                  {analyticsData.weaknesses.map((weakness, index) => (
                    <li key={index} className="p-3 bg-slate-800 rounded-lg border border-red-500/20">
                      <div className="font-semibold text-white mb-1">{weakness.title || weakness.symbol}</div>
                      <div className="text-slate-400 text-sm mb-2">{weakness.description || `P&L: ₹${weakness.pnl?.toFixed(2) || 0}`}</div>
                      {weakness.recommendation && (
                        <div className="text-xs text-blue-400 italic mb-2">
                          💡 {weakness.recommendation}
                        </div>
                      )}
                      {weakness.category && (
                        <div>
                          <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                            {weakness.category}
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Insights and Recommendations */}
          {analyticsData.insights && analyticsData.insights.length > 0 && (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">💡 Insights & Recommendations</h3>
              <div className="space-y-3">
                {analyticsData.insights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${
                      insight.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/50' 
                        : insight.type === 'warning'
                        ? 'bg-yellow-500/10 border-yellow-500/50'
                        : insight.type === 'danger'
                        ? 'bg-red-500/10 border-red-500/50'
                        : 'bg-blue-500/10 border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`text-2xl ${
                        insight.type === 'success' 
                          ? 'text-green-400' 
                          : insight.type === 'warning'
                          ? 'text-yellow-400'
                          : insight.type === 'danger'
                          ? 'text-red-400'
                          : 'text-blue-400'
                      }`}>
                        {insight.type === 'success' ? '✅' : 
                         insight.type === 'warning' ? '⚠️' : 
                         insight.type === 'danger' ? '🚨' : 'ℹ️'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">{insight.title}</div>
                        <div className="text-slate-300 text-sm">{insight.message}</div>
                        {insight.action && (
                          <div className="mt-2 text-xs text-blue-400 italic">
                            → {insight.action}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {trades.length === 0 && !loading && !analyticsLoading && (
        <div className="mt-6 text-center py-8 text-slate-400">
          Add some trades to see performance analytics
        </div>
      )}
    </div>
  )
}

export default PerformanceAnalytics
