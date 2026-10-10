import { supabase } from '../config/supabase.js';
import { httpError } from '../middleware/errorHandler.js';

/** GET /api/categories */
export async function getCategories(_req, res, next) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw httpError(500, error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/** POST /api/categories  [Admin] */
export async function createCategory(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(req.body)
      .select()
      .single();

    if (error) throw httpError(400, error.message);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/categories/:id  [Admin] */
export async function updateCategory(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) throw httpError(404, 'Kategori tidak ditemukan.');
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/categories/:id  [Admin] */
export async function deleteCategory(req, res, next) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.params.id);

    if (error) throw httpError(500, error.message);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
