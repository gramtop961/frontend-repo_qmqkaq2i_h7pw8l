import React, { useEffect, useMemo, useState } from 'react'
import { Clock, Upload, CalendarDays, Bell, Monitor } from 'lucide-react'

function Card({ title, children, icon: Icon, accent = 'emerald' }) {
  const color = useMemo(() => ({
    emerald: 'from-emerald-500/10 to-emerald-500/0 border-emerald-200',
    sky: 'from-sky-500/10 to-sky-500/0 border-sky-200',
    violet: 'from-violet-500/10 to-violet-500/0 border-violet-200',
    amber: 'from-amber-500/10 to-amber-500/0 border-amber-200',
  }[accent] || 'from-emerald-500/10 to-emerald-500/0 border-emerald-200'), [accent])

  return (
    <div className={`rounded-2xl border ${color} bg-white p-6 relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} pointer-events-none`} />
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 text-gray-700" />}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="mt-3 text-sm text-gray-700">
          {children}
        </div>
      </div>
    </div>
  )
}

function FullscreenTip() {
  return (
    <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600 bg-white/80">
      Press F11 to enter full-screen mode on Windows, or Control+Command+F on macOS. The display will auto-refresh timings.
    </div>
  )
}

function LiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-emerald-300 to-sky-300 bg-clip-text text-transparent">{time}</div>
      <div className="mt-2 text-white/70 text-lg md:text-xl">{dateStr}</div>
    </div>
  )
}

function TimesGrid({ data }) {
  const rows = [
    { k: 'fajr', label: 'Fajr', jamaat: 'fajr_jamaat' },
    { k: 'dhuhr', label: 'Dhuhr', jamaat: 'dhuhr_jamaat' },
    { k: 'asr', label: 'Asr', jamaat: 'asr_jamaat' },
    { k: 'maghrib', label: 'Maghrib', jamaat: 'maghrib_jamaat' },
    { k: 'isha', label: 'Isha', jamaat: 'isha_jamaat' },
  ]
  return (
    <div className="grid grid-cols-3 gap-y-3 gap-x-4 items-center">
      <div className="text-white/60 text-xl">Prayer</div>
      <div className="text-white/60 text-xl">Start</div>
      <div className="text-white/60 text-xl">Jamaat</div>
      {rows.map(r => (
        <React.Fragment key={r.k}>
          <div className="py-2 font-semibold text-2xl">{r.label}</div>
          <div className="py-2 text-sky-300 text-2xl md:text-3xl font-semibold tracking-tight">{data?.[r.k] || '--:--'}</div>
          <div className="py-2 text-emerald-300 text-3xl md:text-4xl font-bold tracking-tight">{data?.[r.jamaat] || '--:--'}</div>
        </React.Fragment>
      ))}
    </div>
  )
}

function Ticker({ items }) {
  const content = (items?.length ? items : ['Welcome to the Masjid Display', 'Set announcements in the manager to see them here']).join(' • ')
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
      <div className="whitespace-nowrap animate-[marquee_18s_linear_infinite] py-3 px-4 text-sm md:text-base">
        <span className="text-emerald-300">Announcements:</span> <span className="text-white/80">{content}</span>
      </div>
      <style>{`@keyframes marquee { 0%{ transform: translateX(100%);} 100%{ transform: translateX(-100%);} }`}</style>
    </div>
  )
}

const localYMD = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const getHashDate = () => {
  try {
    const hash = window.location.hash || ''
    // expect formats like #display or #d=YYYY-MM-DD or #display&d=YYYY-MM-DD
    const match = hash.match(/d=(\d{4}-\d{2}-\d{2})/)
    if (match) return match[1]
    return null
  } catch {
    return null
  }
}

function DisplayBoard({ backend, refreshKey, dateOverride }) {
  const [times, setTimes] = useState(null)
  const [announcements, setAnnouncements] = useState([])

  const safeFetch = async (url) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 4000)
    try {
      const res = await fetch(url, { signal: controller.signal })
      if (!res.ok) throw new Error('bad status')
      return await res.json()
    } finally {
      clearTimeout(id)
    }
  }

  const dateForFetch = dateOverride || localYMD()

  useEffect(() => {
    const load = async () => {
      try {
        const t = await safeFetch(`${backend}/api/salah?d=${encodeURIComponent(dateForFetch)}`)
        setTimes(t && typeof t === 'object' ? t : null)
      } catch {}
      try {
        const a = await safeFetch(`${backend}/api/announcements`)
        setAnnouncements(Array.isArray(a) ? a.map(x => x.message).filter(Boolean) : [])
      } catch {}
    }
    load()
    const interval = setInterval(load, 60_000)
    return () => clearInterval(interval)
  }, [backend, refreshKey, dateForFetch])

  const fallbackTimes = {
    fajr: '06:15', fajr_jamaat: '06:30', sunrise: '07:45',
    dhuhr: '12:30', dhuhr_jamaat: '13:30',
    asr: '15:45', asr_jamaat: '16:15',
    maghrib: '17:20', maghrib_jamaat: '17:25',
    isha: '19:30', isha_jamaat: '20:00',
  }

  const timesToShow = times && typeof times === 'object' ? times : fallbackTimes

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col gap-6">
        <LiveClock />
        <div className="rounded-xl border border-white/10 bg-black/30 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold">Prayer Times</h3>
            <span className="text-xs text-white/50">Auto-refreshing • Date: {dateForFetch}</span>
          </div>
          <div className="mt-4">
            <TimesGrid data={timesToShow} />
            {(timesToShow?.sunrise) && (
              <div className="mt-5 text-lg text-white/70">Sunrise: <span className="text-amber-300 font-semibold">{timesToShow.sunrise}</span></div>
            )}
          </div>
        </div>
        <Ticker items={announcements} />
      </div>
    </div>
  )
}

