import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

type ButtonTone = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const toneClasses: Record<ButtonTone, string> = {
  primary: 'bg-[var(--terracotta)] text-white border-[var(--terracotta)] hover:bg-[var(--terracotta-dark)]',
  secondary: 'bg-white text-[var(--ink)] border-[var(--soft-border)] hover:bg-[var(--cream-100)]',
  ghost: 'bg-transparent text-[var(--muted)] border-transparent hover:bg-[var(--cream-100)] hover:text-[var(--ink)]',
  danger: 'bg-white text-[var(--danger)] border-[#e3b6ae] hover:bg-[#fff1ed]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: ButtonTone
  size?: ButtonSize
  icon?: ReactNode
}

export function Button({ className, tone = 'primary', size = 'md', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      type="button"
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

type ButtonLinkProps = {
  to: string
  tone?: ButtonTone
  size?: ButtonSize
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export function ButtonLink({ to, tone = 'primary', size = 'md', icon, children, className }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition',
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      to={to}
    >
      {icon}
      {children}
    </Link>
  )
}
