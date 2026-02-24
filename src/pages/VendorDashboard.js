import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Store, Package, TrendingUp, ShoppingBag, LogOut,
    Plus, Pencil, Trash2, X, CheckCircle2, XCircle,
    AlertTriangle, BarChart3, Star, Clock, DollarSign,
    Bell, Info, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/* ─── helpers ─────────────────────────────────────────────── */
const categories = ['Vegetables', 'Fruits', 'Dairy', 'Dry Fruits', 'Grains', 'Beverages', 'Snacks', 'Other'];
const COMMISSION = 0.10;

const statusColors = {
    processing: { bg: '#fef9c3', text: '#854d0e' },
    confirmed: { bg: '#e0f2fe', text: '#0369a1' },
    packed: { bg: '#ede9fe', text: '#6d28d9' },
    partner_assigned: { bg: '#fce7f3', text: '#9d174d' },
    out_for_delivery: { bg: '#d1fae5', text: '#065f46' },
    delivered: { bg: '#f0fdf4', text: '#16a34a' },
    cancelled: { bg: '#fef2f2', text: '#ef4444' },
    pending: { bg: '#fef9c3', text: '#854d0e' },
    ready: { bg: '#d1fae5', text: '#065f46' },
};

const emptyProduct = { name: '', price: '', category: 'Vegetables', stock: '', expiryDate: '', image: '', description: '' };

