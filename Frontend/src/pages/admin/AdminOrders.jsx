import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { formatRupiah } from '../../utils/formatRupiah.js';
import { Badge } from '../../components/ui/Badge.jsx';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await api.updateOrderStatus(orderId, newStatus);
    loadOrders();
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus === 'semua') return true;
    return o.status === selectedStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-1)' }}>
            Daftar Pesanan
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Kelola transaksi dan status pesanan masuk
          </p>
        </div>

        {/* Filter Status */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['semua', 'baru', 'diproses', 'selesai', 'batal'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--fs-tiny)',
                fontWeight: 600,
                textTransform: 'capitalize',
                backgroundColor: selectedStatus === st ? 'var(--color-accent)' : 'var(--cream-100)',
                color: selectedStatus === st ? 'var(--cream-100)' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--cream-100)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
      >
        {isLoading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Memuat daftar pesanan...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Belum ada pesanan dengan status "{selectedStatus}".
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-small)', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--cream-200)', borderBottom: '2px solid var(--color-border)', color: 'var(--brown-900)' }}>
                  <th style={{ padding: '12px 16px' }}>Kode & Waktu</th>
                  <th style={{ padding: '12px 16px' }}>Pemesan</th>
                  <th style={{ padding: '12px 16px' }}>Rincian Barang</th>
                  <th style={{ padding: '12px 16px' }}>Total</th>
                  <th style={{ padding: '12px 16px' }}>Ubah Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--color-border)', verticalAlign: 'top' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ display: 'block', fontSize: 'var(--fs-body)' }}>{ord.code}</strong>
                      <span style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-text-muted)' }}>
                        {ord.created_at ? new Date(ord.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ margin: 0, fontWeight: 600 }}>{ord.customer_name}</p>
                      <a
                        href={`https://wa.me/${ord.customer_phone?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--color-accent)', textDecoration: 'underline', fontSize: 'var(--fs-tiny)' }}
                      >
                        WA: {ord.customer_phone}
                      </a>
                      <p style={{ margin: '4px 0 0', fontSize: 'var(--fs-tiny)', color: 'var(--color-text-muted)' }}>
                        Metode: {ord.delivery_method === 'pickup' ? 'Ambil di Toko' : 'Kirim Ekspedisi'}
                      </p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--fs-tiny)' }}>
                        {ord.items?.map((it, idx) => (
                          <li key={idx} style={{ marginBottom: '2px' }}>
                            • {it.name} <strong>({it.qty}x)</strong>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-accent)' }}>
                      {formatRupiah(ord.total)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={ord.status || 'baru'}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: 'var(--fs-tiny)', minHeight: '34px' }}
                      >
                        <option value="baru">Baru</option>
                        <option value="diproses">Diproses</option>
                        <option value="selesai">Selesai</option>
                        <option value="batal">Batal</option>
                      </select>
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
