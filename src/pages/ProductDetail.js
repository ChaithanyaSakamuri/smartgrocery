import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Star,
    ShieldCheck,
    Clock,
    Users,
    Heart,
    Share2,
    Plus,
    Minus,
    Zap,
    Scale,
    CheckCircle2,
    ShoppingBag as StoreIcon,
    Info as LeafIcon
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

const ProductDetail = ({ addToCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = [...Object.values(CATEGORIES).flat()].find(p => p.id === id);
    const [qty, setQty] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    if (!product) return (
        <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900' }}>Product not found</h2>
            <button onClick={() => navigate('/home')} style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700' }}>Return Home</button>
        </div>
    );

    const daysToExpiry = Math.floor(Math.random() * 10) + 1;
    const discountMultiplier = daysToExpiry <= 3 ? 0.7 : 1;
    const finalPrice = (product.price * discountMultiplier).toFixed(2);
    const healthScore = Math.floor(Math.random() * 40) + 60;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '20px 0 40px' }}
        >
            <div className="main-container">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <motion.button
                        whileHover={{ x: -5, color: 'var(--primary)' }}
                        onClick={() => navigate(-1)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', transition: 'all 0.2s ease', fontSize: '15px' }}
                    >
                        <ChevronLeft size={22} /> Back to Products
                    </motion.button>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <motion.button whileHover={{ scale: 1.1, background: 'var(--bg-main)' }} whileTap={{ scale: 0.9 }} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--border-light)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--secondary)', boxShadow: 'var(--shadow-sm)' }}>
                            <Share2 size={20} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1, background: 'var(--bg-main)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--border-light)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isWishlisted ? '#ef4444' : 'var(--secondary)', boxShadow: 'var(--shadow-sm)' }}
                        >
                            <Heart size={20} fill={isWishlisted ? '#ef4444' : 'none'} />
                        </motion.button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '40px', alignItems: 'flex-start' }}>
                    {/* Product Image Section */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                background: 'white',
                                borderRadius: '32px',
                                padding: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'var(--shadow-lg)',
                                border: '1px solid var(--border-light)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '320px', objectFit: 'contain' }} />

                            {/* Health Score Badge */}
                            <div style={{ position: 'absolute', top: '40px', right: '40px', textAlign: 'center' }}>
                                <div style={{
                                    width: '84px',
                                    height: '84px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '1000',
                                    fontSize: '26px',
                                    boxShadow: '0 15px 30px var(--primary-glow)',
                                    border: '6px solid var(--primary-light)',
                                    marginBottom: '10px'
                                }}>
                                    {healthScore}
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: '1000', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Health Score</span>
                            </div>

                            {/* Badges Overlay */}
                            <div style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div style={{ padding: '10px 18px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '16px', fontSize: '13px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-light)' }}>
                                    <CheckCircle2 size={18} /> 100% Organic
                                </div>
                                <div style={{ padding: '10px 18px', background: '#fff7ed', color: '#c2410c', borderRadius: '16px', fontSize: '13px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #ffedd5' }}>
                                    <Zap size={18} /> Instant Delivery
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Product Content Section */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <span style={{ color: 'var(--primary)', fontWeight: '1000', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '15px', display: 'block', marginBottom: '20px' }}>{product.category}</span>
                            <h1 style={{ fontSize: '72px', fontWeight: '1000', margin: '0 0 24px', color: 'var(--secondary)', lineHeight: '0.9', letterSpacing: '-3px' }}>{product.name}</h1>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill={i <= 4 ? "#f59e0b" : "none"} color="#f59e0b" />)}
                                    </div>
                                    <span style={{ fontWeight: '1000', color: 'var(--secondary)', fontSize: '20px' }}>4.8</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: '600' }}>(250+ Ratings)</span>
                                </div>
                                <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '900', fontSize: '16px' }}>
                                    <ShieldCheck size={22} /> Certified Farm Fresh
                                </div>
                            </div>

                            {daysToExpiry <= 3 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}
                                >
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Clock size={26} />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '1000', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>FARM-SAVER DEAL: EXPIRES IN {daysToExpiry} DAYS</p>
                                        <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#991b1b', fontWeight: '600' }}>Help us reduce waste and save 30% instantly!</p>
                                    </div>
                                </motion.div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '48px' }}>
                                <div style={{ fontSize: '72px', fontWeight: '1000', color: 'var(--primary)', letterSpacing: '-3px', lineHeight: '1' }}>₹{finalPrice}</div>
                                {discountMultiplier < 1 && (
                                    <div style={{ fontSize: '32px', textDecoration: 'line-through', color: 'var(--text-muted)', fontWeight: '700', opacity: 0.4 }}>₹{product.price}</div>
                                )}
                                <span style={{ fontSize: '20px', color: 'var(--text-muted)', fontWeight: '700' }}>/ unit</span>
                            </div>

                            <div style={{ display: 'flex', gap: '24px', marginBottom: '60px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-main)', borderRadius: '24px', border: '1px solid var(--border-light)', padding: '10px' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.1, background: 'white' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        style={{ width: '54px', height: '54px', borderRadius: '18px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', boxShadow: 'var(--shadow-sm)' }}
                                    >
                                        <Minus size={22} />
                                    </motion.button>
                                    <span style={{ width: '70px', textAlign: 'center', fontWeight: '1000', fontSize: '26px', color: 'var(--secondary)' }}>{qty}</span>
                                    <motion.button
                                        whileHover={{ scale: 1.1, background: 'white' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setQty(qty + 1)}
                                        style={{ width: '54px', height: '54px', borderRadius: '18px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', boxShadow: 'var(--shadow-sm)' }}
                                    >
                                        <Plus size={22} />
                                    </motion.button>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02, background: 'var(--primary-dark)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => addToCart({ ...product, price: parseFloat(finalPrice), qty })}
                                    style={{ flex: 1, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '24px', fontWeight: '1000', fontSize: '22px', cursor: 'pointer', boxShadow: '0 20px 40px var(--primary-glow)', transition: 'all 0.3s ease' }}
                                >
                                    Add to Basket
                                </motion.button>
                            </div>

                            {/* Community Group Buy Section */}
                            <motion.div
                                whileHover={{ y: -10 }}
                                style={{
                                    background: 'var(--secondary)',
                                    borderRadius: '40px',
                                    padding: '40px',
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-lg)'
                                }}
                            >
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '24px', fontWeight: '1000', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                                                <Users size={28} color="var(--primary)" /> Smart Group Buy
                                            </h4>
                                            <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '16px', fontWeight: '600' }}>Collaborative savings for the community!</p>
                                        </div>
                                        <div style={{ background: 'var(--primary)', padding: '14px 22px', borderRadius: '18px', fontWeight: '1000', fontSize: '22px', boxShadow: '0 10px 20px var(--primary-glow)' }}>
                                            ₹{(finalPrice * 0.85).toFixed(0)}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '32px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '14px', fontWeight: '900' }}>
                                            <span style={{ color: '#cbd5e1' }}>Pool Progress</span>
                                            <span style={{ color: 'var(--primary)' }}>Almost there! 3 slots left</span>
                                        </div>
                                        <div style={{ height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '7px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '70%' }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), #10b981)', borderRadius: '7px' }}
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ background: 'white', color: 'var(--secondary)', scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ width: '100%', background: 'transparent', border: '2px solid var(--primary)', color: 'white', padding: '20px', borderRadius: '20px', fontWeight: '1000', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '17px' }}
                                    >
                                        Join Community Pool
                                    </motion.button>
                                </div>

                                {/* Decorative Background Icon */}
                                <Users size={180} style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.05, transform: 'rotate(-15deg)' }} />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Additional Info / Reviews */}
                <div style={{ marginTop: '120px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px' }}>
                    <div>
                        <h3 style={{ fontSize: '36px', fontWeight: '1000', marginBottom: '48px', color: 'var(--secondary)', letterSpacing: '-2px' }}>Nutrition Facts</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            {[
                                { label: 'Energy', value: '45 kcal', icon: <Zap size={26} /> },
                                { label: 'Protein', value: '1.2g', icon: <Scale size={26} /> },
                                { label: 'Fiber', value: '2.5g', icon: <LeafIcon size={26} /> },
                                { label: 'Vitamin C', value: '25mg', icon: <ShieldCheck size={26} /> }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -8, boxShadow: 'var(--shadow-md)', borderColor: 'var(--primary)' }}
                                    style={{
                                        padding: '40px 24px',
                                        background: 'white',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '32px',
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{ color: 'var(--primary)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                                    <h5 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '1000', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</h5>
                                    <p style={{ margin: 0, fontWeight: '1000', fontSize: '28px', color: 'var(--secondary)' }}>{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        padding: '56px',
                        background: 'var(--bg-main)',
                        borderRadius: '48px',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)',
                        alignSelf: 'stretch'
                    }}>
                        <h3 style={{ fontSize: '26px', fontWeight: '1000', marginBottom: '32px', color: 'var(--secondary)' }}>Produced By</h3>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ width: '72px', height: '72px', background: 'white', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                                <StoreIcon size={32} color="var(--primary)" />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '1000', color: 'var(--secondary)' }}>FreshRoots Organic Farms</h4>
                                <p style={{ margin: '4px 0 0', fontSize: '15px', color: 'var(--text-muted)', fontWeight: '700' }}>⭐ 4.9 Super Vendor</p>
                            </div>
                        </div>
                        <p style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '40px', fontWeight: '600' }}>
                            Based in the fertile plains of the Cauvery basin, FreshRoots specializes in heirloom varieties grown with zero chemical intervention.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02, background: 'var(--primary)', color: 'white' }}
                            whileTap={{ scale: 0.98 }}
                            style={{ width: '100%', padding: '18px', borderRadius: '20px', border: '2px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontWeight: '1000', cursor: 'pointer', fontSize: '16px', transition: 'all 0.3s ease' }}
                        >
                            Visit Farm Profile
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetail;

