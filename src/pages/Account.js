import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Truck, MapPin, Headset, Settings,
    LogOut, ChevronRight, ExternalLink, Search,
    ShoppingBag, Clock, XCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserOrders } from '../services/api';

const Account = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const [activeTab, setActiveTab] = useState(query.get('tab') || 'orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedAddress, setSavedAddress] = useState(null);
    const [trackId, setTrackId] = useState('');
    const [trackedOrder, setTrackedOrder] = useState(null);
    const [trackError, setTrackError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getUserOrders();
                if (data && Array.isArray(data) && data.length > 0) {
                    setOrders(data);
                    localStorage.setItem('freshly_orders', JSON.stringify(data));
                } else {
                    throw new Error('empty');
                }
            } catch {
                const stored = JSON.parse(localStorage.getItem('freshly_orders') || '[]');
                setOrders(stored);
                // auto fill first order for tracking
                if (stored.length > 0) setTrackId(stored[0]._id);
            }
            setLoading(false);
        };
        load();
        setSavedAddress(JSON.parse(localStorage.getItem('freshly_address') || 'null'));
    }, []);

    // Auto-fill trackId when orders are loaded
    useEffect(() => {
        if (orders.length > 0 && !trackId) {
            setTrackId(orders[0]._id);
        }
    }, [orders]); // eslint-disable-line

    const handleCancelOrder = (orderId) => {
        if (!window.confirm('Cancel this order?')) return;
        const updated = orders.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o);
        setOrders(updated);
        localStorage.setItem('freshly_orders', JSON.stringify(updated));
    };

    const handleTrack = () => {
        setTrackError('');
        const input = trackId.trim();
        // Flexible match: exact, or by last-8 digits, or contains
        const found = orders.find(o =>
            o._id === input ||
            o._id?.endsWith(input) ||
            o._id?.includes(input) ||
            input.includes(o._id?.replace('ORD-', '').slice(-8))
        );
        if (found) {
            setTrackedOrder(found);
        } else {
            setTrackedOrder(null);
            setTrackError('Order not found. Use the ID shown in My Orders.');
        }
    };

    const statusColor = (s) => {
        if (s === 'cancelled') return { bg: '#fef2f2', color: '#ef4444' };
        if (s === 'delivered') return { bg: '#f0fdf4', color: '#16a34a' };
        return { bg: '#eff6ff', color: '#3b82f6' };
    };

    const tabs = [
        { id: 'orders', label: 'My Orders', icon: <Package size={16} /> },
        { id: 'tracking', label: 'Live Tracking', icon: <Truck size={16} /> },
        { id: 'addresses', label: 'Addresses', icon: <MapPin size={16} /> },
        { id: 'support', label: 'Support', icon: <Headset size={16} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
    ];

    return (
        <div className="main-container" style={{ padding: '12px 0', height: 'calc(100vh - 80px)', overflow: 'hidden', display: 'flex' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', height: '100%', width: '100%' }}>

                {/* ── Sidebar ── */}
                <aside style={{ height: '100%' }}>
                    <div style={{
                        background: 'white', borderRadius: '20px', padding: '16px 14px',
                        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)', height: '100%',
                        display: 'flex', flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '14px', background: 'var(--primary)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '900', fontSize: '18px', flexShrink: 0
                            }}>
                                {user?.photoURL
                                    ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
                                    : (user?.name?.charAt(0) || user?.displayName?.charAt(0) || 'U')}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: 'var(--secondary)' }}>
                                    {user?.name || user?.displayName || 'Shopper'}
                                </p>
                                <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                    Standard Member
                                </span>
                            </div>
                        </div>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                            {tabs.map(tab => (
                                <motion.button key={tab.id} whileHover={{ x: 3 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px',
                                        border: 'none', borderRadius: '12px',
                                        background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                                        color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                                        fontWeight: '700', cursor: 'pointer', fontSize: '13px',
                                        textAlign: 'left', width: '100%', transition: 'all 0.2s'
                                    }}>
                                    <span style={{ opacity: activeTab === tab.id ? 1 : 0.7 }}>{tab.icon}</span>
                                    {tab.label}
                                </motion.button>
                            ))}
                        </nav>

                        <div style={{ height: '1px', background: 'var(--border-light)', margin: '10px 0' }} />
                        <motion.button whileHover={{ background: '#fef2f2' }} onClick={logout}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '9px 12px', borderRadius: '12px', border: '1px solid #fee2e2',
                                background: 'transparent', color: '#ef4444', fontWeight: '800',
                                cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s'
                            }}>
                            <LogOut size={15} /> Logout Session
                        </motion.button>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                            <div style={{ marginBottom: '10px', flexShrink: 0 }}>
                                <h1 style={{ fontSize: '24px', fontWeight: '1000', color: 'var(--secondary)', margin: 0, letterSpacing: '-1px' }}>
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h1>
                            </div>

                            {/* ───── ORDERS ───── */}
                            {activeTab === 'orders' && (
                                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                                    {loading ? (
                                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '40px' }}>Loading...</p>
                                    ) : orders.length === 0 ? (
                                        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                                            <ShoppingBag size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                            <h3 style={{ fontWeight: '900', marginBottom: '8px' }}>No orders yet</h3>
                                            <button onClick={() => navigate('/')} style={{ padding: '10px 24px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer' }}>Start Shopping</button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {orders.map((order, i) => {
                                                if (!order) return null;
                                                const sc = statusColor(order.status);
                                                return (
                                                    <div key={order._id || i} style={{
                                                        background: 'white', borderRadius: '18px',
                                                        border: '1px solid var(--border-light)', overflow: 'hidden',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                                    }}>
                                                        <div style={{
                                                            padding: '14px 20px', background: 'var(--bg-main)',
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                            borderBottom: '1px solid var(--border-light)'
                                                        }}>
                                                            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                                                                <div>
                                                                    <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</p>
                                                                    <p style={{ margin: 0, fontWeight: '900', fontSize: '13px', color: 'var(--secondary)' }}>
                                                                        #{order._id?.replace('ORD-', '').slice(-8) || 'N/A'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</p>
                                                                    <p style={{ margin: 0, fontWeight: '800', fontSize: '13px', color: 'var(--secondary)' }}>
                                                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                                    </p>
                                                                </div>
                                                                <div style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', background: sc.bg, color: sc.color, border: `1px solid ${sc.color}`, textTransform: 'uppercase' }}>
                                                                    {order.status}
                                                                </div>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</p>
                                                                <p style={{ margin: 0, fontWeight: '900', fontSize: '20px', color: 'var(--primary)' }}>₹{(order.totalAmount || 0).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                                                                {(order.items || []).slice(0, 5).map((item, idx) => (
                                                                    <img key={idx} src={item.image} alt={item.name}
                                                                        style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '10px', border: '1px solid var(--border-light)', padding: '4px', background: 'white' }} />
                                                                ))}
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                {['pending', 'processing'].includes(order.status) && (
                                                                    <button onClick={() => handleCancelOrder(order._id)}
                                                                        style={{ color: '#ef4444', background: 'transparent', border: '1px solid #fee2e2', padding: '7px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                        <XCircle size={14} /> Cancel
                                                                    </button>
                                                                )}
                                                                <button onClick={() => { setTrackId(order._id); setActiveTab('tracking'); }}
                                                                    style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '7px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                    <Truck size={14} /> Track
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ───── TRACKING ───── */}
                            {activeTab === 'tracking' && (
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                        {/* Search */}
                                        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-main)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
                                            <input type="text" value={trackId} onChange={e => setTrackId(e.target.value)}
                                                placeholder="Enter Order ID..."
                                                style={{ flex: 1, padding: '8px 12px', background: 'transparent', border: 'none', outline: 'none', fontWeight: '700', color: 'var(--secondary)', fontSize: '13px' }} />
                                            <button onClick={handleTrack}
                                                style={{ padding: '8px 20px', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '13px' }}>
                                                Track
                                            </button>
                                        </div>

                                        {/* Quick select buttons */}
                                        {orders.length > 0 && (
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                                {orders.slice(0, 4).map((o, i) => (
                                                    <button key={i} onClick={() => { setTrackId(o._id); setTrackedOrder(o); setTrackError(''); }}
                                                        style={{
                                                            padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', cursor: 'pointer',
                                                            background: trackId === o._id ? 'var(--primary)' : 'var(--bg-main)',
                                                            color: trackId === o._id ? 'white' : 'var(--text-muted)',
                                                            border: '1px solid var(--border-light)'
                                                        }}>
                                                        #{o._id?.replace('ORD-', '').slice(-8)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {trackError && <p style={{ color: '#ef4444', fontWeight: '700', fontSize: '13px', marginBottom: '12px' }}>{trackError}</p>}

                                        {trackedOrder ? (() => {
                                            const steps = [
                                                { label: 'Order Placed', key: 'pending' },
                                                { label: 'Confirmed', key: 'confirmed' },
                                                { label: 'Packed', key: 'packed' },
                                                { label: 'Out for Delivery', key: 'out_for_delivery' },
                                                { label: 'Delivered', key: 'delivered' }
                                            ];
                                            const statusOrder = ['pending', 'processing', 'confirmed', 'packed', 'out_for_delivery', 'delivered'];
                                            const currentIdx = trackedOrder.status === 'cancelled' ? -1 : Math.max(0, statusOrder.indexOf(trackedOrder.status));

                                            return (
                                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                                    {/* Order info bar */}
                                                    <div style={{ background: 'var(--bg-main)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order ID</p>
                                                            <p style={{ margin: 0, fontWeight: '900', color: 'var(--secondary)', fontSize: '13px' }}>#{trackedOrder._id?.replace('ORD-', '').slice(-8)}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delivering To</p>
                                                            <p style={{ margin: 0, fontWeight: '700', color: 'var(--secondary)', fontSize: '13px' }}>{trackedOrder.city}, {trackedOrder.zipcode}</p>
                                                        </div>
                                                        <div style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', ...statusColor(trackedOrder.status), border: `1px solid ${statusColor(trackedOrder.status).color}`, height: 'fit-content', alignSelf: 'center' }}>
                                                            {trackedOrder.status}
                                                        </div>
                                                    </div>

                                                    {/* Timeline */}
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0' }}>
                                                        {steps.map((step, i) => {
                                                            const done = trackedOrder.status !== 'cancelled' && i <= currentIdx;
                                                            return (
                                                                <React.Fragment key={step.key}>
                                                                    <div style={{ textAlign: 'center', flex: 1 }}>
                                                                        <div style={{
                                                                            width: '32px', height: '32px', borderRadius: '50%',
                                                                            background: trackedOrder.status === 'cancelled' ? '#fee2e2' : done ? 'var(--primary)' : 'var(--bg-main)',
                                                                            border: `2px solid ${trackedOrder.status === 'cancelled' ? '#ef4444' : done ? 'var(--primary)' : 'var(--border-light)'}`,
                                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                            margin: '0 auto 8px',
                                                                            color: done && trackedOrder.status !== 'cancelled' ? 'white' : 'var(--text-muted)',
                                                                            fontSize: '12px', fontWeight: '900', transition: 'all 0.3s'
                                                                        }}>
                                                                            {done && trackedOrder.status !== 'cancelled' ? <CheckCircle size={16} /> : i + 1}
                                                                        </div>
                                                                        <p style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: done && trackedOrder.status !== 'cancelled' ? 'var(--primary)' : 'var(--text-muted)', lineHeight: 1.3, textAlign: 'center' }}>
                                                                            {step.label}
                                                                        </p>
                                                                    </div>
                                                                    {i < steps.length - 1 && (
                                                                        <div style={{ flex: '0 0 20px', height: '2px', background: i < currentIdx && trackedOrder.status !== 'cancelled' ? 'var(--primary)' : 'var(--border-light)', marginTop: '15px', transition: 'all 0.3s' }} />
                                                                    )}
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            );
                                        })() : (
                                            !trackError && orders.length === 0 && (
                                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', padding: '20px 0' }}>No orders to track. Place an order first!</p>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ───── ADDRESSES ───── */}
                            {activeTab === 'addresses' && (
                                <div style={{ flex: 1 }}>
                                    {savedAddress ? (
                                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                            style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', display: 'flex', gap: '14px', alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>Default Address</span>
                                                <p style={{ margin: '8px 0 2px', fontWeight: '800', fontSize: '15px', color: 'var(--secondary)' }}>{savedAddress.address}</p>
                                                <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)' }}>{savedAddress.city} — {savedAddress.zipcode}</p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                                            <MapPin size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                                            <h3 style={{ fontWeight: '900', marginBottom: '8px' }}>No saved address</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>Place an order to save your address.</p>
                                            <button onClick={() => navigate('/')} style={{ padding: '10px 24px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer' }}>Shop Now</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ───── SUPPORT ───── */}
                            {activeTab === 'support' && (
                                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <motion.div whileHover={{ y: -4 }} style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                        <div style={{ width: '48px', height: '48px', background: '#eff6ff', color: '#3b82f6', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                            <Headset size={22} />
                                        </div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--secondary)', marginBottom: '8px' }}>Help Center</h4>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '13px', fontWeight: '600' }}>Browse FAQs and guides for instant help.</p>
                                        <button style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}>Open Help Center</button>
                                    </motion.div>
                                    <motion.div whileHover={{ y: -4 }} style={{ background: 'var(--primary)', borderRadius: '20px', padding: '24px', color: 'white', textAlign: 'center', boxShadow: '0 8px 24px var(--primary-glow)' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                            <Clock size={22} />
                                        </div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'white', marginBottom: '8px' }}>Chat with Support</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '16px', fontSize: '13px', fontWeight: '600' }}>AI-powered assistant, available 24/7.</p>
                                        <button style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.2)', fontWeight: '800', color: 'white', cursor: 'pointer', fontSize: '13px' }}>Start Chat Now</button>
                                    </motion.div>
                                </div>
                            )}

                            {/* ───── SETTINGS ───── */}
                            {activeTab === 'settings' && (
                                <div style={{ flex: 1, background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                    <p style={{ fontWeight: '800', color: 'var(--secondary)', marginBottom: '16px' }}>Account Settings</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {['Notification Preferences', 'Privacy & Security', 'Payment Methods', 'Language & Region'].map(item => (
                                            <button key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', cursor: 'pointer', fontWeight: '700', color: 'var(--secondary)', fontSize: '14px' }}>
                                                {item} <ChevronRight size={16} color="var(--text-muted)" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Account;
