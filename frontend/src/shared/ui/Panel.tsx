import type { ReactNode } from 'react'

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  )
}
