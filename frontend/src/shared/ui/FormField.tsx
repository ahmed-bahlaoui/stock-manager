import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type BaseProps = {
  label: string
  error?: string
  helper?: string
}

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: 'input'
  }

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: 'textarea'
  }

export function FormField(props: InputProps | TextareaProps) {
  const { label, error, helper } = props

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      {props.as === 'textarea' ? (
        <textarea
          {...props}
          className="min-h-[110px] w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-700 focus:bg-white"
        />
      ) : (
        <input
          {...props}
          className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-700 focus:bg-white"
        />
      )}
      {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
      {error ? <p className="text-xs font-medium text-rose-700">{error}</p> : null}
    </label>
  )
}
