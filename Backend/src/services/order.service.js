import { supabase } from '../config/supabase.js';
import { httpError } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';

/**
 * Generate kode pesanan unik: ORD-<base36 timestamp>
 */
export function generateOrderCode() {
  return 'ORD-' + Date.now().toString(36).toUpperCase();
}

/**
 * Susun teks pesan WhatsApp dari detail pesanan.
 */
export function buildWaMessage(code, customer, lines, total) {
  const itemLines = lines
    .map((l) => `  • ${l.name} x${l.qty} = Rp${(l.price * l.qty).toLocaleString('id-ID')}`)
    .join('\n');

  return (
    `*Pesanan Baru – ${code}*\n` +
    `Nama      : ${customer.customer_name}\n` +
    `Telp      : ${customer.customer_phone}\n` +
    `Pengiriman: ${customer.delivery_method === 'delivery' ? 'Diantar' : 'Ambil Sendiri'}\n` +
    (customer.address ? `Alamat    : ${customer.address}\n` : '') +
    (customer.note ? `Catatan   : ${customer.note}\n` : '') +
    `\n*Detail Pesanan:*\n${itemLines}\n` +
    `\n*Total: Rp${total.toLocaleString('id-ID')}*\n` +
    `\nKode: ${code}`
  );
}

/**
 * Validasi stok dan kalkulasi harga dari sumber kebenaran di server (bukan percaya client).
 * @param {Array<{product_id: number, qty: number}>} items
 * @returns {{ lines: Array, total: number }}
 */
export async function validateAndPriceItems(items) {
  const ids = items.map((i) => i.product_id);

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, stock')
    .in('id', ids)
    .eq('is_active', true);

  if (error) throw httpError(500, 'Gagal membaca data produk.');

  const lines = items.map((item) => {
    const p = products.find((x) => x.id === item.product_id);
    if (!p) throw httpError(400, `Produk dengan ID ${item.product_id} tidak ditemukan.`);
    if (p.stock < item.qty)
      throw httpError(400, `Stok "${p.name}" tidak mencukupi (tersisa: ${p.stock}).`);
    return { product_id: p.id, name: p.name, price: p.price, qty: item.qty };
  });

  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  return { lines, total };
}

/**
 * Simpan order + order_items ke database dalam satu proses.
 * @param {{ customer: object, lines: Array, total: number, code: string }}
 * @returns {object} data order yang tersimpan
 */
export async function persistOrder({ customer, lines, total, code }) {
  // Simpan order
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({ code, total, ...customer })
    .select()
    .single();

  if (orderErr) throw httpError(500, orderErr.message);

  // Simpan order_items
  const orderItems = lines.map((l) => ({ ...l, order_id: order.id }));
  const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
  if (itemsErr) throw httpError(500, itemsErr.message);

  return order;
}

/**
 * Kurangi stok semua produk dalam pesanan menggunakan Supabase RPC.
 * Fungsi SQL `decrement_stock` harus sudah dibuat di database terlebih dahulu.
 * @param {Array<{product_id: number, qty: number}>} lines
 */
export async function decrementStock(lines) {
  for (const l of lines) {
    const { error } = await supabase.rpc('decrement_stock', {
      p_id: l.product_id,
      p_qty: l.qty,
    });
    if (error) console.error(`[stock] Gagal kurangi stok produk ${l.product_id}: ${error.message}`);
  }
}

/**
 * Susun URL WhatsApp lengkap dengan pesan terenkode.
 */
export function buildWaUrl(code, customer, lines, total) {
  const text = buildWaMessage(code, customer, lines, total);
  return `https://wa.me/${env.WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
