import { useState } from 'react'
import { marketAPI } from '../utils/api'

const AIPredictionMeter = () => {
  const [symbol, setSymbol] = useState('')
  const [exchange, setExchange] = useState('NSE')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePredict = async (e) => {
    e.preventDefault()
    if (!symbol.trim()) {
      setError('Please enter a stock symbol')
      return
    }

    setLoading(true)
    setError('')
    setPrediction(null)

    try {
      const response = await marketAPI.getPrediction(symbol.trim().toUpperCase(), exchange)
      if (response.success) {
        setPrediction(response.data)
      }
    } catch (err) {
      setError(err.message || 'Failed to get prediction. Please try again.')
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPredictionColor = (direction) => {
    if (!direction) return 'text-slate-400'
    return direction.toLowerCase() === 'bullish' ? 'text-green-400' : 'text-red-400'
  }

  const getPredictionBgColor = (direction) => {
    if (!direction) return 'bg-slate-700'
    return direction.toLowerCase() === 'bullish' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return 'text-green-400'
    if (confidence >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">AI Prediction Meter</h2>
        <p className="text-slate-400">Get bullish/bearish predictions for Indian stocks</p>
      </div>

      {/* Input Form */}
      <form onSubmit={handlePredict} className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., RELIANCE, TCS, INFY)"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-full md:w-32">
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading || !symbol.trim()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Get Prediction'
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Prediction Result */}
      {prediction && (
        <div className="space-y-6">
          {/* Prediction Meter */}
          <div className={`bg-slate-900 rounded-lg p-8 border-2 ${getPredictionBgColor(prediction.direction)}`}>
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-xl text-slate-400 mb-2">{prediction.symbol} ({prediction.exchange})</h3>
                <div className={`text-5xl font-bold mb-2 ${getPredictionColor(prediction.direction)}`}>
                  {prediction.direction?.toUpperCase() || 'NEUTRAL'}
                </div>
                <div className={`text-3xl font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                  {prediction.confidence}% Confidence
                </div>
              </div>

              {/* Visual Gauge */}
              <div className="relative w-full h-4 bg-slate-700 rounded-full overflow-hidden mt-6">
                <div
                  className={`h-full transition-all duration-500 ${
                    prediction.direction?.toLowerCase() === 'bullish' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Technical Indicators */}
          {prediction.indicators && (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Technical Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* RSI */}
                {prediction.indicators.rsi !== undefined && (
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">RSI (14)</div>
                    <div className="text-2xl font-bold text-white">{prediction.indicators.rsi.toFixed(2)}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {prediction.indicators.rsi > 70 ? 'Overbought' : prediction.indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
                    </div>
                  </div>
                )}

                {/* MACD */}
                {prediction.indicators.macd !== undefined && (
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">MACD</div>
                    <div className={`text-2xl font-bold ${prediction.indicators.macd > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {prediction.indicators.macd > 0 ? '+' : ''}{prediction.indicators.macd.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {prediction.indicators.macd > 0 ? 'Bullish' : 'Bearish'} signal
                    </div>
                  </div>
                )}

                {/* Moving Averages */}
                {prediction.indicators.sma50 && prediction.indicators.sma200 && (
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Moving Averages</div>
                    <div className="text-sm text-white mb-1">SMA 50: ₹{prediction.indicators.sma50.toFixed(2)}</div>
                    <div className="text-sm text-white">SMA 200: ₹{prediction.indicators.sma200.toFixed(2)}</div>
                    <div className={`text-xs mt-1 ${prediction.indicators.sma50 > prediction.indicators.sma200 ? 'text-green-400' : 'text-red-400'}`}>
                      {prediction.indicators.sma50 > prediction.indicators.sma200 ? 'Bullish' : 'Bearish'} trend
                    </div>
                  </div>
                )}

                {/* Current Price */}
                {prediction.indicators.currentPrice && (
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Current Price</div>
                    <div className="text-2xl font-bold text-white">
                      ₹{prediction.indicators.currentPrice.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Support & Resistance */}
          {prediction.support && prediction.resistance && (
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Support & Resistance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Support Level</div>
                  <div className="text-2xl font-bold text-green-400">₹{prediction.support.toFixed(2)}</div>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Resistance Level</div>
                  <div className="text-2xl font-bold text-red-400">₹{prediction.resistance.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!prediction && !loading && (
        <div className="text-center py-8 text-slate-400">
          Enter a stock symbol to get AI-powered market predictions
        </div>
      )}
    </div>
  )
}

export default AIPredictionMeter

