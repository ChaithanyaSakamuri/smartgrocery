import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    CreditCard,
    Truck,
    ChevronLeft,
    ShieldCheck,
    Lock,
    Package,
    ArrowRight,
    CheckCircle,
    X,
    Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── Freshly-branded UPI QR SVG ─────────────────────────────── */
const FreshlyQR = () => (
    <svg viewBox="0 0 260 260" width="220" height="220" xmlns="http://www.w3.org/2000/svg">
        {/* White background */}
        <rect width="260" height="260" fill="white" rx="12" />
        {/* Quiet zone border */}
        <rect x="4" y="4" width="252" height="252" fill="none" stroke="#e5e7eb" strokeWidth="1" rx="10" />

        {/* ── Top-left finder pattern ── */}
        <rect x="16" y="16" width="56" height="56" fill="#1a5c38" rx="4" />
        <rect x="22" y="22" width="44" height="44" fill="white" rx="2" />
        <rect x="28" y="28" width="32" height="32" fill="#1a5c38" rx="2" />

        {/* ── Top-right finder pattern ── */}
        <rect x="188" y="16" width="56" height="56" fill="#1a5c38" rx="4" />
        <rect x="194" y="22" width="44" height="44" fill="white" rx="2" />
        <rect x="200" y="28" width="32" height="32" fill="#1a5c38" rx="2" />

        {/* ── Bottom-left finder pattern ── */}
        <rect x="16" y="188" width="56" height="56" fill="#1a5c38" rx="4" />
        <rect x="22" y="194" width="44" height="44" fill="white" rx="2" />
        <rect x="28" y="200" width="32" height="32" fill="#1a5c38" rx="2" />

        {/* ── Data modules (top) ── */}
        <rect x="84" y="16" width="8" height="8" fill="#1a5c38" />
        <rect x="100" y="16" width="8" height="8" fill="#1a5c38" />
        <rect x="108" y="16" width="8" height="8" fill="#1a5c38" />
        <rect x="124" y="16" width="8" height="8" fill="#1a5c38" />
        <rect x="140" y="16" width="8" height="8" fill="#1a5c38" />
        <rect x="156" y="16" width="8" height="8" fill="#1a5c38" />
        <rect x="172" y="16" width="8" height="8" fill="#1a5c38" />

        <rect x="84" y="28" width="8" height="8" fill="#1a5c38" />
        <rect x="100" y="28" width="8" height="8" fill="#1a5c38" />
        <rect x="116" y="28" width="8" height="8" fill="#1a5c38" />
        <rect x="148" y="28" width="8" height="8" fill="#1a5c38" />
        <rect x="164" y="28" width="8" height="8" fill="#1a5c38" />
        <rect x="180" y="28" width="8" height="8" fill="#1a5c38" />

        <rect x="92" y="40" width="8" height="8" fill="#1a5c38" />
        <rect x="108" y="40" width="8" height="8" fill="#1a5c38" />
        <rect x="124" y="40" width="8" height="8" fill="#1a5c38" />
        <rect x="132" y="40" width="8" height="8" fill="#1a5c38" />
        <rect x="148" y="40" width="8" height="8" fill="#1a5c38" />
        <rect x="172" y="40" width="8" height="8" fill="#1a5c38" />

        <rect x="84" y="52" width="8" height="8" fill="#1a5c38" />
        <rect x="100" y="52" width="8" height="8" fill="#1a5c38" />
        <rect x="116" y="52" width="8" height="8" fill="#1a5c38" />
        <rect x="140" y="52" width="8" height="8" fill="#1a5c38" />
        <rect x="156" y="52" width="8" height="8" fill="#1a5c38" />
        <rect x="180" y="52" width="8" height="8" fill="#1a5c38" />

        <rect x="92" y="64" width="8" height="8" fill="#1a5c38" />
        <rect x="108" y="64" width="8" height="8" fill="#1a5c38" />
        <rect x="124" y="64" width="8" height="8" fill="#1a5c38" />
        <rect x="148" y="64" width="8" height="8" fill="#1a5c38" />
        <rect x="164" y="64" width="8" height="8" fill="#1a5c38" />
        <rect x="172" y="64" width="8" height="8" fill="#1a5c38" />

        {/* ── Side data modules ── */}
        <rect x="16" y="84" width="8" height="8" fill="#1a5c38" />
        <rect x="32" y="84" width="8" height="8" fill="#1a5c38" />
        <rect x="48" y="84" width="8" height="8" fill="#1a5c38" />
        <rect x="64" y="84" width="8" height="8" fill="#1a5c38" />

        <rect x="16" y="100" width="8" height="8" fill="#1a5c38" />
        <rect x="40" y="100" width="8" height="8" fill="#1a5c38" />
        <rect x="56" y="100" width="8" height="8" fill="#1a5c38" />

        <rect x="24" y="116" width="8" height="8" fill="#1a5c38" />
        <rect x="48" y="116" width="8" height="8" fill="#1a5c38" />
        <rect x="64" y="116" width="8" height="8" fill="#1a5c38" />

        <rect x="16" y="132" width="8" height="8" fill="#1a5c38" />
        <rect x="32" y="132" width="8" height="8" fill="#1a5c38" />
        <rect x="56" y="132" width="8" height="8" fill="#1a5c38" />

        <rect x="24" y="148" width="8" height="8" fill="#1a5c38" />
        <rect x="40" y="148" width="8" height="8" fill="#1a5c38" />
        <rect x="64" y="148" width="8" height="8" fill="#1a5c38" />

        <rect x="16" y="164" width="8" height="8" fill="#1a5c38" />
        <rect x="48" y="164" width="8" height="8" fill="#1a5c38" />
        <rect x="56" y="164" width="8" height="8" fill="#1a5c38" />
        <rect x="64" y="164" width="8" height="8" fill="#1a5c38" />

        {/* Right side modules */}
        <rect x="188" y="84" width="8" height="8" fill="#1a5c38" />
        <rect x="204" y="84" width="8" height="8" fill="#1a5c38" />
        <rect x="220" y="84" width="8" height="8" fill="#1a5c38" />
        <rect x="236" y="84" width="8" height="8" fill="#1a5c38" />

        <rect x="196" y="100" width="8" height="8" fill="#1a5c38" />
        <rect x="212" y="100" width="8" height="8" fill="#1a5c38" />
        <rect x="236" y="100" width="8" height="8" fill="#1a5c38" />

        <rect x="188" y="116" width="8" height="8" fill="#1a5c38" />
        <rect x="208" y="116" width="8" height="8" fill="#1a5c38" />
        <rect x="228" y="116" width="8" height="8" fill="#1a5c38" />

        <rect x="196" y="132" width="8" height="8" fill="#1a5c38" />
        <rect x="220" y="132" width="8" height="8" fill="#1a5c38" />
        <rect x="236" y="132" width="8" height="8" fill="#1a5c38" />

        <rect x="188" y="148" width="8" height="8" fill="#1a5c38" />
        <rect x="204" y="148" width="8" height="8" fill="#1a5c38" />
        <rect x="228" y="148" width="8" height="8" fill="#1a5c38" />

        <rect x="196" y="164" width="8" height="8" fill="#1a5c38" />
        <rect x="212" y="164" width="8" height="8" fill="#1a5c38" />
        <rect x="236" y="164" width="8" height="8" fill="#1a5c38" />

        {/* ── Centre data block ── */}
        <rect x="84" y="84" width="8" height="8" fill="#1a5c38" />
        <rect x="100" y="84" width="8" height="8" fill="#1a5c38" />
        <rect x="124" y="84" width="8" height="8" fill="#1a5c38" />
        <rect x="140" y="84" width="8" height="8" fill="#1a5c38" />
        <rect x="164" y="84" width="8" height="8" fill="#1a5c38" />
        <rect x="172" y="84" width="8" height="8" fill="#1a5c38" />

        <rect x="92" y="100" width="8" height="8" fill="#1a5c38" />
        <rect x="116" y="100" width="8" height="8" fill="#1a5c38" />
        <rect x="132" y="100" width="8" height="8" fill="#1a5c38" />
        <rect x="148" y="100" width="8" height="8" fill="#1a5c38" />
        <rect x="164" y="100" width="8" height="8" fill="#1a5c38" />

        {/* Freshly leaf logo in center of QR */}
        <circle cx="130" cy="130" r="22" fill="white" stroke="#e5e7eb" strokeWidth="1" />
        <text x="130" y="125" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1a5c38" fontFamily="Arial,sans-serif">🌿</text>
        <text x="130" y="137" textAnchor="middle" fontSize="7" fontWeight="900" fill="#1a5c38" fontFamily="Arial,sans-serif">freshly</text>

        {/* ── Bottom data modules ── */}
        <rect x="84" y="116" width="8" height="8" fill="#1a5c38" />
        <rect x="108" y="116" width="8" height="8" fill="#1a5c38" />
        <rect x="148" y="116" width="8" height="8" fill="#1a5c38" />
        <rect x="172" y="116" width="8" height="8" fill="#1a5c38" />

        <rect x="92" y="132" width="8" height="8" fill="#1a5c38" />
        <rect x="116" y="132" width="8" height="8" fill="#1a5c38" />
        <rect x="140" y="132" width="8" height="8" fill="#1a5c38" />
        <rect x="164" y="132" width="8" height="8" fill="#1a5c38" />

        <rect x="84" y="148" width="8" height="8" fill="#1a5c38" />
        <rect x="100" y="148" width="8" height="8" fill="#1a5c38" />
        <rect x="124" y="148" width="8" height="8" fill="#1a5c38" />
        <rect x="148" y="148" width="8" height="8" fill="#1a5c38" />
        <rect x="172" y="148" width="8" height="8" fill="#1a5c38" />

        <rect x="92" y="164" width="8" height="8" fill="#1a5c38" />
        <rect x="108" y="164" width="8" height="8" fill="#1a5c38" />
        <rect x="132" y="164" width="8" height="8" fill="#1a5c38" />
        <rect x="156" y="164" width="8" height="8" fill="#1a5c38" />
        <rect x="180" y="164" width="8" height="8" fill="#1a5c38" />

        {/* Bottom row */}
        <rect x="84" y="188" width="8" height="8" fill="#1a5c38" />
        <rect x="100" y="188" width="8" height="8" fill="#1a5c38" />
        <rect x="116" y="188" width="8" height="8" fill="#1a5c38" />
        <rect x="132" y="188" width="8" height="8" fill="#1a5c38" />
        <rect x="148" y="188" width="8" height="8" fill="#1a5c38" />
        <rect x="164" y="188" width="8" height="8" fill="#1a5c38" />
        <rect x="172" y="188" width="8" height="8" fill="#1a5c38" />

        <rect x="92" y="200" width="8" height="8" fill="#1a5c38" />
        <rect x="108" y="200" width="8" height="8" fill="#1a5c38" />
        <rect x="124" y="200" width="8" height="8" fill="#1a5c38" />
        <rect x="148" y="200" width="8" height="8" fill="#1a5c38" />
        <rect x="164" y="200" width="8" height="8" fill="#1a5c38" />
        <rect x="180" y="200" width="8" height="8" fill="#1a5c38" />

        <rect x="84" y="212" width="8" height="8" fill="#1a5c38" />
        <rect x="100" y="212" width="8" height="8" fill="#1a5c38" />
        <rect x="116" y="212" width="8" height="8" fill="#1a5c38" />
        <rect x="140" y="212" width="8" height="8" fill="#1a5c38" />
        <rect x="156" y="212" width="8" height="8" fill="#1a5c38" />
        <rect x="172" y="212" width="8" height="8" fill="#1a5c38" />

        <rect x="92" y="224" width="8" height="8" fill="#1a5c38" />
        <rect x="116" y="224" width="8" height="8" fill="#1a5c38" />
        <rect x="132" y="224" width="8" height="8" fill="#1a5c38" />
        <rect x="148" y="224" width="8" height="8" fill="#1a5c38" />
        <rect x="164" y="224" width="8" height="8" fill="#1a5c38" />
        <rect x="180" y="224" width="8" height="8" fill="#1a5c38" />

        <rect x="84" y="236" width="8" height="8" fill="#1a5c38" />
        <rect x="100" y="236" width="8" height="8" fill="#1a5c38" />
        <rect x="124" y="236" width="8" height="8" fill="#1a5c38" />
        <rect x="140" y="236" width="8" height="8" fill="#1a5c38" />
        <rect x="172" y="236" width="8" height="8" fill="#1a5c38" />
    </svg>
);

