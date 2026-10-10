/**
 * Middleware: Penanganan error global Express.
 * Harus didaftarkan sebagai middleware TERAKHIR di app.js.
 *
 * Semua respons error menggunakan format seragam: { "message": "..." }
 */
export function errorHandler(err, _req, res, _next) {
  // Gunakan status dari error jika ada, fallback ke 500
  const status = typeof err.status === 'number' ? err.status : 500;
  const message = err.message || 'Terjadi kesalahan pada server.';

  // Log detail error di server (jangan kirim stack trace ke client)
  if (status >= 500) {
    console.error(`[error] ${status} – ${message}`);
    if (err.stack) console.error(err.stack);
  }

  res.status(status).json({ message });
}

/**
 * Helper: Buat error HTTP dengan status tertentu.
 * Contoh pemakaian di service/controller: throw httpError(404, 'Produk tidak ditemukan');
 */
export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
