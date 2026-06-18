import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full text-left">
        {label && (
          <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-md border border-brand-border bg-brand-bg/50 px-3 py-2 text-sm text-brand-text placeholder-gray-500 transition-all focus:border-brand-primary focus:bg-brand-bg focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-brand-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
