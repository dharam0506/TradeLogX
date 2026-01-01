const Statistics = () => {
  const stats = [
    { value: '120k+', label: 'Trades logged and analyzed' },
    { value: '2.5x', label: 'Disciplined trades' },
    { value: '-63%', label: 'Emotional trades' },
    { value: '4K+', label: 'Active traders on Trade Diary' },
  ]

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center"
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              {stat.value}
            </div>
            <div className="text-slate-400 text-sm">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Statistics


