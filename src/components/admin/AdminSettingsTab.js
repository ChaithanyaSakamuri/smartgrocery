import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Store, Percent, Truck, FileText } from 'lucide-react';

const defaultSettings = {
    storeName: 'Freshly',
    storeEmail: 'admin@freshly.com',
    storePhone: '',
    storeAddress: '',
    gstPercent: 5,
    deliveryCharge: 50,
    freeDeliveryAbove: 499,
    currency: '₹',
};

const AdminSettingsTab = () => {
    const [settings, setSettings] = useState(() => {
        const stored = localStorage.getItem('freshly_settings');
        return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    });
    const [saved, setSaved] = useState(false);

    const save = () => {
        localStorage.setItem('freshly_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const Field = ({ label, k, type = 'text', placeholder = '' }) => (
        <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', display: 'block', marginBottom: '5px' }}>{label}</label>
            <input type={type} placeholder={placeholder} value={settings[k]}
                onChange={e => setSettings(s => ({ ...s, [k]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', fontSize: '13px', fontWeight: '600', color: 'var(--secondary)', outline: 'none', boxSizing: 'border-box' }} />
        </div>
    );

    const Section = ({ icon, title, children }) => (
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 20px', fontWeight: '1000', fontSize: '15px', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon} {title}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {children}
            </div>
        </div>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontWeight: '1000', fontSize: '22px', color: 'var(--secondary)' }}>Settings</h2>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={save}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: saved ? '#16a34a' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '13px', transition: 'background 0.3s' }}>
                    <Save size={15} /> {saved ? '✅ Saved!' : 'Save Settings'}
                </motion.button>
            </div>

            <Section icon={<Store size={16} />} title="Store Details">
                <Field label="Store Name" k="storeName" placeholder="Freshly" />
                <Field label="Store Email" k="storeEmail" placeholder="admin@freshly.com" />
                <Field label="Store Phone" k="storePhone" placeholder="+91 98765 43210" />
                <Field label="Store Address" k="storeAddress" placeholder="123 Market St, Mumbai" />
            </Section>

            <Section icon={<Percent size={16} />} title="Tax Configuration">
                <Field label="GST Percentage (%)" k="gstPercent" type="number" placeholder="5" />
                <Field label="Currency Symbol" k="currency" placeholder="₹" />
            </Section>

            <Section icon={<Truck size={16} />} title="Delivery Settings">
                <Field label="Delivery Charge (₹)" k="deliveryCharge" type="number" placeholder="50" />
                <Field label="Free Delivery Above (₹)" k="freeDeliveryAbove" type="number" placeholder="499" />
            </Section>

            <div style={{ background: '#fef9c3', borderRadius: '16px', padding: '16px 20px', border: '1px solid #fde047', fontSize: '13px', color: '#854d0e', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={14} />
                Payment gateway, multi-language, and advanced billing settings require backend integration — <b>Coming Soon</b>
            </div>
        </div>
    );
};

export default AdminSettingsTab;
