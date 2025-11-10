import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import StatusPanel from './components/StatusPanel'
import CTA from './components/CTA'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main>
        <Hero />
        <Features />
        <StatusPanel />
        <CTA />
      </main>
      <footer className="border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Vibe App. All rights reserved.</p>
          <p>
            Backend URL: <span className="font-medium">{import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