/* ── UPI QR Modal ──────────────────────────────────────────── */
const UpiQrModal = ({ amount, onSuccess, onClose }) => {
    const [paid, setPaid] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const handleConfirm = () => {
        setConfirming(true);
        setTimeout(() => {
            setPaid(true);
            setTimeout(onSuccess, 1200);
        }, 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px'
            }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                style={{
                    background: 'white', borderRadius: '24px',
                    padding: '28px 24px', width: '100%', maxWidth: '360px',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
                    textAlign: 'center', position: 'relative'
                }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '14px', right: '14px', background: 'var(--bg-main)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                    <X size={14} />
                </button>

                {!paid ? (
                    <>
                        {/* Header */}
                        <div style={{ marginBottom: '4px' }}>
                            <span style={{ fontSize: '22px', fontWeight: '1000', color: 'var(--primary)', letterSpacing: '-1px' }}>🌿 Freshly</span>
                        </div>
                        <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>UPI Payment</p>

                        {/* Amount chip */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '6px 16px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '1000', color: 'var(--primary)' }}>₹{amount}</span>
                        </div>

                        {/* QR */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                            <div style={{ padding: '10px', background: 'white', border: '2px solid #e5e7eb', borderRadius: '16px', display: 'inline-block' }}>
                                <FreshlyQR />
                            </div>
                        </div>

                        {/* UPI ID */}
                        <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '8px 14px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Smartphone size={13} color="var(--primary)" />
                            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', letterSpacing: '0.3px' }}>freshly@upi</span>
                        </div>

                        {/* App icons row */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                            {[
                                { label: 'GPay', bg: '#4285f4', emoji: '💳' },
                                { label: 'PhonePe', bg: '#6147bb', emoji: '📱' },
                                { label: 'Paytm', bg: '#00baf2', emoji: '💰' },
                                { label: 'BHIM', bg: '#f5961d', emoji: '🇮🇳' }
                            ].map(a => (
                                <div key={a.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{a.emoji}</div>
                                    <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-muted)' }}>{a.label}</span>
                                </div>
                            ))}
                        </div>

                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: '500' }}>
                            Scan with any UPI app. After payment, tap confirm below.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleConfirm}
                            disabled={confirming}
                            style={{
                                width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                                background: confirming ? '#a7f3d0' : 'var(--primary)', color: 'white',
                                fontWeight: '1000', fontSize: '14px', cursor: confirming ? 'default' : 'pointer',
                                boxShadow: '0 6px 16px var(--primary-glow)', transition: 'background 0.3s'
                            }}
                        >
                            {confirming ? '⏳ Verifying...' : '✅ I have Paid'}
                        </motion.button>

                        <p style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '10px', fontWeight: '500' }}>
                            🔒 Demo QR — no real payment processed
                        </p>
                    </>
                ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '3px solid #86efac' }}>
                            <CheckCircle size={32} color="var(--primary)" />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '6px' }}>Payment Successful!</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>Your order has been placed. Redirecting…</p>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

