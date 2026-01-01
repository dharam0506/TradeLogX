import { useState } from 'react'
import { tradeAPI } from '../utils/api'

const AISummarizer = ({ trade, onAnalysisComplete }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [analysis, setAnalysis] = useState(trade.aiAnalysis || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setLoading(true)
    setError('')
    setIsOpen(true)

    try {
      const response = await tradeAPI.analyzeTrade(trade._id)
      if (response.success) {
        setAnalysis(response.data.analysis)
        if (onAnalysisComplete) {
          onAnalysisComplete(response.data.analysis)
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze trade. Please try again.')
      console.error('AI Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setError('')
  }

  return (
    <>
      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
        title="Analyze trade with AI"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>

      {/* Analysis Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">AI Trade Analysis</h2>
                <p className="text-slate-400 text-sm mt-1">
                  {trade.symbol} ({trade.exchange}) - {trade.tradeType.toUpperCase()}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white transition-colors"
                disabled={loading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-slate-400">AI is analyzing your trade...</p>
                  <p className="text-slate-500 text-sm mt-2">This may take a few seconds</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {!loading && analysis && (
                <div className="space-y-6">
                  {/* Analysis Summary */}
                  {analysis.summary && (
                    <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Summary
                      </h3>
                      <p className="text-slate-300 whitespace-pre-wrap">{analysis.summary}</p>
                    </div>
                  )}

                  {/* Patterns */}
                  {analysis.patterns && analysis.patterns.length > 0 && (
                    <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        Patterns Identified
                      </h3>
                      <ul className="space-y-2">
                        {analysis.patterns.map((pattern, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300">
                            <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span>{pattern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Strengths */}
                  {analysis.strengths && analysis.strengths.length > 0 && (
                    <div className="bg-slate-900 rounded-lg p-6 border border-green-500/50">
                      <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300">
                            <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                    <div className="bg-slate-900 rounded-lg p-6 border border-red-500/50">
                      <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300">
                            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Insights */}
                  {analysis.insights && (
                    <div className="bg-slate-900 rounded-lg p-6 border border-blue-500/50">
                      <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Key Insights
                      </h3>
                      <p className="text-slate-300 whitespace-pre-wrap">{analysis.insights}</p>
                    </div>
                  )}
                </div>
              )}

              {!loading && !analysis && !error && (
                <div className="text-center py-12 text-slate-400">
                  Click "Analyze Trade" to get AI-powered insights
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AISummarizer

