import { cn } from '../../lib/utils'

export function Label({ className, children, ...props }) {
  return (
    <label
      className={cn('mb-2 block text-sm font-bold text-slate-900', className)}
      {...props}
    >
      {children}
    </label>
  )
}
