const ComparisonTable = () => {
  const features = [
    { name: 'Performance Analytics', tradeDiary: true, onPaper: 'Manual' },
    { name: 'Strategy Analysis', tradeDiary: true, onPaper: 'Limited' },
    { name: 'Risk Management Tools', tradeDiary: true, onPaper: false },
    { name: 'AI Analysis', tradeDiary: true, onPaper: false },
    { name: 'Broker Integration', tradeDiary: true, onPaper: 'None' },
    { name: 'Custom Reports', tradeDiary: true, onPaper: false },
    { name: 'Emotion Tracking', tradeDiary: true, onPaper: false },
    { name: 'Psychology Tracking', tradeDiary: true, onPaper: 'Limited' },
    { name: 'Position Sizing Calculator', tradeDiary: true, onPaper: false },
    { name: 'Backtesting Insights', tradeDiary: true, onPaper: false },
    { name: 'Trade Execution Analysis', tradeDiary: true, onPaper: false },
    { name: 'Trade Screenshots Storage', tradeDiary: true, onPaper: false },
    { name: 'Anytime Access', tradeDiary: true, onPaper: false }
  ]

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          TradeDiary vs. Other{' '}
          <span className="text-blue-400">Journaling Methods</span>
        </h2>
        <p className="text-lg text-slate-400">
          Why professional traders choose Trade Diary over other solutions
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-slate-800 rounded-xl border border-slate-700">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-6 py-4 text-left text-white font-semibold">Feature</th>
              <th className="px-6 py-4 text-center text-white font-semibold">Trade Diary</th>
              <th className="px-6 py-4 text-center text-white font-semibold">On Paper</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className="border-b border-slate-700 last:border-b-0">
                <td className="px-6 py-4 text-slate-300">{feature.name}</td>
                <td className="px-6 py-4 text-center">
                  {feature.tradeDiary ? (
                    <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {feature.onPaper === false ? (
                    <svg className="w-6 h-6 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : feature.onPaper === 'Limited' ? (
                    <svg className="w-6 h-6 text-yellow-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-slate-400">{feature.onPaper}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ComparisonTable


