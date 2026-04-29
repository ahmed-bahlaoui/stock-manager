import { useApi } from '../shared/hooks/useApi'
import type { PaginatedResponse, StockMovement } from '../shared/types/api'
import { PageSection } from '../shared/ui/PageSection'
import { Panel } from '../shared/ui/Panel'
import { StatusBanner } from '../shared/ui/StatusBanner'

export function StockMovementsPage() {
  const { data, loading, error } = useApi<PaginatedResponse<StockMovement>>('/stock-movements')

  return (
    <PageSection
      eyebrow="Audit trail"
      title="Stock movements"
      description="This page makes the stock audit trail visible: every inbound and outbound quantity change is recorded and can be tied back to orders."
    >
      <Panel className="overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-slate-900">Movement log</h4>
          <span className="text-sm text-slate-500">{loading ? 'Loading...' : `${data?.data.length ?? 0} shown`}</span>
        </div>
        {error ? <StatusBanner type="error" message={error} /> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-stone-200 text-slate-500">
              <tr>
                <th className="pb-3 pr-4 font-medium">Type</th>
                <th className="pb-3 pr-4 font-medium">Product</th>
                <th className="pb-3 pr-4 font-medium">Order</th>
                <th className="pb-3 pr-4 font-medium">Quantity</th>
                <th className="pb-3 pr-4 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((movement) => (
                <tr key={movement.id} className="border-b border-stone-100 last:border-b-0">
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        movement.type === 'stock_in'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {movement.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-700">
                    <div className="font-medium text-slate-900">{movement.product?.name ?? '-'}</div>
                    <div className="text-xs uppercase tracking-[0.14em] text-slate-500">{movement.product?.sku ?? '-'}</div>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{movement.order_number ?? '-'}</td>
                  <td className="py-3 pr-4 text-slate-600">{movement.quantity}</td>
                  <td className="py-3 pr-4 text-slate-600">{movement.note ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageSection>
  )
}
