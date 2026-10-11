import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { formatRupiah } from '../../utils/formatRupiah.js';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Gagal mengambil daftar produk:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      await api.deleteProduct(id);
      loadProducts();
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Semua' || p.category_name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['Semua', ...new Set(products.map((p) => p.category_name).filter(Boolean))];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-1)' }}>
            Kelola Produk
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Total {products.length} barang terdaftar di katalog
          </p>
        </div>
        <Link to="/admin/produk/baru">
          <Button variant="primary">+ Tambah Produk</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Cari nama atau kategori produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '240px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--cream-100)',
            color: 'var(--brown-900)',
            fontSize: 'var(--fs-small)'
          }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--cream-100)',
            color: 'var(--brown-900)',
            fontSize: 'var(--fs-small)',
            cursor: 'pointer'
          }}
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat === 'Semua' ? 'Semua Kategori' : cat}
            </option>
          ))}
        </select>
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
            Memuat daftar produk...
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
              Belum ada produk di dalam katalog.
            </p>
            <Link to="/admin/produk/baru">
              <Button variant="primary">+ Tambah Produk Pertama</Button>
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-small)', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--cream-200)', borderBottom: '2px solid var(--color-border)', color: 'var(--brown-900)' }}>
                  <th style={{ padding: '12px 16px' }}>Foto</th>
                  <th style={{ padding: '12px 16px' }}>Nama Produk</th>
                  <th style={{ padding: '12px 16px' }}>Kategori</th>
                  <th style={{ padding: '12px 16px' }}>Harga</th>
                  <th style={{ padding: '12px 16px' }}>Stok</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 16px', width: '60px' }}>
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80'}
                        alt={p.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                      <Link to={`/produk/${p.slug}`} target="_blank" style={{ color: 'var(--color-text)' }}>
                        {p.name}
                      </Link>
                      {p.is_featured && (
                        <span style={{ marginLeft: '8px', fontSize: 'var(--fs-tiny)', color: 'var(--color-accent)', fontWeight: 700 }}>
                          ★ Pilihan
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                      {p.category_name || '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-accent)' }}>
                      {formatRupiah(p.price)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.stock <= 0 ? (
                        <Badge variant="out-of-stock">Habis (0)</Badge>
                      ) : p.stock <= 5 ? (
                        <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{p.stock} pcs</span>
                      ) : (
                        <span>{p.stock} pcs</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Link to={`/admin/produk/edit/${p.id}`}>
                          <Button variant="secondary" style={{ padding: '4px 10px', fontSize: 'var(--fs-tiny)', minHeight: '32px' }}>
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(p.id, p.name)}
                          style={{
                            padding: '4px 10px',
                            fontSize: 'var(--fs-tiny)',
                            minHeight: '32px',
                            backgroundColor: 'var(--danger-100)',
                            color: 'var(--danger-600)',
                          }}
                        >
                          Hapus
                        </Button>
                      </div>
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
