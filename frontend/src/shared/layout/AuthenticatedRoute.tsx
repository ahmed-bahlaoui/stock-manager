import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../modules/auth/AuthContext'

export function AuthenticatedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-2xl border border-stone-300 bg-white/90 px-6 py-4 text-sm text-stone-700 shadow-lg">
          Loading application...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
