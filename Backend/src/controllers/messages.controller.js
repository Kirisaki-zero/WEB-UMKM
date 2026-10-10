import { supabase } from '../config/supabase.js';
import { httpError } from '../middleware/errorHandler.js';

/** POST /api/messages */
export async function createMessage(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert(req.body)
      .select()
      .single();

    if (error) throw httpError(500, error.message);
    res.status(201).json({ message: 'Pesan berhasil dikirim.', id: data.id });
  } catch (err) {
    next(err);
  }
}
