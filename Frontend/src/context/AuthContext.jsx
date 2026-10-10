import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('umkm_admin');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const loginAdmin = async (email, password) => {
    // Kredensial default admin lokal untuk pratinjau sebelum Supabase Auth dihubungkan
    if (email === 'admin@umkm.id' && password === 'admin123') {
      const user = { email, role: 'admin', name: 'Pengelola Toko' };
      localStorage.setItem('umkm_admin', JSON.stringify(user));
      setAdminUser(user);
      return { success: true };
    }
    return { success: false, message: 'Email atau kata sandi tidak cocok' };
  };

  const logoutAdmin = () => {
    localStorage.removeItem('umkm_admin');
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAdminLoggedIn: !!adminUser,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}
