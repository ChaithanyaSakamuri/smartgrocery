import React, { useState } from 'react';

const CouponSystem = ({ onApplyCoupon, theme = 'light' }) => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const isDark = theme === 'dark';

    const handleApply = () => {
        if (code.toUpperCase() === 'FRESH20') {
            onApplyCoupon(20); // 20% off
            setMessage('Coupon Applied! You saved 20%');
        } else {
            setMessage('Invalid Coupon Code');
        }
    };

    return (
        <div style={{
            padding: '16px',
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f0fdf4',
            borderRadius: '12px',
            border: isDark ? '1px dashed rgba(255,255,255,0.1)' : '1px dashed #10b981',
            marginTop: '16px'
        }}>
            <h4 style={{ margin: '0 0 10px', color: isDark ? 'white' : '#065f46', fontSize: '13px', fontWeight: '800' }}>
                🏷️ Have a Coupon?
            </h4>
            <div style={{ display: 'flex', gap: '6px' }}>
                <input
                    placeholder="Enter Code (e.g. FRESH20)"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '7px',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #d1fae5',
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'white',
                        color: isDark ? 'white' : 'var(--secondary)',
                        fontSize: '12px',
                        outline: 'none'
                    }}
                />
                <button
                    onClick={handleApply}
                    style={{
                        padding: '8px 16px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '7px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    Apply
                </button>
            </div>
            {message && <p style={{ margin: '6px 0 0', fontSize: '11px', fontWeight: '700', color: message.includes('Applied') ? '#10b981' : '#ef4444' }}>{message}</p>}
        </div>
    );
};

export default CouponSystem;
