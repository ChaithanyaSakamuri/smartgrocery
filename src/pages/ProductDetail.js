import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft, Star, ShieldCheck, Clock, Users,
    Heart, Share2, Plus, Minus, Zap, Scale, CheckCircle2,
    ShoppingBag as StoreIcon, Info as LeafIcon
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

const ProductDetail = ({ addToCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = [...Object.values(CATEGORIES).flat()].find(p => p.id === id);
    const [qty, setQty] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [added, setAdded] = useState(false);

    if (!product) return (
        <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Product not found</h2>
            <button onClick={() => navigate('/home')} style={{ padding: '10px 24px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Return Home</button>
        </div>
    );

    const daysToExpiry = Math.floor(Math.random() * 10) + 1;
    const discountMultiplier = daysToExpiry <= 3 ? 0.7 : 1;
    const finalPrice = (product.price * discountMultiplier).toFixed(2);
    const healthScore = Math.floor(Math.random() * 40) + 60;

    const handleAddToCart = () => {
        addToCart({ ...product, price: parseFloat(finalPrice), qty });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ height: 'calc(100vh - 80px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="main-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: '10px', paddingBottom: '10px' }}>

                {/* Top Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexShrink: 0 }}>
                    <motion.button whileHover={{ x: -4, color: 'var(--primary)' }} onClick={() => navigate(-1)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', fontSize: '14px', transition: 'all 0.2s' }}>
                        <ChevronLeft size={18} /> Back to Products
                    </motion.button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <motion.button whileTap={{ scale: 0.9 }}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-light)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--secondary)' }}>
                            <Share2 size={16} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsWishlisted(!isWishlisted)}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-light)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isWishlisted ? '#ef4444' : 'var(--secondary)' }}>
                            <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} />
                        </motion.button>
                    </div>
                </div>

                {/* Main 3-column grid */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '340px 1fr 1fr', gap: '16px', overflow: 'hidden' }}>

                    {/* ─── Col 1: Image ─── */}
                    <div style={{ background: 'white', borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)', position: 'relative', overflow: 'hidden' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '220px', objectFit: 'contain' }} />

                        {/* Health Score */}
                        <div style={{ position: 'absolute', top: '16px', right: '16px', textAlign: 'center' }}>
                            <div style={{ width: '56px', height: '56px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px', boxShadow: '0 8px 20px var(--primary-glow)', marginBottom: '4px' }}>
                                {healthScore}
                            </div>
                            <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Health</span>
                        </div>

                        {/* Badges */}
                        <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ padding: '5px 10px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '10px', fontSize: '11px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <CheckCircle2 size={12} /> 100% Organic
                            </div>
                            <div style={{ padding: '5px 10px', background: '#fff7ed', color: '#c2410c', borderRadius: '10px', fontSize: '11px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Zap size={12} /> Instant Delivery
                            </div>
                        </div>

                        {/* Nutrition Facts at bottom of image card */}
                        <div style={{ width: '100%', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                            <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: '900', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Nutrition Facts</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {[
                                    { label: 'Energy', value: '45 kcal', icon: <Zap size={14} /> },
                                    { label: 'Protein', value: '1.2g', icon: <Scale size={14} /> },
                                    { label: 'Fiber', value: '2.5g', icon: <LeafIcon size={14} /> },
                                    { label: 'Vitamin C', value: '25mg', icon: <ShieldCheck size={14} /> }
                                ].map((stat, i) => (
                                    <div key={i} style={{ padding: '8px 10px', background: 'var(--bg-main)', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                                        <div style={{ color: 'var(--primary)', marginBottom: '3px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>{stat.label}</p>
                                        <p style={{ margin: 0, fontWeight: '900', fontSize: '14px', color: 'var(--secondary)' }}>{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ─── Col 2: Product Info ─── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
                        <div style={{ background: 'white', borderRadius: '24px', padding: '20px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)', flex: 1 }}>
                            <span style={{ color: 'var(--primary)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px', display: 'block', marginBottom: '6px' }}>{product.category}</span>
                            <h1 style={{ fontSize: '36px', fontWeight: '1000', margin: '0 0 10px', color: 'var(--secondary)', lineHeight: '1', letterSpacing: '-2px' }}>{product.name}</h1>

                            {/* Rating */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i <= 4 ? "#f59e0b" : "none"} color="#f59e0b" />)}
                                </div>
                                <span style={{ fontWeight: '800', color: 'var(--secondary)', fontSize: '14px' }}>4.8</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>(250+ Ratings)</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: '800', fontSize: '12px' }}>
                                    <ShieldCheck size={14} /> Certified Farm Fresh
                                </span>
                            </div>

                            {/* Farm saver deal */}
                            {daysToExpiry <= 3 && (
                                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <Clock size={16} />
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}>FARM-SAVER DEAL: EXPIRES IN {daysToExpiry} DAYS</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#991b1b', fontWeight: '600' }}>Help us reduce waste and save 30% instantly!</p>
                                    </div>
                                </div>
                            )}

                            {/* Price */}
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
                                <div style={{ fontSize: '44px', fontWeight: '1000', color: 'var(--primary)', letterSpacing: '-2px', lineHeight: '1' }}>₹{finalPrice}</div>
                                {discountMultiplier < 1 && (
                                    <div style={{ fontSize: '20px', textDecoration: 'line-through', color: 'var(--text-muted)', fontWeight: '700', opacity: 0.5 }}>₹{product.price}</div>
                                )}
                                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '700' }}>/ unit</span>
                            </div>

                            {/* Qty + Add to Cart */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-light)', padding: '4px' }}>
                                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQty(Math.max(1, qty - 1))}
                                        style={{ width: '38px', height: '38px', borderRadius: '12px', border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', boxShadow: 'var(--shadow-sm)' }}>
                                        <Minus size={16} />
                                    </motion.button>
                                    <span style={{ width: '44px', textAlign: 'center', fontWeight: '900', fontSize: '18px', color: 'var(--secondary)' }}>{qty}</span>
                                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQty(qty + 1)}
                                        style={{ width: '38px', height: '38px', borderRadius: '12px', border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', boxShadow: 'var(--shadow-sm)' }}>
                                        <Plus size={16} />
                                    </motion.button>
                                </div>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart}
                                    style={{ flex: 1, background: added ? '#16a34a' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 20px var(--primary-glow)', transition: 'all 0.3s' }}>
                                    {added ? '✓ Added!' : 'Add to Basket'}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* ─── Col 3: Vendor + Group Buy ─── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
                        {/* Produced By */}
                        <div style={{ background: 'var(--bg-main)', borderRadius: '24px', padding: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
                            <p style={{ margin: '0 0 12px', fontWeight: '900', color: 'var(--secondary)', fontSize: '14px' }}>Produced By</p>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ width: '44px', height: '44px', background: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
                                    <StoreIcon size={22} color="var(--primary)" />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: 'var(--secondary)' }}>FreshRoots Organic Farms</h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>⭐ 4.9 Super Vendor</p>
                                </div>
                            </div>
                            <p style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '600' }}>
                                Based in the fertile plains of the Cauvery basin, FreshRoots specializes in heirloom varieties grown with zero chemical intervention.
                            </p>
                            <motion.button whileHover={{ background: 'var(--primary)', color: 'white' }} whileTap={{ scale: 0.98 }}
                                style={{ width: '100%', padding: '10px', borderRadius: '14px', border: '2px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontWeight: '900', cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s' }}>
                                Visit Farm Profile
                            </motion.button>
                        </div>

                        {/* Community Group Buy */}
                        <div style={{ background: 'var(--secondary)', borderRadius: '24px', padding: '16px', color: 'white', flex: 1, position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                                            <Users size={18} color="var(--primary)" /> Smart Group Buy
                                        </h4>
                                        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>Collaborative savings!</p>
                                    </div>
                                    <div style={{ background: 'var(--primary)', padding: '8px 14px', borderRadius: '12px', fontWeight: '900', fontSize: '18px', boxShadow: '0 6px 14px var(--primary-glow)' }}>
                                        ₹{(finalPrice * 0.85).toFixed(0)}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', fontWeight: '800' }}>
                                        <span style={{ color: '#cbd5e1' }}>Pool Progress</span>
                                        <span style={{ color: 'var(--primary)' }}>3 slots left!</span>
                                    </div>
                                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.07)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 1.5, ease: 'easeOut' }}
                                            style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), #10b981)', borderRadius: '5px' }} />
                                    </div>
                                </div>

                                <motion.button whileHover={{ background: 'white', color: 'var(--secondary)' }} whileTap={{ scale: 0.98 }}
                                    style={{ width: '100%', background: 'transparent', border: '2px solid var(--primary)', color: 'white', padding: '12px', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.3s', fontSize: '14px' }}>
                                    Join Community Pool
                                </motion.button>
                            </div>
                            <Users size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.04, transform: 'rotate(-15deg)' }} />
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetail;
