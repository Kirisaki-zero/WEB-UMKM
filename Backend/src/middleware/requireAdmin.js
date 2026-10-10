import { supabase } from '../config/supabase.js';

/**
 * Middleware: Cek token Supabase Auth + pastikan role user adalah 'admin'.
 * Gunakan di route yang hanya boleh diakses oleh admin.
 */
export async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Belum login atau token tidak ditemukan.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  // Verifikasi token ke Supabase
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ message: 'Sesi tidak valid atau sudah kedaluwarsa.' });
  }

  // Cek role di tabel profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang diizinkan.' });
  }

  // Simpan user ke request agar bisa dipakai di controller
  req.user = data.user;
  next();
}
