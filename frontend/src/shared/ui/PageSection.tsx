import type { ReactNode } from 'react'

type PageSectionProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

export function PageSection({ eyebrow, title, description, children }: PageSectionProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-teal-700">{eyebrow}</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  )
}
