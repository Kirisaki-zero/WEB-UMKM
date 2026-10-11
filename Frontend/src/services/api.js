import { supabase } from './supabase.js';

const normalizeProduct = (product) => {
  const base = product ?? {};
  return {
    ...base,
    id: Number(base.id ?? Date.now()),
    price: Number(base.price ?? 0),
    stock: Number(base.stock ?? 0),
    category_id: Number(base.category_id ?? 0),
    category_name: base.category_name || '',
    images: Array.isArray(base.images) && base.images.length
      ? base.images
      : [base.imageUrl || ''],
    is_featured: Boolean(base.is_featured),
    is_active: base.is_active !== false,
    slug: base.slug || (base.name || 'produk').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  };
};

const normalizeOrder = (order) => {
  const base = order ?? {};
  const items = Array.isArray(base.items)
    ? base.items
    : Array.isArray(base.order_items)
      ? base.order_items
      : [];

  return {
    ...base,
    id: Number(base.id ?? Date.now()),
    code: base.code || `ORD-${Date.now().toString(36).toUpperCase()}`,
    customer_name: base.customer_name || '',
    customer_phone: base.customer_phone || '',
    delivery_method: base.delivery_method || 'pickup',
    total: Number(base.total ?? items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0)),
    status: base.status || 'baru',
    items: items.map((item) => ({
      ...item,
      id: Number(item.id ?? Date.now() + Math.random()),
      price: Number(item.price ?? 0),
      qty: Number(item.qty ?? 1),
    })),
  };
};

export function initLocalStorage() {
  if (typeof window === 'undefined') return;

  const defaults = {
    umkm_cart: '[]',
    umkm_admin: 'null',
    umkm_categories: '[]',
    umkm_products: '[]',
    umkm_settings: '{}',
    umkm_orders: '[]',
  };

  Object.entries(defaults).forEach(([key, value]) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, value);
    }
  });
}