/* ─── Bar Chart (CSS only) ─────────────────────────────────── */
const BarChart = ({ data, color = 'var(--primary)' }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px', padding: '0 4px' }}>
            {data.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)' }}>
                        {d.value > 999 ? (d.value / 1000).toFixed(1) + 'k' : d.value}
                    </span>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.value / max) * 80}px` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        style={{ width: '100%', background: color, borderRadius: '6px 6px 0 0', minHeight: '4px' }}
                    />
                    <span style={{ fontSize: '8px', fontWeight: '700', color: 'var(--text-muted)' }}>{d.label}</span>
                </div>
            ))}
        </div>
    );
};

/* ─── Main Component ───────────────────────────────────────── */
const VendorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');

    const loadProducts = () =>
        JSON.parse(localStorage.getItem('freshly_vendor_products') || '[]')
            .filter(p => p.vendorId === user?.id);

    const loadOrders = () => {
        const myProductIds = JSON.parse(localStorage.getItem('freshly_vendor_products') || '[]')
            .filter(p => p.vendorId === user?.id)
            .map(p => p.id);
        return JSON.parse(localStorage.getItem('freshly_orders') || '[]')
            .filter(o => o.items?.some(item => myProductIds.includes(item.id) || myProductIds.includes(String(item.id))));
    };

    const [products, setProducts] = useState(loadProducts);
    const [orders, setOrders] = useState(loadOrders);

    /* modal state */
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyProduct);
    const [imagePreview, setImagePreview] = useState('');
    const fileRef = useRef();

    const today = new Date();

    useEffect(() => {
        setProducts(loadProducts());
        setOrders(loadOrders());
    }, [user]);

    /* ── computed stats ── */
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const totalSales = deliveredOrders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
    const totalEarnings = totalSales * (1 - COMMISSION);
    const avgRating = products.length
        ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1)
        : '—';
    const lowStockProducts = products.filter(p => Number(p.stock) < 5 && Number(p.stock) >= 0);
    const expiryAlerts = products.filter(p => {
        if (!p.expiryDate) return false;
        const diff = (new Date(p.expiryDate) - today) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
    });

    /* monthly data (last 6 months) */
    const monthlyData = (() => {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(); d.setMonth(d.getMonth() - i);
            const lbl = d.toLocaleString('default', { month: 'short' });
            const total = deliveredOrders
                .filter(o => new Date(o.date).getMonth() === d.getMonth() && new Date(o.date).getFullYear() === d.getFullYear())
                .reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
            months.push({ label: lbl, value: Math.round(total) });
        }
        return months;
    })();

    /* ── product save ── */
    const saveProduct = () => {
        if (!form.name || !form.price) return alert('Name and price are required.');
        const all = JSON.parse(localStorage.getItem('freshly_vendor_products') || '[]');
        let updated;
        if (editingProduct) {
            updated = all.map(p => p.id === editingProduct.id
                ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) }
                : p);
        } else {
            const newProd = {
                ...form, id: 'VP-' + Date.now(), vendorId: user.id,
                vendorName: user.name, price: Number(form.price), stock: Number(form.stock),
                status: 'pending', rating: 0, reviews: [], createdAt: new Date().toISOString()
            };
            updated = [newProd, ...all];
        }
        localStorage.setItem('freshly_vendor_products', JSON.stringify(updated));
        setProducts(updated.filter(p => p.vendorId === user?.id));
        setShowModal(false); setForm(emptyProduct); setEditingProduct(null); setImagePreview('');
    };

    const deleteProduct = (id) => {
        if (!window.confirm('Delete this product?')) return;
        const all = JSON.parse(localStorage.getItem('freshly_vendor_products') || '[]').filter(p => p.id !== id);
        localStorage.setItem('freshly_vendor_products', JSON.stringify(all));
        setProducts(all.filter(p => p.vendorId === user?.id));
    };

    const openEdit = (p) => {
        setEditingProduct(p);
        setForm({ name: p.name, price: p.price, category: p.category, stock: p.stock, expiryDate: p.expiryDate || '', image: p.image || '', description: p.description || '' });
        setImagePreview(p.image || '');
        setShowModal(true);
    };

    /* ── order status update ── */
    const updateOrderStatus = (orderId, status) => {
        const all = JSON.parse(localStorage.getItem('freshly_orders') || '[]').map(o => o._id === orderId ? { ...o, status } : o);
        localStorage.setItem('freshly_orders', JSON.stringify(all));
        setOrders(loadOrders());
    };

    /* ── image file upload ── */
    const handleImageFile = (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => { setForm(f => ({ ...f, image: ev.target.result })); setImagePreview(ev.target.result); };
        reader.readAsDataURL(file);
    };

    /* ── sidebar tabs ── */
    const tabs = [
        { id: 'overview', label: 'Overview', icon: <TrendingUp size={18} /> },
        { id: 'products', label: 'Products', icon: <Package size={18} />, badge: products.filter(p => p.status === 'pending').length },
        { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} />, badge: orders.filter(o => o.status === 'processing').length },
        { id: 'earnings', label: 'Earnings', icon: <DollarSign size={18} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    ];

    const statusDot = (status) => {
        const c = statusColors[status] || statusColors.processing;
        return (
            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', background: c.bg, color: c.text }}>
                {status?.replace(/_/g, ' ')}
            </span>
        );
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', fontFamily: 'inherit' }}>

            {/* ── Sidebar ── */}
            <motion.div
                initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                style={{ width: '240px', background: 'white', borderRight: '1px solid var(--border-light)', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', flexShrink: 0 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Store size={20} color="white" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: '1000', fontSize: '14px', color: 'var(--secondary)' }}>Vendor Portal</p>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{user?.name || user?.email}</p>
                    </div>
                </div>

                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '14px', border: 'none', background: activeTab === tab.id ? 'var(--primary)' : 'transparent', color: activeTab === tab.id ? 'white' : 'var(--text-muted)', fontWeight: '800', cursor: 'pointer', fontSize: '14px', textAlign: 'left', transition: 'all 0.2s' }}>
                        {tab.icon} {tab.label}
                        {tab.badge > 0 && (
                            <span style={{ marginLeft: 'auto', background: activeTab === tab.id ? 'rgba(255,255,255,0.3)' : 'var(--primary)', color: 'white', fontSize: '10px', fontWeight: '900', padding: '2px 7px', borderRadius: '10px' }}>
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}

                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '12px', border: 'none', background: 'transparent', color: 'var(--text-muted)', fontWeight: '700', cursor: 'pointer', fontSize: '13px', width: '100%' }}>
                        <Bell size={16} /> Notifications
                    </button>
                    <button onClick={() => { logout(); navigate('/login'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '12px', border: 'none', background: 'transparent', color: '#ef4444', fontWeight: '800', cursor: 'pointer', fontSize: '13px', width: '100%' }}>
                        <LogOut size={16} /> Log Out
                    </button>
                </div>
            </motion.div>

            {/* ── Main Content ── */}
            <div style={{ flex: 1, padding: '40px 36px', overflowY: 'auto' }}>

                {/* ──────── OVERVIEW ──────── */}
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 style={{ margin: '0 0 24px', fontWeight: '1000', fontSize: '24px', color: 'var(--secondary)' }}>Welcome back, {user?.name} 👋</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                            {[
                                { label: 'Total Sales', value: `₹${totalSales.toLocaleString('en-IN')}`, icon: <TrendingUp size={20} />, color: 'var(--primary)', highlight: true },
                                { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={20} />, color: '#3b82f6' },
                                { label: 'Net Earnings', value: `₹${Math.round(totalEarnings).toLocaleString('en-IN')}`, icon: <DollarSign size={20} />, color: '#16a34a' },
                                { label: 'Products', value: products.length, icon: <Package size={20} />, color: '#8b5cf6' },
                                { label: 'Avg Rating', value: avgRating, icon: <Star size={20} />, color: '#f59e0b' },
                                { label: 'Low Stock', value: lowStockProducts.length, icon: <AlertTriangle size={20} />, color: '#ef4444' },
                            ].map((s, i) => (
                                <motion.div key={i} whileHover={{ y: -4 }} style={{ background: 'white', padding: '20px', borderRadius: '18px', border: s.highlight ? '1px solid var(--primary)' : '1px solid var(--border-light)', boxShadow: s.highlight ? '0 6px 20px var(--primary-glow)' : 'var(--shadow-sm)' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: s.highlight ? 'var(--primary)' : 'var(--bg-main)', color: s.highlight ? 'white' : s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>{s.icon}</div>
                                    <p style={{ margin: '0 0 2px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '1000', color: s.color }}>{s.value}</h3>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
                            <h3 style={{ margin: '0 0 20px', fontWeight: '1000', fontSize: '16px', color: 'var(--secondary)' }}>Monthly Revenue (Last 6 Months)</h3>
                            <BarChart data={monthlyData} />
                        </div>

                        {(lowStockProducts.length > 0 || expiryAlerts.length > 0) && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {lowStockProducts.length > 0 && (
                                    <div style={{ background: '#fef2f2', borderRadius: '16px', padding: '20px', border: '1px solid #fecaca' }}>
                                        <p style={{ margin: '0 0 10px', fontWeight: '900', color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={14} /> Low Stock Alert</p>
                                        {lowStockProducts.map(p => <p key={p.id} style={{ margin: '4px 0', fontSize: '12px', color: '#7f1d1d', fontWeight: '700' }}>{p.name} — {p.stock} left</p>)}
                                    </div>
                                )}
                                {expiryAlerts.length > 0 && (
                                    <div style={{ background: '#fef9c3', borderRadius: '16px', padding: '20px', border: '1px solid #fde047' }}>
                                        <p style={{ margin: '0 0 10px', fontWeight: '900', color: '#854d0e', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Expiry Alert</p>
                                        {expiryAlerts.map(p => <p key={p.id} style={{ margin: '4px 0', fontSize: '12px', color: '#713f12', fontWeight: '700' }}>{p.name} — expires {new Date(p.expiryDate).toLocaleDateString()}</p>)}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ──────── PRODUCTS ──────── */}
                {activeTab === 'products' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>My Products</h2>
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                onClick={() => { setForm(emptyProduct); setEditingProduct(null); setImagePreview(''); setShowModal(true); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '13px' }}>
                                <Plus size={16} /> Add Product
                            </motion.button>
                        </div>

                        <div style={{ background: '#fef9c3', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', border: '1px solid #fde047', fontSize: '12px', color: '#854d0e', fontWeight: '700', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Info size={14} /> New products start as <b>Pending</b> — admin must approve before they appear in the store.
                        </div>

                        {products.length === 0 ? (
                            <div style={{ background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                                <Package size={40} color="var(--text-muted)" style={{ opacity: 0.4, marginBottom: '12px' }} />
                                <p style={{ fontWeight: '900', color: 'var(--secondary)' }}>No products yet</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Click "Add Product" to get started.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {products.map(p => {
                                    const daysToExpiry = p.expiryDate ? Math.ceil((new Date(p.expiryDate) - today) / (1000 * 60 * 60 * 24)) : null;
                                    return (
                                        <motion.div key={p.id} whileHover={{ y: -2 }} style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--bg-main)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={20} color="var(--text-muted)" />}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                    <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>{p.name}</p>
                                                    {statusDot(p.status)}
                                                    {Number(p.stock) < 5 && <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '9px', fontWeight: '900', background: '#fef2f2', color: '#ef4444' }}>⚠ LOW STOCK</span>}
                                                    {daysToExpiry !== null && daysToExpiry <= 7 && daysToExpiry >= 0 && <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '9px', fontWeight: '900', background: '#fef9c3', color: '#854d0e' }}>⏳ EXPIRING</span>}
                                                </div>
                                                <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                    {p.category} · ₹{p.price} · Stock: {p.stock}{p.expiryDate ? ` · Exp: ${new Date(p.expiryDate).toLocaleDateString()}` : ''}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => openEdit(p)} style={{ padding: '8px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', cursor: 'pointer', color: 'var(--secondary)', display: 'flex' }}><Pencil size={14} /></button>
                                                <button onClick={() => deleteProduct(p.id)} style={{ padding: '8px', borderRadius: '10px', border: '1px solid #fca5a5', background: '#fef2f2', cursor: 'pointer', color: '#ef4444', display: 'flex' }}><Trash2 size={14} /></button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ──────── ORDERS ──────── */}
                {activeTab === 'orders' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>My Orders</h2>
                            <button onClick={() => setOrders(loadOrders())} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>
                                <RefreshCw size={13} /> Refresh
                            </button>
                        </div>

                        {orders.length === 0 ? (
                            <div style={{ background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                                <ShoppingBag size={40} color="var(--text-muted)" style={{ opacity: 0.4, marginBottom: '12px' }} />
                                <p style={{ fontWeight: '900', color: 'var(--secondary)' }}>No orders yet</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Orders from customers will appear here once products are approved.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {orders.map(order => (
                                    <div key={order._id} style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '18px 20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>Order #{order._id?.slice(-8).toUpperCase()}</p>
                                                <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{new Date(order.date).toLocaleString()} · {order.paymentMethod?.toUpperCase()}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {statusDot(order.status)}
                                                <span style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '14px' }}>₹{order.totalAmount}</span>
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '12px' }}>
                                            {order.items?.map((item, i) => (
                                                <p key={i} style={{ margin: '2px 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>• {item.name} × {item.qty} — ₹{item.price * item.qty}</p>
                                            ))}
                                        </div>
                                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {['packed', 'ready'].map(s => (
                                                    <button key={s} onClick={() => updateOrderStatus(order._id, s)}
                                                        style={{ padding: '6px 14px', borderRadius: '10px', border: '1px solid var(--border-light)', background: order.status === s ? 'var(--primary)' : 'var(--bg-main)', color: order.status === s ? 'white' : 'var(--secondary)', fontWeight: '800', cursor: 'pointer', fontSize: '11px', textTransform: 'capitalize' }}>
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ──────── EARNINGS ──────── */}
                {activeTab === 'earnings' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 style={{ margin: '0 0 24px', fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Earnings</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                            {[
                                { label: 'Gross Sales', value: `₹${totalSales.toLocaleString('en-IN')}`, color: '#3b82f6', desc: 'From delivered orders' },
                                { label: 'Admin Commission (10%)', value: `₹${Math.round(totalSales * COMMISSION).toLocaleString('en-IN')}`, color: '#f59e0b', desc: 'Platform fee' },
                                { label: 'Net Earnings', value: `₹${Math.round(totalEarnings).toLocaleString('en-IN')}`, color: '#16a34a', desc: 'Your payout', highlight: true },
                            ].map((s, i) => (
                                <div key={i} style={{ background: 'white', borderRadius: '18px', padding: '22px', border: s.highlight ? '1px solid #bbf7d0' : '1px solid var(--border-light)', boxShadow: s.highlight ? '0 4px 16px #d1fae5' : 'none' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                                    <h3 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: '1000', color: s.color }}>{s.value}</h3>
                                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{s.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
                            <h3 style={{ margin: '0 0 20px', fontWeight: '1000', fontSize: '16px', color: 'var(--secondary)' }}>Monthly Earnings (Last 6 Months)</h3>
                            <BarChart data={monthlyData.map(m => ({ ...m, value: Math.round(m.value * (1 - COMMISSION)) }))} color="#16a34a" />
                        </div>

                        <div style={{ background: '#f0fdf4', borderRadius: '16px', padding: '20px', border: '1px solid #bbf7d0' }}>
                            <p style={{ margin: '0 0 6px', fontWeight: '900', fontSize: '13px', color: '#166534' }}>💳 Payout Request</p>
                            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#15803d', fontWeight: '600' }}>Bank details & payout requests require backend integration — <b>Coming Soon</b></p>
                            <button style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#16a34a', color: 'white', fontWeight: '900', cursor: 'not-allowed', fontSize: '13px', opacity: 0.6 }}>Request Payout (Coming Soon)</button>
                        </div>
                    </motion.div>
                )}

                {/* ──────── ANALYTICS ──────── */}
                {activeTab === 'analytics' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 style={{ margin: '0 0 24px', fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Analytics</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)' }}>
                                <h3 style={{ margin: '0 0 16px', fontWeight: '1000', fontSize: '15px', color: 'var(--secondary)' }}>🥇 Top Products</h3>
                                {products.slice(0, 5).length === 0
                                    ? <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No products yet.</p>
                                    : products.slice(0, 5).map((p, i) => (
                                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                            <span style={{ width: '22px', height: '22px', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontWeight: '900', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontWeight: '800', fontSize: '13px', color: 'var(--secondary)' }}>{p.name}</p>
                                                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>₹{p.price} · {p.category}</p>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)' }}>
                                <h3 style={{ margin: '0 0 16px', fontWeight: '1000', fontSize: '15px', color: '#ef4444' }}>⚠ Low Stock Warning</h3>
                                {lowStockProducts.length === 0
                                    ? <p style={{ color: '#16a34a', fontSize: '12px', fontWeight: '700' }}>✅ All products are well-stocked!</p>
                                    : lowStockProducts.map(p => (
                                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '8px 12px', background: '#fef2f2', borderRadius: '10px' }}>
                                            <p style={{ margin: 0, fontWeight: '800', fontSize: '12px', color: '#7f1d1d' }}>{p.name}</p>
                                            <span style={{ fontWeight: '900', fontSize: '12px', color: '#ef4444' }}>{p.stock} left</span>
                                        </div>
                                    ))}
                            </div>

                            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)' }}>
                                <h3 style={{ margin: '0 0 16px', fontWeight: '1000', fontSize: '15px', color: '#854d0e' }}>⏳ Expiry Alerts</h3>
                                {expiryAlerts.length === 0
                                    ? <p style={{ color: '#16a34a', fontSize: '12px', fontWeight: '700' }}>✅ No expiry concerns in the next 7 days!</p>
                                    : expiryAlerts.map(p => (
                                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '8px 12px', background: '#fef9c3', borderRadius: '10px' }}>
                                            <p style={{ margin: 0, fontWeight: '800', fontSize: '12px', color: '#713f12' }}>{p.name}</p>
                                            <span style={{ fontWeight: '900', fontSize: '12px', color: '#854d0e' }}>Exp: {new Date(p.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                            </div>

                            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)' }}>
                                <h3 style={{ margin: '0 0 16px', fontWeight: '1000', fontSize: '15px', color: 'var(--secondary)' }}>📦 Order Summary</h3>
                                {[
                                    { label: 'Total Orders', value: orders.length, color: '#3b82f6' },
                                    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: '#16a34a' },
                                    { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: '#f59e0b' },
                                    { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' },
                                ].map((r, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>{r.label}</p>
                                        <span style={{ fontWeight: '900', fontSize: '15px', color: r.color }}>{r.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* ──────── Add/Edit Product Modal ──────── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
                            style={{ background: 'white', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ margin: 0, fontWeight: '1000', fontSize: '18px' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <button onClick={() => { setShowModal(false); setEditingProduct(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                            </div>

                            {/* image upload */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '6px' }}>Product Image</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ width: '70px', height: '70px', borderRadius: '12px', background: 'var(--bg-main)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-light)' }}>
                                        {imagePreview ? <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={24} color="var(--text-muted)" />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <button onClick={() => fileRef.current.click()} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px dashed var(--border-light)', background: 'var(--bg-main)', cursor: 'pointer', fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '6px', width: '100%' }}>📁 Upload Image</button>
                                        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageFile} style={{ display: 'none' }} />
                                        <input placeholder="or paste image URL"
                                            value={typeof form.image === 'string' && !form.image.startsWith('data:') ? form.image : ''}
                                            onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(e.target.value); }}
                                            style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '11px', color: 'var(--secondary)', background: 'var(--bg-main)', boxSizing: 'border-box' }} />
                                    </div>
                                </div>
                            </div>

                            {/* text fields */}
                            {[
                                { label: 'Product Name *', key: 'name', placeholder: 'e.g. Fresh Tomatoes' },
                                { label: 'Price (₹) *', key: 'price', placeholder: '0', type: 'number' },
                                { label: 'Stock (units)', key: 'stock', placeholder: '0', type: 'number' },
                                { label: 'Expiry Date', key: 'expiryDate', type: 'date' },
                            ].map(field => (
                                <div key={field.key} style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '5px' }}>{field.label}</label>
                                    <input type={field.type || 'text'} placeholder={field.placeholder} value={form[field.key]}
                                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '13px', fontWeight: '600', color: 'var(--secondary)', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                            ))}

                            {/* category */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '5px' }}>Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '13px', fontWeight: '600', color: 'var(--secondary)', outline: 'none' }}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* description */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '5px' }}>Description</label>
                                <textarea placeholder="Brief product description..." value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    rows={3}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '13px', fontWeight: '600', color: 'var(--secondary)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => { setShowModal(false); setEditingProduct(null); }}
                                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', cursor: 'pointer', fontWeight: '800', fontSize: '13px', color: 'var(--secondary)' }}>Cancel</button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveProduct}
                                    style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: '900', fontSize: '13px' }}>
                                    {editingProduct ? '✅ Save Changes' : '➕ Submit for Approval'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorDashboard;
