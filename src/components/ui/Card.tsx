import { twMerge } from 'tailwind-merge'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }

export function Card({ padding = 'md', className, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge('bg-white rounded-lg border border-slate-200 shadow-sm', paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  )
}
