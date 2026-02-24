import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag } from 'lucide-react';

const emptyCoupon = { code: '', type: 'percent', value: '', minOrder: '', maxUses: '', expiry: '', active: true };

const AdminCouponsTab = ({ coupons, setCoupons }) => {
    const [form, setForm] = useState(emptyCoupon);
    const [showAdd, setShowAdd] = useState(false);

    const save = () => {
        if (!form.code || !form.value) return alert('Code and value are required.');
        const newCoupon = { ...form, id: 'CPN-' + Date.now(), value: Number(form.value), minOrder: Number(form.minOrder) || 0, maxUses: Number(form.maxUses) || 999, uses: 0, createdAt: new Date().toISOString() };
        const updated = [newCoupon, ...coupons];
        localStorage.setItem('freshly_coupons', JSON.stringify(updated));
        setCoupons(updated);
        setForm(emptyCoupon);
        setShowAdd(false);
    };

    const toggle = (id) => {
        const updated = coupons.map(c => c.id === id ? { ...c, active: !c.active } : c);
        localStorage.setItem('freshly_coupons', JSON.stringify(updated));
        setCoupons(updated);
    };

    const del = (id) => {
        if (!window.confirm('Delete this coupon?')) return;
        const updated = coupons.filter(c => c.id !== id);
        localStorage.setItem('freshly_coupons', JSON.stringify(updated));
        setCoupons(updated);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Coupon Management</h2>
                <motion.button whileHover={{ scale: 1.04 }} onClick={() => setShowAdd(!showAdd)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '13px' }}>
                    <Plus size={16} /> Create Coupon
                </motion.button>
            </div>

            {/* Add form */}
            {showAdd && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--primary)', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 16px', fontWeight: '1000', fontSize: '15px' }}>New Coupon</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        {[
                            { label: 'Coupon Code', key: 'code', placeholder: 'e.g. SAVE20' },
                            { label: 'Discount Value', key: 'value', type: 'number', placeholder: '20' },
                            { label: 'Min. Order (₹)', key: 'minOrder', type: 'number', placeholder: '0' },
                            { label: 'Max Uses', key: 'maxUses', type: 'number', placeholder: 'Unlimited' },
                            { label: 'Expiry Date', key: 'expiry', type: 'date' },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '4px' }}>{f.label}</label>
                                <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]}
                                    onChange={e => setForm(fm => ({ ...fm, [f.key]: e.target.value }))}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                        ))}
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '4px' }}>Discount Type</label>
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '13px', outline: 'none' }}>
                                <option value="percent">Percentage (%)</option>
                                <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setShowAdd(false)} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>Cancel</button>
                        <motion.button whileHover={{ scale: 1.02 }} onClick={save}
                            style={{ padding: '10px 28px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: '900', fontSize: '13px' }}>
                            Create
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {coupons.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                    <Tag size={40} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ fontWeight: '900', color: 'var(--secondary)' }}>No coupons yet. Create your first discount code!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {coupons.map(c => (
                        <motion.div key={c.id} whileHover={{ y: -2 }}
                            style={{ background: c.active ? 'white' : '#f9fafb', borderRadius: '16px', border: `1px solid ${c.active ? 'var(--border-light)' : '#e5e7eb'}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', opacity: c.active ? 1 : 0.7 }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: c.active ? 'var(--primary)' : '#e5e7eb', color: c.active ? 'white' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Tag size={18} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: '900', fontSize: '16px', color: 'var(--secondary)', letterSpacing: '1px', fontFamily: 'monospace' }}>{c.code}</span>
                                    <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', background: c.active ? '#f0fdf4' : '#f3f4f6', color: c.active ? '#16a34a' : '#6b7280' }}>{c.active ? 'ACTIVE' : 'INACTIVE'}</span>
                                </div>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    {c.type === 'percent' ? `${c.value}% off` : `₹${c.value} off`}
                                    {c.minOrder > 0 ? ` · Min ₹${c.minOrder}` : ''}
                                    {c.expiry ? ` · Exp: ${new Date(c.expiry).toLocaleDateString()}` : ''}
                                    {` · ${c.uses}/${c.maxUses} uses`}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button onClick={() => toggle(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.active ? 'var(--primary)' : '#9ca3af', display: 'flex' }}>
                                    {c.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                </button>
                                <button onClick={() => del(c.id)} style={{ padding: '7px', borderRadius: '10px', border: '1px solid #fca5a5', background: '#fef2f2', cursor: 'pointer', color: '#ef4444', display: 'flex' }}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCouponsTab;
