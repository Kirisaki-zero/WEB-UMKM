import React from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../ui/Button.jsx';

export function AdminLayout() {
  const { isAdminLoggedIn, logoutAdmin, adminUser } = useAuth();
  const navigate = useNavigate();

  if (!isAdminLoggedIn) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}>
        <div style={{ maxWidth: '400px', textAlign: 'center', backgroundColor: 'var(--cream-100)', padding: 'var(--space-8)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Akses Khusus Pengelola</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
            Silakan masuk dengan akun pengelola toko untuk mengakses halaman ini.
          </p>
          <Button variant="primary" onClick={() => navigate('/admin/login')} style={{ width: '100%' }}>
            Ke Halaman Masuk
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', label: 'Ringkasan', end: true },
    { to: '/admin/produk', label: 'Kelola Produk' },
    { to: '/admin/pesanan', label: 'Daftar Pesanan' },
    { to: '/admin/pengaturan', label: 'Pengaturan Toko' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--cream-200)' }}>
      {/* Sidebar Desktop */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--brown-900)',
          color: 'var(--cream-100)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'var(--space-6)',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ marginBottom: 'var(--space-8)', borderBottom: '1px solid rgba(253,251,247,0.15)', paddingBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--cream-100)', marginBottom: 'var(--space-1)' }}>
              Panel Pengelola
            </h2>
            <p style={{ fontSize: 'var(--fs-tiny)', color: 'var(--cream-300)', margin: 0 }}>
              {adminUser?.email || 'Admin Toko'}
            </p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} aria-label="Menu Admin">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--fs-small)',
                  fontWeight: 600,
                  color: isActive ? 'var(--cream-100)' : 'var(--cream-200)',
                  backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                  display: 'block',
                  transition: 'background-color var(--transition-fast)',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div style={{ borderTop: '1px solid rgba(253,251,247,0.15)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Link
            to="/"
            style={{
              fontSize: 'var(--fs-small)',
              color: 'var(--cream-200)',
              padding: '8px 0',
              display: 'block',
            }}
          >
            ← Kembali ke Website Toko
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              color: 'var(--danger-100)',
              fontSize: 'var(--fs-small)',
              textAlign: 'left',
              padding: '8px 0',
              cursor: 'pointer',
            }}
          >
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main style={{ flex: 1, padding: 'var(--space-8)', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
