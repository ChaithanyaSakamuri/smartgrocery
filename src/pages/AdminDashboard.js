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
import {
    getAdminSalesOverview,
    getAdminOrders,
    updateAdminOrderStatus,
    getAdminUsers,
    approveVendor,
    updateUserRole,
    deleteUser
} from '../services/api';

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
    const [allUsers, setAllUsers] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [analytics, setAnalytics] = useState({ daily: [], categorySales: {} });
    const [adminProducts, setAdminProducts] = useState([]);
    const [vendorProducts, setVendorProducts] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [orderSearch, setOrderSearch] = useState('');
    const [deliveryInputs, setDeliveryInputs] = useState({});
    const [loading, setLoading] = useState(true);
    const { notifications, markAllRead, unreadCount } = useNotifications();

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const overview = await getAdminSalesOverview();
            setMetrics(overview.metrics);
            setAnalytics(overview.analytics);

            const ordersData = await getAdminOrders();
            setOrders(ordersData);

            const usersData = await getAdminUsers();
            setAllUsers(usersData);

            // Local fallback for things not yet in backend
            setAdminProducts(JSON.parse(localStorage.getItem('freshly_admin_products') || '[]'));
            setVendorProducts(JSON.parse(localStorage.getItem('freshly_vendor_products') || '[]'));
            setCoupons(JSON.parse(localStorage.getItem('freshly_coupons') || '[]'));

            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    /* order helpers */
    const changeOrderStatus = async (id, status) => {
        try {
            await updateAdminOrderStatus(id, status);
            const updated = orders.map(o => o._id === id ? { ...o, status } : o);
            setOrders(updated);
            const overview = await getAdminSalesOverview();
            setMetrics(overview.metrics);
        } catch (error) {
            alert("Failed to update status: " + error.message);
        }
    };

    const assignDelivery = async (id) => {
        const partner = deliveryInputs[id] || '';
        if (!partner.trim()) return alert('Enter delivery partner name.');
        const updated = orders.map(o => o._id === id ? { ...o, deliveryPartner: partner } : o);
        setOrders(updated);
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
            <p><b>Date:</b> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><b>Customer:</b> ${order.shippingAddress?.name || 'Guest'}</p>
            <p><b>Address:</b> ${order.shippingAddress || '—'}, ${order.city || ''}</p>
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

    /* user/vendor helpers */
    const handleVendorAction = async (userId, action) => {
        try {
            if (action === 'accepted') {
                await approveVendor(userId);
            } else if (action === 'delete') {
                if (!window.confirm("Are you sure?")) return;
                await deleteUser(userId);
            } else if (action === 'rejected') {
                await updateUserRole(userId, 'customer');
            }
            fetchAdminData();
        } catch (error) {
            alert("Action failed: " + error.message);
        }
    };

    const handleProductApproval = (productId, action) => {
        const vendorProductsLocal = JSON.parse(localStorage.getItem('freshly_vendor_products') || '[]');
        const updated = vendorProductsLocal.map(p => p.id === productId ? { ...p, status: action } : p);
        localStorage.setItem('freshly_vendor_products', JSON.stringify(updated));
        setVendorProducts(updated);
    };

    /* stats */
    const totalSalesStr = metrics.find(m => m.label === 'Total Sales')?.value || '₹0';
    const totalOrdersCount = orders.length;
    const lowStockCount = adminProducts.filter(p => Number(p.stock) < 10).length;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
        { id: 'products', label: 'Products', icon: <Package size={17} />, badge: 0 },
        { id: 'orders', label: 'Orders', icon: <ShoppingBag size={17} />, badge: orders.filter(o => o.status === 'pending' || o.status === 'processing').length },
        { id: 'customers', label: 'Customers', icon: <Users size={17} /> },
        { id: 'inventory', label: 'Inventory', icon: <AlertTriangle size={17} />, badge: lowStockCount },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={17} /> },
        { id: 'coupons', label: 'Coupons', icon: <Tag size={17} />, badge: coupons.filter(c => c.active).length },
        { id: 'vendors', label: 'Vendors', icon: <TrendingUp size={17} />, badge: allUsers.filter(u => u.role === 'vendor' && !u.vendorApproved).length },
        { id: 'notifications', label: 'Alerts', icon: <Bell size={17} />, badge: unreadCount },
        { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
    ];

    const filteredOrders = orders.filter(o =>
        !orderSearch || o._id?.includes(orderSearch) ||
        o.shippingAddress?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.userId?.email?.toLowerCase().includes(orderSearch.toLowerCase())
    );

    if (loading && orders.length === 0) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontWeight: '800' }}>Loading Admin Panel...</div>;
    }

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
                                { label: 'Total Sales', value: totalSalesStr, color: 'var(--primary)' },
                                { label: 'Total Orders', value: orders.length, color: '#3b82f6' },
                                { label: 'Vendors', value: allUsers.filter(u => u.role === 'vendor' && u.vendorApproved).length, color: '#8b5cf6' },
                                { label: 'Products', value: adminProducts.length, color: '#16a34a' },
                                { label: 'Customers', value: allUsers.filter(u => u.role === 'customer').length, color: '#f59e0b' },
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
                                {orders.filter(o => o.status === 'pending' || o.status === 'processing').slice(0, 5).map(o => (
                                    <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '700' }}>
                                        <span style={{ color: 'var(--secondary)' }}>#{o._id?.slice(-6).toUpperCase()}</span>
                                        <span style={{ color: 'var(--primary)' }}>₹{o.totalAmount}</span>
                                    </div>
                                ))}
                                {orders.filter(o => o.status === 'pending' || o.status === 'processing').length === 0 && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No pending orders</p>}
                            </div>
                            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)' }}>
                                <p style={{ margin: '0 0 12px', fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>🏪 Pending Vendors</p>
                                {allUsers.filter(u => u.role === 'vendor' && !u.vendorApproved).slice(0, 5).map(v => (
                                    <div key={v._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '700' }}>
                                        <span style={{ color: 'var(--secondary)' }}>{v.name}</span>
                                        <span style={{ color: '#854d0e' }}>Pending</span>
                                    </div>
                                ))}
                                {allUsers.filter(u => u.role === 'vendor' && !u.vendorApproved).length === 0 && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No pending vendors</p>}
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
                                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                {new Date(order.createdAt).toLocaleString()} &nbsp;·&nbsp;
                                                <b style={{ color: 'var(--secondary)' }}>{order.userName || order.userId?.name || order.shippingAddress?.name || 'Customer'}</b>
                                                {(order.userEmail || order.userId?.email) && (
                                                    <> &nbsp;·&nbsp; <a href={`mailto:${order.userEmail || order.userId?.email}`} style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}>{order.userEmail || order.userId?.email}</a></>
                                                )}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {pill(order.status)}
                                            <span style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '15px' }}>₹{order.totalAmount}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                        <select value={order.status} onChange={e => changeOrderStatus(order._id, e.target.value)}
                                            style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '12px', fontWeight: '700', outline: 'none', cursor: 'pointer' }}>
                                            {['pending', 'processing', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
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
                        {allUsers.filter(u => u.role === 'vendor').length === 0 && <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>No vendor applications yet.</p>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {allUsers.filter(u => u.role === 'vendor').map(v => {
                                const vendorSales = orders.filter(o => o.status === 'delivered' && (o.items || []).some(item => item.vendorId === v._id)).reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
                                const commission = Math.round(vendorSales * 0.1);
                                return (
                                    <div key={v._id} style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', flexShrink: 0 }}>
                                            {v.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>{v.name}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{v.email} · {v.businessName || 'Vendor'}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#16a34a', fontWeight: '700' }}>Sales: ₹{vendorSales.toLocaleString('en-IN')} · Commission: ₹{commission.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', background: v.vendorApproved ? '#f0fdf4' : '#fef9c3', color: v.vendorApproved ? '#16a34a' : '#854d0e' }}>
                                                {v.vendorApproved ? 'APPROVED' : 'PENDING'}
                                            </span>
                                            {!v.vendorApproved && (
                                                <>
                                                    <button onClick={() => handleVendorAction(v._id, 'accepted')} style={{ padding: '6px 12px', borderRadius: '10px', border: 'none', background: '#f0fdf4', color: '#16a34a', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}>Accept</button>
                                                    <button onClick={() => handleVendorAction(v._id, 'rejected')} style={{ padding: '6px 12px', borderRadius: '10px', border: 'none', background: '#fef2f2', color: '#ef4444', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}>Reject</button>
                                                </>
                                            )}
                                            <button onClick={() => handleVendorAction(v._id, 'delete')} style={{ padding: '6px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '12px', display: 'flex' }}>✕</button>
                                        </div>
                                    </div>
                                );
                            })}
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
                            {allUsers.filter(u => u.role === 'vendor' && !u.vendorApproved).map(v => (
                                <div key={v._id} style={{ background: '#fef9c3', borderRadius: '14px', padding: '12px 16px', border: '1px solid #fde047', fontSize: '13px', fontWeight: '700', color: '#854d0e' }}>
                                    🏪 New vendor application: <b>{v.name}</b> — <a href="#" onClick={() => setActiveTab('vendors')} style={{ color: 'var(--primary)', fontWeight: '900' }}>Review</a>
                                </div>
                            ))}
                            {adminProducts.filter(p => Number(p.stock) < 10).map(p => (
                                <div key={p.id} style={{ background: '#fef2f2', borderRadius: '14px', padding: '12px 16px', border: '1px solid #fca5a5', fontSize: '13px', fontWeight: '700', color: '#7f1d1d' }}>
                                    ⚠ Low stock: <b>{p.name}</b> — only {p.stock} units left
                                </div>
                            ))}
                        </div>

                        {/* ─── Recent Order Alerts ─── */}
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ margin: '0 0 10px', fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>📦 New Orders</p>
                            {(() => {
                                let savedProfile = null;
                                try { savedProfile = JSON.parse(localStorage.getItem('freshly_user_profile') || 'null'); } catch (_) { }
                                return orders.slice(0, 8).map((o, i) => {
                                    let name = o.userName || o.userId?.name || '';
                                    let email = o.userEmail || o.userId?.email || '';
                                    if ((!name || name === 'Guest' || name === 'Customer') && savedProfile) name = savedProfile.name;
                                    if (!email && savedProfile) email = savedProfile.email;
                                    name = name || 'Customer';
                                    return (
                                        <div key={i} style={{ background: '#f0fdf4', borderRadius: '14px', padding: '12px 16px', border: '1px solid #bbf7d0', fontSize: '13px', color: 'var(--secondary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                            <div>
                                                <span style={{ fontWeight: '900' }}>#{(o._id || '').replace('ORD-', '').slice(-8)}</span>
                                                <span style={{ fontWeight: '700', color: 'var(--text-muted)', margin: '0 6px' }}>·</span>
                                                <span style={{ fontWeight: '800' }}>{name}</span>
                                                {email
                                                    ? <span style={{ marginLeft: '8px', fontSize: '12px', color: '#16a34a', fontWeight: '700' }}>{email}</span>
                                                    : <span style={{ marginLeft: '8px', fontSize: '11px', color: '#ef4444', fontStyle: 'italic' }}>no email</span>
                                                }
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                                <span style={{ fontWeight: '900', color: 'var(--primary)' }}>₹{o.totalAmount}</span>
                                                <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', background: '#fef9c3', color: '#854d0e', textTransform: 'uppercase' }}>{o.paymentMethod}</span>
                                                {email && (
                                                    <a href={`mailto:${email}?subject=Your Freshly Order&body=Hi ${name},`}
                                                        style={{ padding: '5px 12px', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontWeight: '800', fontSize: '11px', textDecoration: 'none' }}>
                                                        ✉️ Email
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                            {orders.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>No orders yet.</p>}
                        </div>

                        {/* notification context items */}
                        {notifications.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {notifications.map((n, i) => {
                                    const isContact = n.type === 'contact';
                                    return (
                                        <div key={i} style={{ background: n.read ? 'white' : (isContact ? '#eff6ff' : '#f0fdf4'), borderRadius: '14px', padding: '14px 16px', border: `1px solid ${n.read ? 'var(--border-light)' : (isContact ? '#bfdbfe' : '#bbf7d0')}`, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <span style={{ fontSize: '20px', flexShrink: 0 }}>{isContact ? '✉️' : (n.icon || '🔔')}</span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                {/* Show Gmail as the title for contact messages */}
                                                {isContact ? (
                                                    <>
                                                        <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: '#1d4ed8' }}>{n.email || n.from || 'Unknown sender'}</p>
                                                        <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>{n.from && n.email ? `${n.from}` : ''} · {n.subject}</p>
                                                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--secondary)', fontWeight: '600', lineHeight: 1.4 }}>{n.message}</p>
                                                        {n.email && (
                                                            <a href={`mailto:${n.email}?subject=Re: ${n.subject || 'Your Message'}&body=Hi ${n.from || ''},`}
                                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '8px', padding: '5px 12px', borderRadius: '8px', background: '#1d4ed8', color: 'white', fontWeight: '800', fontSize: '11px', textDecoration: 'none' }}>
                                                                ↩️ Reply to {n.email}
                                                            </a>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <p style={{ margin: 0, fontWeight: '800', fontSize: '13px', color: 'var(--secondary)' }}>{n.title}</p>
                                                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{n.message}</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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

