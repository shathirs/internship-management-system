import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Input = forwardRef(function Input(
  {
    className,
    type = 'text',
    startIcon: StartIcon,
    endIcon: EndIcon,
    onEndIconClick,
    ...props
  },
  ref,
) {
  return (
    <div
      className={cn(
        'flex h-12 w-full items-center gap-3 rounded-lg border-2 border-slate-400 bg-white px-3',
        'transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/25',
        'has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-slate-100 has-[:disabled]:opacity-70',
        'has-[:aria-invalid=true]:border-red-500 has-[:aria-invalid=true]:bg-red-50',
        className,
      )}
    >
      {StartIcon ? (
        <StartIcon className="h-5 w-5 shrink-0 text-slate-600" aria-hidden="true" />
      ) : null}

      <input
        ref={ref}
        type={type}
        className="min-w-0 flex-1 border-0 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-500"
        {...props}
      />

      {EndIcon ? (
        onEndIconClick ? (
          <button
            type="button"
            onClick={onEndIconClick}
            className="shrink-0 text-slate-600 hover:text-slate-900"
            aria-label="Toggle password visibility"
          >
            <EndIcon className="h-5 w-5" />
          </button>
        ) : (
          <EndIcon className="h-5 w-5 shrink-0 text-slate-600" aria-hidden="true" />
        )
      ) : null}
    </div>
  )
})
