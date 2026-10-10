import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { ProductGallery } from '../components/product/ProductGallery.jsx';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { formatRupiah } from '../utils/formatRupiah.js';

export function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const [foundProduct, allProducts, storeSettings] = await Promise.all([
          api.getProductBySlug(slug),
          api.getProducts(),
          api.getSettings(),
        ]);
        setProduct(foundProduct);
        setSettings(storeSettings);

        if (foundProduct) {
          const related = allProducts
            .filter((p) => p.id !== foundProduct.id && (p.category_id === foundProduct.category_id || p.category_name === foundProduct.category_name))
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Gagal mengambil data produk:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
    setQuantity(1);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
          <h1 style={{ marginBottom: 'var(--space-4)' }}>Produk Tidak Ditemukan</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
            Produk yang kamu tuju mungkin telah dipindahkan atau sudah tidak aktif.
          </p>
          <Link to="/produk">
            <Button variant="primary">Kembali ke Katalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  const waQuestionText = `Halo Omah Kriya, saya tertarik dengan produk "${product.name}". Apakah stoknya masih tersedia?`;
  const waUrl = `https://wa.me/${settings?.wa_number || '6281234567890'}?text=${encodeURIComponent(waQuestionText)}`;

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        {/* Breadcrumb Navigasi */}
        <nav
          aria-label="Breadcrumb"
          style={{
            fontSize: 'var(--fs-small)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-6)',
            display: 'flex',
            gap: 'var(--space-2)',
            alignItems: 'center',
          }}
        >
          <Link to="/" style={{ textDecoration: 'underline' }}>Beranda</Link>
          <span>/</span>
          <Link to="/produk" style={{ textDecoration: 'underline' }}>Katalog</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{product.name}</span>
        </nav>

        {/* Grid Detail Produk: 2 Kolom di Desktop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-10)',
            marginBottom: 'var(--space-16)',
            alignItems: 'start',
          }}
        >
          {/* Kolom Kiri: Galeri Foto */}
          <div>
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Kolom Kanan: Rincian Produk & Aksi Beli */}
          <div
            style={{
              backgroundColor: 'var(--cream-100)',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {product.category_name || 'Katalog'}
                </span>
                {isOutOfStock ? (
                  <Badge variant="out-of-stock">Stok Habis</Badge>
                ) : (
                  <Badge variant="available">Tersedia {product.stock} pcs</Badge>
                )}
              </div>

              <h1 style={{ fontSize: 'var(--fs-h2)', lineHeight: 1.25, marginBottom: 'var(--space-3)' }}>
                {product.name}
              </h1>

              <p
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  margin: 0,
                }}
              >
                {formatRupiah(product.price)}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                Deskripsi Produk
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: 'var(--fs-body)', margin: 0 }}>
                {product.description || 'Produk buatan perajin lokal dengan bahan pilihan.'}
              </p>
            </div>

            {/* Pemilihan Jumlah dan Tombol Aksi */}
            {!isOutOfStock && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                <label style={{ fontSize: 'var(--fs-small)', fontWeight: 600, display: 'block', marginBottom: 'var(--space-2)' }}>
                  Jumlah Pembelian:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Kurangi kuantitas"
                      style={{ width: '44px', height: '44px', fontSize: '1.25rem', fontWeight: 'bold' }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 600 }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      aria-label="Tambah kuantitas"
                      style={{ width: '44px', height: '44px', fontSize: '1.25rem', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                  </div>
                  <span style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-text-muted)' }}>
                    (Maksimal {product.stock} pcs)
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {isOutOfStock ? (
                <Button variant="secondary" disabled style={{ width: '100%', opacity: 0.6 }}>
                  Produk Ini Sedang Habis
                </Button>
              ) : (
                <Button variant="primary" onClick={handleAddToCart} style={{ width: '100%' }}>
                  + Tambah {quantity} ke Keranjang ({formatRupiah(product.price * quantity)})
                </Button>
              )}

              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" style={{ width: '100%' }}>
                  💬 Tanya Produk Ini via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Rekomendasi Produk Terkait */}
        {relatedProducts.length > 0 && (
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-12)' }}>
            <h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-6)' }}>
              Produk Lain di Kategori Serupa
            </h2>
            <div className="product-grid">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
