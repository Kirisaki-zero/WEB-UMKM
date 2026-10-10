import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

export function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@umkm.id');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat masuk');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--cream-100)',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-1)' }}>
            Masuk Pengelola
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-small)' }}>
            Panel kendali produk dan pesanan toko
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--danger-100)',
              color: 'var(--danger-600)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-small)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {error}
          </div>
        )}

        {/* Info Kredensial Nyata untuk Pengujian Awal */}
        <div
          style={{
            padding: 'var(--space-3)',
            backgroundColor: 'var(--cream-200)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--color-border)',
            fontSize: 'var(--fs-tiny)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <strong>Kredensial Bawaan:</strong><br />
          Email: <code>admin@umkm.id</code><br />
          Sandi: <code>admin123</code>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Alamat Email"
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Kata Sandi"
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            disabled={isLoggingIn}
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
          >
            {isLoggingIn ? 'Memeriksa...' : 'Masuk ke Dashboard'}
          </Button>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
            <Link to="/" style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-muted)' }}>
              ← Kembali ke Beranda Toko
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
