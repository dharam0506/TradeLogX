const Testimonials = () => {
  const testimonials = [
    {
      quote: "I separate strategy issues from execution now. Reviewing trades brought massive clarity. I finally know what to fix.",
      name: 'Abhay',
      role: 'Equity Trader',
      avatar: '👤'
    },
    {
      quote: "I could literally see my emotional mistakes like fear exits or revenge trades. That one insight changed everything for me.",
      name: 'Rajvansh',
      role: 'Student',
      avatar: '👤'
    },
    {
      quote: "I only trade twice a week, but journaling keeps me consistent. I learn from every mistake and feel much more in control.",
      name: 'Abhinav Singh',
      role: 'Working Professional',
      avatar: '👤'
    }
  ]

  return (
    <section id="testimonials" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          What Traders Say
        </h2>
        <p className="text-lg text-slate-400">
          Hear from early users who transformed their performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl mr-4">
                {testimonial.avatar}
              </div>
              <div>
                <h4 className="text-white font-semibold">{testimonial.name}</h4>
                <p className="text-slate-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials


