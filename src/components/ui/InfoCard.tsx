import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export function InfoCard({
  title,
  children,
  icon,
  className,
}: {
  title?: string
  children: ReactNode
  icon?: ReactNode
  className?: string
}) {
  return (
    <section className={cn('soft-card p-5', className)}>
      <div className="flex items-start gap-3">
        {icon ? <div className="mt-0.5 rounded-lg bg-[var(--cream-100)] p-2 text-[var(--terracotta)]">{icon}</div> : null}
        <div className="min-w-0">
          {title ? <h2 className="text-lg font-semibold text-[var(--ink)]">{title}</h2> : null}
          <div className={cn('text-sm leading-6 text-[var(--muted)]', title ? 'mt-2' : '')}>{children}</div>
        </div>
      </div>
    </section>
  )
}
