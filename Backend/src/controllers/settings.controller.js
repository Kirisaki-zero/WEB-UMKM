import { supabase } from '../config/supabase.js';
import { httpError } from '../middleware/errorHandler.js';

/** GET /api/settings */
export async function getSettings(_req, res, next) {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw httpError(500, error.message);
    res.json(data ?? {});
  } catch (err) {
    next(err);
  }
}

/** PUT /api/settings  [Admin] */
export async function updateSettings(req, res, next) {
  try {
    // upsert: buat baris jika belum ada (id = 1 selalu)
    const { data, error } = await supabase
      .from('store_settings')
      .upsert({ id: 1, ...req.body })
      .select()
      .single();

    if (error) throw httpError(500, error.message);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
