import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type Tone = 'cream' | 'green' | 'red' | 'gold'

const toneClasses: Record<Tone, string> = {
  cream: 'border-[var(--soft-border)] bg-[var(--cream-100)] text-[var(--muted)]',
  green: 'border-[#cfe0bd] bg-[var(--mint)] text-[var(--green-dark)]',
  red: 'border-[#ecc0b8] bg-[#fff1ed] text-[var(--danger)]',
  gold: 'border-[#ead0a2] bg-[#fff5dc] text-[#8a5d18]',
}

export function StatusPill({ children, tone = 'cream', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold', toneClasses[tone], className)}>
      {children}
    </span>
  )
}