/* ── Main Checkout Component ─────────────────────────────────── */
const Checkout = ({ cart, setCart }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const subtotal = cart.reduce((acc, item) => acc + (item?.price || 0) * (item?.qty || 0), 0);

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [showQr, setShowQr] = useState(false);

    /* ── Persist order to localStorage ── */
    const saveOrderLocally = (method) => {
        const existing = JSON.parse(localStorage.getItem('freshly_orders') || '[]');
        const newOrder = {
            _id: 'ORD-' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'processing',
            paymentMethod: method,
            totalAmount: subtotal,
            shippingAddress: address,
            city,
            zipcode,
            items: cart.map(item => ({
                name: item.name,
                image: item.image,
                price: item.price,
                qty: item.qty
            }))
        };
        localStorage.setItem('freshly_orders', JSON.stringify([newOrder, ...existing]));
        /* Also save the latest address */
        localStorage.setItem('freshly_address', JSON.stringify({ address, city, zipcode }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setError('');

        if (paymentMethod === 'upi') {
            /* Show QR modal — no backend call needed */
            setShowQr(true);
            return;
        }

        /* COD path — no backend required, accepts any location */
        setProcessing(true);
        saveOrderLocally('cod');
        setTimeout(() => {
            setCart([]);
            setProcessing(false);
            navigate('/home');
        }, 1200);
    };

    const handleUpiSuccess = () => {
        saveOrderLocally('upi');
        setShowQr(false);
        setCart([]);
        navigate('/home');
    };

    return (
        <>
            <AnimatePresence>
                {showQr && (
                    <UpiQrModal
                        amount={subtotal.toFixed(0)}
                        onSuccess={handleUpiSuccess}
                        onClose={() => setShowQr(false)}
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ padding: '12px 0' }}
            >
                <div className="main-container" style={{ width: '100%', maxWidth: '1080px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <motion.button
                            whileHover={{ x: -5, color: 'var(--primary)' }}
                            onClick={() => navigate('/cart')}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '12px' }}
                        >
                            <ChevronLeft size={14} /> Back to Cart
                        </motion.button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '16px', letterSpacing: '-0.5px' }}>Checkout</h1>

                            <form onSubmit={handlePayment}>
                                {/* Step 1: Delivery */}
                                <section style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                        <div style={{ width: '24px', height: '24px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '1000', fontSize: '11px' }}>1</div>
                                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '1000', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={16} color="var(--primary)" /> Delivery Info
                                        </h3>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--secondary)', marginBottom: '4px' }}>Street Address</label>
                                            <input type="text" placeholder="House No., Street" value={address} onChange={e => setAddress(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--secondary)', outline: 'none', fontWeight: '600', fontSize: '13px' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--secondary)', marginBottom: '4px' }}>City</label>
                                            <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--secondary)', outline: 'none', fontWeight: '600', fontSize: '13px' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--secondary)', marginBottom: '4px' }}>Pincode</label>
                                            <input type="text" placeholder="000 000" value={zipcode} onChange={e => setZipcode(e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--secondary)', outline: 'none', fontWeight: '600', fontSize: '13px' }} />
                                        </div>
                                    </div>
                                </section>

                                {/* Step 2: Payment */}
                                <section style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                        <div style={{ width: '24px', height: '24px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '1000', fontSize: '11px' }}>2</div>
                                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '1000', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <CreditCard size={16} color="var(--primary)" /> Payment
                                        </h3>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        {/* UPI */}
                                        <div
                                            onClick={() => setPaymentMethod('upi')}
                                            style={{
                                                padding: '12px', borderRadius: '12px', border: '2px solid',
                                                borderColor: paymentMethod === 'upi' ? 'var(--primary)' : 'var(--border-light)',
                                                background: paymentMethod === 'upi' ? 'var(--primary-light)' : 'white',
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                <CreditCard size={18} color={paymentMethod === 'upi' ? 'var(--primary)' : 'var(--text-muted)'} />
                                                {paymentMethod === 'upi' && <ShieldCheck size={14} color="var(--primary)" />}
                                            </div>
                                            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '900', color: 'var(--secondary)' }}>Online / UPI</h4>
                                            <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', fontWeight: '500' }}>Scan QR to pay</p>
                                        </div>

                                        {/* COD */}
                                        <div
                                            onClick={() => setPaymentMethod('cod')}
                                            style={{
                                                padding: '12px', borderRadius: '12px', border: '2px solid',
                                                borderColor: paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border-light)',
                                                background: paymentMethod === 'cod' ? 'var(--primary-light)' : 'white',
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                <Truck size={18} color={paymentMethod === 'cod' ? 'var(--primary)' : 'var(--text-muted)'} />
                                                {paymentMethod === 'cod' && <ShieldCheck size={14} color="var(--primary)" />}
                                            </div>
                                            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '900', color: 'var(--secondary)' }}>COD</h4>
                                            <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', fontWeight: '500' }}>Pay at door</p>
                                        </div>
                                    </div>

                                    {/* UPI hint */}
                                    {paymentMethod === 'upi' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{ marginTop: '10px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--primary)', fontWeight: '700' }}
                                        >
                                            📲 A QR code will appear after you click Pay — scan it with GPay, PhonePe, Paytm or BHIM.
                                        </motion.div>
                                    )}
                                </section>

                                {error && (
                                    <div style={{ marginBottom: '16px', padding: '10px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', color: '#dc2626', fontWeight: '700', fontSize: '12px' }}>
                                        {error}
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.01, background: 'var(--primary-dark)' }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                                        background: 'var(--primary)', color: 'white', fontWeight: '1000', fontSize: '15px',
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        boxShadow: '0 8px 16px var(--primary-glow)', opacity: processing ? 0.7 : 1
                                    }}
                                >
                                    {processing ? 'Processing...' : (
                                        <>
                                            {paymentMethod === 'upi' ? '📲 Pay ₹' : 'Pay ₹'}{subtotal.toFixed(0)} <ArrowRight size={18} />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <aside>
                            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Package size={18} color="var(--primary)" /> Order Review
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '160px', overflowY: 'auto', paddingRight: '6px', marginBottom: '16px' }}>
                                    {cart.map((item, index) => (
                                        <div key={item?.id || index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <div style={{ width: '36px', height: '36px', background: 'var(--bg-main)', borderRadius: '6px', padding: '4px', flexShrink: 0 }}>
                                                <img src={item?.image} alt={item?.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: 'var(--secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item?.name}</h4>
                                                <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>{item?.qty} × ₹{item?.price}</p>
                                            </div>
                                            <p style={{ margin: 0, fontWeight: '900', fontSize: '12px', color: 'var(--secondary)' }}>₹{(item?.price * item?.qty).toFixed(0)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                                        <span>Items Subtotal</span>
                                        <span style={{ color: 'var(--secondary)', fontWeight: '800' }}>₹{subtotal.toFixed(0)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: '800' }}>
                                        <span>Shipping</span><span>FREE</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed var(--border-light)' }}>
                                    <span style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '13px' }}>Total Amount</span>
                                    <span style={{ fontSize: '20px', fontWeight: '1000', color: 'var(--primary)', letterSpacing: '-0.5px' }}>₹{subtotal.toFixed(0)}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '10px', padding: '0 8px', lineHeight: 1.4, fontWeight: '500' }}>
                                <Lock size={14} color="var(--primary)" />
                                <span>Encrypted SSL checkout. Secure data handling.</span>
                            </div>
                        </aside>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Checkout;
