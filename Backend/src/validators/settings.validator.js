import { z } from 'zod';

export const settingsSchema = z.object({
  store_name: z.string().optional(),
  wa_number: z.string().optional(),
  address: z.string().optional(),
  opening_hours: z.string().optional(),
  instagram: z.string().optional(),
  maps_embed_url: z.string().optional(),
});
