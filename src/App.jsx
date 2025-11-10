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
    <div className="grid grid-cols-3 gap-2 text-lg">
      <div className="text-white/60">Prayer</div>
      <div className="text-white/60">Adhan</div>
      <div className="text-white/60">Jamaat</div>
      {rows.map(r => (
        <React.Fragment key={r.k}>
          <div className="py-2 font-medium">{r.label}</div>
          <div className="py-2 text-emerald-300">{data?.[r.k] || '--:--'}</div>
          <div className="py-2 text-sky-300">{data?.[r.jamaat] || '--:--'}</div>
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

function AssetCarousel({ items }) {
  const [idx, setIdx] = useState(0)
  const len = items?.length || 0
  useEffect(() => {
    if (!len) return
    const t = setInterval(() => setIdx(i => (i + 1) % len), 6000)
    return () => clearInterval(t)
  }, [len])
  if (!len) {
    return (
      <div className="aspect-video w-full rounded-xl border border-white/10 bg-gradient-to-br from-emerald-900/40 to-sky-900/40 grid place-items-center">
        <div className="text-white/70 text-sm">Uploaded images and PDFs will rotate here</div>
      </div>
    )
  }
  const current = items[idx]
  const url = current.url
  const isImage = current.content_type?.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(url || '')
  const isPDF = current.content_type === 'application/pdf' || /\.pdf$/i.test(url || '')
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/50">
      {isImage ? (
        <img src={url} alt="slide" className="h-full w-full object-contain" />
      ) : isPDF ? (
        <iframe src={url} title="PDF" className="h-full w-full" />
      ) : (
        <div className="h-full w-full grid place-items-center">
          <a href={url} target="_blank" rel="noreferrer" className="text-sky-300 underline">Open Document</a>
        </div>
      )}
    </div>
  )
}

function DisplayBoard({ backend, refreshKey }) {
  const [times, setTimes] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [assets, setAssets] = useState([])

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

  useEffect(() => {
    const load = async () => {
      try {
        const t = await safeFetch(`${backend}/api/salah/today`)
        setTimes(t)
      } catch {}
      try {
        const a = await safeFetch(`${backend}/api/announcements`)
        setAnnouncements(Array.isArray(a) ? a.map(x => x.message).filter(Boolean) : [])
      } catch {}
      try {
        const as = await safeFetch(`${backend}/api/assets`)
        const normalized = Array.isArray(as) ? as.map(x => ({
          url: `${backend}${x.path}`,
          content_type: x.content_type || '',
        })) : []
        setAssets(normalized)
      } catch {
        setAssets([])
      }
    }
    load()
    const interval = setInterval(load, 60_000)
    return () => clearInterval(interval)
  }, [backend, refreshKey])

  const fallbackTimes = {
    fajr: '06:15', fajr_jamaat: '06:30', sunrise: '07:45',
    dhuhr: '12:30', dhuhr_jamaat: '13:30',
    asr: '15:45', asr_jamaat: '16:15',
    maghrib: '17:20', maghrib_jamaat: '17:25',
    isha: '19:30', isha_jamaat: '20:00',
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <LiveClock />
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Today’s Times</h3>
              <span className="text-xs text-white/50">Auto-refreshing</span>
            </div>
            <div className="mt-4">
              <TimesGrid data={times || fallbackTimes} />
              {(times?.sunrise || fallbackTimes.sunrise) && (
                <div className="mt-3 text-sm text-white/60">Sunrise: <span className="text-amber-300">{times?.sunrise || fallbackTimes.sunrise}</span></div>
              )}
            </div>
          </div>
          <Ticker items={announcements} />
        </div>
        <div className="flex flex-col gap-6">
          <AssetCarousel items={assets} />
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-emerald-900/30 to-sky-900/30 p-4">
            <p className="text-white/70 text-sm">Uploaded image/PDF rotation pulls from your backend uploads. If a PDF won’t preview, it uses a built-in inline viewer or shows an open link.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [refreshKey, setRefreshKey] = useState(0)

  const upload = async (file) => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${backend}/api/upload`, { method: 'POST', body: form })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    // Trigger immediate refresh of the display board after successful upload
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
                <p className="mt-2 text-xs text-white/60">Uploaded files are accessible from the backend and rotate in the preview.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  <h3 className="font-medium">Today’s Times</h3>
                </div>
                <p className="mt-2 text-sm text-white/70">The editable form for daily salah and jamaat will go here. It will save to the backend instantly.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="display" className="py-16 bg-gradient-to-b from-[#0b1220] to-black">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-semibold">Display Preview</h2>
            <div className="mt-6">
              <DisplayBoard backend={backend} refreshKey={refreshKey} />
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
