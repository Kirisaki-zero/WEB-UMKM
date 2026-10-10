import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { ProductGrid } from '../components/product/ProductGrid.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

export function Home() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [prodData, settData] = await Promise.all([
          api.getProducts(),
          api.getSettings(),
        ]);
        setProducts(prodData);
        setSettings(settData);
      } catch (err) {
        console.error('Gagal memuat data beranda:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="section" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-16)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-10)',
              alignItems: 'center',
            }}
          >
            {/* Teks Hero */}
            <div>
              <span
                style={{
                  fontSize: 'var(--fs-small)',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'inline-block',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Karya Perajin & Dapur Tradisional
              </span>
              <h1
                style={{
                  fontSize: 'var(--fs-display)',
                  lineHeight: 1.15,
                  marginBottom: 'var(--space-4)',
                }}
              >
                Menikmati Keaslian Rasa dan Kriya Nusantara
              </h1>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6,
                  marginBottom: 'var(--space-6)',
                  maxWidth: '520px',
                }}
              >
                Diproduksi dari bahan alami pilihan oleh tangan-tangan terampil lokal. Belanja mudah, transparan, dan terhubung langsung ke WhatsApp pengrajin.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center' }}>
                <Link to="/produk">
                  <Button variant="primary">
                    Lihat Katalog Produk
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/${settings?.wa_number || '6281234567890'}?text=${encodeURIComponent('Halo Omah Kriya, saya ingin bertanya seputar produk.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary">
                    Tanya Penjual via WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Foto Hero Asli */}
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: 'var(--cream-200)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                alt="Produk kopi dan kriya lokal"
                fetchPriority="high"
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 'var(--space-4)',
                  left: 'var(--space-4)',
                  right: 'var(--space-4)',
                  backgroundColor: 'rgba(253, 251, 247, 0.95)',
                  backdropFilter: 'blur(4px)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <p style={{ margin: 0, fontSize: 'var(--fs-small)', fontWeight: 600, color: 'var(--brown-900)' }}>
                  Koleksi Musim Ini: Biji Kopi Arabika Puntang & Wadah Jati Utuh
                </p>
                <p style={{ margin: 0, fontSize: 'var(--fs-tiny)', color: 'var(--color-text-muted)' }}>
                  Stok terbatas langsung dari tempat produksi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motif Pemisah Garis Serat Kayu */}
      <div className="wave-divider" style={{ backgroundImage: 'url(data:image/svg+xml;utf8,<svg%20xmlns="http://www.w3.org/2000/svg"%20viewBox="0%200%201200%2024"%20fill="none"><path%20d="M0%2012%20Q%20150%202%20300%2012%20T%20600%2012%20T%20900%2012%20T%201200%2012"%20stroke="%23E8DFD2"%20stroke-width="1.75"%20stroke-linecap="round"/><path%20d="M0%2018%20Q%20150%2014%20300%2018%20T%20600%2018%20T%20900%2018%20T%201200%2018"%20stroke="%23E8DFD2"%20stroke-width="1"%20stroke-dasharray="8%206"%20opacity="0.6"/></svg>)' }} />

      {/* 2. Produk Unggulan */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-8)',
            }}
          >
            <div>
              <h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-2)' }}>
                Produk Pilihan Pekan Ini
              </h2>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                Koleksi yang paling sering dicari dan dipesan pelanggan
              </p>
            </div>
            <Link to="/produk">
              <Button variant="secondary">
                Lihat Semua ({products.length} Produk) →
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <Skeleton count={4} />
          ) : (
            <ProductGrid products={featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)} />
          )}
        </div>
      </section>

      {/* 3. Cerita Usaha & Bahan Alami */}
      <section className="section section-alt">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-10)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: 'var(--cream-100)',
                border: '1px solid var(--color-border)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"
                alt="Proses anyaman kerajinan tangan"
                style={{ width: '100%', height: '360px', objectFit: 'cover' }}
              />
            </div>

            <div>
              <span
                style={{
                  fontSize: 'var(--fs-small)',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Cerita Pembuatan
              </span>
              <h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-4)' }}>
                Dibuat Perlahan, Menghargai Waktu dan Bahan
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
                Setiap wadah kayu dipahat dari sisa tebangan legal, dan setiap racikan bumbu diolah tanpa perisa buatan. Kami percaya bahwa kualitas yang bertahan lama berasal dari kesabaran dalam proses.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                Dengan membeli dari kami, kamu turut mendukung keberlangsungan hidup tiga bengkel kriya mandiri dan kelompok ibu perajin di Mantrijeron.
              </p>
              <Link to="/tentang">
                <Button variant="secondary">
                  Pelajari Lebih Dalam Tentang Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Alur Pemesanan Riil */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: '600px', marginInline: 'auto' }}>
            <h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-2)' }}>
              Cara Belanja Sederhana
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Tidak perlu repot membuat akun. Pesan langsung melalui WhatsApp.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-6)',
              marginTop: 'var(--space-8)',
            }}
          >
            {[
              {
                step: '1',
                title: 'Pilih Produk',
                desc: 'Jelajahi katalog dan klik tombol tambah ke keranjang pada barang yang diinginkan.',
              },
              {
                step: '2',
                title: 'Isi Data Diri',
                desc: 'Tulis nama, nomor kontak, serta pilih ambil di toko atau kirim kurir ke alamat.',
              },
              {
                step: '3',
                title: 'Kirim via WhatsApp',
                desc: 'Klik tombol kirim pesanan, sistem otomatis menyusun format pesan rapi ke nomor penjual.',
              },
              {
                step: '4',
                title: 'Konfirmasi & Kirim',
                desc: 'Penjual memverifikasi ketersediaan stok, memberikan nomor resi, dan paket segera diproses.',
              },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  backgroundColor: 'var(--cream-100)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-6)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-accent)',
                    border: '1.5px solid var(--color-accent)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
