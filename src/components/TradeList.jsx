import { useState } from 'react'
import AISummarizer from './AISummarizer'

const TradeList = ({ trades, loading, onEdit, onDelete, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterExchange, setFilterExchange] = useState('all')
  const [searchSymbol, setSearchSymbol] = useState('')

  // Filter trades
  const filteredTrades = trades.filter(trade => {
    if (filterStatus !== 'all' && trade.status !== filterStatus) return false
    if (filterExchange !== 'all' && trade.exchange !== filterExchange) return false
    if (searchSymbol && !trade.symbol.toLowerCase().includes(searchSymbol.toLowerCase())) return false
    return true
  })

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate P&L color
  const getPnLColor = (pnl) => {
    if (!pnl && pnl !== 0) return 'text-slate-400'
    return pnl >= 0 ? 'text-green-400' : 'text-red-400'
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-slate-400">Loading trades...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700">
      {/* Header with Filters */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">My Trades</h2>
          
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by symbol..."
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            
            {/* Exchange Filter */}
            <select
              value={filterExchange}
              onChange={(e) => setFilterExchange(e.target.value)}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Exchanges</option>
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trades Table */}
      {filteredTrades.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No trades found</h3>
          <p className="text-slate-400">
            {trades.length === 0 
              ? "Start by adding your first trade using the 'Add Trade' button above."
              : "No trades match your current filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Symbol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Exchange</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Entry</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Exit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Qty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">P&L</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredTrades.map((trade) => (
                <tr key={trade._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{trade.symbol}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm">
                      {trade.exchange}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      trade.tradeType === 'long' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.tradeType.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">{formatCurrency(trade.entryPrice)}</td>
                  <td className="px-6 py-4 text-white">
                    {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                  </td>
                  <td className="px-6 py-4 text-white">{trade.quantity}</td>
                  <td className={`px-6 py-4 font-semibold ${getPnLColor(trade.profitLoss)}`}>
                    {trade.profitLoss !== null && trade.profitLoss !== undefined 
                      ? formatCurrency(trade.profitLoss) 
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      trade.status === 'open' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {trade.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {formatDate(trade.entryDate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <AISummarizer trade={trade} />
                      <button
                        onClick={() => onEdit(trade)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Edit trade"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this trade?')) {
                            onDelete(trade._id)
                          }
                        }}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete trade"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TradeList