function TimesForm({ backend, onSaved, dateOverride }) {
  const initialDate = dateOverride || localYMD()
  const [form, setForm] = useState({
    date: initialDate,
    fajr: '', fajr_jamaat: '',
    sunrise: '',
    dhuhr: '', dhuhr_jamaat: '',
    asr: '', asr_jamaat: '',
    maghrib: '', maghrib_jamaat: '',
    isha: '', isha_jamaat: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const loadExisting = async (d) => {
    try {
      const res = await fetch(`${backend}/api/salah?d=${encodeURIComponent(d)}`)
      if (res.ok) {
        const data = await res.json()
        if (data && data.date) {
          setForm(prev => ({ ...prev, ...data, date: data.date }))
        } else {
          setForm(prev => ({ ...prev, date: d }))
        }
      }
    } catch {}
  }

  useEffect(() => {
    loadExisting(form.date)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // React to hash date override changes
  useEffect(() => {
    if (!dateOverride) return
    setForm(prev => ({ ...prev, date: dateOverride }))
    loadExisting(dateOverride)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateOverride])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, date: form.date }
      const res = await fetch(`${backend}/api/salah`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed')
      // Keep hash in sync with the date being saved so display uses the same day
      try {
        const hash = window.location.hash || ''
        const base = hash.includes('#display') ? '#display' : (hash.includes('#manage') ? '#manage' : '#')
        window.location.hash = `${base}&d=${form.date}`
      } catch {}
      onSaved?.()
      alert('Saved times')
    } catch (e) {
      alert('Could not save times')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="col-span-2 text-sm text-white/70">Date
          <input type="date" name="date" value={form.date} onChange={(e)=>{handleChange(e); loadExisting(e.target.value)}} className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white" />
        </label>
      </div>

      {[
        {k:'fajr', label:'Fajr'},
        {k:'dhuhr', label:'Dhuhr'},
        {k:'asr', label:'Asr'},
        {k:'maghrib', label:'Maghrib'},
        {k:'isha', label:'Isha'},
      ].map(row => (
        <div key={row.k} className="grid grid-cols-3 gap-3 items-end">
          <div className="text-white/80 text-sm">{row.label}</div>
          <input placeholder="Start HH:MM" name={row.k} value={form[row.k]||''} onChange={handleChange} className="rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white" />
          <input placeholder="Jamaat HH:MM" name={`${row.k}_jamaat`} value={form[`${row.k}_jamaat`]||''} onChange={handleChange} className="rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white" />
        </div>
      ))}

      <div className="grid grid-cols-1 gap-3">
        <label className="text-sm text-white/70">Sunrise
          <input placeholder="HH:MM" name="sunrise" value={form.sunrise||''} onChange={handleChange} className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white" />
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2 flex-wrap">
        <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-400 disabled:opacity-50">
          {loading ? 'Saving…' : 'Save Today’s Times'}
        </button>
        <a href={`#display&d=${form.date}`} className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-500">Open Full‑Screen for this date</a>
      </div>
    </form>
  )
}

function AnnouncementsManager({ backend, onChanged }) {
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState(3)
  const [active, setActive] = useState(true)
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const res = await fetch(`${backend}/api/announcements`)
      if (res.ok) {
        const data = await res.json()
        setList(Array.isArray(data) ? data : [])
      }
    } catch {}
  }

  useEffect(() => { load() }, [])

  const toISOorNull = (val) => {
    if (!val) return null
    const d = new Date(val)
    if (isNaN(d.getTime())) return null
    return d.toISOString()
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!message.trim()) { alert('Enter a message'); return }
    setLoading(true)
    try {
      const payload = {
        message: message.trim(),
        priority: Number(priority) || 1,
        active: !!active,
        start_at: toISOorNull(startAt),
        end_at: toISOorNull(endAt),
      }
      const res = await fetch(`${backend}/api/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('failed')
      setMessage('')
      setStartAt('')
      setEndAt('')
      setPriority(3)
      setActive(true)
      await load()
      onChanged?.()
      alert('Announcement added')
    } catch (e) {
      alert('Could not add announcement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5" />
        <h3 className="font-medium">Announcements</h3>
      </div>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block text-sm text-white/70">Message
          <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Type announcement" className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm text-white/70">Start at (optional)
            <input type="datetime-local" value={startAt} onChange={e=>setStartAt(e.target.value)} className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white" />
          </label>
          <label className="text-sm text-white/70">End at (optional)
            <input type="datetime-local" value={endAt} onChange={e=>setEndAt(e.target.value)} className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white" />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3 items-center">
          <label className="text-sm text-white/70">Priority
            <input type="number" min={1} max={5} value={priority} onChange={e=>setPriority(e.target.value)} className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white" />
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80 mt-6">
            <input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} className="h-4 w-4" /> Active
          </label>
        </div>
        <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-400 disabled:opacity-50">{loading ? 'Saving…' : 'Add Announcement'}</button>
      </form>

      <div className="mt-6">
        <div className="text-sm text-white/60 mb-2">Currently active</div>
        <ul className="space-y-2">
          {list.length === 0 && <li className="text-white/50 text-sm">No active announcements</li>}
          {list.map((a, i) => (
            <li key={i} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm flex items-center justify-between">
              <span className="text-white/80">{a.message}</span>
              <span className="text-white/40">P{a.priority||1}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function App() {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [refreshKey, setRefreshKey] = useState(0)
  const [hashDate, setHashDate] = useState(getHashDate())

  // Keep UI in sync with URL hash changes
  useEffect(() => {
    const onHash = () => setHashDate(getHashDate())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const upload = async (file) => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${backend}/api/upload`, { method: 'POST', body: form })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    setRefreshKey(k => k + 1)
    return data
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <header className="sticky top-0 z-10 backdrop-blur bg-[#0b1220]/70 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-sky-400" />
            <span className="text-lg font-semibold tracking-tight">Masjid Display</span>
          </div>
          <a className="text-sm text-emerald-300 hover:text-emerald-200 transition" href="#manage">Manage</a>
        </div>
      </header>

      <main>
        <section className="py-14 md:py-20 bg-gradient-to-b from-[#0b1220] to-[#0b1220]">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-6 md:grid-cols-2 items-start">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Salah & Jamaat Times for Your Masjid</h1>
                <p className="mt-4 text-white/70 max-w-prose">Upload monthly timetables, set jamaat times, show announcements, and run a beautiful full-screen display on any monitor in the masjid.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Card title="Daily Times" icon={Clock} accent="emerald">
                    Fetches today’s timings from the backend. You can update or import via Excel/PDF and display instantly.
                  </Card>
                  <Card title="Announcements" icon={Bell} accent="amber">
                    Post messages like Jumu’ah times, events, or reminders with start/end times and priority.
                  </Card>
                  <Card title="Full-Screen Display" icon={Monitor} accent="sky">
                    One-click full-screen board. Large fonts, high contrast colors, and auto refresh.
                  </Card>
                  <Card title="Upload Timetable" icon={Upload} accent="violet">
                    Import PDFs, images, or spreadsheets. Files are stored and can be shown on the screen.
                  </Card>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <div className="mt-4 grid gap-3">
                  <a href="#display" className="inline-flex items-center justify-center rounded-lg bg-emerald-500 text-white px-4 py-2 hover:bg-emerald-400 transition">Open Full-Screen</a>
                  <a href="#manage" className="inline-flex items-center justify-center rounded-lg bg-sky-500 text-white px-4 py-2 hover:bg-sky-400 transition">Manage Timings</a>
                  <a href={`${backend}/test`} target="_blank" className="inline-flex items-center justify-center rounded-lg bg-white/10 text-white px-4 py-2 hover:bg-white/20 transition">Backend Status</a>
                </div>
                <div className="mt-6"><FullscreenTip /></div>
              </div>
            </div>
          </div>
        </section>

        <section id="manage" className="py-16 bg-[#0b1220]">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-semibold">Manage Timings & Files</h2>
            <p className="text-white/70 mt-2">Upload a file and it will appear in the display rotation below.</p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  <h3 className="font-medium">Upload a file (PDF, JPG, XLSX)</h3>
                </div>
                <input
                  type="file"
                  className="mt-4 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-500 file:px-3 file:py-2 file:text-white hover:file:bg-emerald-400"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      const res = await upload(file)
                      alert(`Uploaded: ${res.url}`)
                    } catch (err) {
                      alert('Upload failed')
                    }
                  }}
                />
                <p className="mt-2 text-xs text-white/60">Uploaded files are accessible from the backend.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  <h3 className="font-medium">Today’s Times</h3>
                </div>
                <p className="mt-2 text-sm text-white/70">Edit daily salah and jamaat times. Saving updates the display instantly.</p>
                <TimesForm backend={backend} dateOverride={hashDate} onSaved={() => setRefreshKey(k=>k+1)} />
              </div>
            </div>

            <div className="mt-6">
              <AnnouncementsManager backend={backend} onChanged={() => setRefreshKey(k=>k+1)} />
            </div>
          </div>
        </section>

        <section id="display" className="py-16 bg-gradient-to-b from-[#0b1220] to-black">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-semibold">Display Preview</h2>
            <div className="mt-6">
              <DisplayBoard backend={backend} refreshKey={refreshKey} dateOverride={hashDate} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/60 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Masjid Display</p>
          <p>Backend: <span className="text-white/80">{backend}</span></p>
        </div>
      </footer>
    </div>
  )
}

export default App
