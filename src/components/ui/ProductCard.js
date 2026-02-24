import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, addToCart, onWishlist }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, boxShadow: 'var(--shadow-md)' }}
            style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                padding: '12px'
            }}
        >
            {/* Image Section */}
            <div
                onClick={() => navigate(`/product/${product.id}`)}
                style={{
                    position: 'relative',
                    height: '160px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                }}
            >
                <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    src={product.image}
                    alt={product.name}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
                <motion.button
                    whileHover={{ scale: 1.1, background: 'var(--primary-light)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onWishlist(product); }}
                    style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8'
                    }}
                >
                    <Heart size={18} />
                </motion.button>
            </div>

            {/* Content Section */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    {product.category || 'Grocery'}
                </div>
                <h4
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{
                        margin: '0 0 6px 0',
                        fontSize: '14px',
                        color: 'var(--text-main)',
                        fontWeight: '800',
                        lineHeight: '1.3',
                        height: '36px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {product.name}
                </h4>

                {/* Star Rating Mockup */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '12px' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} style={{ color: '#fbbf24', fontSize: '10px' }}>★</span>
                    ))}
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '4px' }}>(4.5)</span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontWeight: '900', fontSize: '16px', color: 'var(--primary)' }}>₹{product.price}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ₹{(product.price * 1.2).toFixed(0)}
                        </span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05, background: 'var(--primary-dark)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: '800',
                            fontSize: '12px'
                        }}
                    >
                        <Plus size={14} strokeWidth={3} />
                        Add
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;

