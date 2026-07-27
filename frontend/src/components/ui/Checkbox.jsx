import { cn } from '../../lib/utils'

export function Checkbox({ className, label, id, ...props }) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800',
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-slate-500 text-blue-600 focus:ring-blue-600"
        {...props}
      />
      {label ? <span>{label}</span> : null}
    </label>
  )
}
