import { supabase } from '../config/supabase.js';
import { httpError } from '../middleware/errorHandler.js';

/** GET /api/products?category=&q=&page=&limit= */
export async function getProducts(req, res, next) {
  try {
    const { category, q, page = 1, limit = 12 } = req.query;
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    let query = supabase
      .from('products')
      .select('id, name, slug, price, stock, images, is_featured, categories(name, slug)', {
        count: 'exact',
      })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (category) query = query.eq('categories.slug', category);
    if (q) query = query.ilike('name', `%${q}%`);

    const { data, error, count } = await query;
    if (error) throw httpError(500, error.message);

    res.json({ data, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

/** GET /api/products/:slug */
export async function getProductBySlug(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('slug', req.params.slug)
      .eq('is_active', true)
      .single();

    if (error || !data) throw httpError(404, 'Produk tidak ditemukan.');
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/** POST /api/products  [Admin] */
export async function createProduct(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(req.body)
      .select()
      .single();

    if (error) throw httpError(400, error.message);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/products/:id  [Admin] */
export async function updateProduct(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) throw httpError(404, 'Produk tidak ditemukan.');
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/products/:id  [Admin] */
export async function deleteProduct(req, res, next) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw httpError(500, error.message);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
