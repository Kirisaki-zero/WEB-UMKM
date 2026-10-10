import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    store_name: '',
    tagline: '',
    wa_number: '',
    address: '',
    opening_hours: '',
    instagram: '',
    about_story: '',
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const data = await api.getSettings();
      if (data) {
        setSettings(data);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);
    try {
      await api.updateSettings(settings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      console.error('Gagal memperbarui pengaturan:', err);
      alert('Terjadi kesalahan saat menyimpan pengaturan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-1)' }}>
          Pengaturan Toko
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
          Atur informasi nama usaha, narahubung WhatsApp, dan alamat operasional
        </p>
      </div>

      {isSaved && (
        <div
          style={{
            backgroundColor: 'var(--green-100)',
            color: 'var(--green-700)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--fs-small)',
            fontWeight: 600,
          }}
        >
          ✓ Pengaturan toko berhasil disimpan!
        </div>
      )}

      <div
        style={{
          backgroundColor: 'var(--cream-100)',
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Usaha / Toko"
            id="set-name"
            value={settings.store_name}
            onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
            required
          />

          <Input
            label="Slogan / Tagline Singkat"
            id="set-tagline"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
          />

          <Input
            label="Nomor WhatsApp Pesanan"
            id="set-wa"
            value={settings.wa_number}
            onChange={(e) => setSettings({ ...settings, wa_number: e.target.value })}
            placeholder="6281234567890 (Gunakan kode negara tanpa tanda +)"
            helperText="Nomor tujuan untuk menerima pesan checkout pesanan dari pembeli"
            required
          />

          <Input
            as="textarea"
            label="Alamat Toko & Galeri"
            id="set-address"
            rows={2}
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            required
          />

          <Input
            label="Jam Operasional"
            id="set-hours"
            value={settings.opening_hours}
            onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
            placeholder="Senin - Sabtu: 08.00 - 17.00 WIB"
          />

          <Input
            label="Akun Instagram (Tanpa tanda @)"
            id="set-ig"
            value={settings.instagram}
            onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
            placeholder="omahkaryalokal"
          />

          <Input
            as="textarea"
            label="Cerita Usaha (Halaman Tentang Kami)"
            id="set-story"
            rows={4}
            value={settings.about_story}
            onChange={(e) => setSettings({ ...settings, about_story: e.target.value })}
          />

          <Button type="submit" variant="primary" disabled={isSaving} style={{ marginTop: 'var(--space-2)' }}>
            {isSaving ? 'Menyimpan Pengaturan...' : 'Simpan Pengaturan Toko'}
          </Button>
        </form>
      </div>
    </div>
  );
}
