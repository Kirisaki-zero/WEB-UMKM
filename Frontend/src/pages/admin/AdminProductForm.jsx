import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

export function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category_id: 2,
    category_name: 'Kopi & Minuman',
    price: 50000,
    stock: 10,
    imageUrl: '',
    description: '',
    is_featured: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadInitial() {
      const catList = await api.getCategories();
      setCategories(catList.filter(c => c.slug !== 'semua'));

      if (isEditMode) {
        const prodList = await api.getProducts();
        const found = prodList.find((p) => p.id === Number(id));
        if (found) {
          setFormData({
            id: found.id,
            name: found.name,
            category_id: found.category_id || 2,
            category_name: found.category_name || '',
            price: found.price || 0,
            stock: found.stock || 0,
            imageUrl: found.images?.[0] || '',
            description: found.description || '',
            is_featured: !!found.is_featured,
          });
        }
      }
    }
    loadInitial();
  }, [id, isEditMode]);

  const handleCategoryChange = (e) => {
    const selectedId = Number(e.target.value);
    const cat = categories.find((c) => c.id === selectedId);
    setFormData({
      ...formData,
      category_id: selectedId,
      category_name: cat ? cat.name : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price < 0 || formData.stock < 0) {
      alert('Mohon isi nama produk, harga, dan stok dengan benar.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...(isEditMode ? { id: Number(id) } : {}),
        name: formData.name.trim(),
        category_id: formData.category_id,
        category_name: formData.category_name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'],
        description: formData.description.trim(),
        is_featured: formData.is_featured,
      };

      await api.saveProduct(payload);
      navigate('/admin/produk');
    } catch (err) {
      console.error('Gagal menyimpan produk:', err);
      alert('Terjadi kesalahan saat menyimpan produk.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-1)' }}>
          {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
          {isEditMode ? 'Perbarui informasi dan stok produk' : 'Masukkan informasi produk untuk ditampilkan di katalog'}
        </p>
      </div>

      <div
        style={{
          backgroundColor: 'var(--cream-100)',
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Produk"
            id="prod-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: Kopi Robusta Temanggung (200g)"
            required
          />

          <div className="form-group">
            <label htmlFor="prod-cat" className="form-label">Kategori:</label>
            <select
              id="prod-cat"
              value={formData.category_id}
              onChange={handleCategoryChange}
              className="form-select"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input
              label="Harga (Rupiah)"
              id="prod-price"
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />

            <Input
              label="Stok Tersedia"
              id="prod-stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
          </div>

          <Input
            label="URL Foto Produk"
            id="prod-img"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            helperText="Gunakan URL gambar publik atau kosongkan untuk gambar contoh alami"
          />

          {formData.imageUrl && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: 'var(--fs-tiny)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Pratinjau Foto:
              </span>
              <img
                src={formData.imageUrl}
                alt="Pratinjau"
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <Input
            as="textarea"
            label="Deskripsi Produk"
            id="prod-desc"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Jelaskan bahan baku, ukuran, aroma/rasa, dan cara penyimpanan produk..."
          />

          <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              />
              Tampilkan sebagai Produk Pilihan di Beranda
            </label>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Terbitkan Produk'}
            </Button>
            <Link to="/admin/produk">
              <Button variant="secondary">Batal</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
