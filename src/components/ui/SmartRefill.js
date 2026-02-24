import React from 'react';
import { CATEGORIES } from '../../data/products';

const SmartRefill = ({ addToCart }) => {
    // Predictive logic based on "last bought" (mocked)
    const refillItems = [
        { ...CATEGORIES.dairy[0], daysLeft: 2 },
        { ...CATEGORIES.vegetables[2], daysLeft: 1 }
    ];

    return (
        <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '20px', borderRadius: '20px', color: 'white' }}>
            <p style={{ margin: '0 0 16px', opacity: 0.9, fontWeight: '600', fontSize: '13px' }}>Predicted items running low in your pantry.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {refillItems.map(item => (
                    <div key={item.id} style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'white' }}>{item.name}</h4>
                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#fee2e2', fontWeight: '800' }}>Refill in {item.daysLeft}d</p>
                        </div>
                        <button
                            onClick={() => addToCart(item)}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: 'white', color: '#d97706', fontWeight: '800', cursor: 'pointer', fontSize: '11px' }}
                        >
                            Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartRefill;
