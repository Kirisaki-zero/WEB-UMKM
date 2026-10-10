import React from 'react';

export function Skeleton({ count = 4 }) {
  return (
    <div style={{ padding: 'var(--space-8) 0', textAlign: 'center' }}>
      <div className="product-grid" style={{ marginBottom: 'var(--space-6)' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'var(--cream-200)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              padding: 'var(--space-4)',
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '160px',
                backgroundColor: 'var(--cream-300)',
                borderRadius: 'var(--radius-sm)',
                opacity: 0.7,
              }}
            />
            <div style={{ width: '70%', height: '18px', backgroundColor: 'var(--cream-300)', borderRadius: '4px' }} />
            <div style={{ width: '45%', height: '14px', backgroundColor: 'var(--cream-300)', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-small)' }}>
        Memuat data katalog produk...
      </p>
    </div>
  );
}
