import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';

export function NotFound() {
  return (
    <div className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-20)' }}>
      <div className="container" style={{ maxWidth: '560px', textAlign: 'center' }}>
        <p style={{ fontSize: '3.5rem', marginBottom: 'var(--space-2)' }}>🍂</p>
        <h1 style={{ fontSize: 'var(--fs-display)', marginBottom: 'var(--space-2)' }}>
          404 - Halaman Tidak Ditemukan
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 'var(--space-8)' }}>
          Alamat yang kamu tuju sepertinya salah ketik atau telah dipindahkan ke halaman lain.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
          <Link to="/">
            <Button variant="primary">Kembali ke Beranda</Button>
          </Link>
          <Link to="/produk">
            <Button variant="secondary">Lihat Katalog Produk</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
