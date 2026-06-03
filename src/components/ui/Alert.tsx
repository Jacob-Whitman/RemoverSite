import { twMerge } from 'tailwind-merge'
import type { HTMLAttributes } from 'react'

type AlertVariant = 'info' | 'warning' | 'success' | 'danger'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
}

const styles: Record<AlertVariant, string> = {
  info:    'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-orange-50 border-orange-200 text-orange-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  danger:  'bg-red-50 border-red-200 text-red-800',
}

export function Alert({ variant = 'info', title, className, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={twMerge('rounded-md border px-4 py-3 text-sm', styles[variant], className)}
      {...props}
    >
      {title && <p className="font-semibold mb-1">{title}</p>}
      {children}
    </div>
  )
}
