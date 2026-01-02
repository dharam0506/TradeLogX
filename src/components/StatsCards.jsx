const StatsCards = ({ stats, loading }) => {
  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '₹0.00'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  // Format percentage
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return '0.00%'
    return `${value.toFixed(2)}%`
  }

  const statCards = [
    {
      label: 'Total P&L',
      value: formatCurrency(stats?.totalPnL),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: stats?.totalPnL >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: stats?.totalPnL >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
      borderColor: stats?.totalPnL >= 0 ? 'border-green-500/50' : 'border-red-500/50'
    },
    {
      label: 'Win Rate',
      value: formatPercentage(stats?.winRate),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/50'
    },
    {
      label: 'Total Trades',
      value: stats?.totalTrades || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/50'
    },
    {
      label: 'Open Positions',
      value: stats?.openPositions || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/50'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-24 mb-4"></div>
            <div className="h-8 bg-slate-700 rounded w-32"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-slate-800 rounded-xl p-6 border ${stat.borderColor} transition-all hover:scale-105 w-full overflow-visible`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </div>
          </div>
          <div className={`${stat.color} w-full overflow-visible`}>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 break-words whitespace-normal">{stat.value}</p>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards

