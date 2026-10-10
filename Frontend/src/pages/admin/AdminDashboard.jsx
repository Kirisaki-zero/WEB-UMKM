import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { formatRupiah } from '../../utils/formatRupiah.js';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';

export function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadData() {
      const [p, o] = await Promise.all([api.getProducts(), api.getOrders()]);
      setProducts(p);
      setOrders(o);
    }
    loadData();
  }, []);

  const totalOmset = orders.reduce((sum, item) => sum + (item.total || 0), 0);
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-1)' }}>
            Ringkasan Toko
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Pantau pergerakan stok barang dan pesanan pembeli
          </p>
        </div>
        <Link to="/admin/produk/baru">
          <Button variant="primary">+ Tambah Produk Baru</Button>
        </Link>
      </div>

      {/* Kartu Metrik Riil (Tanpa Angka Fiktif) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)',
        }}
      >
        <div style={{ backgroundColor: 'var(--cream-100)', padding: 'var(--space-5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Katalog Produk
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 700, margin: 'var(--space-1) 0 0', color: 'var(--brown-900)' }}>
            {products.length}
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--cream-100)', padding: 'var(--space-5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Pesanan Masuk
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 700, margin: 'var(--space-1) 0 0', color: 'var(--brown-900)' }}>
            {orders.length}
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--cream-100)', padding: 'var(--space-5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Nilai Pesanan
          </span>
          <p style={{ fontSize: '1.6rem', fontWeight: 700, margin: 'var(--space-1) 0 0', color: 'var(--color-accent)' }}>
            {formatRupiah(totalOmset)}
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--cream-100)', padding: 'var(--space-5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Stok Menipis (≤ 5)
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 700, margin: 'var(--space-1) 0 0', color: lowStockProducts.length > 0 ? 'var(--color-danger)' : 'var(--color-accent)' }}>
            {lowStockProducts.length}
          </p>
        </div>
      </div>

      {/* Bagian Peringatan Stok Menipis */}
      {lowStockProducts.length > 0 && (
        <div style={{ backgroundColor: 'var(--danger-100)', border: '1px solid rgba(162,59,42,0.2)', padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-8)' }}>
          <strong style={{ color: 'var(--danger-600)', display: 'block', marginBottom: 'var(--space-2)' }}>
            ⚠️ Perhatian: Terdapat {lowStockProducts.length} produk dengan stok kritis atau habis:
          </strong>
          <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--color-text)', fontSize: 'var(--fs-small)' }}>
            {lowStockProducts.map((lp) => (
              <li key={lp.id}>
                {lp.name} (Sisa stok: <strong>{lp.stock}</strong>) -{' '}
                <Link to={`/admin/produk/edit/${lp.id}`} style={{ textDecoration: 'underline', color: 'var(--color-accent)' }}>
                  Perbarui Stok
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pesanan Terbaru */}
      <div style={{ backgroundColor: 'var(--cream-100)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--fs-h3)', margin: 0 }}>Pesanan Masuk Terbaru</h2>
          <Link to="/admin/pesanan" style={{ fontSize: 'var(--fs-small)', color: 'var(--color-accent)', fontWeight: 600 }}>
            Lihat Semua Pesanan →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-small)', margin: 0 }}>
            Belum ada transaksi pesanan yang masuk.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-small)', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '8px' }}>Kode</th>
                  <th style={{ padding: '8px' }}>Pemesan</th>
                  <th style={{ padding: '8px' }}>Total</th>
                  <th style={{ padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 600 }}>{ord.code}</td>
                    <td style={{ padding: '10px 8px' }}>{ord.customer_name}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 600 }}>{formatRupiah(ord.total)}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <Badge variant={ord.status || 'baru'}>{ord.status || 'baru'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
