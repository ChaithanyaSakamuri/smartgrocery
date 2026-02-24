import React from 'react';
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

const AdminInventoryTab = ({ products }) => {
    const today = new Date();
    const lowStock = products.filter(p => Number(p.stock) >= 0 && Number(p.stock) < 10);
    const expiring = products.filter(p => {
        if (!p.expiryDate) return false;
        const diff = (new Date(p.expiryDate) - today) / 86400000;
        return diff >= 0 && diff <= 7;
    });
    const expired = products.filter(p => {
        if (!p.expiryDate) return false;
        return new Date(p.expiryDate) < today;
    });

    const Section = ({ title, color, icon, items, emptyMsg, renderItem }) => (
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontWeight: '1000', fontSize: '16px', color, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon} {title}
                <span style={{ marginLeft: 'auto', background: items.length > 0 ? color : '#f0fdf4', color: items.length > 0 ? 'white' : '#16a34a', fontSize: '11px', fontWeight: '900', padding: '2px 10px', borderRadius: '20px' }}>
                    {items.length}
                </span>
            </h3>
            {items.length === 0
                ? <p style={{ color: '#16a34a', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} /> {emptyMsg}</p>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{items.map(renderItem)}</div>
            }
        </div>
    );

    return (
        <div>
            <h2 style={{ margin: '0 0 24px', fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Inventory Alerts</h2>

            <Section
                title="Low Stock (< 10 units)"
                color="#ef4444"
                icon={<AlertTriangle size={16} />}
                items={lowStock}
                emptyMsg="All products are well-stocked!"
                renderItem={p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fef2f2', borderRadius: '12px' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: '800', fontSize: '13px', color: '#7f1d1d' }}>{p.name}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#991b1b', fontWeight: '600' }}>{p.category}</p>
                        </div>
                        <span style={{ fontWeight: '900', fontSize: '16px', color: '#ef4444' }}>{p.stock} left</span>
                    </div>
                )}
            />

            <Section
                title="Expiring Within 7 Days"
                color="#854d0e"
                icon={<Clock size={16} />}
                items={expiring}
                emptyMsg="No products expiring soon!"
                renderItem={p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fef9c3', borderRadius: '12px' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: '800', fontSize: '13px', color: '#713f12' }}>{p.name}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#92400e', fontWeight: '600' }}>{p.category}</p>
                        </div>
                        <span style={{ fontWeight: '900', fontSize: '13px', color: '#854d0e' }}>
                            Exp: {new Date(p.expiryDate).toLocaleDateString()}
                        </span>
                    </div>
                )}
            />

            <Section
                title="Expired Products"
                color="#6b7280"
                icon={<Clock size={16} />}
                items={expired}
                emptyMsg="No expired products!"
                renderItem={p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f9fafb', borderRadius: '12px', opacity: 0.7 }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: '800', fontSize: '13px', color: '#374151', textDecoration: 'line-through' }}>{p.name}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>{p.category}</p>
                        </div>
                        <span style={{ fontWeight: '900', fontSize: '13px', color: '#6b7280' }}>
                            Exp: {new Date(p.expiryDate).toLocaleDateString()}
                        </span>
                    </div>
                )}
            />
        </div>
    );
};

export default AdminInventoryTab;
