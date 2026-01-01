import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const About = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Us</h1>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-lg">
              TradeDiary empowers traders with clear, data-driven journaling to optimize performance and discipline. Our mission is to turn every trade into a learning opportunity, helping you stay ahead of the curve with precision analytics and personalized feedback.
            </p>
            
            <p>
              We're fully independent — no brokers, no noise — just clean insights from your trading behavior. Whether you're a beginner or a pro, TradeDiary helps you reflect, grow, and trade smarter with confidence.
            </p>
            
            <p>
              Our platform is built by traders, for traders. We understand the challenges of the market because we face them daily. That's why we've created tools that adapt to your trading style, whether you're into day trading, swing trading, or long-term investments. The analytics dashboard gives you instant feedback on your performance metrics.
            </p>
          </div>

          <div className="mt-12">
            <Link
              to="/#pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              Start Journaling
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default About


