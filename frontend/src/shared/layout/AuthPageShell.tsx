import type { ReactNode } from 'react'

export function AuthPageShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-transparent px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-stone-300/70 bg-[#17324d] p-8 text-stone-50 shadow-[0_24px_60px_rgba(23,50,77,0.18)] lg:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-200/80">Stock Manager</p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight lg:text-5xl">
            Operational control for your inventory, orders, and stock history.
          </h1>
          <p className="mt-5 max-w-lg text-base text-stone-300">
            This frontend is built to exercise the Laravel API in a clear, role-aware way for your prototype demo.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Admin</p>
              <p className="mt-3 text-sm text-stone-200">Full access to categories, products, stock-in, orders, and movement history.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Warehouse / Sales</p>
              <p className="mt-3 text-sm text-stone-200">Role-limited access makes the authorization layer visible during the demo.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-stone-300/70 bg-[#fffdf8] p-6 shadow-[0_24px_60px_rgba(90,70,30,0.08)] lg:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-teal-700">{subtitle}</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h2>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </div>
  )
}
