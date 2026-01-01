import { Link } from 'react-router-dom'

const CTA = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Ready to Transform Your Indian Stock Trading?
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Start tracking your NSE/BSE trades with AI-powered analysis, psychology tracking, and performance insights
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          Get Started Free
        </Link>
      </div>
    </section>
  )
}

export default CTA


