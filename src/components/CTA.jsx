import React from 'react'

function CTA() {
  return (
    <section id="get-started" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-600 to-blue-600 p-8 md:p-12 text-white shadow-xl">
          <div className="grid md:grid-cols-2 items-center gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Ready to build?</h3>
              <p className="mt-2 text-white/80">Start with a prompt, and we’ll spin up a live app with a real backend you can iterate on.</p>
            </div>
            <div className="flex md:justify-end gap-3">
              <a href="#" className="inline-flex items-center justify-center rounded-lg bg-white text-gray-900 px-5 py-3 font-medium shadow hover:shadow-md transition">Create Project</a>
              <a href="#features" className="inline-flex items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/30 px-5 py-3 font-medium hover:bg-white/15 transition">Explore Features</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
