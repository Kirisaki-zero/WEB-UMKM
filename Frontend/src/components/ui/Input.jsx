import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  as = 'input',
  rows = 3,
  className = '',
  ...props
}) {
  const Component = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <Component
        id={id}
        type={as === 'textarea' ? undefined : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={as === 'textarea' ? rows : undefined}
        className={as === 'textarea' ? 'form-textarea' : 'form-input'}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} style={{ color: 'var(--color-danger)', fontSize: 'var(--fs-tiny)', fontWeight: 500 }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${id}-helper`} style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-tiny)' }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
