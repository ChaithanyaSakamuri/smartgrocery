import React, { useState } from 'react';
import { CATEGORIES } from '../../data/products';

const SmartMealSuggestions = ({ cartItems, addToCart }) => {
    const [suggestion, setSuggestion] = useState(null);
    const [interest, setInterest] = useState('balanced');

    const generateSuggestion = () => {
        let possibleMatches = [];

        switch (interest) {
            case 'low-carb':
                // mostly non-starchy vegetables
                possibleMatches = CATEGORIES.vegetables;
                break;
            case 'high-protein':
                // dairy products are generally protein rich in this data set
                possibleMatches = CATEGORIES.dairy;
                break;
            case 'high-carb':
                // fruits tend to be carbohydrate heavy
                possibleMatches = CATEGORIES.fruits;
                break;
            default: // balanced or unknown
                const hasVeg = cartItems.some(i => i.category === 'vegetables');
                const hasDairy = cartItems.some(i => i.category === 'dairy');

                if (hasVeg && !hasDairy) {
                    possibleMatches = CATEGORIES.dairy;
                } else if (hasVeg && hasDairy) {
                    possibleMatches = CATEGORIES.fruits;
                } else {
                    possibleMatches = CATEGORIES.vegetables;
                }
                break;
        }

        const randomItem = possibleMatches[Math.floor(Math.random() * possibleMatches.length)];
        setSuggestion(randomItem);
    };

    // Use a default suggestion if none is set
    const activeSuggestion = suggestion || CATEGORIES.vegetables[0];

    return (
        <div style={{ padding: '20px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '20px', color: 'white' }}>
            <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, fontWeight: '500' }}>
                    {cartItems.length > 0
                        ? "Based on your cart, we've found the perfect addition!"
                        : "Start adding items to your cart for smart AI meal ideas!"}
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <select
                    value={interest}
                    onChange={e => setInterest(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', outline: 'none' }}
                >
                    <option style={{ color: 'black' }} value="balanced">Balanced</option>
                    <option style={{ color: 'black' }} value="high-protein">High Protein</option>
                    <option style={{ color: 'black' }} value="low-carb">Low Carb</option>
                    <option style={{ color: 'black' }} value="high-carb">High Carb</option>
                </select>
                <button
                    onClick={generateSuggestion}
                    style={{ flex: 1, padding: '8px 16px', background: 'white', color: '#4f46e5', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}
                >
                    Refresh
                </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'white', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={activeSuggestion.image} alt={activeSuggestion.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '14px' }}>{activeSuggestion.name}</h4>
                    <p style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: '900' }}>₹{activeSuggestion.price}</p>
                </div>
                <button
                    onClick={() => addToCart(activeSuggestion)}
                    style={{ padding: '8px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '11px' }}
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default SmartMealSuggestions;
