import React from 'react';
import { Link } from 'react-router-dom';
import { formatRupiah } from '../../utils/formatRupiah.js';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { useCart } from '../../context/CartContext.jsx';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';

  return (
    <article
      style={{
        backgroundColor: 'var(--cream-100)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
      }}
      className="product-card"
    >
      <Link
        to={`/produk/${product.slug}`}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          paddingTop: '90%', // aspect ratio 1:0.9
          backgroundColor: 'var(--cream-200)',
          overflow: 'hidden',
        }}
        tabIndex={0}
        aria-label={`Lihat detail produk ${product.name}`}
      >
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-normal)',
          }}
          className="product-card-img"
        />
        <div style={{ position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)' }}>
          {isOutOfStock ? (
            <Badge variant="out-of-stock">Stok Habis</Badge>
          ) : (
            <Badge variant="available">Stok: {product.stock}</Badge>
          )}
        </div>
      </Link>

      <div
        style={{
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
        }}
      >
        <div>
          <span
            style={{
              fontSize: 'var(--fs-tiny)',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: 600,
              display: 'block',
              marginBottom: 'var(--space-1)',
            }}
          >
            {product.category_name || 'Katalog Pilihan'}
          </span>
          <h3
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.35,
              marginBottom: 'var(--space-2)',
            }}
          >
            <Link
              to={`/produk/${product.slug}`}
              style={{ color: 'var(--color-text)' }}
            >
              {product.name}
            </Link>
          </h3>
          <p
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--color-accent)',
              margin: 0,
            }}
          >
            {formatRupiah(product.price)}
          </p>
        </div>

        <div style={{ marginTop: 'var(--space-2)' }}>
          {isOutOfStock ? (
            <Button
              variant="secondary"
              disabled
              style={{ width: '100%', opacity: 0.65, cursor: 'not-allowed' }}
            >
              Stok Habis
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleAdd}
              ariaLabel={`Tambah ${product.name} ke keranjang`}
              style={{ width: '100%' }}
            >
              + Keranjang
            </Button>
          )}
        </div>
      </div>

      <style>{`
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-card);
        }
        .product-card:hover .product-card-img {
          transform: scale(1.03);
        }
      `}</style>
    </article>
  );
}
