import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section id="hero" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full">
            <span className="text-blue-400 text-sm font-semibold">TRADE SMARTER, NOT HARDER</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Indian Stock Market{' '}
            <span className="text-blue-400">Trade Diary with AI</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            Track and analyze your NSE/BSE trades with AI-powered insights. Get intelligent summaries, track psychology, analyze performance, and predict market direction using Google Gemini AI.
          </p>
          
          <div>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Get Started
            </Link>
          </div>
        </div>

        {/* Right Content - Chart Illustration */}
        <div className="relative">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            {/* Chart Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">RELIANCE</span>
                <span className="px-3 py-1 bg-slate-700 text-white rounded text-sm">NSE</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm">+₹15,240</span>
              </div>
            </div>
            
            {/* Days */}
            <div className="flex justify-between mb-2 text-xs text-slate-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>
            
            {/* Chart Area */}
            <div className="relative h-48 bg-slate-900 rounded-lg p-4">
              {/* Chart Line */}
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                <polyline
                  points="0,120 80,100 160,80 240,60 320,40 400,20"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                {/* Data Points */}
                <circle cx="80" cy="100" r="4" fill="#10b981" />
                <circle cx="160" cy="80" r="4" fill="#f59e0b" />
                <circle cx="240" cy="60" r="4" fill="#ec4899" />
              </svg>
            </div>
            
            {/* Chart Labels */}
            <div className="flex justify-between mt-4 text-xs text-slate-400">
              <span>Win Rate</span>
              <span>P/L</span>
              <span>Trades</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero


