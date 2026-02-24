import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Package, Info } from 'lucide-react';

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Dry Fruits', 'Grains', 'Beverages', 'Snacks', 'Other'];
const EMPTY = { name: '', price: '', category: 'Vegetables', stock: '', expiryDate: '', image: '', description: '' };

const statusPill = (s) => {
    const map = { approved: ['#f0fdf4', '#16a34a'], pending: ['#fef9c3', '#854d0e'], rejected: ['#fef2f2', '#ef4444'] };
    const [bg, col] = map[s] || map.pending;
    return <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', background: bg, color: col }}>{s}</span>;
};

const AdminProductsTab = ({ products, setProducts }) => {
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [preview, setPreview] = useState('');
    const fileRef = useRef();

    const save = () => {
        if (!form.name || !form.price) return alert('Name and price are required.');
        const all = JSON.parse(localStorage.getItem('freshly_admin_products') || '[]');
        let updated;
        if (editing) {
            updated = all.map(p => p.id === editing.id ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) } : p);
        } else {
            updated = [{ ...form, id: 'AP-' + Date.now(), price: Number(form.price), stock: Number(form.stock), status: 'approved', createdAt: new Date().toISOString() }, ...all];
        }
        localStorage.setItem('freshly_admin_products', JSON.stringify(updated));
        setProducts(updated);
        setShowModal(false); setEditing(null); setForm(EMPTY); setPreview('');
    };

    const del = (id) => {
        if (!window.confirm('Delete this product?')) return;
        const updated = products.filter(p => p.id !== id);
        localStorage.setItem('freshly_admin_products', JSON.stringify(updated));
        setProducts(updated);
    };

    const openEdit = (p) => {
        setEditing(p);
        setForm({ name: p.name, price: p.price, category: p.category, stock: p.stock, expiryDate: p.expiryDate || '', image: p.image || '', description: p.description || '' });
        setPreview(p.image || '');
        setShowModal(true);
    };

    const handleFile = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => { setForm(fm => ({ ...fm, image: ev.target.result })); setPreview(ev.target.result); };
        r.readAsDataURL(f);
    };

    const today = new Date();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Product Management</h2>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => { setForm(EMPTY); setEditing(null); setPreview(''); setShowModal(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '13px' }}>
                    <Plus size={16} /> Add Product
                </motion.button>
            </div>

            {products.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                    <Package size={40} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ fontWeight: '900', color: 'var(--secondary)' }}>No products yet. Click Add Product to start.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {products.map(p => {
                        const daysExp = p.expiryDate ? Math.ceil((new Date(p.expiryDate) - today) / 86400000) : null;
                        return (
                            <motion.div key={p.id} whileHover={{ y: -2 }} style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'var(--bg-main)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={18} color="var(--text-muted)" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>{p.name}</span>
                                        {statusPill(p.status || 'approved')}
                                        {Number(p.stock) < 10 && <span style={{ fontSize: '9px', fontWeight: '900', padding: '2px 7px', borderRadius: '8px', background: '#fef2f2', color: '#ef4444' }}>⚠ LOW STOCK</span>}
                                        {daysExp !== null && daysExp <= 7 && daysExp >= 0 && <span style={{ fontSize: '9px', fontWeight: '900', padding: '2px 7px', borderRadius: '8px', background: '#fef9c3', color: '#854d0e' }}>⏳ EXPIRING</span>}
                                    </div>
                                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                        {p.category} · ₹{p.price} · Stock: {p.stock}{p.expiryDate ? ` · Exp: ${new Date(p.expiryDate).toLocaleDateString()}` : ''}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => openEdit(p)} style={{ padding: '7px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', cursor: 'pointer', display: 'flex' }}><Pencil size={13} /></button>
                                    <button onClick={() => del(p.id)} style={{ padding: '7px', borderRadius: '10px', border: '1px solid #fca5a5', background: '#fef2f2', cursor: 'pointer', color: '#ef4444', display: 'flex' }}><Trash2 size={13} /></button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            style={{ background: 'white', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, fontWeight: '1000' }}>{editing ? 'Edit Product' : 'Add Product'}</h3>
                                <button onClick={() => { setShowModal(false); setEditing(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                            </div>

                            {/* image */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '6px' }}>Image</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--bg-main)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-light)' }}>
                                        {preview ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={22} color="var(--text-muted)" />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <button onClick={() => fileRef.current.click()} style={{ padding: '7px 12px', borderRadius: '8px', border: '1px dashed var(--border-light)', background: 'var(--bg-main)', cursor: 'pointer', fontSize: '12px', fontWeight: '800', marginBottom: '6px', width: '100%' }}>📁 Upload</button>
                                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                                        <input placeholder="or paste URL" value={typeof form.image === 'string' && !form.image.startsWith('data:') ? form.image : ''}
                                            onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setPreview(e.target.value); }}
                                            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '11px', boxSizing: 'border-box' }} />
                                    </div>
                                </div>
                            </div>

                            {[{ label: 'Product Name *', key: 'name', placeholder: 'e.g. Fresh Tomatoes' }, { label: 'Price (₹) *', key: 'price', type: 'number', placeholder: '0' }, { label: 'Stock (units)', key: 'stock', type: 'number', placeholder: '0' }, { label: 'Expiry Date', key: 'expiryDate', type: 'date' }]
                                .map(f => (
                                    <div key={f.key} style={{ marginBottom: '12px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '4px' }}>{f.label}</label>
                                        <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]}
                                            onChange={e => setForm(fm => ({ ...fm, [f.key]: e.target.value }))}
                                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                                    </div>
                                ))}

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '4px' }}>Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '13px', outline: 'none' }}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>

                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '4px' }}>Description</label>
                                <textarea rows={3} placeholder="Product description..." value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => { setShowModal(false); setEditing(null); }} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>Cancel</button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={save}
                                    style={{ flex: 2, padding: '11px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: '900', fontSize: '13px' }}>
                                    {editing ? '✅ Save Changes' : '➕ Add Product'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProductsTab;
