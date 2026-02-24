import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../../data/products';

const SupportChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi there! 👋 How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const findProduct = (searchTerm) => {
        const allProducts = Object.values(CATEGORIES).flat();
        return allProducts.find(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    const getRandomDefault = () => {
        const defaults = [
            "That's interesting! Let me look into that for you.",
            "I'm not quite sure about that, but I can help you with orders or product info!",
            "I'm here to help! Could you tell me more?",
            "Freshness is our priority! Is there a specific item you're looking for?",
            "I'm still learning, but I'll do my best to assist you!"
        ];
        return defaults[Math.floor(Math.random() * defaults.length)];
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const currentInput = input;
        const userMsg = { text: currentInput, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Randomized typing delay for more natural feel
        const delay = Math.floor(Math.random() * 800) + 700;

        setTimeout(() => {
            let botText = getRandomDefault();
            const lowerInput = currentInput.toLowerCase();

            // Product lookup
            const product = findProduct(lowerInput.replace('is', '').replace('available', '').replace('price of', '').replace('how much is', '').trim());

            if (product && (lowerInput.includes('available') || lowerInput.includes('have') || lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes(product.name.toLowerCase()))) {
                botText = `Checking... Yes, we have ${product.name}! It's currently ₹${product.price} per unit. 🛒`;
                if (product.stock < 5) botText += " Hurry, we're almost out of stock!";
            }
            else if (lowerInput.includes('order')) botText = "You can track your order in the 'My Account' section! 🚚";
            else if (lowerInput.includes('delivery')) botText = "Standard delivery takes 30-45 minutes. 🏎️";
            else if (lowerInput.includes('refund') || lowerInput.includes('cancel')) botText = "Orders can be cancelled within 5 minutes of placing them. 💸";
            else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) botText = "Hello! Looking for some fresh groceries today? 🍎";
            else if (lowerInput.includes('thank')) botText = "You're very welcome! Happy shopping! 😊";

            setMessages(prev => [...prev, { text: botText, isBot: true }]);
        }, delay);
    };

    return (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 3000 }}>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#10b981', color: 'white', border: 'none', fontSize: '30px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(16,185,129,0.3)', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    💬
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{ width: '360px', height: '500px', background: 'white', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideUp 0.3s ease' }}>
                    {/* Header */}
                    <div style={{ background: '#10b981', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '18px' }}>Support Chat</h4>
                            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>We're online!</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ alignSelf: m.isBot ? 'flex-start' : 'flex-end', maxWidth: '80%', padding: '12px 16px', borderRadius: m.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px', background: m.isBot ? 'white' : '#10b981', color: m.isBot ? '#1e293b' : 'white', fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: m.isBot ? '1px solid #f1f5f9' : 'none' }}>
                                {m.text}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                        />
                        <button onClick={handleSend} style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer' }}>
                            ➤
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SupportChatbot;
