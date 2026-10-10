import {
  validateAndPriceItems,
  generateOrderCode,
  persistOrder,
  decrementStock,
  buildWaUrl,
} from '../services/order.service.js';
import { supabase } from '../config/supabase.js';
import { httpError } from '../middleware/errorHandler.js';

/** POST /api/orders */
export async function createOrder(req, res, next) {
  try {
    const { customer_name, customer_phone, delivery_method, address, note, items } = req.body;
    const customer = { customer_name, customer_phone, delivery_method, address, note };

    // Validasi stok & hitung ulang harga di server
    const { lines, total } = await validateAndPriceItems(items);

    const code = generateOrderCode();

    // Simpan order & order_items
    await persistOrder({ customer, lines, total, code });

    // Kurangi stok (non-blocking jika gagal, pesanan tetap berhasil)
    await decrementStock(lines);

    // Susun URL WhatsApp
    const waUrl = buildWaUrl(code, customer, lines, total);

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
