import React from 'react'

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Build full-stack apps fast with an AI teammate
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-prose">
              Describe what you want and watch your idea turn into a working website with a live backend. Edit, iterate, and ship — all in one place.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a href="#get-started" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-white font-medium shadow hover:bg-indigo-700 transition">
                Get Started
              </a>
              <a href="#status" className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-medium hover:bg-gray-50 transition">
                Check Backend
              </a>
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-200 via-blue-200 to-purple-200 blur-2xl opacity-60 rounded-3xl" />
              <div className="relative rounded-2xl border border-gray-200 bg-white shadow-xl p-4 md:p-6">
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map((i) => (
                    <div key={i} className="aspect-video rounded-lg bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-gray-200" />
                  ))}
                </div>
                <div className="mt-4 h-2 w-1/3 rounded bg-gray-200" />
                <div className="mt-2 h-2 w-2/3 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
