import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-700 shadow-sm',
  secondary: 'bg-ink-900 text-white hover:bg-ink-700 focus-visible:outline-ink-900 shadow-sm',
  outline: 'border border-ink-200 bg-white text-ink-800 hover:bg-ink-50 focus-visible:outline-brand-600',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-800 focus-visible:outline-brand-600',
  danger: 'border border-error-100 bg-error-50 text-error-700 hover:bg-error-100 focus-visible:outline-error-500',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', type = 'button', ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} className={`${btnBase} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
});

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 flex items-center gap-1 text-xs font-medium text-error-600" role="alert">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

const inputBase =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none disabled:cursor-not-allowed disabled:bg-ink-50';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorId?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, errorId, hint, optional, id, className = '', ...props },
  ref,
) {
  const inputId = id ?? props.name ?? `in-${label.replace(/\s/g, '-').toLowerCase()}`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
        {optional && <span className="ml-1 font-normal text-ink-400">(opsional)</span>}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? `${inputId}-hint` : undefined}
        className={`${inputBase} ${error ? 'border-error-500' : 'border-ink-200'}`}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-ink-500">
          {hint}
        </p>
      )}
      <FieldError id={errorId ?? `${inputId}-error`} message={error} />
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  errorId?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, errorId, hint, optional, id, className = '', ...props },
  ref,
) {
  const inputId = id ?? props.name ?? `ta-${label.replace(/\s/g, '-').toLowerCase()}`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
        {optional && <span className="ml-1 font-normal text-ink-400">(opsional)</span>}
      </label>
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? `${inputId}-hint` : undefined}
        className={`${inputBase} min-h-[88px] resize-y ${error ? 'border-error-500' : 'border-ink-200'}`}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-ink-500">
          {hint}
        </p>
      )}
      <FieldError id={errorId ?? `${inputId}-error`} message={error} />
    </div>
  );
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, id, className = '', ...props },
  ref,
) {
  const inputId = id ?? props.name ?? `sel-${label.replace(/\s/g, '-').toLowerCase()}`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
      </label>
      <select ref={ref} id={inputId} className={`${inputBase} border-ink-200`} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export function Fieldset({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-ink-900">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-ink-500">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
