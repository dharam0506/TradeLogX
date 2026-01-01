import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Trade Diary Column */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Trade Diary</h3>
            <p className="text-slate-400 text-sm">
              India's most advanced trading journal for serious traders looking to improve their performance.
            </p>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/disclaimer" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Disclaimer
                </a>
              </li>
              <li>
                <a href="/refund-and-cancellation" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Refund And Cancellation Policy
                </a>
              </li>
              <li>
                <a href="/disclosures" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Disclosures
                </a>
              </li>
              <li>
                <a href="/terms-and-conditions" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-slate-400 text-sm">© 2025 Trade Diary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


