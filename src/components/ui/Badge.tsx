import { twMerge } from 'tailwind-merge'
import type { HTMLAttributes } from 'react'

type BadgeVariant = 'neutral' | 'info' | 'warning' | 'success' | 'danger' | 'amber'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  info:    'bg-blue-50 text-blue-700',
  warning: 'bg-orange-50 text-orange-700',
  success: 'bg-green-50 text-green-700',
  danger:  'bg-red-50 text-red-700',
  amber:   'bg-amber-50 text-amber-700',
}

export function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={twMerge('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}
