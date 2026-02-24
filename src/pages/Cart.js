import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ChevronLeft,
    Tag,
    ShieldCheck
} from 'lucide-react';
import CouponSystem from '../components/ui/CouponSystem';

const Cart = ({ cart, setCart }) => {
    const [discount, setDiscount] = useState(0);
    const navigate = useNavigate();
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const total = subtotal * (1 - discount / 100);

    const incrementQty = (id) => {
        setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
    };

    const decrementQty = (id) => {
        setCart(prev => {
            const item = prev.find(i => i.id === id);
            if (item.qty === 1) return prev.filter(i => i.id !== id);
            return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
        });
    };

    const removeItem = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        console.log('Navigating to checkout...');
        navigate('/checkout');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                padding: '12px 0'
            }}
        >
            <div className="main-container" style={{ width: '100%', maxWidth: '1080px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                            <ShoppingBag size={18} />
                        </div>
                        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '1000', color: 'var(--secondary)', letterSpacing: '-0.5px' }}>Cart</h1>
                        <span style={{ marginLeft: '6px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '50px', fontWeight: '800', fontSize: '10px' }}>
                            {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ x: -4, color: 'var(--primary)' }}
                        onClick={() => navigate('/home')}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', fontSize: '12px' }}
                    >
                        <ChevronLeft size={14} /> Continue
                    </motion.button>
                </div>

                {cart.length === 0 ? (
                    <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}
                    >
                        <div style={{ width: '60px', height: '60px', background: 'var(--bg-main)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <ShoppingBag size={30} color="var(--text-muted)" />
                        </div>
                        <h2 style={{ fontSize: '22px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '8px' }}>Your cart is empty</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px', fontWeight: '500' }}>Add some fresh goodness to get started.</p>
                        <motion.button
                            whileHover={{ scale: 1.05, background: 'var(--primary-dark)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/home')}
                            style={{ padding: '12px 32px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: '900', fontSize: '14px' }}
                        >
                            Start Shopping
                        </motion.button>
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: 'calc(100vh - 180px)', overflowY: 'auto', paddingRight: '8px' }}>
                            <AnimatePresence initial={false}>
                                {cart.map(item => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '12px',
                                            background: 'white',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-light)',
                                            boxShadow: 'var(--shadow-sm)',
                                            gap: '12px'
                                        }}
                                    >
                                        <div style={{ width: '48px', height: '48px', background: 'var(--bg-main)', borderRadius: '10px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        </div>

                                        <div style={{ flex: '1', minWidth: '0' }}>
                                            <h3 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '900', color: 'var(--secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                                            <span style={{ fontWeight: '900', fontSize: '13px', color: 'var(--primary)' }}>₹{item.price}</span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', padding: '4px', borderRadius: '8px' }}>
                                            <button onClick={() => decrementQty(item.id)} style={{ border: 'none', background: 'white', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}><Minus size={12} /></button>
                                            <span style={{ fontWeight: '900', width: '24px', textAlign: 'center', fontSize: '13px' }}>{item.qty}</span>
                                            <button onClick={() => incrementQty(item.id)} style={{ border: 'none', background: 'white', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}><Plus size={12} /></button>
                                        </div>

                                        <div style={{ textAlign: 'right', minWidth: '60px' }}>
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '1000', color: 'var(--secondary)' }}>₹{(item.price * item.qty).toFixed(0)}</p>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.1, color: '#ef4444' }}
                                            onClick={() => removeItem(item.id)}
                                            style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px' }}
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div style={{
                            padding: '16px',
                            borderRadius: '20px',
                            background: 'white',
                            boxShadow: 'var(--shadow-lg)',
                            border: '1px solid var(--border-light)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '1000', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)' }}>
                                <ShieldCheck size={18} color="var(--primary)" /> Summary
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>
                                    <span>Subtotal</span>
                                    <span style={{ fontWeight: '800', color: 'var(--secondary)' }}>₹{subtotal.toFixed(0)}</span>
                                </div>
                                {discount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: '800', fontSize: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={12} /> Discount</div>
                                        <span>-₹{(subtotal * discount / 100).toFixed(0)}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>
                                    <span>Shipping</span>
                                    <span style={{ fontWeight: '800', color: '#10b981' }}>FREE</span>
                                </div>
                            </div>

                            <div style={{ height: '1px', background: 'var(--border-light)' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)' }}>Total</span>
                                <span style={{ fontSize: '22px', fontWeight: '1000', color: 'var(--primary)', letterSpacing: '-0.5px' }}>₹{total.toFixed(0)}</span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, background: 'var(--primary-dark)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCheckout}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: '900',
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 16px var(--primary-glow)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                Checkout <ArrowRight size={18} />
                            </motion.button>

                            <CouponSystem onApplyCoupon={(val) => setDiscount(val)} theme="light" />

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'var(--bg-main)', padding: '10px', borderRadius: '10px', fontSize: '10px', border: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                                <ShieldCheck size={14} color="#10b981" style={{ flexShrink: 0 }} />
                                <p style={{ margin: 0, lineHeight: '1.4', fontWeight: '500' }}>Secure and encrypted payments. Your data is protected.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Cart;
