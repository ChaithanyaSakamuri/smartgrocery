import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../../data/products';

// ─── Build a flat product list for context ───────────────────────────────────
const ALL_PRODUCTS = Object.entries(CATEGORIES).flatMap(([cat, products]) =>
    products.map(p => ({ ...p, category: cat }))
);

// ─── Gemini API Configuration ─────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─── System prompt with full product catalog ──────────────────────────────────
const buildSystemPrompt = () => {
    const productList = ALL_PRODUCTS.map(p =>
        `- ${p.name} (${p.category}): ₹${p.price}, stock: ${p.stock} units`
    ).join('\n');

    return `You are "FreshBot", the friendly AI assistant for Smart Grocery Store — an online grocery delivery platform.

Your personality: helpful, warm, concise, and knowledgeable about grocery products. Always respond in 2-4 short sentences unless a list is genuinely needed. Use emojis sparingly (1-2 max per message).

You can help customers with:
1. Product availability, prices, and stock info
2. Order tracking (tell them to visit "My Orders" in their account)
3. Delivery info (30–45 minutes standard delivery)
4. Cancellation/refund policy (cancel within 5 minutes of placing order)
5. General grocery questions and cooking tips

CURRENT PRODUCT CATALOG:
${productList}

Rules:
- If asked about a product in the catalog, give accurate price and stock info
- If stock is below 5, mention it's almost out of stock
- If a product is NOT in the catalog, say you don't carry it currently
- Never make up prices or information not in the catalog
- For order/payment/account issues you cannot resolve, ask them to email support@smartgrocery.com
- Keep responses SHORT and friendly
- Respond ONLY in English`;
};

// ─── Call Gemini API ──────────────────────────────────────────────────────────
const callGemini = async (conversationHistory, userMessage) => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        throw new Error('NO_API_KEY');
    }

    const systemInstruction = buildSystemPrompt();

    // Build contents array from conversation history
    const contents = conversationHistory
        .filter(m => !m.isBot || m.text !== "Hi there! 👋 How can I help you today?")
        .map(m => ({
            role: m.isBot ? 'model' : 'user',
            parts: [{ text: m.text }]
        }));

    // Add current user message
    contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: {
                parts: [{ text: systemInstruction }]
            },
            contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 256,
                topP: 0.9,
            },
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
            ]
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that. Please try again!";
};

