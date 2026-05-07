import type { ReactNode } from 'react'

export function PageTitle({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
  aside?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-3 text-sm font-semibold text-[var(--gold)]">{eyebrow}</p> : null}
        <h1 className="text-4xl font-semibold leading-tight text-[var(--ink)] md:text-5xl">{title}</h1>
        {children ? <div className="mt-4 text-base leading-7 text-[var(--muted)]">{children}</div> : null}
      </div>
      {aside ? <div className="flex shrink-0 flex-wrap gap-2">{aside}</div> : null}
    </div>
  )
}
