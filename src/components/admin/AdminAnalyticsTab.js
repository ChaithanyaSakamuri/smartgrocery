import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BarChart = ({ data, color = 'var(--primary)', height = 120 }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: `${height}px`, padding: '0 4px' }}>
            {data.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '8px', fontWeight: '800', color: 'var(--text-muted)' }}>
                        {d.value > 999 ? (d.value / 1000).toFixed(1) + 'k' : d.value}
                    </span>
                    <motion.div
                        initial={{ height: 0 }} animate={{ height: `${(d.value / max) * (height - 28)}px` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        style={{ width: '100%', background: color, borderRadius: '6px 6px 0 0', minHeight: '4px' }}
                    />
                    <span style={{ fontSize: '8px', fontWeight: '700', color: 'var(--text-muted)' }}>{d.label}</span>
                </div>
            ))}
        </div>
    );
};

const AdminAnalyticsTab = ({ orders, products }) => {
    const [period, setPeriod] = useState('monthly');

    const now = new Date();
    const delivered = orders.filter(o => o.status === 'delivered');

    // Build chart data
    const getMonthly = () => {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(); d.setMonth(d.getMonth() - i);
            const label = d.toLocaleString('default', { month: 'short' });
            const value = delivered
                .filter(o => {
                    const od = new Date(o.createdAt || o.date);
                    return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
                })
                .reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
            months.push({ label, value: Math.round(value) });
        }
        return months;
    };

    const getWeekly = () => {
        const weeks = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('default', { weekday: 'short' });
            const ds = d.toDateString();
            const value = delivered
                .filter(o => new Date(o.createdAt || o.date).toDateString() === ds)
                .reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
            weeks.push({ label, value: Math.round(value) });
        }
        return weeks;
    };

    const chartData = period === 'monthly' ? getMonthly() : getWeekly();
    const totalRevenue = delivered.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
    const totalOrders = orders.length;
    const cancelRate = totalOrders > 0
        ? ((orders.filter(o => o.status === 'cancelled').length / totalOrders) * 100).toFixed(1) : 0;

    // Unique customers
    const uniqueCustomers = new Set(
        orders.map(o => o.shippingAddress?.email || o.email || 'guest')
    ).size;

    // Top products by revenue (use product name from order items)
    const productRevMap = {};
    delivered.forEach(o => {
        (o.items || []).forEach(item => {
            if (!productRevMap[item.name]) productRevMap[item.name] = 0;
            productRevMap[item.name] += item.price * item.qty;
        });
    });
    const topProducts = Object.entries(productRevMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return (
        <div>
            <h2 style={{ margin: '0 0 24px', fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Analytics & Reports</h2>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {[
                    { label: 'Total Revenue', value: `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`, color: 'var(--primary)' },
                    { label: 'Total Orders', value: totalOrders, color: '#3b82f6' },
                    { label: 'Customers', value: uniqueCustomers, color: '#8b5cf6' },
                    { label: 'Cancel Rate', value: `${cancelRate}%`, color: '#ef4444' },
                ].map((s, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '18px', border: '1px solid var(--border-light)' }}>
                        <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</p>
                        <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '1000', color: s.color }}>{s.value}</h3>
                    </div>
                ))}
            </div>

            {/* Sales Chart */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontWeight: '1000', fontSize: '15px', color: 'var(--secondary)' }}>Sales Chart</h3>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {['weekly', 'monthly'].map(p => (
                            <button key={p} onClick={() => setPeriod(p)}
                                style={{ padding: '5px 14px', borderRadius: '10px', border: 'none', background: period === p ? 'var(--primary)' : 'var(--bg-main)', color: period === p ? 'white' : 'var(--text-muted)', fontWeight: '800', cursor: 'pointer', fontSize: '11px', textTransform: 'capitalize' }}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
                <BarChart data={chartData} />
            </div>

            {/* Top Products */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)' }}>
                <h3 style={{ margin: '0 0 16px', fontWeight: '1000', fontSize: '15px', color: 'var(--secondary)' }}>🥇 Top Selling Products</h3>
                {topProducts.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>No sales data yet.</p>
                ) : topProducts.map(([name, rev], i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: i === 0 ? '#f59e0b' : i === 1 ? '#6b7280' : i === 2 ? '#92400e' : 'var(--bg-main)', color: 'white', fontWeight: '900', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: '800', fontSize: '13px', color: 'var(--secondary)' }}>{name}</p>
                            <div style={{ height: '4px', background: 'var(--bg-main)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                                <motion.div animate={{ width: `${(rev / topProducts[0][1]) * 100}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', background: 'var(--primary)', borderRadius: '2px' }} />
                            </div>
                        </div>
                        <span style={{ fontWeight: '900', fontSize: '13px', color: 'var(--primary)' }}>₹{Math.round(rev).toLocaleString('en-IN')}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAnalyticsTab;
