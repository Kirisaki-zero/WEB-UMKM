import React from 'react';

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ariaLabel,
  ...props
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    icon: 'btn-icon',
    danger: 'btn-danger',
  }[variant] || 'btn-primary';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`btn ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
