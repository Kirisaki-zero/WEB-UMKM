import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { CartDrawer } from './components/layout/CartDrawer.jsx';
import { Toast } from './components/ui/Toast.jsx';

import { Home } from './pages/Home.jsx';
import { Catalog } from './pages/Catalog.jsx';
import { ProductDetail } from './pages/ProductDetail.jsx';
import { Checkout } from './pages/Checkout.jsx';
import { OrderStatus } from './pages/OrderStatus.jsx';
import { About } from './pages/About.jsx';
import { Contact } from './pages/Contact.jsx';
import { NotFound } from './pages/NotFound.jsx';

import { AdminLogin } from './pages/admin/AdminLogin.jsx';
import { AdminLayout } from './components/layout/AdminLayout.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminProducts } from './pages/admin/AdminProducts.jsx';
import { AdminProductForm } from './pages/admin/AdminProductForm.jsx';
import { AdminOrders } from './pages/admin/AdminOrders.jsx';
import { AdminSettings } from './pages/admin/AdminSettings.jsx';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function GlobalFeedback() {
  const { toastMessage } = useCart();
  return (
    <>
      <CartDrawer />
      <Toast message={toastMessage} />
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <GlobalFeedback />
          <Routes>
            {/* Rute Publik */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/produk" element={<Catalog />} />
              <Route path="/produk/:slug" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pesanan/:kode" element={<OrderStatus />} />
              <Route path="/tentang" element={<About />} />
              <Route path="/kontak" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Rute Panel Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="produk" element={<AdminProducts />} />
              <Route path="produk/baru" element={<AdminProductForm />} />
              <Route path="produk/edit/:id" element={<AdminProductForm />} />
              <Route path="pesanan" element={<AdminOrders />} />
              <Route path="pengaturan" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
