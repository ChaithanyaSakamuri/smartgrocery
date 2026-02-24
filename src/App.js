import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Plus, Trash2 } from 'lucide-react';
import Layout from './components/layout/Layout';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Account from './pages/Account';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';

const AppContent = () => {
  const { user, role, loading } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  if (loading) return <div className="full-screen">Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* welcome screen is always rendered at root; component handles any redirects */}
        <Route
          path="/"
          element={<Welcome />}
        />

        {/* everything else lives inside Layout */}
        <Route element={<Layout cartCount={cart.length} setShowWishlist={setShowWishlist} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}>
          <Route path="home" element={<Home addToCart={addToCart} wishlist={wishlist} setWishlist={setWishlist} cartItems={cart} />} />
          <Route path="login" element={<Login />} />
          <Route path="cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="checkout" element={user ? <Checkout cart={cart} setCart={setCart} /> : <Navigate to="/login" />} />
          <Route path="account" element={user ? <Account /> : <Navigate to="/login" />} />
          <Route path="product/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="admin" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/home" />} />

          <Route path="*" element={<Navigate to="/home" />} />
        </Route>

        {/* Vendor — standalone, no site header */}
        <Route path="/vendor" element={role === 'vendor' ? <VendorDashboard /> : <Navigate to="/login" />} />
      </Routes>

      {/* Wishlist Modal (Shared) */}
      <AnimatePresence>
        {showWishlist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 77, 44, 0.1)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              padding: '24px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                maxWidth: '480px',
                width: '100%',
                maxHeight: '85vh',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                padding: '24px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ color: '#ef4444' }}><Heart size={24} fill="#ef4444" /></div>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '1000', color: 'var(--secondary)', letterSpacing: '-0.5px' }}>My Wishlist</h3>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, background: 'var(--bg-main)' }}
                  onClick={() => setShowWishlist(false)}
                  style={{ background: 'transparent', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s ease' }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div style={{ padding: '24px 32px', overflowY: 'auto', flex: 1 }}>
                {wishlist.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {wishlist.map(item => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '12px', borderRadius: '16px', border: '1px solid var(--border-light)', background: 'white' }}
                      >
                        <div style={{ width: '70px', height: '70px', padding: '8px', background: 'var(--bg-main)', borderRadius: '12px', flexShrink: 0 }}>
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: '800', fontSize: '15px', color: 'var(--secondary)' }}>{item.name}</p>
                          <p style={{ margin: 0, fontSize: '14px', color: 'var(--primary)', fontWeight: '800' }}>₹{item.price}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { addToCart(item); setWishlist(wishlist.filter(w => w.id !== item.id)); }}
                            style={{ background: 'var(--primary)', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            title="Add to Basket"
                          >
                            <Plus size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1, background: 'var(--bg-main)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setWishlist(wishlist.filter(w => w.id !== item.id))}
                            style={{ background: 'transparent', color: '#ef4444', border: 'none', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            title="Remove"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-main)', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                      <Heart size={36} />
                    </div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: '900', color: 'var(--secondary)' }}>Wishlist is empty</h4>
                    <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-muted)', fontWeight: '500' }}>Save items you love to find them later.</p>
                  </div>
                )}
              </div>

              <div style={{ padding: '24px 32px', background: 'var(--bg-main)', borderTop: '1px solid var(--border-light)' }}>
                <motion.button
                  whileHover={{ scale: 1.02, background: 'var(--primary)', color: 'white' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowWishlist(false)}
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '16px' }}
                >
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;