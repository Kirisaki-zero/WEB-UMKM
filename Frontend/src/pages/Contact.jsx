import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';

export function Contact() {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({ name: '', contact: '', body: '' });
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const data = await api.getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim() || !formData.body.trim()) {
      alert('Mohon lengkapi seluruh kolom pesan');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.submitContactMessage(formData);
      setIsSent(true);
      setFormData({ name: '', contact: '', body: '' });
    } catch (err) {
      console.error('Gagal mengirim pesan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--fs-h1)', marginBottom: 'var(--space-2)' }}>
            Hubungi & Kunjungi Kami
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-body)' }}>
            Punya pertanyaan mengenai stok khusus, kemitraan oleh-oleh, atau ingin berkunjung langsung ke galeri kami?
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-10)',
            marginBottom: 'var(--space-12)',
            alignItems: 'start',
          }}
        >
          {/* Kolom Kiri: Info Alamat & Kontak Cepat */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div
              style={{
                backgroundColor: 'var(--cream-100)',
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h2 style={{ fontSize: 'var(--fs-h3)', marginBottom: 'var(--space-4)' }}>
                Galeri & Rumah Produksi
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: 'var(--fs-body)' }}>
                <div>
                  <strong style={{ display: 'block', color: 'var(--brown-900)', marginBottom: '2px' }}>
                    Alamat Lengkap:
                  </strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {settings?.address || 'Jl. Tirtodipuran No. 28, Mantrijeron, Yogyakarta'}
                  </span>
                </div>

                <div>
                  <strong style={{ display: 'block', color: 'var(--brown-900)', marginBottom: '2px' }}>
                    Jam Operasional Galeri:
                  </strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {settings?.opening_hours || 'Senin - Sabtu: 08.00 - 17.00 WIB'}
                  </span>
                </div>

                <div>
                  <strong style={{ display: 'block', color: 'var(--brown-900)', marginBottom: '2px' }}>
                    Saluran WhatsApp:
                  </strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    +{settings?.wa_number || '6281234567890'} (Respon cepat saat jam kerja)
                  </span>
                </div>

                <div>
                  <strong style={{ display: 'block', color: 'var(--brown-900)', marginBottom: '2px' }}>
                    Media Sosial Instagram:
                  </strong>
                  <a
                    href={`https://instagram.com/${settings?.instagram || 'omahkaryalokal'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
                  >
                    @{settings?.instagram || 'omahkaryalokal'}
                  </a>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-6)' }}>
                <a
                  href={`https://wa.me/${settings?.wa_number || '6281234567890'}?text=${encodeURIComponent('Halo, saya ingin bertanya info produk Omah Kriya.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" style={{ width: '100%' }}>
                    Chat Langsung via WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Formulir Kirim Pesan */}
          <div
            style={{
              backgroundColor: 'var(--cream-100)',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2 style={{ fontSize: 'var(--fs-h3)', marginBottom: 'var(--space-4)' }}>
              Kirim Pesan Pertanyaan
            </h2>

            {isSent ? (
              <div
                style={{
                  backgroundColor: 'var(--green-100)',
                  color: 'var(--green-700)',
                  padding: 'var(--space-6)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                  ✓ Pesan Terkirim!
                </p>
                <p style={{ fontSize: 'var(--fs-small)', margin: 0 }}>
                  Terima kasih sudah menghubungi kami. Tim kami akan segera merespons melalui kontak yang kamu cantumkan.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setIsSent(false)}
                  style={{ marginTop: 'var(--space-4)' }}
                >
                  Tulis Pesan Lain
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Input
                  label="Nama Lengkap"
                  id="contact-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama Anda"
                  required
                />

                <Input
                  label="Nomor WhatsApp / Email"
                  id="contact-info"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="0812xxxx atau email@domain.com"
                  required
                />

                <Input
                  as="textarea"
                  label="Pesan Anda"
                  id="contact-body"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Ceritakan apa yang bisa kami bantu..."
                  rows={4}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  style={{ width: '100%' }}
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Peta Lokasi Google Maps */}
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <iframe
            title="Lokasi Toko Omah Kriya"
            src={settings?.maps_embed_url || 'https://maps.google.com/maps?q=Yogyakarta&t=&z=13&ie=UTF8&iwloc=&output=embed'}
            width="100%"
            height="360"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
