import { initialProducts, initialCategories, initialStoreSettings } from './mockData.js';

const STORAGE_KEYS = {
  PRODUCTS: 'umkm_products',
  CATEGORIES: 'umkm_categories',
  SETTINGS: 'umkm_settings',
  ORDERS: 'umkm_orders',
  MESSAGES: 'umkm_messages',
};

// Inisialisasi data lokal jika belum ada di browser
function getLocalItem(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    return fallback;
  }
}

function setLocalItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Gagal menyimpan ke localStorage:', err);
  }
}

export function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setLocalItem(STORAGE_KEYS.PRODUCTS, initialProducts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    setLocalItem(STORAGE_KEYS.CATEGORIES, initialCategories);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setLocalItem(STORAGE_KEYS.SETTINGS, initialStoreSettings);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    setLocalItem(STORAGE_KEYS.ORDERS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    setLocalItem(STORAGE_KEYS.MESSAGES, []);
  }
}

const API_BASE = import.meta.env.VITE_API_URL;

export const api = {
  async getProducts() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend belum merespons, beralih ke penyimpanan lokal browser.');
      }
    }
    initLocalStorage();
    return getLocalItem(STORAGE_KEYS.PRODUCTS, initialProducts);
  },

  async getProductBySlug(slug) {
    const products = await this.getProducts();
    return products.find(p => p.slug === slug) || null;
  },

  async getCategories() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend belum merespons, beralih ke penyimpanan lokal browser.');
      }
    }
    initLocalStorage();
    return getLocalItem(STORAGE_KEYS.CATEGORIES, initialCategories);
  },

  async getSettings() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/settings`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend belum merespons, beralih ke penyimpanan lokal browser.');
      }
    }
    initLocalStorage();
    return getLocalItem(STORAGE_KEYS.SETTINGS, initialStoreSettings);
  },

  async createOrder(orderPayload) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Menyimpan pesanan ke penyimpanan lokal.');
      }
    }
    initLocalStorage();
    const orders = getLocalItem(STORAGE_KEYS.ORDERS, []);
    const orderCode = 'ORD-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const newOrder = {
      ...orderPayload,
      code: orderCode,
      id: Date.now(),
      created_at: new Date().toISOString(),
      status: 'baru',
    };
    orders.unshift(newOrder);
    setLocalItem(STORAGE_KEYS.ORDERS, orders);

    // Kurangi stok produk lokal
    const products = getLocalItem(STORAGE_KEYS.PRODUCTS, initialProducts);
    orderPayload.items.forEach(item => {
      const p = products.find(prod => prod.id === item.id);
      if (p && p.stock >= item.qty) {
        p.stock -= item.qty;
      }
    });
    setLocalItem(STORAGE_KEYS.PRODUCTS, products);

    return { ok: true, order: newOrder };
  },

  async getOrders() {
    initLocalStorage();
    return getLocalItem(STORAGE_KEYS.ORDERS, []);
  },

  async updateOrderStatus(id, status) {
    initLocalStorage();
    const orders = getLocalItem(STORAGE_KEYS.ORDERS, []);
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      setLocalItem(STORAGE_KEYS.ORDERS, orders);
      return orders[index];
    }
    return null;
  },

  async saveProduct(productData) {
    initLocalStorage();
    const products = getLocalItem(STORAGE_KEYS.PRODUCTS, initialProducts);
    if (productData.id) {
      const idx = products.findIndex(p => p.id === productData.id);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...productData };
        setLocalItem(STORAGE_KEYS.PRODUCTS, products);
        return products[idx];
      }
    } else {
      const newProduct = {
        ...productData,
        id: Date.now(),
        slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        is_active: true,
      };
      products.unshift(newProduct);
      setLocalItem(STORAGE_KEYS.PRODUCTS, products);
      return newProduct;
    }
  },

  async deleteProduct(id) {
    initLocalStorage();
    const products = getLocalItem(STORAGE_KEYS.PRODUCTS, initialProducts);
    const filtered = products.filter(p => p.id !== id);
    setLocalItem(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  },

  async updateSettings(newSettings) {
    initLocalStorage();
    setLocalItem(STORAGE_KEYS.SETTINGS, newSettings);
    return newSettings;
  },

  async submitContactMessage(messageData) {
    initLocalStorage();
    const messages = getLocalItem(STORAGE_KEYS.MESSAGES, []);
    const newMsg = { ...messageData, id: Date.now(), created_at: new Date().toISOString() };
    messages.unshift(newMsg);
    setLocalItem(STORAGE_KEYS.MESSAGES, messages);
    return { ok: true };
  },
};
