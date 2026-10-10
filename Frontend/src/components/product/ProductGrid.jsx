import React from 'react';
import { ProductCard } from './ProductCard.jsx';
import { Button } from '../ui/Button.jsx';

export function ProductGrid({ products, onResetFilter }) {
  if (!products || products.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--space-12) var(--space-4)',
          textAlign: 'center',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
        }}
      >
        <p style={{ fontSize: 'var(--fs-h3)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
          Tidak ada produk yang cocok
        </p>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          Coba ganti kata kunci pencarian atau pilih kategori lain.
        </p>
        {onResetFilter && (
          <Button variant="secondary" onClick={onResetFilter}>
            Tampilkan Semua Produk
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
