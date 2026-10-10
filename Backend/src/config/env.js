import 'dotenv/config';

export const env = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  CORS_ORIGINS: process.env.CORS_ORIGINS || 'http://localhost:5173',
  WA_NUMBER: process.env.WA_NUMBER || '',
  STORAGE_BUCKET: process.env.STORAGE_BUCKET || 'product-images',
};

// Validasi environment variables wajib
const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter((key) => !env[key]);

if (missing.length > 0) {
  console.error(`[env] Variabel environment wajib tidak ditemukan: ${missing.join(', ')}`);
  process.exit(1);
}
