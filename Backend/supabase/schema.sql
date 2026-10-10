-- =============================================================================
-- SCHEMA UMKM – Jalankan di Supabase SQL Editor
-- Urutan: tabel → RLS → policies → fungsi → trigger
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. TABEL
-- ---------------------------------------------------------------------------

create table if not exists profiles (
  id   uuid primary key references auth.users on delete cascade,
  role text not null default 'customer' check (role in ('admin', 'customer'))
);
comment on table profiles is 'Role pengguna: admin atau customer (opsional).';

-- ---------------------------------------------------------------------------

create table if not exists categories (
  id         bigint generated always as identity primary key,
  name       text not null,
  slug       text unique not null,
  created_at timestamptz default now()
);
comment on table categories is 'Kategori produk (contoh: kue, minuman, snack).';

-- ---------------------------------------------------------------------------

create table if not exists products (
  id          bigint generated always as identity primary key,
  category_id bigint references categories on delete set null,
  name        text not null,
  slug        text unique not null,
  description text,
  price       integer not null check (price >= 0),      -- dalam rupiah
  stock       integer not null default 0 check (stock >= 0),
  images      text[]  default '{}',                     -- URL publik dari Storage
  is_featured boolean default false,
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
comment on table products is 'Katalog produk UMKM.';

-- ---------------------------------------------------------------------------

create table if not exists orders (
  id              bigint generated always as identity primary key,
  code            text unique not null,
  customer_name   text not null,
  customer_phone  text not null,
  delivery_method text not null check (delivery_method in ('pickup', 'delivery')),
  address         text,
  note            text,
  total           integer not null,
  status          text not null default 'baru'
                    check (status in ('baru', 'diproses', 'selesai', 'batal')),
  created_at      timestamptz default now()
);
comment on table orders is 'Pesanan dari pelanggan, dibuat lewat checkout WhatsApp.';

-- ---------------------------------------------------------------------------

create table if not exists order_items (
  id         bigint generated always as identity primary key,
  order_id   bigint references orders on delete cascade,
  product_id bigint references products on delete set null,
  name       text    not null,   -- disalin agar riwayat tetap utuh jika produk diubah
  price      integer not null,
  qty        integer not null check (qty > 0)
);
comment on table order_items is 'Item detail dari setiap pesanan.';

-- ---------------------------------------------------------------------------

create table if not exists messages (
  id         bigint generated always as identity primary key,
  name       text not null,
  contact    text not null,
  body       text not null,
  created_at timestamptz default now()
);
comment on table messages is 'Pesan masuk dari form kontak halaman Kontak.';

-- ---------------------------------------------------------------------------

create table if not exists store_settings (
  id             int primary key default 1 check (id = 1),  -- hanya satu baris
  store_name     text,
  wa_number      text,
  address        text,
  opening_hours  text,
  instagram      text,
  maps_embed_url text
);
comment on table store_settings is 'Pengaturan toko: nama, WA, alamat, jam buka, Instagram.';

-- ---------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS)
-- Backend memakai service_role → melewati RLS.
-- Aturan di bawah melindungi data jika anon key dipakai langsung dari browser.
-- ---------------------------------------------------------------------------

alter table profiles       enable row level security;
alter table categories     enable row level security;
alter table products       enable row level security;
alter table orders         enable row level security;
alter table order_items    enable row level security;
alter table messages       enable row level security;
alter table store_settings enable row level security;

-- Publik boleh membaca katalog dan info toko
create policy "read categories"     on categories     for select using (true);
create policy "read active products" on products       for select using (is_active);
create policy "read settings"        on store_settings for select using (true);

-- User hanya bisa baca profil miliknya sendiri
create policy "read own profile"     on profiles       for select using (auth.uid() = id);

-- orders, order_items, messages: tidak ada policy publik → hanya bisa diakses
-- lewat backend (service_role), bukan langsung dari browser.

-- ---------------------------------------------------------------------------
-- 3. TRIGGER: auto-update updated_at pada tabel products
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. FUNGSI RPC: kurangi stok produk secara aman (atomic)
-- Dipanggil dari backend: supabase.rpc('decrement_stock', { p_id, p_qty })
-- ---------------------------------------------------------------------------

create or replace function decrement_stock(p_id bigint, p_qty integer)
returns void language plpgsql as $$
begin
  update products
  set    stock = stock - p_qty
  where  id = p_id
    and  stock >= p_qty;   -- tidak akan membuat stok negatif

  if not found then
    raise exception 'Stok produk % tidak mencukupi atau produk tidak ditemukan.', p_id;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. DATA AWAL: baris pengaturan toko (wajib ada agar GET /api/settings tidak error)
-- ---------------------------------------------------------------------------

insert into store_settings (id, store_name, wa_number, address, opening_hours)
values (1, 'Nama Toko [ISI]', '6281234567890', 'Alamat Toko [ISI]', 'Senin–Sabtu 08.00–17.00')
on conflict (id) do nothing;

-- =============================================================================
-- SETELAH MENJALANKAN SQL INI:
-- 1. Buat bucket "product-images" di Storage (centang Public).
-- 2. Buat akun admin: Dashboard > Authentication > Users > Add user.
-- 3. Jalankan: insert into profiles (id, role) values ('<uuid>', 'admin');
-- 4. Nonaktifkan pendaftaran publik: Authentication > Providers > Email >
--    matikan "Allow new users to sign up".
-- =============================================================================
