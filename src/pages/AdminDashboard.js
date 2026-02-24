import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Users, Package, ShoppingBag,
    BarChart3, Tag, Settings, CheckCircle2,
    XCircle, TrendingUp, AlertTriangle, Search,
    Bell, Printer, Truck
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import AdminProductsTab from '../components/admin/AdminProductsTab';
import AdminCustomersTab from '../components/admin/AdminCustomersTab';
import AdminInventoryTab from '../components/admin/AdminInventoryTab';
import AdminCouponsTab from '../components/admin/AdminCouponsTab';
import AdminSettingsTab from '../components/admin/AdminSettingsTab';
import AdminAnalyticsTab from '../components/admin/AdminAnalyticsTab';

/* ─────────── helpers ─────────── */
const pill = (status) => {
    const map = {
        processing: ['#fef9c3', '#854d0e'],
        confirmed: ['#e0f2fe', '#0369a1'],
        packed: ['#ede9fe', '#6d28d9'],
        out_for_delivery: ['#d1fae5', '#065f46'],
        delivered: ['#f0fdf4', '#16a34a'],
        cancelled: ['#fef2f2', '#ef4444'],
        pending: ['#fef9c3', '#854d0e'],
        ready: ['#d1fae5', '#065f46'],
    };
    const [bg, col] = map[status] || map.processing;
    return (
        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', background: bg, color: col }}>
            {status?.replace(/_/g, ' ')}
        </span>
    );
};

const SidebarBtn = ({ id, label, icon, badge, active, onClick }) => (
    <button onClick={() => onClick(id)}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '14px', border: 'none', background: active ? 'var(--primary)' : 'transparent', color: active ? 'white' : 'var(--text-muted)', fontWeight: '800', cursor: 'pointer', fontSize: '13px', textAlign: 'left', width: '100%', transition: 'all 0.2s' }}>
        {icon} {label}
        {badge > 0 && (
            <span style={{ marginLeft: 'auto', background: active ? 'rgba(255,255,255,0.3)' : 'var(--primary)', color: 'white', fontSize: '10px', fontWeight: '900', padding: '2px 7px', borderRadius: '10px' }}>
                {badge}
            </span>
        )}
    </button>
);

