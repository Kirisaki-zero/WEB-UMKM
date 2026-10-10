import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('umkm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('umkm_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Gagal menyimpan keranjang:', e);
    }
  }, [cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const newQty = existing.qty + qty;
        if (newQty > product.stock) {
          showToast(`Stok maksimal ${product.name} adalah ${product.stock}`);
          return prev;
        }
        showToast(`Jumlah ${product.name} diperbarui di keranjang`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: newQty } : item
        );
      } else {
        if (qty > product.stock) {
          showToast(`Stok tidak mencukupi`);
          return prev;
        }
        showToast(`${product.name} berhasil ditambahkan ke keranjang`);
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            image: product.images?.[0] || '',
            qty,
          },
        ];
      }
    });
  };

  const updateQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          if (newQty > item.stock) {
            showToast(`Maksimal stok tersedia hanya ${item.stock}`);
            return { ...item, qty: item.stock };
          }
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast('Produk dihapus dari keranjang');
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        totalCount,
        totalPrice,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
}
