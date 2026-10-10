import React from 'react';

export function Badge({ children, variant = 'available', className = '' }) {
  const variantClass = {
    available: 'badge-available',
    'out-of-stock': 'badge-out-of-stock',
    baru: 'badge-available',
    diproses: 'badge-available',
    selesai: 'badge-available',
    batal: 'badge-out-of-stock',
  }[variant] || 'badge-available';

  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