/* ─────────── component ─────────── */
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [vendorProducts, setVendorProducts] = useState([]);
    const [adminProducts, setAdminProducts] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [orderSearch, setOrderSearch] = useState('');
    const [deliveryInputs, setDeliveryInputs] = useState({});
    const { notifications, markAllRead, unreadCount } = useNotifications();

    useEffect(() => {
        setOrders(JSON.parse(localStorage.getItem('freshly_orders') || '[]'));
        setVendors(JSON.parse(localStorage.getItem('freshly_vendors') || '[]'));
        setVendorProducts(JSON.parse(localStorage.getItem('freshly_vendor_products') || '[]'));
        setAdminProducts(JSON.parse(localStorage.getItem('freshly_admin_products') || '[]'));
        setCoupons(JSON.parse(localStorage.getItem('freshly_coupons') || '[]'));
    }, []);

    /* order helpers */
    const changeOrderStatus = (id, status) => {
        const updated = orders.map(o => o._id === id ? { ...o, status } : o);
        setOrders(updated);
        localStorage.setItem('freshly_orders', JSON.stringify(updated));
    };

    const assignDelivery = (id) => {
        const partner = deliveryInputs[id] || '';
        if (!partner.trim()) return alert('Enter delivery partner name.');
        const updated = orders.map(o => o._id === id ? { ...o, deliveryPartner: partner } : o);
        setOrders(updated);
        localStorage.setItem('freshly_orders', JSON.stringify(updated));
        setDeliveryInputs(d => ({ ...d, [id]: '' }));
    };

    const printInvoice = (order) => {
        const w = window.open('', '_blank');
        w.document.write(`
            <html><head><title>Invoice #${order._id?.slice(-8).toUpperCase()}</title>
            <style>body{font-family:sans-serif;padding:32px;max-width:600px;margin:auto}h1{font-size:24px}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{text-align:left;padding:8px 12px;border-bottom:1px solid #e5e7eb}th{background:#f9fafb;font-weight:800}</style></head>
            <body>
            <h1>🧾 Invoice</h1>
            <p><b>Order ID:</b> #${order._id?.slice(-8).toUpperCase()}</p>
            <p><b>Date:</b> ${new Date(order.date).toLocaleString()}</p>
            <p><b>Customer:</b> ${order.shippingAddress?.name || 'Guest'}</p>
            <p><b>Address:</b> ${order.shippingAddress?.address || '—'}, ${order.shippingAddress?.city || ''}</p>
            <table>
                <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                ${(order.items || []).map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>₹${i.price}</td><td>₹${i.price * i.qty}</td></tr>`).join('')}
            </table>
            <h3>Total: ₹${order.totalAmount}</h3>
            <p><b>Payment:</b> ${order.paymentMethod?.toUpperCase()}</p>
            <p><b>Status:</b> ${order.status}</p>
            <script>window.onload=()=>{window.print();window.close();}</script>
            </body></html>
        `);
        w.document.close();
    };

    /* vendor helpers */
    const handleVendorAction = (vendorId, action) => {
        const updated = action === 'delete'
            ? vendors.filter(v => v.id !== vendorId)
            : vendors.map(v => v.id === vendorId ? { ...v, status: action } : v);
        setVendors(updated);
        localStorage.setItem('freshly_vendors', JSON.stringify(updated));
    };

    const handleProductApproval = (productId, action) => {
        const updated = vendorProducts.map(p => p.id === productId ? { ...p, status: action } : p);
        setVendorProducts(updated);
        localStorage.setItem('freshly_vendor_products', JSON.stringify(updated));
    };

    /* stats */
    const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
    const lowStockCount = adminProducts.filter(p => Number(p.stock) < 10).length;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
        { id: 'products', label: 'Products', icon: <Package size={17} />, badge: 0 },
        { id: 'orders', label: 'Orders', icon: <ShoppingBag size={17} />, badge: orders.filter(o => o.status === 'processing').length },
        { id: 'customers', label: 'Customers', icon: <Users size={17} /> },
        { id: 'inventory', label: 'Inventory', icon: <AlertTriangle size={17} />, badge: lowStockCount },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={17} /> },
        { id: 'coupons', label: 'Coupons', icon: <Tag size={17} />, badge: coupons.filter(c => c.active).length },
        { id: 'vendors', label: 'Vendors', icon: <TrendingUp size={17} />, badge: vendors.filter(v => v.status === 'pending').length },
        { id: 'vproducts', label: 'V-Products', icon: <CheckCircle2 size={17} />, badge: vendorProducts.filter(p => p.status === 'pending').length },
        { id: 'notifications', label: 'Alerts', icon: <Bell size={17} />, badge: unreadCount },
        { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
    ];

    const filteredOrders = orders.filter(o =>
        !orderSearch || o._id?.includes(orderSearch) ||
        o.shippingAddress?.name?.toLowerCase().includes(orderSearch.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>

            {/* ── Sidebar ── */}
            <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                style={{ width: '210px', background: 'white', borderRight: '1px solid var(--border-light)', padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '4px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', flexShrink: 0 }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LayoutDashboard size={18} color="white" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: '1000', fontSize: '14px', color: 'var(--secondary)' }}>Admin Panel</p>
                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>Freshly Admin</p>
                    </div>
                </div>

                {tabs.map(t => <SidebarBtn key={t.id} {...t} active={activeTab === t.id} onClick={setActiveTab} />)}
            </motion.div>

            {/* ── Main ── */}
            <div style={{ flex: 1, padding: '36px 32px', overflowY: 'auto' }}>

                {/* ── OVERVIEW ── */}
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 style={{ margin: '0 0 24px', fontWeight: '1000', fontSize: '24px', color: 'var(--secondary)' }}>Dashboard Overview</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                            {[
                                { label: 'Total Sales', value: `₹${totalSales.toLocaleString('en-IN')}`, color: 'var(--primary)' },
                                { label: 'Total Orders', value: orders.length, color: '#3b82f6' },
                                { label: 'Vendors', value: vendors.filter(v => v.status === 'accepted').length, color: '#8b5cf6' },
                                { label: 'Products', value: adminProducts.length, color: '#16a34a' },
                                { label: 'Customers', value: new Set(orders.map(o => o.shippingAddress?.email || 'g')).size, color: '#f59e0b' },
                                { label: 'Low Stock', value: lowStockCount, color: '#ef4444' },
                            ].map((s, i) => (
                                <motion.div key={i} whileHover={{ y: -4 }} style={{ background: 'white', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-light)' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</p>
                                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '1000', color: s.color }}>{s.value}</h3>
                                </motion.div>
                            ))}
                        </div>

                        {/* pending items */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)' }}>
                                <p style={{ margin: '0 0 12px', fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>⏳ Pending Orders</p>
                                {orders.filter(o => o.status === 'processing').slice(0, 5).map(o => (
                                    <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '700' }}>
                                        <span style={{ color: 'var(--secondary)' }}>#{o._id?.slice(-6)}</span>
                                        <span style={{ color: 'var(--primary)' }}>₹{o.totalAmount}</span>
                                    </div>
                                ))}
                                {orders.filter(o => o.status === 'processing').length === 0 && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No pending orders</p>}
                            </div>
                            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)' }}>
                                <p style={{ margin: '0 0 12px', fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>🏪 Pending Vendors</p>
                                {vendors.filter(v => v.status === 'pending').slice(0, 5).map(v => (
                                    <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '700' }}>
                                        <span style={{ color: 'var(--secondary)' }}>{v.name}</span>
                                        <span style={{ color: '#854d0e' }}>Pending</span>
                                    </div>
                                ))}
                                {vendors.filter(v => v.status === 'pending').length === 0 && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No pending vendors</p>}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── PRODUCTS ── */}
                {activeTab === 'products' && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                        <AdminProductsTab products={adminProducts} setProducts={setAdminProducts} />
                    </motion.div>
                )}

                {/* ── ORDERS ── */}
                {activeTab === 'orders' && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Orders</h2>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input placeholder="Search by ID or name…" value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                                    style={{ paddingLeft: '30px', padding: '8px 12px 8px 30px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'white', fontSize: '12px', outline: 'none', width: '220px' }} />
                            </div>
                        </div>

                        {filteredOrders.length === 0 && <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>No orders found.</p>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {filteredOrders.map(order => (
                                <div key={order._id} style={{ background: 'white', borderRadius: '18px', border: '1px solid var(--border-light)', padding: '18px 20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '900', fontSize: '14px' }}>Order #{order._id?.slice(-8).toUpperCase()}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{new Date(order.date).toLocaleString()} · {order.shippingAddress?.name}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {pill(order.status)}
                                            <span style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '15px' }}>₹{order.totalAmount}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                        <select value={order.status} onChange={e => changeOrderStatus(order._id, e.target.value)}
                                            style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '12px', fontWeight: '700', outline: 'none', cursor: 'pointer' }}>
                                            {['processing', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
                                                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                            ))}
                                        </select>

                                        {/* Delivery partner */}
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            <input placeholder={order.deliveryPartner || 'Assign delivery partner…'}
                                                value={deliveryInputs[order._id] || ''}
                                                onChange={e => setDeliveryInputs(d => ({ ...d, [order._id]: e.target.value }))}
                                                style={{ padding: '6px 10px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '11px', outline: 'none', width: '180px' }} />
                                            <button onClick={() => assignDelivery(order._id)}
                                                style={{ padding: '6px 10px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Truck size={11} /> Assign
                                            </button>
                                        </div>

                                        {/* Print Invoice */}
                                        <button onClick={() => printInvoice(order)}
                                            style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', cursor: 'pointer', fontWeight: '800', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--secondary)' }}>
                                            <Printer size={11} /> Invoice
                                        </button>
                                    </div>

                                    {order.deliveryPartner && (
                                        <p style={{ margin: '8px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                            🚚 Assigned to: <b>{order.deliveryPartner}</b>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── CUSTOMERS ── */}
                {activeTab === 'customers' && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                        <AdminCustomersTab orders={orders} />
                    </motion.div>
                )}

                {/* ── INVENTORY ── */}
                {activeTab === 'inventory' && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                        <AdminInventoryTab products={adminProducts} />
                    </motion.div>
                )}

                {/* ── ANALYTICS ── */}
                {activeTab === 'analytics' && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                        <AdminAnalyticsTab orders={orders} products={adminProducts} />
                    </motion.div>
                )}

                {/* ── COUPONS ── */}
                {activeTab === 'coupons' && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                        <AdminCouponsTab coupons={coupons} setCoupons={setCoupons} />
                    </motion.div>
                )}

                {/* ── VENDORS ── */}
                {activeTab === 'vendors' && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 style={{ margin: '0 0 20px', fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Vendor Management</h2>
                        {vendors.length === 0 && <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>No vendor applications yet.</p>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {vendors.map(v => {
                                const vendorSales = orders.filter(o => o.status === 'delivered' && (o.items || []).some(item => item.vendorId === v.id)).reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
                                const commission = Math.round(vendorSales * 0.1);
                                return (
                                    <div key={v.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', flexShrink: 0 }}>
                                            {v.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>{v.name}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{v.email} · {v.storeName || v.businessName}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#16a34a', fontWeight: '700' }}>Sales: ₹{vendorSales.toLocaleString('en-IN')} · Commission: ₹{commission.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', background: v.status === 'accepted' ? '#f0fdf4' : v.status === 'rejected' ? '#fef2f2' : '#fef9c3', color: v.status === 'accepted' ? '#16a34a' : v.status === 'rejected' ? '#ef4444' : '#854d0e' }}>
                                                {v.status?.toUpperCase()}
                                            </span>
                                            {v.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleVendorAction(v.id, 'accepted')} style={{ padding: '6px 12px', borderRadius: '10px', border: 'none', background: '#f0fdf4', color: '#16a34a', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}>Accept</button>
                                                    <button onClick={() => handleVendorAction(v.id, 'rejected')} style={{ padding: '6px 12px', borderRadius: '10px', border: 'none', background: '#fef2f2', color: '#ef4444', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}>Reject</button>
                                                </>
                                            )}
                                            <button onClick={() => handleVendorAction(v.id, 'delete')} style={{ padding: '6px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '12px', display: 'flex' }}>✕</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* ── VENDOR PRODUCTS ── */}
                {activeTab === 'vproducts' && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 style={{ margin: '0 0 20px', fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Vendor Product Approvals</h2>
                        {vendorProducts.length === 0 && <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>No vendor products submitted yet.</p>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {vendorProducts.map(p => (
                                <div key={p.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--bg-main)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📦'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>{p.name}</p>
                                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>by {p.vendorName} · {p.category} · ₹{p.price} · Stock: {p.stock}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', background: p.status === 'approved' ? '#f0fdf4' : p.status === 'rejected' ? '#fef2f2' : '#fef9c3', color: p.status === 'approved' ? '#16a34a' : p.status === 'rejected' ? '#ef4444' : '#854d0e' }}>
                                            {p.status?.toUpperCase()}
                                        </span>
                                        {p.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleProductApproval(p.id, 'approved')} style={{ padding: '6px 12px', borderRadius: '10px', border: 'none', background: '#f0fdf4', color: '#16a34a', fontWeight: '800', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={13} /> Approve</button>
                                                <button onClick={() => handleProductApproval(p.id, 'rejected')} style={{ padding: '6px 12px', borderRadius: '10px', border: 'none', background: '#fef2f2', color: '#ef4444', fontWeight: '800', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={13} /> Reject</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── NOTIFICATIONS ── */}
                {activeTab === 'notifications' && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Alerts & Notifications</h2>
                            {unreadCount > 0 && <button onClick={markAllRead} style={{ padding: '8px 16px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}>Mark All Read</button>}
                        </div>

                        {/* system alerts */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                            {vendors.filter(v => v.status === 'pending').map(v => (
                                <div key={v.id} style={{ background: '#fef9c3', borderRadius: '14px', padding: '12px 16px', border: '1px solid #fde047', fontSize: '13px', fontWeight: '700', color: '#854d0e' }}>
                                    🏪 New vendor application: <b>{v.name}</b> — <a href="#" onClick={() => setActiveTab('vendors')} style={{ color: 'var(--primary)', fontWeight: '900' }}>Review</a>
                                </div>
                            ))}
                            {adminProducts.filter(p => Number(p.stock) < 10).map(p => (
                                <div key={p.id} style={{ background: '#fef2f2', borderRadius: '14px', padding: '12px 16px', border: '1px solid #fca5a5', fontSize: '13px', fontWeight: '700', color: '#7f1d1d' }}>
                                    ⚠ Low stock: <b>{p.name}</b> — only {p.stock} units left
                                </div>
                            ))}
                            {vendorProducts.filter(p => p.status === 'pending').map(p => (
                                <div key={p.id} style={{ background: '#e0f2fe', borderRadius: '14px', padding: '12px 16px', border: '1px solid #bae6fd', fontSize: '13px', fontWeight: '700', color: '#0369a1' }}>
                                    📦 Vendor product awaiting approval: <b>{p.name}</b> by {p.vendorName}
                                </div>
                            ))}
                        </div>

                        {/* notification context items */}
                        {notifications.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {notifications.map((n, i) => (
                                    <div key={i} style={{ background: n.read ? 'white' : '#f0fdf4', borderRadius: '14px', padding: '12px 16px', border: `1px solid ${n.read ? 'var(--border-light)' : '#bbf7d0'}`, display: 'flex', gap: '10px' }}>
                                        <span style={{ fontSize: '18px' }}>{n.icon || '🔔'}</span>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '800', fontSize: '13px', color: 'var(--secondary)' }}>{n.title}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{n.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {notifications.length === 0 && vendors.filter(v => v.status === 'pending').length === 0 && adminProducts.filter(p => Number(p.stock) < 10).length === 0 && (
                            <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>All caught up! No alerts right now.</p>
                        )}
                    </motion.div>
                )}

                {/* ── SETTINGS ── */}
                {activeTab === 'settings' && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                        <AdminSettingsTab />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
