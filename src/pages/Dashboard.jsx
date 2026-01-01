import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import TradeForm from '../components/TradeForm'
import TradeList from '../components/TradeList'
import PerformanceAnalytics from '../components/PerformanceAnalytics'
import PsychologyTracking from '../components/PsychologyTracking'
import AIPredictionMeter from '../components/AIPredictionMeter'
import { authAPI, tradeAPI, removeToken } from '../utils/api'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trades, setTrades] = useState([])
  const [tradesLoading, setTradesLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTrade, setEditingTrade] = useState(null)
  const [error, setError] = useState('')

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.getCurrentUser()
        if (response.success) {
          setUser(response.data.user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        removeToken()
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  // Fetch trades and stats
  useEffect(() => {
    if (!loading) {
      fetchTrades()
      fetchStats()
    }
  }, [loading])

  const fetchTrades = async () => {
    setTradesLoading(true)
    setError('')
    try {
      const response = await tradeAPI.getAllTrades()
      if (response.success) {
        setTrades(response.data.trades || [])
      }
    } catch (error) {
      console.error('Error fetching trades:', error)
      setError(error.message || 'Failed to load trades')
    } finally {
      setTradesLoading(false)
    }
  }

  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const response = await tradeAPI.getTradeStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const handleAddTrade = () => {
    setEditingTrade(null)
    setIsFormOpen(true)
  }

  const handleEditTrade = (trade) => {
    setEditingTrade(trade)
    setIsFormOpen(true)
  }

  const handleSaveTrade = async (tradeData) => {
    try {
      if (editingTrade) {
        // Update existing trade
        await tradeAPI.updateTrade(editingTrade._id, tradeData)
      } else {
        // Create new trade
        await tradeAPI.createTrade(tradeData)
      }
      // Refresh trades list and stats
      await Promise.all([fetchTrades(), fetchStats()])
      setIsFormOpen(false)
      setEditingTrade(null)
    } catch (error) {
      throw error // Let TradeForm handle the error display
    }
  }

  const handleDeleteTrade = async (tradeId) => {
    try {
      await tradeAPI.deleteTrade(tradeId)
      // Refresh trades list and stats
      await Promise.all([fetchTrades(), fetchStats()])
    } catch (error) {
      alert(error.message || 'Failed to delete trade')
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTrade(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome to Trade Diary
                </h1>
                <p className="text-slate-400">
                  {user?.name ? `Hello, ${user.name}! Track and analyze your Indian stock trades.` : 'Track and analyze your trades'}
                </p>
              </div>
              <button
                onClick={handleAddTrade}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Trade
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Performance Analytics and AI Prediction Meter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PerformanceAnalytics stats={stats} loading={statsLoading} trades={trades} />
            <AIPredictionMeter />
          </div>

          {/* Psychology Tracking */}
          <PsychologyTracking trades={trades} />

          {/* Trade List */}
          <TradeList
            trades={trades}
            loading={tradesLoading}
            onEdit={handleEditTrade}
            onDelete={handleDeleteTrade}
            onRefresh={fetchTrades}
          />
        </div>
      </div>
      <Footer />

      {/* Trade Form Modal */}
      <TradeForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveTrade}
        initialData={editingTrade}
        mode={editingTrade ? 'edit' : 'create'}
      />
    </div>
  )
}

export default Dashboard

