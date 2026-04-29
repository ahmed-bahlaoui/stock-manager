import { Boxes, ClipboardList, Package, Warehouse } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../modules/auth/AuthContext'
import { useApi } from '../shared/hooks/useApi'
import { PageSection } from '../shared/ui/PageSection'
import { Panel } from '../shared/ui/Panel'
import { StatusBanner } from '../shared/ui/StatusBanner'
import type { Category, Order, PaginatedResponse, Product, StockMovement } from '../shared/types/api'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const categories = useApi<PaginatedResponse<Category>>('/categories')
  const products = useApi<PaginatedResponse<Product>>('/products')
  const orders = useApi<PaginatedResponse<Order>>('/orders')
  const movements = useApi<PaginatedResponse<StockMovement>>('/stock-movements')

  const cards = [
    {
      label: 'Categories',
      value: categories.data?.meta.total ?? '-',
      href: '/categories',
      icon: Boxes,
      tone: 'bg-teal-50 text-teal-800',
    },
    {
      label: 'Products',
      value: products.data?.meta.total ?? '-',
      href: '/products',
      icon: Package,
      tone: 'bg-orange-50 text-orange-800',
    },
    {
      label: 'Orders',
      value: orders.data?.meta.total ?? '-',
      href: '/orders',
      icon: ClipboardList,
      tone: 'bg-sky-50 text-sky-800',
    },
    {
      label: 'Movements',
      value: movements.data?.meta.total ?? '-',
      href: '/stock-movements',
      icon: Warehouse,
      tone: 'bg-emerald-50 text-emerald-800',
    },
  ]

  const errors = [categories.error, products.error, orders.error, movements.error].filter(Boolean)

  return (
    <PageSection
      eyebrow="Overview"
      title={`Welcome back, ${user?.name}`}
      description="Use this dashboard to demonstrate authentication, role-based access, product visibility, order workflows, and stock movement traceability."
    >
      {errors.length ? <StatusBanner type="error" message={errors.join(' | ')} /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon, tone }) => (
          <button key={label} type="button" onClick={() => navigate(href)} className="text-left">
            <Panel className="space-y-3 transition hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md">
              <div className={`inline-flex rounded-2xl p-3 ${tone}`}>
                <Icon size={20} />
              </div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-3xl font-semibold text-slate-900">{value}</p>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-teal-700">Open module</p>
            </Panel>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h4 className="text-lg font-semibold text-slate-900">Role access</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li><span className="font-semibold">Admin:</span> full inventory and configuration access.</li>
            <li><span className="font-semibold">Warehouse:</span> can receive stock and inspect movement history.</li>
            <li><span className="font-semibold">Sales:</span> can create orders and inspect sellable catalog data.</li>
          </ul>
        </Panel>

        <Panel>
          <h4 className="text-lg font-semibold text-slate-900">Demo talking points</h4>
          <ol className="mt-4 space-y-3 text-sm text-slate-700">
            <li>1. Log in and show the authenticated role.</li>
            <li>2. Browse categories/products coming from the Laravel API.</li>
            <li>3. Receive stock or create an order depending on the user role.</li>
            <li>4. Confirm inventory changes through the movement audit trail.</li>
          </ol>
        </Panel>
      </div>
    </PageSection>
  )
}