const readLocalList = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocalList = (key, data) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  async getProducts() {
    if (supabase) {
      try {
        // Mengambil data produk sekaligus memanggil relasi ke tabel categories
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              name
            )
          `)
          .order('updated_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          return data.map((item) => normalizeProduct({
            ...item,
            // Mengisi category_name dari hasil join tabel categories
            category_name: item.categories?.name || ''
          }));
        }

        if (error) {
          console.warn('Supabase products error:', error.message || error);
        }
      } catch (error) {
        console.warn('Supabase products error:', error.message || error);
      }
    }

    return readLocalList('umkm_products', []).map(normalizeProduct);
  },

  async getProductBySlug(slug) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (!error && data) {
          return normalizeProduct(data);
        }

        if (error) {
          console.warn('Supabase product detail unavailable, fallback to local storage:', error.message || error);
        }
      } catch (error) {
        console.warn('Supabase product detail unavailable, fallback to local storage:', error.message || error);
      }
    }

    const localProducts = readLocalList('umkm_products', []).map(normalizeProduct);
    return localProducts.find((product) => product.slug === slug) || null;
  },

  async saveProduct(productData) {
    const slug = productData.slug || (productData.name || 'produk').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Memastikan format array gambar disesuaikan dengan kolom `images` (text[]) di Supabase
    const normalizedImages = Array.isArray(productData.images) && productData.images.length > 0
      ? productData.images.filter(Boolean)
      : productData.imageUrl
        ? [productData.imageUrl]
        : [];

    const payload = normalizeProduct({ ...productData, slug, images: normalizedImages });

    if (supabase) {
      try {
        // HANYA menyisipkan kolom yang benar-benar ada di tabel products di Supabase
        const dbPayload = {
          name: payload.name,
          slug: payload.slug,
          category_id: Number(payload.category_id),
          price: Number(payload.price),
          stock: Number(payload.stock),
          description: payload.description || '',
          images: normalizedImages,
          is_featured: Boolean(payload.is_featured),
          is_active: payload.is_active !== false,
        };

        if (productData.id) {
          // UPDATE PRODUK
          const { data, error } = await supabase
            .from('products')
            .update(dbPayload)
            .eq('id', Number(productData.id))
            .select();

          if (!error && data && data[0]) {
            return normalizeProduct(data[0]);
          }

          if (error) {
            console.warn('Supabase update failed, fallback local save:', error.message || error);
          }
        } else {
          // INSERT PRODUK BARU
          const { data, error } = await supabase
            .from('products')
            .insert([dbPayload])
            .select();

          if (!error && data && data[0]) {
            return normalizeProduct(data[0]);
          }

          if (error) {
            console.warn('Supabase insert failed, fallback local save:', error.message || error);
          }
        }
      } catch (error) {
        console.warn('Supabase save failed, fallback local save:', error.message || error);
      }
    }

    const localProducts = readLocalList('umkm_products', []).map(normalizeProduct);
    const nextProducts = productData.id
      ? localProducts.map((item) => (item.id === Number(productData.id) ? payload : item))
      : [payload, ...localProducts];

    writeLocalList('umkm_products', nextProducts);
    return payload;
  },

  async deleteProduct(id) {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', Number(id));

        if (error) {
          console.warn('Supabase delete failed, fallback local delete:', error.message || error);
        }
      } catch (error) {
        console.warn('Supabase delete failed, fallback local delete:', error.message || error);
      }
    }

    const localProducts = readLocalList('umkm_products', []).map(normalizeProduct);
    const filtered = localProducts.filter((item) => item.id !== Number(id));
    writeLocalList('umkm_products', filtered);
    return true;
  },

  async uploadProductImage(file) {
    if (supabase && file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'application/octet-stream',
          });

        if (!uploadError && uploadData) {
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          return data?.publicUrl || '';
        }

        console.warn('Supabase storage upload failed, fallback to local URL:', uploadError.message || uploadError);
      } catch (error) {
        console.warn('Supabase storage upload failed, fallback to local URL:', error.message || error);
      }
    }

    return file ? URL.createObjectURL(file) : '';
  },

  async getCategories() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('id', { ascending: true });

        if (!error && Array.isArray(data) && data.length) {
          writeLocalList('umkm_categories', data);
          return data;
        }

        if (error) {
          console.warn('Supabase categories unavailable, fallback to local storage:', error.message || error);
        }
      } catch (error) {
        console.warn('Supabase categories unavailable, fallback to local storage:', error.message || error);
      }
    }

    return readLocalList('umkm_categories', []);
  },

  async getSettings() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .maybeSingle();

        if (!error && data) {
          writeLocalList('umkm_settings', data);
          return data;
        }

        if (error) {
          console.warn('Supabase settings unavailable, fallback to local storage:', error.message || error);
        }
      } catch (error) {
        console.warn('Supabase settings unavailable, fallback to local storage:', error.message || error);
      }
    }

    return readLocalList('umkm_settings', {});
  },

  async updateSettings(settings) {
    const payload = { ...(settings || {}), id: 1 };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .upsert(payload, { onConflict: 'id' })
          .select();

        if (!error && data && data[0]) {
          writeLocalList('umkm_settings', data[0]);
          return data[0];
        }

        if (error) {
          console.warn('Supabase settings save failed, fallback local save:', error.message || error);
        }
      } catch (error) {
        console.warn('Supabase settings save failed, fallback local save:', error.message || error);
      }
    }

    writeLocalList('umkm_settings', payload);
    return payload;
  },

  async getOrders() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          return data.map(normalizeOrder);
        }

        if (error) {
          console.warn('Supabase orders unavailable, fallback to local storage:', error.message || error);
        }
      } catch (error) {
        console.warn('Supabase orders unavailable, fallback to local storage:', error.message || error);
      }
    }

    return readLocalList('umkm_orders', []).map(normalizeOrder);
  },

  async createOrder(orderPayload) {
    const items = Array.isArray(orderPayload.items) ? orderPayload.items : [];
    const code = `ORD-${Date.now().toString().slice(-6).toUpperCase()}`;
    const payload = {
      code,
      customer_name: orderPayload.customer_name,
      customer_phone: orderPayload.customer_phone,
      delivery_method: orderPayload.delivery_method || 'pickup',
      address: orderPayload.address || '',
      note: orderPayload.note || '',
      total: Number(orderPayload.total || 0),
      status: 'baru',
      items,
    };

    if (supabase) {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              code: payload.code,
              customer_name: payload.customer_name,
              customer_phone: payload.customer_phone,
              delivery_method: payload.delivery_method,
              address: payload.address,
              note: payload.note,
              total: payload.total,
              status: payload.status,
            },
          ])
          .select()
          .single();

        if (!orderError && orderData) {
          const mappedItems = items.map((item) => ({
            order_id: Number(orderData.id),
            product_id: item.id ? Number(item.id) : null,
            name: item.name,
            price: Number(item.price || 0),
            qty: Number(item.qty || 1),
          }));

          const { error: itemError } = await supabase
            .from('order_items')
            .insert(mappedItems);

          if (itemError) {
            console.warn('Supabase order items failed to save:', itemError.message || itemError);
          }

          for (const item of items) {
          if (item.id) {
            // Ambil stok produk saat ini
            const { data: prodData } = await supabase
              .from('products')
              .select('stock')
              .eq('id', Number(item.id))
              .maybeSingle();

            if (prodData) {
              const currentStock = Number(prodData.stock || 0);
              const qtyPurchased = Number(item.qty || 1);
              const newStock = Math.max(0, currentStock - qtyPurchased); // Mencegah stok minus

              // Update stok baru ke Supabase
              await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', Number(item.id));
            }
          }
        }

          return { order: normalizeOrder({ ...orderData, items: mappedItems }) };
        }

        if (orderError) {
          console.warn('Supabase order create failed, fallback local save:', orderError.message || orderError);
        }
      } catch (error) {
        console.warn('Supabase order create failed, fallback local save:', error.message || error);
      }
    }

    const localOrders = readLocalList('umkm_orders', []).map(normalizeOrder);
    const newOrder = normalizeOrder({ ...payload, id: Date.now(), created_at: new Date().toISOString() });
    writeLocalList('umkm_orders', [newOrder, ...localOrders]);
    return { order: newOrder };
  },

  async updateOrderStatus(orderId, newStatus) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', Number(orderId))
          .select();

        if (!error && data && data[0]) {
          return data[0];
        }

        if (error) {
          console.warn('Supabase order update failed, fallback local update:', error.message || error);
        }
      } catch (error) {
        console.warn('Supabase order update failed, fallback local update:', error.message || error);
      }
    }

    const localOrders = readLocalList('umkm_orders', []).map(normalizeOrder);
    const updated = localOrders.map((order) => order.id === Number(orderId) ? { ...order, status: newStatus } : order);
    writeLocalList('umkm_orders', updated);
    return updated.find((order) => order.id === Number(orderId));
  },
};