import { useMemo, useState } from 'react'
import { useAuth } from '../modules/auth/AuthContext'
import { api } from '../shared/api/client'
import { useApi } from '../shared/hooks/useApi'
import type { Category, PaginatedResponse } from '../shared/types/api'
import { getErrorMessage } from '../shared/utils/error'
import { FormField } from '../shared/ui/FormField'
import { PageSection } from '../shared/ui/PageSection'
import { Panel } from '../shared/ui/Panel'
import { StatusBanner } from '../shared/ui/StatusBanner'

export function CategoriesPage() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useApi<PaginatedResponse<Category>>('/categories')
  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [message, setMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canManage = user?.role === 'admin'
  const rows = useMemo(() => data?.data ?? [], [data])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setSubmitError(null)
      setMessage(null)
      await api.post('/categories', form)
      setForm({ name: '', slug: '', description: '' })
      setMessage('Category created successfully.')
      await refetch()
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageSection
      eyebrow="Catalog"
      title="Categories"
      description="Browse the category list and, as an admin, create categories directly against the protected Laravel API."
    >
      {error ? <StatusBanner type="error" message={error} /> : null}
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel className="overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-900">Current categories</h4>
            <span className="text-sm text-slate-500">{loading ? 'Loading...' : `${rows.length} shown`}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stone-200 text-slate-500">
                <tr>
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Slug</th>
                  <th className="pb-3 pr-4 font-medium">Products</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((category) => (
                  <tr key={category.id} className="border-b border-stone-100 last:border-b-0">
                    <td className="py-3 pr-4 font-medium text-slate-900">{category.name}</td>
                    <td className="py-3 pr-4 text-slate-600">{category.slug}</td>
                    <td className="py-3 pr-4 text-slate-600">{category.products_count ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <h4 className="text-lg font-semibold text-slate-900">Create category</h4>
          <p className="mt-2 text-sm text-slate-600">
            This action is restricted to admin users. Non-admin roles can still view category data.
          </p>
          {!canManage ? <div className="mt-4"><StatusBanner type="info" message="Your current role can view categories but cannot create them." /></div> : null}
          {message ? <div className="mt-4"><StatusBanner type="success" message={message} /></div> : null}
          {submitError ? <div className="mt-4"><StatusBanner type="error" message={submitError} /></div> : null}
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <FormField label="Name" value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} />
            <FormField label="Slug" value={form.slug} onChange={(e) => setForm((v) => ({ ...v, slug: e.target.value }))} />
            <FormField
              as="textarea"
              label="Description"
              value={form.description}
              onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
            />
            <button
              type="submit"
              disabled={!canManage || submitting}
              className="rounded-2xl bg-[#17324d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2740] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create category'}
            </button>
          </form>
        </Panel>
      </div>
    </PageSection>
  )
}
