import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { Drawer } from '../ui/Drawer.jsx';
import { Button } from '../ui/Button.jsx';
import { formatRupiah } from '../../utils/formatRupiah.js';

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQty, removeFromCart, totalPrice, totalCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleBrowse = () => {
    closeCart();
    navigate('/produk');
  };

  return (
    <Drawer isOpen={isCartOpen} onClose={closeCart} title={`Keranjang (${totalCount})`}>
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🧺</p>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>
            Keranjang belanja masih kosong
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-small)', marginBottom: 'var(--space-6)' }}>
            Pilih produk kriya atau olahan rasa favoritmu dari katalog kami.
          </p>
          <Button variant="primary" onClick={handleBrowse} style={{ width: '100%' }}>
            Lihat Katalog Produk
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {/* List Item Keranjang */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', overflowY: 'auto' }}>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 'var(--space-3)',
                  paddingBottom: 'var(--space-4)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80'}
                  alt={item.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--cream-200)',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 'var(--fs-small)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: 'var(--fs-small)', fontWeight: 700, color: 'var(--color-accent)', margin: 0 }}>
                    {formatRupiah(item.price)}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label={`Kurangi jumlah ${item.name}`}
                        style={{ width: '32px', height: '32px', minHeight: '32px', fontSize: '1rem', fontWeight: 'bold' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 8px', fontSize: 'var(--fs-small)', fontWeight: 600 }}>
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label={`Tambah jumlah ${item.name}`}
                        style={{ width: '32px', height: '32px', minHeight: '32px', fontSize: '1rem', fontWeight: 'bold' }}
                      >
                        +
                      </button>
                    </div>

                    {/* Hapus button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Hapus ${item.name} dari keranjang`}
                      style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-danger)', textDecoration: 'underline', minHeight: '32px' }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bagian Total & Checkout */}
          <div
            style={{
              paddingTop: 'var(--space-4)',
              borderTop: '2px solid var(--color-border)',
              marginTop: 'var(--space-4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: 'var(--fs-body)', fontWeight: 600 }}>Total Pesanan</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                {formatRupiah(totalPrice)}
              </span>
            </div>
            <Button
              variant="primary"
              onClick={handleCheckout}
              style={{ width: '100%' }}
            >
              Lanjut ke Pembayaran ({formatRupiah(totalPrice)})
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
