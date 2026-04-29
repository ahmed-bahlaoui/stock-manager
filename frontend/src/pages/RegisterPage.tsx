import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../modules/auth/AuthContext'
import { AuthPageShell } from '../shared/layout/AuthPageShell'
import { FormField } from '../shared/ui/FormField'
import { StatusBanner } from '../shared/ui/StatusBanner'
import { getErrorMessage } from '../shared/utils/error'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const setValue = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError(null)
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPageShell title="Create account" subtitle="Registration">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error ? <StatusBanner type="error" message={error} /> : null}
        <FormField label="Full name" value={form.name} onChange={(e) => setValue('name', e.target.value)} />
        <FormField label="Email" value={form.email} onChange={(e) => setValue('email', e.target.value)} />
        <FormField label="Password" type="password" value={form.password} onChange={(e) => setValue('password', e.target.value)} />
        <FormField
          label="Confirm password"
          type="password"
          value={form.password_confirmation}
          onChange={(e) => setValue('password_confirmation', e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#17324d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2740] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{' '}
        <Link className="font-semibold text-teal-700 hover:text-teal-800" to="/login">
          Sign in
        </Link>
      </p>
    </AuthPageShell>
  )
}
