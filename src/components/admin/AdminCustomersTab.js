import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShoppingBag, Mail, Copy, X } from 'lucide-react';

/* Enrich an order with real user info from all available sources */
const enrichOrder = (o, profileMap) => {
    if (!o) return o;
    let name = o.userName || o.userId?.name || o.name || '';
    let email = o.userEmail || o.userId?.email || o.email || '';
    let uid = o.userId?.uid || (typeof o.userId === 'string' ? o.userId : null) || '';

    // Try freshly_user_profile saved by AuthContext
    if ((!name || name === 'Guest' || name === 'Customer') && profileMap) {
        const saved = uid ? profileMap[uid] : Object.values(profileMap)[0];
        if (saved) { name = saved.name; email = saved.email; }
    }
    return { ...o, _name: name || 'Unknown', _email: email || null, _uid: uid };
};

const AdminCustomersTab = ({ orders }) => {
    const [selected, setSelected] = useState(null);
    const [copied, setCopied] = useState('');

    // Load persisted user profiles (keyed by uid)
    let profileMap = {};
    try {
        const raw = localStorage.getItem('freshly_user_profile');
        if (raw) {
            const p = JSON.parse(raw);
            if (p.uid) profileMap[p.uid] = p;
        }
    } catch (_) { }

    // Build customer map
    const customerMap = {};
    orders.forEach(o => {
        const e = enrichOrder(o, profileMap);
        if (!e) return;
        const key = e._email || e._uid || 'unknown';
        if (!customerMap[key]) {
            customerMap[key] = { name: e._name, email: e._email, uid: e._uid, orders: [], totalSpent: 0 };
        }
        customerMap[key].orders.push(e);
        if (e.status !== 'cancelled') customerMap[key].totalSpent += Number(e.totalAmount) || 0;
    });
    const customers = Object.values(customerMap);

    const copyText = (text, key) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(key);
            setTimeout(() => setCopied(''), 1800);
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Customers</h2>
                <span style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '6px 14px', fontSize: '13px', fontWeight: '800', color: 'var(--secondary)' }}>
                    {customers.length} total
                </span>
            </div>

            {customers.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                    <Users size={40} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ fontWeight: '900', color: 'var(--secondary)' }}>No customers yet</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Customers appear here once orders are placed.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {customers.map((c, i) => (
                        <motion.div key={i} whileHover={{ y: -2 }}
                            style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                            onClick={() => setSelected(c)}>

                            {/* Avatar */}
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px', flexShrink: 0 }}>
                                {(c.name || '?')[0].toUpperCase()}
                            </div>

                            {/* Name + uid + email */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>{c.name}</p>
                                {c.email
                                    ? <p style={{ margin: '1px 0 0', fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>{c.email}</p>
                                    : <p style={{ margin: '1px 0 0', fontSize: '11px', color: '#ef4444', fontWeight: '700', fontStyle: 'italic' }}>No email — place a new order to capture contact info</p>
                                }
                                {c.uid && <p style={{ margin: '1px 0 0', fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', fontFamily: 'monospace' }}>UID: {c.uid.slice(0, 20)}…</p>}
                            </div>

                            {/* Stats */}
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: 'var(--primary)' }}>₹{Math.round(c.totalSpent).toLocaleString('en-IN')}</p>
                                <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                    <ShoppingBag size={11} /> {c.orders.length} order{c.orders.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Quick email */}
                            {c.email && (
                                <a href={`mailto:${c.email}`} onClick={e => e.stopPropagation()}
                                    style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}
                                    title={`Email ${c.name}`}>
                                    <Mail size={16} />
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* ─── Customer Detail Popup ─── */}
            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setSelected(null)}>
                        <motion.div initial={{ scale: 0.85, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'white', borderRadius: '28px', padding: '32px', width: '440px', maxWidth: '92vw', boxShadow: '0 32px 64px rgba(0,0,0,0.22)', position: 'relative' }}>

                            {/* Close */}
                            <button onClick={() => setSelected(null)}
                                style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--bg-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                <X size={16} />
                            </button>

                            {/* Avatar */}
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '1000', fontSize: '28px', margin: '0 auto 12px', boxShadow: '0 8px 20px var(--primary-glow)' }}>
                                    {(selected.name || '?')[0].toUpperCase()}
                                </div>
                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '1000', color: 'var(--secondary)' }}>{selected.name}</h3>
                                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 12px', borderRadius: '20px', marginTop: '6px', display: 'inline-block' }}>Customer</span>
                            </div>

                            {/* Info rows */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                {[
                                    { label: 'Gmail / Email', value: selected.email || 'Not available', icon: '📧', key: 'email', copyable: !!selected.email },
                                    { label: 'User ID (UID)', value: selected.uid || 'Not available', icon: '🆔', key: 'uid', copyable: !!selected.uid },
                                    { label: 'Total Orders', value: `${selected.orders.length} order${selected.orders.length !== 1 ? 's' : ''}`, icon: '🛍️', key: null, copyable: false },
                                    { label: 'Total Spent', value: `₹${Math.round(selected.totalSpent).toLocaleString('en-IN')}`, icon: '💰', key: null, copyable: false },
                                ].map((row, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: row.key === 'email' && selected.email ? '#f0fdf4' : 'var(--bg-main)', borderRadius: '12px', border: `1px solid ${row.key === 'email' && selected.email ? '#bbf7d0' : 'var(--border-light)'}` }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>
                                            <span>{row.icon}</span> {row.label}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: '800', fontSize: '13px', color: row.value === 'Not available' ? '#ef4444' : 'var(--secondary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.value}</span>
                                            {row.copyable && (
                                                <button onClick={() => copyText(row.value, row.key)}
                                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: copied === row.key ? '#16a34a' : 'var(--text-muted)', padding: '2px', display: 'flex' }}
                                                    title="Copy">
                                                    {copied === row.key ? '✓' : <Copy size={13} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent orders */}
                            {selected.orders.length > 0 && (
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ margin: '0 0 8px', fontWeight: '900', fontSize: '13px', color: 'var(--secondary)' }}>Recent Orders</p>
                                    {selected.orders.slice(0, 3).map((o, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: '10px', marginBottom: '6px', fontSize: '12px', fontWeight: '700', border: '1px solid var(--border-light)' }}>
                                            <span style={{ color: 'var(--secondary)' }}>#{(o._id || '').replace('ORD-', '').slice(-8)}</span>
                                            <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{o.status}</span>
                                            <span style={{ color: 'var(--primary)' }}>₹{o.totalAmount}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Contact actions */}
                            <div style={{ display: 'grid', gridTemplateColumns: selected.email ? '1fr 1fr' : '1fr', gap: '10px' }}>
                                {selected.email ? (
                                    <>
                                        <a href={`mailto:${selected.email}?subject=Your Freshly Order&body=Hi ${selected.name},%0A%0A`}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '14px', background: 'var(--primary)', color: 'white', fontWeight: '900', fontSize: '13px', textDecoration: 'none' }}>
                                            <Mail size={16} /> Send Email
                                        </a>
                                        <button onClick={() => copyText(selected.email, 'popup-email')}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '14px', border: '2px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}>
                                            {copied === 'popup-email' ? '✓ Copied!' : <><Copy size={16} /> Copy Email</>}
                                        </button>
                                    </>
                                ) : (
                                    <div style={{ padding: '14px', borderRadius: '14px', background: '#fef9c3', border: '1px solid #fde047', color: '#854d0e', fontWeight: '700', fontSize: '13px', textAlign: 'center' }}>
                                        ⚠️ Customer email not available for this order.<br />
                                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Ask the customer to place a new order — it will capture their Gmail automatically.</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCustomersTab;
