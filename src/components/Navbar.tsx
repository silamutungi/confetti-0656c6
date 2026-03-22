import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-ink text-paper">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-xl font-800 focus:outline-none focus:ring-2 focus:ring-primary rounded">
          Confetti
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm hover:text-primary transition focus:outline-none focus:ring-2 focus:ring-primary rounded">Dashboard</Link>
              <span className="text-sm text-[#c8c4bc]">{user.email}</span>
              <button onClick={handleLogout} className="min-h-[44px] px-4 py-2 text-sm border border-paper/30 rounded-lg hover:bg-paper/10 transition focus:outline-none focus:ring-2 focus:ring-primary">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:text-primary transition min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded">Sign in</Link>
              <Link to="/signup" className="min-h-[44px] px-5 py-2 bg-primary text-white text-sm font-500 rounded-lg hover:opacity-90 transition flex items-center focus:outline-none focus:ring-2 focus:ring-primary">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary rounded"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-paper/10 px-6 py-4 space-y-3">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block text-sm py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded">Dashboard</Link>
              <span className="block text-sm text-[#c8c4bc] py-1">{user.email}</span>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block text-sm py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded">Sign in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block text-sm py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded">Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}