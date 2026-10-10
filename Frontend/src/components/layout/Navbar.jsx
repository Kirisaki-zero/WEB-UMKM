import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

export function Navbar() {
  const { totalCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/produk', label: 'Katalog' },
    { to: '/tentang', label: 'Tentang' },
    { to: '/kontak', label: 'Kontak' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--cream-100)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        className="container"
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}
      >
        {/* Brand Logo / Name */}
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 700,
            color: 'var(--brown-900)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <span
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--color-accent)',
              borderRadius: '50%',
              display: 'inline-block',
            }}
          />
          Omah Kriya & Rasa
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="desktop-nav"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 'var(--space-6)',
          }}
          aria-label="Navigasi Utama"
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: 'var(--fs-body)',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                paddingBottom: '4px',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions (Cart & Mobile Menu Button) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Cart Button */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Keranjang belanja, ${totalCount} barang`}
            style={{
              position: 'relative',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'var(--cream-200)',
              color: 'var(--color-text)',
              fontWeight: 600,
              fontSize: 'var(--fs-small)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <span>🛒</span>
            <span>Keranjang</span>
            {totalCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--cream-100)',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px 8px',
                  fontSize: 'var(--fs-tiny)',
                  fontWeight: 'bold',
                }}
              >
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button (with explicit label per R-03) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label={isMobileMenuOpen ? 'Tutup navigasi' : 'Buka menu navigasi'}
            aria-expanded={isMobileMenuOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-border)',
              backgroundColor: 'transparent',
              fontSize: 'var(--fs-small)',
              fontWeight: 600,
            }}
          >
            <span>{isMobileMenuOpen ? '✕' : '☰'}</span>
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-panel"
          style={{
            backgroundColor: 'var(--cream-100)',
            borderTop: '1px solid var(--color-border)',
            padding: 'var(--space-4) var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: 'var(--space-2) 0',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                display: 'block',
              })}
            >
              {item.label}
            </NavLink>
          ))}
          <div style={{ paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)' }}>
            <Link
              to="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)' }}
            >
              Area Pengelola (Admin)
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-nav-panel {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
