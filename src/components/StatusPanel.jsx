import React, { useEffect, useState } from 'react'

function StatusPanel() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
        const res = await fetch(`${base}/test`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setStatus(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  return (
    <section id="status" className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Backend Status</h2>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${loading ? 'bg-yellow-100 text-yellow-800' : error ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
            {loading ? 'Checking…' : error ? 'Issue' : 'Online'}
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Backend</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{status?.backend || '—'}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Database</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{status?.database || '—'}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Collections</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 truncate">{Array.isArray(status?.collections) ? status.collections.join(', ') || 'None' : '—'}</p>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
      </div>
    </section>
  )
}

export default StatusPanel
