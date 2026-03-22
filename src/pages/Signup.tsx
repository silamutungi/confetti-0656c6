import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (authError) {
      setError('Something went wrong. Please try a different email.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl font-800 mb-2 text-center">Create your account</h1>
        <p className="text-[#6b6862] text-center mb-8">Start creating events in under a minute.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-500 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-500 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={128}
              className="w-full min-h-[44px] px-4 py-2 border border-ink/20 rounded-lg bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="At least 8 characters"
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm border border-red-300 bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] px-6 py-3 bg-primary text-white font-500 rounded-lg hover:opacity-90 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="text-center text-sm text-[#6b6862] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-dark underline focus:outline-none focus:ring-2 focus:ring-primary">Sign in</Link>
        </p>
      </div>
    </div>
  )
}