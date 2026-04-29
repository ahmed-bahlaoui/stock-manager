import { Boxes, ClipboardList, LayoutDashboard, LogOut, Package, ShieldCheck, Warehouse } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/categories', label: 'Categories', icon: Boxes },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/stock-in', label: 'Stock In', icon: Warehouse },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/stock-movements', label: 'Movements', icon: ShieldCheck },
]

export function AppShell() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const allowedLinks = links.filter((link) => {
    if (!user) return false
    if (user.role === 'admin') return true
    if (user.role === 'warehouse') return !['/categories'].includes(link.to)
    if (user.role === 'sales') return !['/stock-in'].includes(link.to)
    return false
  })

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-[280px_1fr] lg:px-6">
        <aside className="rounded-[2rem] border border-stone-300/80 bg-[#17324d] p-5 text-stone-50 shadow-[0_24px_60px_rgba(23,50,77,0.16)]">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-teal-200/80">Stock Manager</p>
            <h1 className="mt-3 text-2xl font-semibold">Control panel</h1>
            <p className="mt-2 text-sm text-stone-300">
              Laravel API demo with role-based access and live inventory workflows.
            </p>
          </div>

          <nav className="space-y-2">
            {allowedLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? 'bg-teal-500/15 text-white ring-1 ring-teal-300/30'
                      : 'text-stone-300 hover:bg-white/6 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-400">Signed in</p>
            <p className="mt-2 text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-stone-300">{user?.email}</p>
            <p className="mt-3 inline-flex rounded-full bg-teal-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">
              {user?.role}
            </p>
          </div>
        </aside>

        <main className="rounded-[2rem] border border-stone-300/70 bg-[#fffdf8]/92 p-5 shadow-[0_24px_60px_rgba(90,70,30,0.08)] backdrop-blur lg:p-8">
          <header className="mb-6 flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-teal-700">Authenticated workspace</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Inventory prototype</h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="rounded-2xl border border-stone-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-teal-700 hover:text-teal-700"
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => void logout().then(() => navigate('/login'))}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#17324d] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0f2740]"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  )
}
