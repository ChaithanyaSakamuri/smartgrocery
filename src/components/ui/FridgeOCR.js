import React, { useState } from 'react';
import { CATEGORIES } from '../../data/products';

const FridgeOCR = ({ addToCart }) => {
    const [scanning, setScanning] = useState(false);
    const [detectedItems, setDetectedItems] = useState([]);

    const simulateScan = () => {
        setScanning(true);
        setTimeout(() => {
            // Randomly pick a few items from categories
            const allProducts = [...Object.values(CATEGORIES).flat()];
            const subset = allProducts.sort(() => 0.5 - Math.random()).slice(0, 3);
            setDetectedItems(subset);
            setScanning(false);
        }, 2000);
    };

    return (
        <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '20px', borderRadius: '20px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '13px', fontWeight: '500' }}>Scan fridge to find missing items.</p>
                <button
                    onClick={simulateScan}
                    disabled={scanning}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'white', color: '#059669', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}
                >
                    {scanning ? '...' : 'Scan'}
                </button>
            </div>

            {scanning && (
                <div style={{ height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div style={{ width: '100%', height: '2px', background: 'white', position: 'absolute', top: 0, boxShadow: '0 0 10px white', animation: 'scan 2s linear infinite' }}></div>
                    <span style={{ fontSize: '32px' }}>🧊</span>
                </div>
            )}

            {!scanning && detectedItems.length > 0 ? (
                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                    <p style={{ fontWeight: '800', opacity: 0.9, marginBottom: '12px', fontSize: '12px' }}>✅ Found {detectedItems.length} items:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {detectedItems.map(item => (
                            <div key={item.id} style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                </div>
                                <h5 style={{ margin: 0, fontSize: '13px', flex: 1, color: 'white' }}>{item.name}</h5>
                                <button
                                    onClick={() => addToCart(item)}
                                    style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', border: 'none', background: 'white', color: '#059669', fontWeight: '800', cursor: 'pointer' }}
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : !scanning && (
                <div style={{ height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)' }}>
                    <span style={{ opacity: 0.7, fontSize: '13px', fontWeight: '600' }}>No scan data yet</span>
                </div>
            )}

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
            `}</style>
        </div>
    );
};

export default FridgeOCR;
