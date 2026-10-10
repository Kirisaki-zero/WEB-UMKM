import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--brown-900)',
        color: 'var(--cream-100)',
        marginTop: 'auto',
      }}
    >
      {/* Wood Grain Wave Accent */}
      <div
        style={{
          height: '16px',
          backgroundColor: 'var(--cream-200)',
          maskImage: 'radial-gradient(circle, #000 70%, transparent 70%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      />

      <div className="container" style={{ paddingBlock: 'var(--space-12) var(--space-8)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-8)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {/* Kolom 1: Profil Usaha */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                color: 'var(--cream-100)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Omah Kriya & Rasa Lokal
            </h3>
            <p style={{ color: 'var(--cream-200)', fontSize: 'var(--fs-small)', lineHeight: 1.6 }}>
              Menghadirkan karya perajin kriya dan olahan pangan rumahan nusantara dengan bahan pilihan dan kejujuran rasa.
            </p>
          </div>

          {/* Kolom 2: Jam Operasional & Layanan */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                color: 'var(--cream-100)',
                marginBottom: 'var(--space-3)',
                fontWeight: 600,
              }}
            >
              Jam Buka Toko
            </h4>
            <p style={{ color: 'var(--cream-200)', fontSize: 'var(--fs-small)', margin: 0 }}>
              Senin - Sabtu: 08.00 - 17.00 WIB
            </p>
            <p style={{ color: 'var(--cream-200)', fontSize: 'var(--fs-small)', margin: 0 }}>
              Minggu & Hari Libur Nasional: Tutup
            </p>
            <p style={{ color: 'var(--cream-300)', fontSize: 'var(--fs-tiny)', marginTop: 'var(--space-2)' }}>
              Pemesanan daring via website dilayani setiap hari.
            </p>
          </div>

          {/* Kolom 3: Kontak & Alamat */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                color: 'var(--cream-100)',
                marginBottom: 'var(--space-3)',
                fontWeight: 600,
              }}
            >
              Lokasi & Narahubung
            </h4>
            <p style={{ color: 'var(--cream-200)', fontSize: 'var(--fs-small)', marginBottom: 'var(--space-2)' }}>
              Jl. Tirtodipuran No. 28, Mantrijeron, Yogyakarta
            </p>
            <p style={{ color: 'var(--cream-200)', fontSize: 'var(--fs-small)', margin: 0 }}>
              WhatsApp:{' '}
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--green-100)', textDecoration: 'underline' }}
              >
                +62 812-3456-7890
              </a>
            </p>
            <p style={{ color: 'var(--cream-200)', fontSize: 'var(--fs-small)', margin: 0 }}>
              Instagram:{' '}
              <a
                href="https://instagram.com/omahkaryalokal"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--green-100)', textDecoration: 'underline' }}
              >
                @omahkaryalokal
              </a>
            </p>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div
          style={{
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid rgba(253, 251, 247, 0.15)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-4)',
            fontSize: 'var(--fs-tiny)',
            color: 'var(--cream-300)',
          }}
        >
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Omah Kriya & Rasa Lokal. Seluruh hak cipta dilindungi.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Link to="/tentang" style={{ color: 'var(--cream-200)' }}>
              Tentang Kami
            </Link>
            <Link to="/kontak" style={{ color: 'var(--cream-200)' }}>
              Hubungi Kami
            </Link>
            <Link to="/admin/login" style={{ color: 'var(--cream-300)' }}>
              Masuk Pengelola
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
