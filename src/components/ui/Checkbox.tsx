import { twMerge } from 'tailwind-merge'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  description?: string
  error?: string
}

export function Checkbox({ label, description, error, className, id, ...props }: CheckboxProps) {
  const checkId = id ?? `checkbox-${Math.random().toString(36).slice(2, 8)}`
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-3">
        <input
          id={checkId}
          type="checkbox"
          className={twMerge(
            'mt-0.5 h-4 w-4 rounded border-slate-300 text-navy-700 focus:ring-navy-600 cursor-pointer',
            className
          )}
          {...props}
        />
        <div>
          <label htmlFor={checkId} className="text-sm font-medium text-slate-700 cursor-pointer">
            {label}
          </label>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {error && <p className="text-xs text-red-600 ml-7">{error}</p>}
    </div>
  )
}
