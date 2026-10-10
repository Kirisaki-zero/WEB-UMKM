import { supabase } from '../config/supabase.js';
import { httpError } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';

/**
 * Generate kode pesanan unik: ORD-<base36 timestamp>
 */
function generateCode() {
  return 'ORD-' + Date.now().toString(36).toUpperCase();
}

/**
 * Susun pesan WhatsApp dari detail pesanan.
 */
function buildWaMessage(code, customer, lines, total) {
  const itemLines = lines
    .map((l) => `  • ${l.name} x${l.qty} = Rp${(l.price * l.qty).toLocaleString('id-ID')}`)
    .join('\n');

  return (
    `*Pesanan Baru – ${code}*\n` +
    `Nama: ${customer.customer_name}\n` +
    `Telp: ${customer.customer_phone}\n` +
    `Pengiriman: ${customer.delivery_method === 'delivery' ? 'Diantar' : 'Ambil Sendiri'}\n` +
    (customer.address ? `Alamat: ${customer.address}\n` : '') +
    (customer.note ? `Catatan: ${customer.note}\n` : '') +
    `\nDetail Pesanan:\n${itemLines}\n` +
    `\n*Total: Rp${total.toLocaleString('id-ID')}*`
  );
}

/** POST /api/orders */
export async function createOrder(req, res, next) {
  try {
    const { customer_name, customer_phone, delivery_method, address, note, items } = req.body;

    // 1. Ambil data produk dari DB (harga & stok sumber kebenaran ada di server)
    const ids = items.map((i) => i.product_id);
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, name, price, stock')
      .in('id', ids)
      .eq('is_active', true);

    if (prodErr) throw httpError(500, prodErr.message);

    // 2. Validasi stok & susun baris pesanan
    const lines = items.map((item) => {
      const p = products.find((x) => x.id === item.product_id);
      if (!p) throw httpError(400, `Produk dengan ID ${item.product_id} tidak ditemukan.`);
      if (p.stock < item.qty) throw httpError(400, `Stok ${p.name} tidak mencukupi.`);
      return { product_id: p.id, name: p.name, price: p.price, qty: item.qty };
    });

    // 3. Hitung total
    const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
    const code = generateCode();

    // 4. Simpan pesanan ke DB
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({ code, customer_name, customer_phone, delivery_method, address, note, total })
      .select()
      .single();

    if (orderErr) throw httpError(500, orderErr.message);

    // 5. Simpan order_items
    const orderItems = lines.map((l) => ({ ...l, order_id: order.id }));
    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
    if (itemsErr) throw httpError(500, itemsErr.message);

    // 6. Kurangi stok produk
    for (const l of lines) {
      await supabase.rpc('decrement_stock', { p_id: l.product_id, p_qty: l.qty });
    }

    // 7. Susun URL WhatsApp
    const waMessage = buildWaMessage(code, { customer_name, customer_phone, delivery_method, address, note }, lines, total);
    const waUrl = `https://wa.me/${env.WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    res.status(201).json({ code, total, waUrl });
  } catch (err) {
    next(err);
  }
}

/** GET /api/orders/:code */
export async function getOrderByCode(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('code', req.params.code)
      .single();

    if (error || !data) throw httpError(404, 'Pesanan tidak ditemukan.');
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/** GET /api/orders  [Admin] */
export async function getOrders(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    let query = supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw httpError(500, error.message);

    res.json({ data, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/orders/:id/status  [Admin] */
export async function updateOrderStatus(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: req.body.status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) throw httpError(404, 'Pesanan tidak ditemukan.');
    res.json(data);
  } catch (err) {
    next(err);
  }
}
