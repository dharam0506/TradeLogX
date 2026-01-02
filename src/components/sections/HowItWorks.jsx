const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Log Your Indian Stock Trades',
      description: 'Record your NSE/BSE trades with entry, exit prices, quantity, and trading notes.'
    },
    {
      number: '2',
      title: 'AI Analyzes Your Trades',
      description: 'Google Gemini AI instantly analyzes your trades and identifies patterns you missed.'
    },
    {
      number: '3',
      title: 'Track Psychology & Performance',
      description: 'Monitor your emotions, behavioral patterns, and performance analytics to identify strengths and weaknesses.'
    },
    {
      number: '4',
      title: 'Get AI Predictions',
      description: 'Use AI Prediction Meter to get bullish/bearish signals for Indian stocks using technical indicators.'
    }
  ]

  return (
    <section id="how-it-works" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          How TradeLogX Works
        </h2>
        <p className="text-lg text-slate-400">
          Transform your Indian stock market trading with AI-powered insights
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center">
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden md:block mx-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks


