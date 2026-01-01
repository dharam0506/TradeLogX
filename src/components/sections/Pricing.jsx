const Pricing = () => {
  const plans = [
    {
      name: 'Monthly Plan',
      subtitle: 'Flexibility with month-to-month access',
      price: '₹299',
      period: '/month',
      features: [
        'Unlimited trades',
        'Advanced analytics',
        'Risk management tools',
        'Trade screenshots',
        'Standard support'
      ],
      buttonText: 'Choose Monthly',
      buttonClass: 'bg-blue-500 hover:bg-blue-600',
      highlight: false
    },
    {
      name: 'Annual Plan',
      subtitle: 'Best value with significant savings',
      price: '₹999',
      period: '/year',
      periodNote: '(Just ₹83/month)',
      originalPrice: '₹3,588/year',
      savings: 'Save ₹2,589 (72%)',
      features: [
        'Unlimited trades',
        'Advanced analytics',
        'Risk management tools',
        'Trade screenshots',
        'Priority support',
        'Beta Tester Access'
      ],
      buttonText: 'Save 72% Annually',
      buttonClass: 'bg-green-500 hover:bg-green-600',
      highlight: true,
      badge: 'Limited Period Offer'
    }
  ]

  return (
    <section id="pricing" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Simple, <span className="text-blue-400">Transparent Pricing</span>
        </h2>
        <p className="text-lg text-slate-400">
          Choose the plan that fits your trading needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-slate-800 rounded-xl p-8 border-2 ${
              plan.highlight ? 'border-green-500 relative' : 'border-slate-700'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {plan.badge}
              </div>
            )}
            
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-slate-400 mb-6">{plan.subtitle}</p>
            
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400 ml-2">{plan.period}</span>
              </div>
              {plan.periodNote && (
                <p className="text-slate-400 text-sm mt-1">{plan.periodNote}</p>
              )}
              {plan.originalPrice && (
                <div className="mt-2">
                  <span className="text-slate-500 line-through mr-2">{plan.originalPrice}</span>
                  <span className="text-green-400 font-semibold">{plan.savings}</span>
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors ${plan.buttonClass}`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Pricing


