import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../services/api.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { formatRupiah } from '../utils/formatRupiah.js';
import { buildWaMessage } from '../utils/buildWaMessage.js';

export function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'pickup',
    address: '',
    note: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const data = await api.getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  if (cart.length === 0) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🧺</p>
          <h1 style={{ marginBottom: 'var(--space-2)' }}>Keranjang Belanja Masih Kosong</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
            Kamu belum menambahkan produk ke keranjang belanja.
          </p>
          <Link to="/produk">
            <Button variant="primary">Lihat Katalog Produk</Button>
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor WhatsApp aktif wajib diisi';
    } else if (!/^[0-9+]{9,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Format nomor WhatsApp tidak valid (contoh: 08123456789)';
    }

    if (formData.deliveryMethod === 'delivery' && !formData.address.trim()) {
      newErrors.address = 'Alamat pengiriman wajib diisi untuk layanan kurir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        delivery_method: formData.deliveryMethod,
        address: formData.address.trim(),
        note: formData.note.trim(),
        items: cart,
        total: totalPrice,
      };

      const result = await api.createOrder(orderPayload);
      const orderCode = result?.order?.code || 'ORD-' + Date.now().toString(36).toUpperCase();

      // Susun pesan WhatsApp
      const waText = buildWaMessage({
        orderCode,
        customerName: formData.name,
        phone: formData.phone,
        deliveryMethod: formData.deliveryMethod,
        address: formData.address,
        note: formData.note,
        items: cart,
        total: totalPrice,
      });

      const targetWaNumber = settings?.wa_number || '6281234567890';
      const waUrl = `https://wa.me/${targetWaNumber}?text=${encodeURIComponent(waText)}`;

      // Kosongkan keranjang
      clearCart();

      // Buka tab WhatsApp
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Arahkan ke halaman status pesanan
      navigate(`/pesanan/${orderCode}`);
    } catch (err) {
      console.error('Gagal mengirim pesanan:', err);
      alert('Terjadi kendala saat menyimpan pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--fs-h1)', marginBottom: 'var(--space-2)' }}>
            Konfirmasi Pesanan
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-body)' }}>
            Lengkapi data diri di bawah. Pesanan akan otomatis diteruskan ke WhatsApp penjual.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-10)',
              alignItems: 'start',
            }}
          >
            {/* Kolom Kiri: Form Data Pemesan */}
            <div
              style={{
                backgroundColor: 'var(--cream-100)',
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h2 style={{ fontSize: 'var(--fs-h3)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
                Data Penerima
              </h2>

              <Input
                label="Nama Lengkap"
                id="customer-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Rina Anggraini"
                required
                error={errors.name}
              />

              <Input
                label="Nomor WhatsApp"
                id="customer-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Contoh: 081234567890"
                required
                helperText="Nomor aktif untuk konfirmasi ketersediaan barang dan resi"
                error={errors.phone}
              />

              {/* Pilihan Metode Pengiriman */}
              <div className="form-group">
                <label className="form-label">Metode Pengambilan:</label>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-1)' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      cursor: 'pointer',
                      padding: '10px 14px',
                      backgroundColor: formData.deliveryMethod === 'pickup' ? 'var(--green-100)' : 'var(--cream-200)',
                      border: '1.5px solid',
                      borderColor: formData.deliveryMethod === 'pickup' ? 'var(--color-accent)' : 'var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: 'var(--fs-small)',
                      flex: 1,
                    }}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={formData.deliveryMethod === 'pickup'}
                      onChange={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
                    />
                    Ambil di Toko (Gratis)
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      cursor: 'pointer',
                      padding: '10px 14px',
                      backgroundColor: formData.deliveryMethod === 'delivery' ? 'var(--green-100)' : 'var(--cream-200)',
                      border: '1.5px solid',
                      borderColor: formData.deliveryMethod === 'delivery' ? 'var(--color-accent)' : 'var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: 'var(--fs-small)',
                      flex: 1,
                    }}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="delivery"
                      checked={formData.deliveryMethod === 'delivery'}
                      onChange={() => setFormData({ ...formData, deliveryMethod: 'delivery' })}
                    />
                    Kirim Kurir / Ekspedisi
                  </label>
                </div>
              </div>

              {/* Alamat (Jika Delivery) */}
              {formData.deliveryMethod === 'delivery' && (
                <Input
                  as="textarea"
                  label="Alamat Pengiriman Lengkap"
                  id="customer-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota/kabupaten, dan kode pos"
                  required
                  error={errors.address}
                />
              )}

              <Input
                as="textarea"
                label="Catatan Pesanan (Opsional)"
                id="customer-note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Contoh: Titip ke satpam, atau tolong digiling kasar untuk kopi"
              />
            </div>

            {/* Kolom Kanan: Rincian Belanja & Tombol WhatsApp */}
            <div
              style={{
                backgroundColor: 'var(--cream-100)',
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h2 style={{ fontSize: 'var(--fs-h3)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
                Rincian Barang ({cart.length} Jenis)
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 'var(--fs-small)',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{item.name}</p>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {item.qty} x {formatRupiah(item.price)}
                      </span>
                    </div>
                    <span style={{ fontWeight: 600 }}>
                      {formatRupiah(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-small)' }}>
                  <span>Subtotal Produk</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-small)' }}>
                  <span>Ongkos Kirim</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {formData.deliveryMethod === 'pickup' ? 'Rp 0 (Ambil di Toko)' : 'Dikonfirmasi via WhatsApp'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    borderTop: '1px dashed var(--color-border)',
                    paddingTop: 'var(--space-3)',
                    marginTop: 'var(--space-2)',
                  }}
                >
                  <span>Total Pembayaran</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                style={{ width: '100%', fontSize: '1.05rem', padding: '14px' }}
              >
                {isSubmitting ? 'Memproses Pesanan...' : 'Kirim Pesanan via WhatsApp →'}
              </Button>

              <p style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 'var(--space-3)', marginInline: 'auto' }}>
                Setelah klik tombol di atas, browser akan membuka obrolan WhatsApp dengan nomor resmi penjual dan rincian pesanan sudah tersusun rapi.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
