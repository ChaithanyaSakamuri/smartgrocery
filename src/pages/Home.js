import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    ChevronDown,
} from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { CATEGORIES } from '../data/products';

const Home = ({ addToCart, wishlist, setWishlist }) => {
    const { searchTerm } = useOutletContext();
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('default'); // 'default', 'low', 'high', 'review'
    const [showOnlyOffers, setShowOnlyOffers] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null); // 'price', 'review', null

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        if (openDropdown) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openDropdown]);

    const categories = [
        { id: 'vegetables', name: 'Vegetables', icon: '🥦', bg: '#f0fdf4' },
        { id: 'fruits', name: 'Fruits', icon: '🍎', bg: '#fff7ed' },
        { id: 'dairy', name: 'Dairy', icon: '🥛', bg: '#eff6ff' },
        { id: 'dryFruits', name: 'Dry Fruits', icon: '🥜', bg: '#fef2f2' },
        { id: 'grains', name: 'Grains', icon: '🌾', bg: '#fafaf9' },
        { id: 'beverages', name: 'Beverages', icon: '🥤', bg: '#fdf4ff' }
    ];

    const onWishlist = (product) => {
        setWishlist(prev =>
            prev.find(w => w.id === product.id)
                ? prev.filter(w => w.id !== product.id)
                : [...prev, product]
        );
    };

    const filterAndSort = (items) => {
        let filtered = items.filter(i => {
            const matchesCategory = activeCategory === 'all' ||
                i.id.startsWith(activeCategory.charAt(0)) ||
                (i.category && i.category.toLowerCase().includes(activeCategory.toLowerCase()));
            const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesOffer = !showOnlyOffers || (i.price < 50 || i.stock < 20); // Mock offer logic
            return matchesCategory && matchesSearch && matchesOffer;
        });

        if (sortBy === 'low') filtered.sort((a, b) => a.price - b.price);
        if (sortBy === 'high') filtered.sort((a, b) => b.price - a.price);
        if (sortBy === 'review') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        return filtered;
    };

    const allProducts = Object.values(CATEGORIES).flat();
    const filteredProducts = filterAndSort(allProducts);

    const handleSort = (type) => {
        setSortBy(type);
        setOpenDropdown(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ paddingBottom: '60px' }}
        >
            {/* 1. EasyMart Hero Section */}
            <section style={{
                background: 'var(--primary)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px 48px',
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '300px'
            }}>
                <div style={{ flex: 1, zIndex: 1, maxWidth: '400px' }}>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
                        🏁 Grocery Home Service
                    </div>
                    <h1 style={{ fontSize: '44px', color: 'white', fontWeight: '1000', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-1.2px' }}>
                        Fastest <br />
                        <span style={{ color: '#ecfdf5', opacity: 0.9 }}>Delivery &</span> <br />
                        <span style={{ color: '#fbbf24' }}>Easy Pickup.</span>
                    </h1>
                    <motion.button
                        whileHover={{ scale: 1.05, background: 'var(--accent)' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: '#f97316',
                            color: 'white',
                            border: 'none',
                            padding: '16px 40px',
                            borderRadius: '12px',
                            fontWeight: '900',
                            fontSize: '16px',
                            cursor: 'pointer',
                            boxShadow: '0 20px 40px rgba(249, 115, 22, 0.3)'
                        }}
                    >
                        Shop Now
                    </motion.button>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', zIndex: 1 }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        style={{ position: 'relative' }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
                            alt="Fresh Vegetables"
                            style={{
                                width: '320px',
                                height: '320px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: '10px solid rgba(255,255,255,0.1)'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '20px',
                            background: 'white',
                            padding: '12px 24px',
                            borderRadius: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white', marginLeft: i > 1 ? '-12px' : 0, overflow: 'hidden' }}>
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>Our Happy Customer</div>
                                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>⭐ 4.9 (12.4k Reviews)</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '600px',
                    height: '600px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '50%',
                    filter: 'blur(80px)'
                }}></div>
            </section>

            {/* 2. Shop By Category */}
            <section style={{ margin: '40px 0' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '20px', letterSpacing: '-0.5px' }}>
                    Shop By Category
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '16px'
                }}>
                    <motion.div
                        whileHover={{ y: -6 }}
                        onClick={() => setActiveCategory('all')}
                        style={{
                            background: '#f8fafc',
                            padding: '20px 12px',
                            borderRadius: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: activeCategory === 'all' ? '2px solid var(--primary)' : '2px solid transparent'
                        }}
                    >
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛒</div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--secondary)' }}>All</div>
                    </motion.div>
                    {categories.map(cat => (
                        <motion.div
                            key={cat.id}
                            whileHover={{ y: -6 }}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{
                                background: cat.bg,
                                padding: '20px 12px',
                                borderRadius: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: activeCategory === cat.id ? '2px solid var(--primary)' : '2px solid transparent'
                            }}
                        >
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--secondary)' }}>{cat.name}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 4. Our All Products */}
            <section style={{ margin: '40px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '1000', color: 'var(--secondary)', letterSpacing: '-0.5px' }}>
                        Our All Products
                    </h2>
                    <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                        {/* Price Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <div
                                onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                                style={{
                                    padding: '8px 16px',
                                    border: `1px solid ${sortBy === 'low' || sortBy === 'high' ? 'var(--primary)' : 'var(--border-light)'}`,
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    background: sortBy === 'low' || sortBy === 'high' ? '#f0fdf4' : 'white',
                                    color: sortBy === 'low' || sortBy === 'high' ? 'var(--primary)' : 'inherit',
                                    transition: 'all 0.2s ease'
                                }}>
                                Price {sortBy === 'low' ? '(Low)' : sortBy === 'high' ? '(High)' : ''}
                                <ChevronDown size={14} style={{ transform: openDropdown === 'price' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </div>
                            {openDropdown === 'price' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '110%',
                                    left: 0,
                                    background: 'white',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '12px',
                                    boxShadow: 'var(--shadow-lg)',
                                    zIndex: 100,
                                    minWidth: '160px',
                                    overflow: 'hidden',
                                    padding: '4px'
                                }}>
                                    {[
                                        { label: 'Default', value: 'default' },
                                        { label: 'Price: Low to High', value: 'low' },
                                        { label: 'Price: High to Low', value: 'high' }
                                    ].map(opt => (
                                        <div
                                            key={opt.value}
                                            onClick={() => handleSort(opt.value)}
                                            style={{
                                                padding: '10px 12px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                background: sortBy === opt.value ? '#f0fdf4' : 'transparent',
                                                color: sortBy === opt.value ? 'var(--primary)' : 'inherit',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                            onMouseLeave={(e) => e.target.style.background = sortBy === opt.value ? '#f0fdf4' : 'transparent'}
                                        >
                                            {opt.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Review Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <div
                                onClick={() => setOpenDropdown(openDropdown === 'review' ? null : 'review')}
                                style={{
                                    padding: '8px 16px',
                                    border: `1px solid ${sortBy === 'review' ? 'var(--primary)' : 'var(--border-light)'}`,
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    background: sortBy === 'review' ? '#f0fdf4' : 'white',
                                    color: sortBy === 'review' ? 'var(--primary)' : 'inherit',
                                    transition: 'all 0.2s ease'
                                }}>
                                Review {sortBy === 'review' ? '(Top)' : ''}
                                <ChevronDown size={14} style={{ transform: openDropdown === 'review' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </div>
                            {openDropdown === 'review' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '110%',
                                    left: 0,
                                    background: 'white',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '12px',
                                    boxShadow: 'var(--shadow-lg)',
                                    zIndex: 100,
                                    minWidth: '160px',
                                    overflow: 'hidden',
                                    padding: '4px'
                                }}>
                                    {[
                                        { label: 'Default', value: 'default' },
                                        { label: 'Top Rated', value: 'review' }
                                    ].map(opt => (
                                        <div
                                            key={opt.value}
                                            onClick={() => handleSort(opt.value)}
                                            style={{
                                                padding: '10px 12px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                background: sortBy === opt.value ? '#f0fdf4' : 'transparent',
                                                color: sortBy === opt.value ? 'var(--primary)' : 'inherit',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                            onMouseLeave={(e) => e.target.style.background = sortBy === opt.value ? '#f0fdf4' : 'transparent'}
                                        >
                                            {opt.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Offer Toggle (Single Button) */}
                        <div
                            onClick={() => {
                                setShowOnlyOffers(!showOnlyOffers);
                                setOpenDropdown(null);
                            }}
                            style={{
                                padding: '8px 16px',
                                border: `1px solid ${showOnlyOffers ? 'var(--primary)' : 'var(--border-light)'}`,
                                borderRadius: '10px',
                                fontSize: '13px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                background: showOnlyOffers ? '#f0fdf4' : 'white',
                                color: showOnlyOffers ? 'var(--primary)' : 'inherit',
                                transition: 'all 0.2s ease'
                            }}>
                            Offer
                            <ChevronDown size={14} style={{ opacity: 0.3 }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {activeCategory === 'all' ? (
                        categories.map(cat => {
                            const categoryProducts = filteredProducts.filter(p =>
                                p.id.startsWith(cat.id.charAt(0)) ||
                                (p.category && p.category.toLowerCase() === cat.id.toLowerCase())
                            );

                            if (categoryProducts.length === 0) return null;

                            return (
                                <div key={cat.id}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '24px' }}>{cat.icon}</span>
                                        <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--secondary)' }}>{cat.name}</h3>
                                        <div style={{ flex: 1, height: '1px', background: 'var(--border-light)', opacity: 0.5 }}></div>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>{categoryProducts.length} Items</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                                        {categoryProducts.map(item => (
                                            <ProductCard
                                                key={item.id}
                                                product={item}
                                                addToCart={addToCart}
                                                onWishlist={onWishlist}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                            {filteredProducts.map(item => (
                                <ProductCard
                                    key={item.id}
                                    product={item}
                                    addToCart={addToCart}
                                    onWishlist={onWishlist}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {filteredProducts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        No products found matching your criteria.
                    </div>
                )}
            </section>
        </motion.div>
    );
};

export default Home;
