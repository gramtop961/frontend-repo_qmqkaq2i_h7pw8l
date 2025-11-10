import React from 'react'

const features = [
  {
    title: 'Backend-first',
    desc: 'Define APIs and data models that persist to a real database. Frontend calls only what exists.'
  },
  {
    title: 'Live previews',
    desc: 'Instantly see your app running with automatic server restarts and shareable URLs.'
  },
  {
    title: 'Clean components',
    desc: 'Composable UI built with focused, reusable pieces and tasteful defaults.'
  },
  {
    title: 'Modern stack',
    desc: 'Vite + React on the front, FastAPI on the back, Tailwind for styling.'
  }
]

function Features() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Features</h2>
        <p className="mt-3 text-gray-600 max-w-prose">A focused toolkit to go from idea to live app in minutes.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
