import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn('page-band py-10 md:py-14', className)}>{children}</main>
}
