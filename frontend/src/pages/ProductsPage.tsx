import { useMemo, useState } from 'react'
import { useAuth } from '../modules/auth/AuthContext'
import { api } from '../shared/api/client'
import { useApi } from '../shared/hooks/useApi'
import type { Category, PaginatedResponse, Product } from '../shared/types/api'
import { getErrorMessage } from '../shared/utils/error'
import { FormField } from '../shared/ui/FormField'
import { PageSection } from '../shared/ui/PageSection'
import { Panel } from '../shared/ui/Panel'
import { StatusBanner } from '../shared/ui/StatusBanner'

export function ProductsPage() {
  const { user } = useAuth()
  const products = useApi<PaginatedResponse<Product>>('/products')
  const categories = useApi<PaginatedResponse<Category>>('/categories')
  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    quantity: '',
    min_quantity: '',
    category_id: '',
  })
  const [message, setMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canManage = user?.role === 'admin'
  const rows = useMemo(() => products.data?.data ?? [], [products.data])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setSubmitError(null)
      setMessage(null)
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        min_quantity: Number(form.min_quantity),
        category_id: Number(form.category_id),
      })
      setForm({
        name: '',
        sku: '',
        description: '',
        price: '',
        quantity: '',
        min_quantity: '',
        category_id: '',
      })
      setMessage('Product created successfully.')
      await products.refetch()
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageSection
      eyebrow="Inventory"
      title="Products"
      description="Review stock levels, identify low-stock items, and create new products from the admin role."
    >
      {products.error ? <StatusBanner type="error" message={products.error} /> : null}
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-900">Product catalog</h4>
            <span className="text-sm text-slate-500">{products.loading ? 'Loading...' : `${rows.length} shown`}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stone-200 text-slate-500">
                <tr>
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">SKU</th>
                  <th className="pb-3 pr-4 font-medium">Stock</th>
                  <th className="pb-3 pr-4 font-medium">Price</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((product) => (
                  <tr key={product.id} className="border-b border-stone-100 last:border-b-0">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-slate-900">{product.name}</div>
                      {product.is_low_stock ? (
                        <span className="mt-1 inline-flex rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
                          Low stock
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{product.sku}</td>
                    <td className="py-3 pr-4 text-slate-600">{product.quantity}</td>
                    <td className="py-3 pr-4 text-slate-600">{product.price}</td>
                    <td className="py-3 pr-4 text-slate-600">{product.category?.name ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <h4 className="text-lg font-semibold text-slate-900">Create product</h4>
          <p className="mt-2 text-sm text-slate-600">Admin users can add products directly and prepare them for stock or order actions.</p>
          {!canManage ? <div className="mt-4"><StatusBanner type="info" message="Your current role can view products but cannot create them." /></div> : null}
          {message ? <div className="mt-4"><StatusBanner type="success" message={message} /></div> : null}
          {submitError ? <div className="mt-4"><StatusBanner type="error" message={submitError} /></div> : null}
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <FormField label="Name" value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} />
            <FormField label="SKU" value={form.sku} onChange={(e) => setForm((v) => ({ ...v, sku: e.target.value }))} />
            <FormField
              as="textarea"
              label="Description"
              value={form.description}
              onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm((v) => ({ ...v, price: e.target.value }))} />
              <FormField label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm((v) => ({ ...v, quantity: e.target.value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Min quantity" type="number" value={form.min_quantity} onChange={(e) => setForm((v) => ({ ...v, min_quantity: e.target.value }))} />
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-800">Category</span>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((v) => ({ ...v, category_id: e.target.value }))}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-700 focus:bg-white"
                >
                  <option value="">Select category</option>
                  {(categories.data?.data ?? []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="submit"
              disabled={!canManage || submitting}
              className="rounded-2xl bg-[#17324d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2740] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create product'}
            </button>
          </form>
        </Panel>
      </div>
    </PageSection>
  )
}
