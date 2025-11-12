import React, { useState } from 'react'

export default function AISyncButton({ backend, currentDate, onSynced }) {
  const [loading, setLoading] = useState(false)

  const runSync = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/sync/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: currentDate, commit: true })
      })
      if (!res.ok) {
        const err = await res.json().catch(()=>({detail:'Unknown error'}))
        throw new Error(err.detail || 'AI sync failed')
      }
      const data = await res.json()
      onSynced?.(data)
      alert('AI sync complete')
    } catch (e) {
      alert(e.message || 'AI sync failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" onClick={runSync} disabled={loading} className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-3 py-2 text-white hover:bg-purple-500 disabled:opacity-50">
      {loading ? 'Syncing…' : 'Sync with AI'}
    </button>
  )
}
