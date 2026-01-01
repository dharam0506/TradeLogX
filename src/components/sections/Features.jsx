const Features = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI Summarizer',
      description: 'Analyze your trades using Google Gemini AI to get instant insights and patterns.',
      points: [
        'Auto-generated trade summaries',
        'AI-powered pattern recognition',
        'Strength & weakness detection',
        'Actionable insights in plain English'
      ]
    },
    {
      icon: '🧠',
      title: 'Psychology Tracking',
      description: 'Track emotions and identify behavioral patterns in your trading.',
      points: [
        'Emotion tagging for trades',
        'Behavioral pattern analysis',
        'Identify fear exits & revenge trading',
        'Review mindset trends'
      ]
    },
    {
      icon: '📊',
      title: 'Performance Analytics',
      description: 'Analyze strengths, weaknesses, and performance metrics.',
      points: [
        'Win rate and profit factor',
        'Best & worst performing stocks',
        'Performance by strategy',
        'Equity curve visualization'
      ]
    },
    {
      icon: '📈',
      title: 'AI Prediction Meter',
      description: 'Get bullish/bearish predictions for Indian stocks using technical analysis.',
      points: [
        'RSI, MACD & Moving Averages',
        'Support & Resistance levels',
        'Market direction prediction',
        'Confidence percentage indicator'
      ]
    }
  ]

  return (
    <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full mb-4">
          <span className="text-blue-400 text-sm font-semibold">FEATURES</span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Everything You Need to Document & Improve Your Trades
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Powerful features to help traders track performance, refine strategies, and grow consistently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-slate-400 mb-4">{feature.description}</p>
            <ul className="space-y-2">
              {feature.points.map((point, idx) => (
                <li key={idx} className="flex items-start text-slate-300 text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features


