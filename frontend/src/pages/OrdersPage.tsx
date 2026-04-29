import { useMemo, useState } from 'react'
import { useAuth } from '../modules/auth/AuthContext'
import { api } from '../shared/api/client'
import { useApi } from '../shared/hooks/useApi'
import type { Order, PaginatedResponse, Product } from '../shared/types/api'
import { getErrorMessage } from '../shared/utils/error'
import { FormField } from '../shared/ui/FormField'
import { PageSection } from '../shared/ui/PageSection'
import { Panel } from '../shared/ui/Panel'
import { StatusBanner } from '../shared/ui/StatusBanner'

export function OrdersPage() {
  const { user } = useAuth()
  const orders = useApi<PaginatedResponse<Order>>('/orders')
  const products = useApi<PaginatedResponse<Product>>('/products')
  const [form, setForm] = useState({ product_id: '', quantity: '', notes: '' })
  const [message, setMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canCreate = user?.role === 'admin' || user?.role === 'sales'
  const rows = useMemo(() => orders.data?.data ?? [], [orders.data])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setSubmitError(null)
      setMessage(null)
      await api.post('/orders', {
        notes: form.notes,
        items: [
          {
            product_id: Number(form.product_id),
            quantity: Number(form.quantity),
          },
        ],
      })
      setForm({ product_id: '', quantity: '', notes: '' })
      setMessage('Order created successfully.')
      await Promise.all([orders.refetch(), products.refetch()])
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageSection
      eyebrow="Sales"
      title="Orders"
      description="Create customer orders against live stock and show the API’s insufficient-stock protection directly from the interface."
    >
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <h4 className="text-lg font-semibold text-slate-900">Create order</h4>
          <p className="mt-2 text-sm text-slate-600">Admin and sales users can place orders. Warehouse users can only inspect them.</p>
          {!canCreate ? <div className="mt-4"><StatusBanner type="info" message="Your role can view orders but cannot create them." /></div> : null}
          {message ? <div className="mt-4"><StatusBanner type="success" message={message} /></div> : null}
          {submitError ? <div className="mt-4"><StatusBanner type="error" message={submitError} /></div> : null}
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-800">Product</span>
              <select
                value={form.product_id}
                onChange={(e) => setForm((v) => ({ ...v, product_id: e.target.value }))}
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-700 focus:bg-white"
              >
                <option value="">Select product</option>
                {(products.data?.data ?? []).map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku}) - stock {product.quantity}
                  </option>
                ))}
              </select>
            </label>
            <FormField label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm((v) => ({ ...v, quantity: e.target.value }))} />
            <FormField as="textarea" label="Notes" value={form.notes} onChange={(e) => setForm((v) => ({ ...v, notes: e.target.value }))} />
            <button
              type="submit"
              disabled={!canCreate || submitting}
              className="rounded-2xl bg-[#17324d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2740] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create order'}
            </button>
          </form>
        </Panel>

        <Panel className="overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-900">Order history</h4>
            <span className="text-sm text-slate-500">{orders.loading ? 'Loading...' : `${rows.length} shown`}</span>
          </div>
          {orders.error ? <StatusBanner type="error" message={orders.error} /> : null}
          <div className="space-y-4">
            {rows.map((order) => (
              <div key={order.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{order.order_number}</p>
                    <p className="text-sm text-slate-600">{order.notes ?? 'No note provided.'}</p>
                  </div>
                  <div className="text-sm text-slate-700">
                    <p className="font-medium uppercase tracking-[0.16em] text-teal-700">{order.status}</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{order.total_amount}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{item.product_name}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{item.product_sku}</p>
                      </div>
                      <div className="text-right text-sm text-slate-700">
                        <p>Qty {item.quantity}</p>
                        <p className="font-medium text-slate-900">{item.subtotal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageSection>
  )
}
