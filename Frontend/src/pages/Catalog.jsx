import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { ProductGrid } from '../components/product/ProductGrid.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

export function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('kategori') || 'semua';
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'terbaru';

  useEffect(() => {
    async function loadCatalog() {
      setIsLoading(true);
      try {
        const [prodList, catList] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);
        setProducts(prodList);
        setCategories(catList);
      } catch (err) {
        console.error('Gagal mengambil katalog:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const handleCategoryChange = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'semua') {
      params.delete('kategori');
    } else {
      params.set('kategori', slug);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (val.trim()) {
      params.set('q', val);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  const handleResetFilter = () => {
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          activeCategory === 'semua' ||
          (p.category_name && p.category_name.toLowerCase().includes(activeCategory.toLowerCase())) ||
          (p.category_id && categories.find(c => c.slug === activeCategory)?.id === p.category_id);

        const matchesSearch =
          !searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'harga-rendah') return a.price - b.price;
        if (sortBy === 'harga-tinggi') return b.price - a.price;
        if (sortBy === 'nama') return a.name.localeCompare(b.name);
        return b.id - a.id; // terbaru default
      });
  }, [products, categories, activeCategory, searchQuery, sortBy]);

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        {/* Header Katalog */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--fs-h1)', marginBottom: 'var(--space-2)' }}>
            Katalog Produk Pilihan
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-body)' }}>
            Seluruh produk siap dipesan langsung dan dikirim aman ke alamatmu.
          </p>
        </div>

        {/* Filter Bar & Pencarian */}
        <div
          style={{
            backgroundColor: 'var(--cream-100)',
            padding: 'var(--space-4) var(--space-6)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--space-8)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          {/* Baris 1: Pencarian dan Pengurutan */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: '1 1 280px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Cari nama kopi, wadah kayu, camilan..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Cari produk"
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              >
                🔍
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label htmlFor="sort-select" style={{ fontSize: 'var(--fs-small)', fontWeight: 600 }}>
                Urutkan:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={handleSortChange}
                className="form-select"
                style={{ width: 'auto', minWidth: '160px' }}
              >
                <option value="terbaru">Terbaru</option>
                <option value="harga-rendah">Harga: Rendah ke Tinggi</option>
                <option value="harga-tinggi">Harga: Tinggi ke Rendah</option>
                <option value="nama">Nama: A ke Z</option>
              </select>
            </div>
          </div>

          {/* Baris 2: Chip Kategori */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 'var(--fs-tiny)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Kategori:
            </span>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--fs-small)',
                    fontWeight: 600,
                    minHeight: '36px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'var(--color-accent)' : 'var(--cream-200)',
                    color: isActive ? 'var(--cream-100)' : 'var(--color-text)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--color-accent)' : 'var(--color-border)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ringkasan Jumlah Produk */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', margin: 0 }}>
            Menampilkan <strong>{filteredProducts.length}</strong> produk
            {activeCategory !== 'semua' && ` pada kategori "${categories.find(c => c.slug === activeCategory)?.name || activeCategory}"`}
            {searchQuery && ` dengan kata kunci "${searchQuery}"`}
          </p>
          {(activeCategory !== 'semua' || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilter}
              style={{
                fontSize: 'var(--fs-small)',
                color: 'var(--color-accent)',
                textDecoration: 'underline',
                fontWeight: 600,
              }}
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Hasil Katalog */}
        {isLoading ? (
          <Skeleton count={8} />
        ) : (
          <ProductGrid products={filteredProducts} onResetFilter={handleResetFilter} />
        )}
      </div>
    </div>
  );
}
