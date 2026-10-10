import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { Button } from '../components/ui/Button.jsx';

export function About() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      const data = await api.getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header Tentang Kami */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <span
            style={{
              fontSize: 'var(--fs-small)',
              fontWeight: 700,
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: 'var(--space-2)',
            }}
          >
            Mengenal Lebih Dekat
          </span>
          <h1 style={{ fontSize: 'var(--fs-display)', marginBottom: 'var(--space-4)' }}>
            Perjalanan Omah Kriya & Rasa Lokal
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.7,
              maxWidth: '700px',
              marginInline: 'auto',
            }}
          >
            Menyajikan kreasi tangan dan olahan tradisional nusantara yang dikerjakan dengan kesabaran, kejujuran bahan, dan penghormatan pada tradisi.
          </p>
        </div>

        {/* Gambar Workshop */}
        <div
          style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: 'var(--cream-200)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--space-10)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80"
            alt="Suasana bengkel kriya dan bahan alami"
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
        </div>

        {/* Narasi Usaha */}
        <div
          style={{
            backgroundColor: 'var(--cream-100)',
            padding: 'var(--space-8)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            lineHeight: 1.8,
            fontSize: '1.05rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-10)',
          }}
        >
          <h2 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-2)' }}>
            Awal Mula Pendirian
          </h2>
          <p>
            {settings?.about_story ||
              'Omah Kriya & Rasa Lokal berawal dari komitmen keluarga kecil di Mantrijeron untuk mengangkat hasil tani dan kerajinan tangan dari desa sekitar. Kami bekerja sama langsung dengan perajin kayu dan pembuat olahan rempah lokal untuk menghadirkan produk dengan kualitas bahan yang jujur.'}
          </p>
          <p>
            Di tengah maraknya produk massal serba cepat, kami memilih jalan yang berbeda. Setiap sendok madu hutan, biji kopi arabika, toples nastar, hingga piring saji kayu jati diproduksi dalam jumlah terbatas agar kualitas dan kebersihan setiap barang dapat dipantau langsung.
          </p>

          <h2 style={{ fontSize: 'var(--fs-h2)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
            Prinsip Produksi Kami
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            <div style={{ backgroundColor: 'var(--cream-200)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-1)' }}>1. Bahan Baku Alami</h3>
              <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', margin: 0 }}>
                Bebas pewarna sintetik, perisa buatan, dan pengawet berbahaya.
              </p>
            </div>
            <div style={{ backgroundColor: 'var(--cream-200)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-1)' }}>2. Kemitraan Adil</h3>
              <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', margin: 0 }}>
                Membeli bahan baku dan kriya langsung dari perajin dengan harga yang layak dan transparan.
              </p>
            </div>
            <div style={{ backgroundColor: 'var(--cream-200)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-1)' }}>3. Kemasan Ramah Lingkungan</h3>
              <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)', margin: 0 }}>
                Menggunakan pembungkus kertas daur ulang dan anyaman purun untuk mengurangi sampah plastik.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bawah */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/produk">
            <Button variant="primary" style={{ paddingInline: 'var(--space-8)' }}>
              Jelajahi Koleksi Kami Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
