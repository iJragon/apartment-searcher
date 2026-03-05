import { useState } from 'react'
import { INPUT_CLASS } from '../constants'

export default function AuthModal({ onAuth, onClose }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (tab === 'login') {
        await onAuth.signIn(email, password)
        onClose()
      } else {
        if (!displayName.trim()) throw new Error('Display name is required')
        await onAuth.signUp(email, password, displayName.trim())
        setDone(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-sm bg-slate-950 border border-white/[0.08] rounded-2xl shadow-2xl z-50 p-6">

        {done ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">📬</div>
            <h2 className="text-base font-semibold text-white mb-2">Check your email</h2>
            <p className="text-sm text-slate-400">We sent a confirmation link to <span className="text-slate-200">{email}</span>. Click it to activate your account, then come back and log in.</p>
            <button onClick={onClose} className="mt-5 w-full py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">
              Got it
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">
                {tab === 'login' ? 'Sign in' : 'Create account'}
              </h2>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-900 rounded-lg mb-5">
              {['login', 'register'].map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(null) }}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-all ${
                    tab === t ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t === 'login' ? 'Log in' : 'Register'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {tab === 'register' && (
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Display name"
                  required
                  className={INPUT_CLASS}
                />
              )}
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                required
                className={INPUT_CLASS}
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className={INPUT_CLASS}
              />

              {error && (
                <p className="text-xs text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors mt-1"
              >
                {loading ? 'Please wait…' : tab === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  )
}