// ─── Local fallback (backend product search + rule-based) ────────────────────
const localFallback = async (input) => {
    const lower = input.toLowerCase();

    // Try backend API product search first
    try {
        const searchTerm = lower
            .replace(/price of|how much is|is|available|do you have|cost of/gi, '')
            .trim();
        if (searchTerm.length > 2) {
            const res = await fetch(`http://localhost:5000/api/products?search=${encodeURIComponent(searchTerm)}`);
            if (res.ok) {
                const products = await res.json();
                if (products.length > 0) {
                    const p = products[0];
                    let reply = `Yes, we have **${p.name}**! It's ₹${p.price} per unit. 🛒`;
                    if (p.stock < 5) reply += ` ⚠️ Hurry — only ${p.stock} left!`;
                    return reply;
                }
            }
        }
    } catch (_) { /* backend not running, use local data */ }

    // Local product search from static data
    const cleanInput = lower.replace(/price of|how much is|is|available|do you have|cost of/gi, '').trim();
    const product = ALL_PRODUCTS.find(p => p.name.toLowerCase().includes(cleanInput));
    if (product && (lower.includes('available') || lower.includes('have') || lower.includes('price') || lower.includes('cost') || lower.includes(product.name.toLowerCase()))) {
        let reply = `Yes, we carry **${product.name}** for ₹${product.price}! 🛒`;
        if (product.stock < 5) reply += ` Only ${product.stock} left — grab it soon!`;
        return reply;
    }

    // Rule-based fallbacks
    if (lower.includes('order')) return "You can track your order in the **My Orders** section of your account! 🚚";
    if (lower.includes('delivery') || lower.includes('time')) return "Standard delivery takes **30–45 minutes**. 🏎️";
    if (lower.includes('refund') || lower.includes('cancel')) return "Orders can be cancelled within **5 minutes** of placing them. For refunds, contact support@smartgrocery.com 💸";
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return "Hello! 👋 Looking for some fresh groceries today?";
    if (lower.includes('thank')) return "You're very welcome! Happy shopping! 😊";
    if (lower.includes('payment') || lower.includes('pay')) return "We accept UPI, debit/credit cards, net banking, and cash on delivery! 💳";

    return "I'm here to help! You can ask me about product prices, availability, delivery times, or orders. 😊";
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SupportChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi there! 👋 I'm FreshBot, your Smart Grocery assistant. Ask me about any product, price, delivery, or order!", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
    }, [isOpen]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isTyping) return;

        const userMsg = { text: trimmed, isBot: false };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            let botText;
            // Try Gemini AI first
            botText = await callGemini(
                messages, // history (excluding the new user message)
                trimmed
            );
            setMessages(prev => [...prev, { text: botText, isBot: true }]);
        } catch (err) {
            // If no API key, try local fallback
            try {
                const fallbackText = await localFallback(trimmed);
                const note = (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE')
                    ? '' : '';
                setMessages(prev => [...prev, { text: fallbackText + note, isBot: true }]);
            } catch (_) {
                setMessages(prev => [...prev, {
                    text: "Sorry, I'm having trouble right now. Please try again in a moment! 🙏",
                    isBot: true
                }]);
            }
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickReplies = ["Product prices", "Delivery time", "Cancel order", "Payment options"];

    return (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 3000, fontFamily: "'Inter', sans-serif" }}>

            {/* ── Toggle Button ── */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    title="Chat with FreshBot"
                    style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white', border: 'none', fontSize: '28px', cursor: 'pointer',
                        boxShadow: '0 8px 32px rgba(16,185,129,0.45)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(16,185,129,0.55)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(16,185,129,0.45)'; }}
                >
                    💬
                </button>
            )}

            {/* ── Chat Window ── */}
            {isOpen && (
                <div style={{
                    width: '380px', height: '540px',
                    background: 'white', borderRadius: '20px',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    animation: 'chatSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)'
                }}>

                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        padding: '16px 20px', color: 'white',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '20px'
                            }}>🤖</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '0.3px' }}>FreshBot</div>
                                <div style={{ fontSize: '11px', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{
                                        width: '6px', height: '6px', borderRadius: '50%',
                                        background: '#a7f3d0', display: 'inline-block'
                                    }}></span>
                                    AI-powered • Always Online
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'rgba(255,255,255,0.15)', border: 'none',
                                color: 'white', width: '32px', height: '32px',
                                borderRadius: '8px', cursor: 'pointer', fontSize: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        >✕</button>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1, padding: '16px', overflowY: 'auto',
                        display: 'flex', flexDirection: 'column', gap: '10px',
                        background: '#f8fffe'
                    }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: m.isBot ? 'flex-start' : 'flex-end',
                                alignItems: 'flex-end', gap: '8px'
                            }}>
                                {m.isBot && (
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '13px', flexShrink: 0
                                    }}>🤖</div>
                                )}
                                <div style={{
                                    maxWidth: '78%',
                                    padding: '10px 14px',
                                    borderRadius: m.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                                    background: m.isBot ? 'white' : 'linear-gradient(135deg, #10b981, #059669)',
                                    color: m.isBot ? '#1e293b' : 'white',
                                    fontSize: '13.5px', lineHeight: '1.5',
                                    boxShadow: m.isBot ? '0 2px 8px rgba(0,0,0,0.07)' : '0 4px 14px rgba(16,185,129,0.3)',
                                    border: m.isBot ? '1px solid #e8fdf5' : 'none',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {/* Render bold markdown(**text**) */}
                                    {m.text.split(/\*\*(.*?)\*\*/g).map((part, pi) =>
                                        pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '13px', flexShrink: 0
                                }}>🤖</div>
                                <div style={{
                                    padding: '12px 16px', borderRadius: '16px 16px 16px 4px',
                                    background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                    border: '1px solid #e8fdf5', display: 'flex', gap: '5px'
                                }}>
                                    {[0, 1, 2].map(d => (
                                        <span key={d} style={{
                                            width: '7px', height: '7px', borderRadius: '50%',
                                            background: '#10b981', display: 'inline-block',
                                            animation: `dotBounce 1.2s ${d * 0.2}s ease-in-out infinite`
                                        }}></span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {messages.length <= 1 && (
                        <div style={{
                            padding: '8px 16px', display: 'flex', gap: '6px',
                            flexWrap: 'wrap', borderTop: '1px solid #f0fdf8'
                        }}>
                            {quickReplies.map(q => (
                                <button
                                    key={q}
                                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                                    style={{
                                        padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                                        background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0',
                                        cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit'
                                    }}
                                    onMouseOver={e => { e.currentTarget.style.background = '#d1fae5'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = '#ecfdf5'; }}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div style={{
                        padding: '14px 16px', borderTop: '1px solid #f0fdf8',
                        display: 'flex', gap: '10px', alignItems: 'center',
                        background: 'white'
                    }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about products, orders, delivery..."
                            disabled={isTyping}
                            style={{
                                flex: 1, padding: '10px 14px',
                                borderRadius: '12px', fontSize: '13.5px',
                                border: '1.5px solid #d1fae5', outline: 'none',
                                fontFamily: 'inherit', transition: 'border-color 0.2s',
                                background: isTyping ? '#f9fafb' : 'white',
                                color: '#1e293b'
                            }}
                            onFocus={e => e.target.style.borderColor = '#10b981'}
                            onBlur={e => e.target.style.borderColor = '#d1fae5'}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isTyping || !input.trim()}
                            style={{
                                width: '42px', height: '42px', borderRadius: '12px',
                                border: 'none',
                                background: (isTyping || !input.trim())
                                    ? '#d1fae5'
                                    : 'linear-gradient(135deg, #10b981, #059669)',
                                color: (isTyping || !input.trim()) ? '#6ee7b7' : 'white',
                                cursor: (isTyping || !input.trim()) ? 'not-allowed' : 'pointer',
                                fontSize: '18px', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0
                            }}
                        >➤</button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes chatSlideUp {
                    from { transform: translateY(24px) scale(0.95); opacity: 0; }
                    to   { transform: translateY(0)     scale(1);    opacity: 1; }
                }
                @keyframes dotBounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
                    40%           { transform: translateY(-6px); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SupportChatbot;
