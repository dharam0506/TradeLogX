import { useState } from 'react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "How does Trade Diary help improve my trading?",
      answer: "Trade Diary provides data-driven insights into your trading performance. By analyzing your win rate, profit factor, average win/loss, and other metrics across different strategies and market conditions, you can identify what's working and eliminate weaknesses in your approach."
    },
    {
      question: "Is my trading data secure?",
      answer: "Absolutely. We use bank-grade encryption for all data in transit and at rest. Your trading data is never shared with third parties. You can also enable two-factor authentication for additional security."
    },
    {
      question: "Are there any additional costs or fees for using Trade Diary?",
      answer: "The costs are outlined in our subscription plans. There are no hidden fees."
    },
    {
      question: "Why choose annual billing over monthly?",
      answer: "Our annual plan offers significant savings - you get 2 months free compared to monthly billing. At just ₹83/month (billed annually at ₹999), it's a 70% discount compared to the ₹299 monthly plan. Plus, you lock in the current price even if we increase prices in the future."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Frequently <span className="text-blue-400">Asked Questions</span>
        </h2>
        <p className="text-lg text-slate-400">
          Find answers to common questions about Trade Diary
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
              <svg
                className={`w-5 h-5 text-blue-400 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 border-t border-slate-700">
                <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQ


