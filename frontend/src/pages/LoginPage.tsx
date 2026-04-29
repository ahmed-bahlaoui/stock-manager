import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../modules/auth/AuthContext'
import { AuthPageShell } from '../shared/layout/AuthPageShell'
import { FormField } from '../shared/ui/FormField'
import { StatusBanner } from '../shared/ui/StatusBanner'
import { getErrorMessage } from '../shared/utils/error'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError(null)
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageShell title="Sign in" subtitle="Authentication">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error ? <StatusBanner type="error" message={error} /> : null}
        <FormField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#17324d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2740] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Demo users</p>
        <ul className="mt-3 space-y-1">
          <li>`admin@example.com` / `password`</li>
          <li>`warehouse@example.com` / `password`</li>
          <li>`sales@example.com` / `password`</li>
        </ul>
      </div>

      <p className="mt-6 text-sm text-slate-600">
        Need a new user?{' '}
        <Link className="font-semibold text-teal-700 hover:text-teal-800" to="/register">
          Create an account
        </Link>
      </p>
    </AuthPageShell>
  )
}
