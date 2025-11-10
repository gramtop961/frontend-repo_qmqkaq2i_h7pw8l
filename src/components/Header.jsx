import React from 'react'

function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500" />
          <span className="text-lg font-semibold tracking-tight text-gray-800">Vibe App</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a className="hover:text-gray-900 transition" href="#features">Features</a>
          <a className="hover:text-gray-900 transition" href="#status">Status</a>
          <a className="hover:text-gray-900 transition" href="#get-started">Get Started</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
