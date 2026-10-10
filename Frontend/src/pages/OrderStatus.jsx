import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { formatRupiah } from '../utils/formatRupiah.js';

export function OrderStatus() {
  const { kode } = useParams();
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      try {
        const [ordersList, storeSettings] = await Promise.all([
          api.getOrders(),
          api.getSettings(),
        ]);
        const found = ordersList.find((o) => o.code === kode);
        setOrder(found || null);
        setSettings(storeSettings);
      } catch (err) {
        console.error('Gagal mengambil data pesanan:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [kode]);

  return (
    <div className="section" style={{ paddingTop: 'var(--space-12)' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div
          style={{
            backgroundColor: 'var(--cream-100)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-8)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--green-100)',
              color: 'var(--green-700)',
              fontSize: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)',
            }}
          >
            ✓
          </div>

          <h1 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-2)' }}>
            Pesanan Berhasil Dicatat!
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
            Rincian pesananmu telah tersimpan di sistem kami.
          </p>

          {/* Kartu Rincian Kode */}
          <div
            style={{
              backgroundColor: 'var(--cream-200)',
              padding: 'var(--space-4) var(--space-6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-6)',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Kode Pesanan
              </span>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                {kode}
              </p>
            </div>
            <div>
              <Badge variant={order?.status || 'baru'}>
                Status: {order?.status ? order.status.toUpperCase() : 'MENUNGGU KONFIRMASI'}
              </Badge>
            </div>
          </div>

          {order && (
            <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--fs-small)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                Rincian Barang:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {order.items?.map((it, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-small)' }}>
                    <span>{it.name} ({it.qty}x)</span>
                    <span style={{ fontWeight: 600 }}>{formatRupiah(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)', borderTop: '1px dashed var(--color-border)', paddingTop: 'var(--space-2)', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-accent)' }}>{formatRupiah(order.total)}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <a
              href={`https://wa.me/${settings?.wa_number || '6281234567890'}?text=${encodeURIComponent(`Halo Omah Kriya, saya ingin menanyakan perkembangan pesanan dengan kode ${kode}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" style={{ width: '100%' }}>
                Buka WhatsApp Penjual
              </Button>
            </a>
            <Link to="/produk">
              <Button variant="secondary" style={{ width: '100%' }}>
                Kembali ke Katalog Produk
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
