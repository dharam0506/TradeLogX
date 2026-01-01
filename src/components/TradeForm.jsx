import { useState, useEffect } from 'react'

const TradeForm = ({ isOpen, onClose, onSave, initialData = null, mode = 'create' }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    symbol: '',
    exchange: 'NSE',
    tradeType: 'long',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    entryDate: '',
    exitDate: '',
    fees: 0,
    emotion: '',
    notes: '',
    tags: '',
    status: 'open'
  })

  // Initialize form data when editing
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        symbol: initialData.symbol || '',
        exchange: initialData.exchange || 'NSE',
        tradeType: initialData.tradeType || 'long',
        entryPrice: initialData.entryPrice || '',
        exitPrice: initialData.exitPrice || '',
        quantity: initialData.quantity || '',
        entryDate: initialData.entryDate ? new Date(initialData.entryDate).toISOString().slice(0, 16) : '',
        exitDate: initialData.exitDate ? new Date(initialData.exitDate).toISOString().slice(0, 16) : '',
        fees: initialData.fees || 0,
        emotion: initialData.emotion || '',
        notes: initialData.notes || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
        status: initialData.status || 'open'
      })
    } else {
      // Reset form for new trade
      setFormData({
        symbol: '',
        exchange: 'NSE',
        tradeType: 'long',
        entryPrice: '',
        exitPrice: '',
        quantity: '',
        entryDate: new Date().toISOString().slice(0, 16),
        exitDate: '',
        fees: 0,
        emotion: '',
        notes: '',
        tags: '',
        status: 'open'
      })
    }
    setError('')
  }, [initialData, mode, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.symbol.trim()) {
      setError('Symbol is required')
      setLoading(false)
      return
    }
    if (!formData.entryPrice || parseFloat(formData.entryPrice) <= 0) {
      setError('Valid entry price is required')
      setLoading(false)
      return
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      setError('Valid quantity is required')
      setLoading(false)
      return
    }
    if (!formData.entryDate) {
      setError('Entry date is required')
      setLoading(false)
      return
    }

    // Prepare data for submission
    const submitData = {
      symbol: formData.symbol.trim().toUpperCase(),
      exchange: formData.exchange,
      tradeType: formData.tradeType,
      entryPrice: parseFloat(formData.entryPrice),
      quantity: parseFloat(formData.quantity),
      entryDate: new Date(formData.entryDate).toISOString(),
      fees: parseFloat(formData.fees) || 0,
      notes: formData.notes.trim(),
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      status: formData.status
    }

    // Add optional fields if provided
    if (formData.exitPrice) {
      submitData.exitPrice = parseFloat(formData.exitPrice)
    }
    if (formData.exitDate) {
      submitData.exitDate = new Date(formData.exitDate).toISOString()
      submitData.status = 'closed'
    }
    if (formData.emotion) {
      submitData.emotion = formData.emotion
    }

    try {
      await onSave(submitData)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save trade. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'edit' ? 'Edit Trade' : 'Add New Trade'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Symbol and Exchange */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Stock Symbol <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="e.g., RELIANCE, TCS, INFY"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Exchange <span className="text-red-400">*</span>
              </label>
              <select
                name="exchange"
                value={formData.exchange}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              >
                <option value="NSE">NSE</option>
                <option value="BSE">BSE</option>
              </select>
            </div>
          </div>

          {/* Trade Type */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Trade Type <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tradeType"
                  value="long"
                  checked={formData.tradeType === 'long'}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-500 border-slate-700 bg-slate-900 focus:ring-blue-500"
                />
                <span className="ml-2 text-slate-300">Long</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tradeType"
                  value="short"
                  checked={formData.tradeType === 'short'}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-500 border-slate-700 bg-slate-900 focus:ring-blue-500"
                />
                <span className="ml-2 text-slate-300">Short</span>
              </label>
            </div>
          </div>

          {/* Entry Price, Exit Price, Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Entry Price (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Exit Price (₹)
              </label>
              <input
                type="number"
                name="exitPrice"
                value={formData.exitPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Quantity <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                step="1"
                min="1"
                placeholder="0"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Entry Date, Exit Date, Fees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Entry Date & Time <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                name="entryDate"
                value={formData.entryDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Exit Date & Time
              </label>
              <input
                type="datetime-local"
                name="exitDate"
                value={formData.exitDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Fees (₹)
              </label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Emotion */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Emotion (for psychology tracking)
            </label>
            <select
              name="emotion"
              value={formData.emotion}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select emotion</option>
              <option value="fear">Fear</option>
              <option value="greed">Greed</option>
              <option value="confidence">Confidence</option>
              <option value="anxiety">Anxiety</option>
              <option value="calm">Calm</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., breakout, swing, intraday"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add your trading notes, strategy, or observations..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                mode === 'edit' ? 'Update Trade' : 'Add Trade'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TradeForm

