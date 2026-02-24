import React from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag } from 'lucide-react';

const AdminCustomersTab = ({ orders }) => {
    // Extract unique customers from orders
    const customerMap = {};
    orders.forEach(o => {
        const email = o.shippingAddress?.email || o.email || 'unknown@guest.com';
        const name = o.shippingAddress?.name || o.name || email.split('@')[0];
        if (!customerMap[email]) {
            customerMap[email] = { name, email, orders: [], totalSpent: 0 };
        }
        customerMap[email].orders.push(o);
        if (o.status !== 'cancelled') customerMap[email].totalSpent += Number(o.totalAmount) || 0;
    });
    const customers = Object.values(customerMap);

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
                            style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* avatar */}
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', flexShrink: 0 }}>
                                {c.name[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>{c.name}</p>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{c.email}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: 'var(--primary)' }}>₹{Math.round(c.totalSpent).toLocaleString('en-IN')}</p>
                                <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                    <ShoppingBag size={11} /> {c.orders.length} order{c.orders.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCustomersTab;
