import { useMemo, useState } from 'react'
import { useAuth } from '../modules/auth/AuthContext'
import { api } from '../shared/api/client'
import { useApi } from '../shared/hooks/useApi'
import type { PaginatedResponse, Product, StockMovement } from '../shared/types/api'
import { getErrorMessage } from '../shared/utils/error'
import { FormField } from '../shared/ui/FormField'
import { PageSection } from '../shared/ui/PageSection'
import { Panel } from '../shared/ui/Panel'
import { StatusBanner } from '../shared/ui/StatusBanner'

export function StockInPage() {
  const { user } = useAuth()
  const products = useApi<PaginatedResponse<Product>>('/products')
  const movements = useApi<PaginatedResponse<StockMovement>>('/stock-movements?type=stock_in')
  const [form, setForm] = useState({ product_id: '', quantity: '', note: '' })
  const [message, setMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canManage = user?.role === 'admin' || user?.role === 'warehouse'
  const latestMovements = useMemo(() => movements.data?.data ?? [], [movements.data])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setSubmitError(null)
      setMessage(null)
      await api.post('/stock-movements/stock-in', {
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
        note: form.note,
      })
      setForm({ product_id: '', quantity: '', note: '' })
      setMessage('Stock received successfully.')
      await Promise.all([products.refetch(), movements.refetch()])
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageSection
      eyebrow="Warehouse"
      title="Stock in"
      description="Receive inventory from suppliers and immediately reflect the result in both product stock and movement history."
    >
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <h4 className="text-lg font-semibold text-slate-900">Receive stock</h4>
          <p className="mt-2 text-sm text-slate-600">This action is available to admin and warehouse roles.</p>
          {!canManage ? <div className="mt-4"><StatusBanner type="info" message="Your role can view this page but cannot perform stock-in operations." /></div> : null}
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
                    {product.name} ({product.sku}) - current stock {product.quantity}
                  </option>
                ))}
              </select>
            </label>
            <FormField label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm((v) => ({ ...v, quantity: e.target.value }))} />
            <FormField as="textarea" label="Note" value={form.note} onChange={(e) => setForm((v) => ({ ...v, note: e.target.value }))} />
            <button
              type="submit"
              disabled={!canManage || submitting}
              className="rounded-2xl bg-[#17324d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2740] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Receive stock'}
            </button>
          </form>
        </Panel>

        <Panel className="overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-900">Recent stock-in activity</h4>
            <span className="text-sm text-slate-500">{movements.loading ? 'Loading...' : `${latestMovements.length} shown`}</span>
          </div>
          {movements.error ? <StatusBanner type="error" message={movements.error} /> : null}
          <div className="space-y-3">
            {latestMovements.map((movement) => (
              <div key={movement.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{movement.product?.name ?? 'Unknown product'}</p>
                    <p className="text-sm text-slate-600">{movement.product?.sku}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                    +{movement.quantity}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{movement.note ?? 'No note provided.'}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageSection>
  )
}
