import { useState, useEffect, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Event, Rsvp } from '../types'

const COVER_COLORS = ['#E85D75', '#6366F1', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899']

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [rsvps, setRsvps] = useState<Record<string, Rsvp[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [coverColor, setCoverColor] = useState(COVER_COLORS[0])
  const [creating, setCreating] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated.'); setLoading(false); return }
    const { data, error: fetchErr } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('event_date', { ascending: true })
    if (fetchErr) { setError('Could not load events.'); setLoading(false); return }
    setEvents(data || [])
    if (data && data.length > 0) {
      const { data: rsvpData } = await supabase
        .from('rsvps')
        .select('*')
        .in('event_id', data.map((e: Event) => e.id))
        .is('deleted_at', null)
      const grouped: Record<string, Rsvp[]> = {}
      ;(rsvpData || []).forEach((r: Rsvp) => {
        if (!grouped[r.event_id]) grouped[r.event_id] = []
        grouped[r.event_id].push(r)
      })
      setRsvps(grouped)
    }
    setLoading(false)
  }

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !eventDate) { setError('Title and date are required.'); return }
    setCreating(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated.'); setCreating(false); return }
    const { error: insertErr } = await supabase.from('events').insert({
      user_id: user.id,
      title: title.trim().slice(0, 200),
      description: description.trim().slice(0, 2000),
      location: location.trim().slice(0, 500),
      event_date: eventDate,
      cover_color: coverColor
    })
    setCreating(false)
    if (insertErr) { setError('Could not create event.'); return }
    setTitle(''); setDescription(''); setLocation(''); setEventDate(''); setCoverColor(COVER_COLORS[0]); setShowForm(false)
    fetchEvents()
  }

  const copyLink = (eventId: string) => {
    const url = `${window.location.origin}/rsvp/${eventId}`
    navigator.clipboard.writeText(url)
  }

  const countByStatus = (eventId: string, status: string) =>
    (rsvps[eventId] || []).filter((r) => r.status === status).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h1 className="font-serif text-3xl font-800">Your events</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="min-h-[44px] px-6 py-2 bg-primary text-white font-500 rounded-lg hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {showForm ? 'Cancel' : '+ New event'}
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm border border-red-300 bg-red-50 rounded-lg px-4 py-2 mb-6">{error}</p>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-ink/10 rounded-xl p-6 mb-10 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-500 mb-1">Event title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg bg-paper focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Rooftop Dinner Party" />
          </div>
          <div>
            <label htmlFor="desc" className="block text-sm font-500 mb-1">Description</label>
            <textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={3} className="w-full px-4 py-2 border border-ink/20 rounded-lg bg-paper focus:outline-none focus:ring-2 focus:ring-primary" placeholder="What should guests know?" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-500 mb-1">Location</label>
              <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={500} className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg bg-paper focus:outline-none focus:ring-2 focus:ring-primary" placeholder="123 Main St" />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-500 mb-1">Date &amp; time</label>
              <input id="date" type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg bg-paper focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div>
            <span className="block text-sm font-500 mb-2">Cover color</span>
            <div className="flex gap-3">
              {COVER_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setCoverColor(c)} className={`w-10 h-10 rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-primary ${coverColor === c ? 'border-ink scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} aria-label={`Select color ${c}`} />
              ))}
            </div>
          </div>
          <button type="submit" disabled={creating} className="min-h-[44px] px-8 py-3 bg-primary text-white font-500 rounded-lg hover:opacity-90 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary">
            {creating ? 'Creating…' : 'Create event'}
          </button>
        </form>
      )}

      {events.length === 0 && !showForm && (
        <div className="text-center py-20">
          <p className="font-serif text-2xl font-600 mb-3">No events yet</p>
          <p className="text-[#6b6862] mb-6">Create your first event and share the link with friends.</p>
          <button onClick={() => setShowForm(true)} className="min-h-[44px] px-8 py-3 bg-primary text-white font-500 rounded-lg hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-primary">
            + New event
          </button>
        </div>
      )}

      <div className="space-y-6">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white border border-ink/10 rounded-xl overflow-hidden">
            <div className="h-3" style={{ backgroundColor: ev.cover_color }} />
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-serif text-xl font-600">{ev.title}</h2>
                  <p className="text-sm text-[#6b6862]">
                    {new Date(ev.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    {ev.location && ` · ${ev.location}`}
                  </p>
                </div>
                <button onClick={() => copyLink(ev.id)} className="min-h-[44px] px-4 py-2 text-sm border-2 border-primary-dark text-primary-dark rounded-lg hover:bg-primary-dark hover:text-white transition focus:outline-none focus:ring-2 focus:ring-primary">
                  Copy invite link
                </button>
              </div>
              {ev.description && <p className="text-sm text-[#6b6862] mb-4">{ev.description}</p>}
              <div className="flex gap-6 text-sm">
                <span className="text-green-700 font-500">Going {countByStatus(ev.id, 'going')}</span>
                <span className="text-yellow-700 font-500">Maybe {countByStatus(ev.id, 'maybe')}</span>
                <span className="text-red-700 font-500">Can't go {countByStatus(ev.id, 'cant_go')}</span>
              </div>
              <button onClick={() => setSelectedEvent(selectedEvent === ev.id ? null : ev.id)} className="mt-3 text-sm text-primary-dark underline min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary">
                {selectedEvent === ev.id ? 'Hide guest list' : 'View guest list'}
              </button>
              {selectedEvent === ev.id && (
                <div className="mt-4 border-t border-ink/10 pt-4">
                  {(!rsvps[ev.id] || rsvps[ev.id].length === 0) ? (
                    <p className="text-sm text-[#6b6862]">No RSVPs yet. Share your invite link to get started.</p>
                  ) : (
                    <ul className="space-y-2">
                      {rsvps[ev.id].map((r) => (
                        <li key={r.id} className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-500">{r.guest_name}</span>
                            <span className="text-[#6b6862] ml-2">{r.guest_email}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-500 ${
                            r.status === 'going' ? 'bg-green-100 text-green-800' :
                            r.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {r.status === 'cant_go' ? "Can't go" : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}