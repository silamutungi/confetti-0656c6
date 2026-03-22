import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
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
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError('Invalid email or password. Please try again.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl font-800 mb-2 text-center">Welcome back</h1>
        <p className="text-[#6b6862] text-center mb-8">Sign in to manage your events.</p>
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
              placeholder="Your password"
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-sm text-[#6b6862] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-dark underline focus:outline-none focus:ring-2 focus:ring-primary">Create one</Link>
        </p>
      </div>
    </div>
  )
}