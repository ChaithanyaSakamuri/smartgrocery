import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Truck,
    MapPin,
    Headset,
    Settings,
    LogOut,
    ChevronRight,
    ExternalLink,
    Search,
    ShoppingBag,
    Clock,
    XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

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

    /* Load orders from localStorage */
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('freshly_orders') || '[]');
        setOrders(stored);
        const addr = JSON.parse(localStorage.getItem('freshly_address') || 'null');
        setSavedAddress(addr);
        setLoading(false);
        /* Auto-fill latest order for tracking */
        if (stored.length > 0) setTrackId(stored[0]._id);
    }, []);

    const handleCancelOrder = (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        const updated = orders.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o);
        setOrders(updated);
        localStorage.setItem('freshly_orders', JSON.stringify(updated));
    };

    const handleTrack = () => {
        setTrackError('');
        const found = orders.find(o => o._id === trackId.trim());
        if (found) {
            setTrackedOrder(found);
        } else {
            setTrackedOrder(null);
            setTrackError('Order not found. Please check the Order ID.');
        }
    };

    const tabs = [
        { id: 'orders', label: 'My Orders', icon: <Package size={20} /> },
        { id: 'tracking', label: 'Live Tracking', icon: <Truck size={20} /> },
        { id: 'addresses', label: 'Addresses', icon: <MapPin size={20} /> },
        { id: 'support', label: 'Support', icon: <Headset size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
    ];

    return (
        <div className="main-container" style={{ padding: '20px 0 40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'flex-start' }}>

                {/* Sidebar Navigation */}
                <aside style={{ position: 'sticky', top: '120px' }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '24px 20px',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border-light)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '16px',
                                background: 'var(--primary)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '1000',
                                fontSize: '20px',
                                boxShadow: '0 6px 12px var(--primary-glow)',
                                border: '3px solid white'
                            }}>
                                {user?.photoURL ? <img src={user.photoURL} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover' }} /> : (user?.name?.charAt(0) || 'U')}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '1000', color: 'var(--secondary)', letterSpacing: '-0.5px' }}>{user?.name || 'Shopper'}</h3>
                                <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Standard Member</span>
                            </div>
                        </div>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {tabs.map(tab => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ x: 5, background: 'var(--bg-main)' }}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 16px',
                                        border: 'none',
                                        borderRadius: '18px',
                                        background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                                        color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        transition: 'all 0.3s ease',
                                        textAlign: 'left',
                                        width: '100%'
                                    }}
                                >
                                    <span style={{ color: activeTab === tab.id ? 'white' : 'var(--primary)', opacity: activeTab === tab.id ? 1 : 0.8 }}>{tab.icon}</span>
                                    {tab.label}
                                </motion.button>
                            ))}
                        </nav>

                        <div style={{ height: '1px', background: 'var(--border-light)', margin: '16px 0' }} />

                        <motion.button
                            whileHover={{ scale: 1.02, background: '#fef2f2' }}
                            onClick={logout}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 16px',
                                borderRadius: '14px',
                                border: '1px solid #fee2e2',
                                background: 'rgba(239, 68, 68, 0.03)',
                                color: '#ef4444',
                                fontWeight: '1000',
                                cursor: 'pointer',
                                fontSize: '15px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <LogOut size={20} /> Logout Session
                        </motion.button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main style={{ minWidth: 0 }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div style={{ marginBottom: '20px' }}>
                                <h1 style={{ fontSize: '32px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '4px', letterSpacing: '-1.5px' }}>
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h1>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>Manage and view your {activeTab} information below.</p>
                            </div>

                            {activeTab === 'orders' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                    {loading ? (
                                        <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700', fontSize: '18px' }}>Loading your orders...</div>
                                    ) : orders.length === 0 ? (
                                        <div style={{
                                            background: 'white',
                                            borderRadius: '24px',
                                            padding: '40px',
                                            textAlign: 'center',
                                            border: '1px solid var(--border-light)',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}>
                                            <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' }}>
                                                <ShoppingBag size={28} />
                                            </div>
                                            <h3 style={{ fontSize: '20px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '8px' }}>No orders found</h3>
                                            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>Looks like you haven't placed any orders yet.</p>
                                            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 20px 40px var(--primary-glow)' }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/')} style={{ padding: '12px 32px', borderRadius: '14px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '1000', cursor: 'pointer', fontSize: '14px', boxShadow: '0 8px 16px var(--primary-glow)' }}>Start Shopping</motion.button>
                                        </div>
                                    ) : (
                                        orders.map(order => (
                                            <motion.div
                                                key={order._id}
                                                whileHover={{ y: -3 }}
                                                style={{
                                                    background: 'white',
                                                    borderRadius: '40px',
                                                    border: '1px solid var(--border-light)',
                                                    overflow: 'hidden',
                                                    boxShadow: 'var(--shadow-sm)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <div style={{
                                                    padding: '32px 40px',
                                                    borderBottom: '1px solid var(--border-light)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    background: 'var(--bg-main)'
                                                }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '60px' }}>
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>Order ID</p>
                                                            <p style={{ margin: 0, fontWeight: '1000', fontSize: '14px', color: 'var(--secondary)' }}>#{order._id.replace('ORD-', '').slice(-8)}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>Date Placed</p>
                                                            <p style={{ margin: 0, fontWeight: '1000', fontSize: '16px', color: 'var(--secondary)' }}>{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>Status</p>
                                                            <div style={{
                                                                padding: '6px 16px',
                                                                borderRadius: '12px',
                                                                fontSize: '12px',
                                                                fontWeight: '1000',
                                                                background: order.status === 'cancelled' ? '#fef2f2' : (order.status === 'delivered' ? '#f0fdf4' : '#eff6ff'),
                                                                color: order.status === 'cancelled' ? '#ef4444' : (order.status === 'delivered' ? '#16a34a' : '#3b82f6'),
                                                                display: 'inline-block',
                                                                border: '1px solid currentColor',
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                {order.status}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>Total Amount</p>
                                                        <p style={{ margin: 0, fontWeight: '1000', fontSize: '28px', color: 'var(--primary)' }}>₹{order.totalAmount.toLocaleString()}</p>
                                                    </div>
                                                </div>

                                                <div style={{ padding: '40px' }}>
                                                    <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} style={{
                                                                flexShrink: 0,
                                                                width: '100px',
                                                                height: '100px',
                                                                padding: '16px',
                                                                border: '1px solid var(--border-light)',
                                                                borderRadius: '20px',
                                                                background: 'white'
                                                            }}>
                                                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', pt: '32px', borderTop: '1px solid var(--border-light)' }}>
                                                        <div style={{ display: 'flex', gap: '16px' }}>
                                                            <motion.button whileHover={{ scale: 1.05, background: 'var(--bg-main)' }} style={{ background: 'white', border: '1px solid var(--border-light)', padding: '14px 28px', borderRadius: '16px', fontSize: '15px', fontWeight: '800', color: 'var(--secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease' }}>
                                                                <ExternalLink size={18} /> View Details
                                                            </motion.button>
                                                            {['pending', 'processing'].includes(order.status) && (
                                                                <motion.button whileHover={{ scale: 1.05, background: '#fef2f2' }} onClick={() => handleCancelOrder(order._id)} style={{ color: '#ef4444', background: 'transparent', border: '1px solid #fee2e2', padding: '14px 28px', borderRadius: '16px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease' }}>
                                                                    <XCircle size={18} /> Cancel Order
                                                                </motion.button>
                                                            )}
                                                        </div>
                                                        <motion.button whileHover={{ gap: '12px', color: 'var(--primary)' }} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', fontSize: '15px', fontWeight: '1000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s ease' }}>
                                                            Help with Order <ChevronRight size={20} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'tracking' && (
                                <div style={{ background: 'white', borderRadius: '24px', padding: '28px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Search size={20} color="var(--primary)" /> Track Your Order
                                    </h3>

                                    {/* Search bar */}
                                    <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-main)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
                                        <input
                                            type="text"
                                            value={trackId}
                                            onChange={e => setTrackId(e.target.value)}
                                            placeholder="Enter Order ID (e.g. ORD-...)"
                                            style={{ flex: 1, padding: '10px 14px', background: 'transparent', border: 'none', outline: 'none', fontWeight: '700', color: 'var(--secondary)', fontSize: '13px' }}
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            onClick={handleTrack}
                                            style={{ padding: '0 20px', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '1000', cursor: 'pointer', fontSize: '13px' }}
                                        >Track</motion.button>
                                    </div>

                                    {trackError && <p style={{ color: '#ef4444', fontWeight: '700', fontSize: '13px', marginBottom: '12px' }}>{trackError}</p>}

                                    {trackedOrder && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            {/* Order summary bar */}
                                            <div style={{ background: 'var(--bg-main)', borderRadius: '14px', padding: '14px 18px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</p>
                                                    <p style={{ margin: 0, fontWeight: '1000', fontSize: '14px', color: 'var(--secondary)' }}>#{trackedOrder._id.replace('ORD-', '')}</p>
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Placed On</p>
                                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: 'var(--secondary)' }}>{new Date(trackedOrder.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivering To</p>
                                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: 'var(--secondary)' }}>{trackedOrder.city}, {trackedOrder.zipcode}</p>
                                                </div>
                                                <div style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '1000', textTransform: 'uppercase', background: trackedOrder.status === 'cancelled' ? '#fef2f2' : '#f0fdf4', color: trackedOrder.status === 'cancelled' ? '#ef4444' : '#16a34a', border: '1px solid currentColor' }}>
                                                    {trackedOrder.status}
                                                </div>
                                            </div>

                                            {/* Status timeline */}
                                            {(() => {
                                                const steps = [
                                                    { label: 'Order\nPlaced', key: 'processing' },
                                                    { label: 'Confirmed', key: 'confirmed' },
                                                    { label: 'Packed', key: 'packed' },
                                                    { label: 'Partner\nAssigned', key: 'partner_assigned' },
                                                    { label: 'Out for\nDelivery', key: 'out_for_delivery' },
                                                    { label: 'Delivered', key: 'delivered' }
                                                ];
                                                const statusOrder = ['processing', 'confirmed', 'packed', 'partner_assigned', 'out_for_delivery', 'delivered'];
                                                const currentIdx = trackedOrder.status === 'cancelled' ? -1 : statusOrder.indexOf(trackedOrder.status);
                                                const safeIdx = currentIdx === -1 ? -1 : Math.max(0, currentIdx);
                                                return (
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', overflowX: 'auto', paddingBottom: '4px' }}>
                                                        {steps.map((step, i) => (
                                                            <React.Fragment key={step.key}>
                                                                <div style={{ textAlign: 'center', minWidth: '68px' }}>
                                                                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: trackedOrder.status === 'cancelled' ? '#fee2e2' : i <= safeIdx ? 'var(--primary)' : 'var(--bg-main)', border: `2px solid ${trackedOrder.status === 'cancelled' ? '#ef4444' : i <= safeIdx ? 'var(--primary)' : 'var(--border-light)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 5px', color: i <= safeIdx && trackedOrder.status !== 'cancelled' ? 'white' : 'var(--text-muted)', fontSize: '11px', fontWeight: '900', transition: 'all 0.3s' }}>
                                                                        {i <= safeIdx && trackedOrder.status !== 'cancelled' ? '✓' : i + 1}
                                                                    </div>
                                                                    <p style={{ margin: 0, fontSize: '8px', fontWeight: '800', color: i <= safeIdx && trackedOrder.status !== 'cancelled' ? 'var(--primary)' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3, whiteSpace: 'pre-line' }}>{step.label}</p>
                                                                </div>
                                                                {i < steps.length - 1 && (
                                                                    <div style={{ flex: 1, height: '2px', background: i < safeIdx && trackedOrder.status !== 'cancelled' ? 'var(--primary)' : 'var(--border-light)', minWidth: '10px', transition: 'all 0.3s', marginTop: '12px' }} />
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                );
                                            })()}
                                        </motion.div>
                                    )}

                                    {!trackedOrder && !trackError && orders.length === 0 && (
                                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px', padding: '20px 0' }}>No orders yet. Place an order to track it here.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'addresses' && (
                                <div>
                                    {savedAddress ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                            style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}
                                        >
                                            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <MapPin size={22} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Default Address</span>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Saved from last order</span>
                                                </div>
                                                <p style={{ margin: 0, fontWeight: '800', fontSize: '15px', color: 'var(--secondary)', marginBottom: '4px' }}>{savedAddress.address}</p>
                                                <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)' }}>{savedAddress.city} — {savedAddress.zipcode}</p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', border: '1px solid var(--border-light)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'var(--bg-main)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><MapPin size={24} /></div>
                                            <h3 style={{ fontSize: '18px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '8px' }}>No saved address yet</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', marginBottom: '20px' }}>Place an order to save your delivery address here.</p>
                                            <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/')} style={{ padding: '10px 28px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '1000', cursor: 'pointer', fontSize: '13px', boxShadow: '0 6px 12px var(--primary-glow)' }}>Shop Now</motion.button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'support' && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                    <motion.div whileHover={{ y: -6 }} style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-light)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                        <div style={{ width: '52px', height: '52px', background: '#eff6ff', color: '#3b82f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                            <Headset size={24} />
                                        </div>
                                        <h4 style={{ fontSize: '18px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '8px' }}>Help Center</h4>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px', fontWeight: '600', lineHeight: '1.5' }}>Browse our FAQ and guides for immediate solutions and tips.</p>
                                        <motion.button whileHover={{ scale: 1.05, background: 'var(--bg-main)' }} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'white', fontWeight: '1000', color: 'var(--secondary)', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s ease' }}>Open Help Center</motion.button>
                                    </motion.div>
                                    <motion.div whileHover={{ y: -6 }} style={{ background: 'var(--primary)', borderRadius: '24px', padding: '32px', color: 'white', textAlign: 'center', boxShadow: '0 20px 40px var(--primary-glow)' }}>
                                        <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                            <Clock size={24} />
                                        </div>
                                        <h4 style={{ fontSize: '18px', fontWeight: '1000', color: 'white', marginBottom: '8px' }}>Chat with Support</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px', fontSize: '14px', fontWeight: '600', lineHeight: '1.5' }}>Our AI-powered assistant is ready to help 24/7 with any query.</p>
                                        <motion.button whileHover={{ scale: 1.05, background: 'white', color: 'var(--primary)' }} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.2)', fontWeight: '1000', color: 'white', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s ease' }}>Start Chat Now</motion.button>
                                    </motion.div>
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

