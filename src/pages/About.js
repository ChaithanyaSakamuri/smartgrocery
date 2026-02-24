import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Truck, ShieldCheck, Heart, Sparkles, Users, ArrowRight } from 'lucide-react';

const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                minHeight: 'calc(100vh - 120px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
        >
            <div style={{
                display: 'flex',
                background: 'white',
                borderRadius: '32px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-light)',
                maxWidth: '1100px',
                width: '100%',
                maxHeight: '650px'
            }}>
                {/* Visual Side */}
                <div style={{
                    flex: '1',
                    padding: '40px',
                    background: 'linear-gradient(rgba(240, 253, 244, 0.95), rgba(240, 253, 244, 0.95)), url("https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80")',
                    backgroundSize: 'cover',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', marginBottom: '12px' }}>Our Mission</span>
                    <h1 style={{ fontSize: '40px', fontWeight: '900', lineHeight: '1.1', marginBottom: '16px', letterSpacing: '-1.5px', color: 'var(--secondary)' }}>
                        Better Food, <br />
                        <span style={{ color: 'var(--primary)' }}>Better Mood.</span>
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '600', lineHeight: '1.5' }}>
                        Freshly provides access to handpicked, local organic groceries delivered within hours.
                    </p>
                </div>

                {/* Content Side */}
                <div style={{ flex: '1.5', padding: '40px', background: 'white', overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--secondary)', marginBottom: '24px' }}>Our Core Values</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                        {[
                            { icon: <Leaf size={20} />, title: '100% Organic', color: 'var(--primary)' },
                            { icon: <Truck size={20} />, title: 'Farm to Fork', color: '#eab308' },
                            { icon: <ShieldCheck size={20} />, title: 'Quality First', color: '#6366f1' },
                            { icon: <Heart size={20} />, title: 'User Focused', color: '#f43f5e' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                                <div style={{ color: item.color, marginBottom: '8px' }}>{item.icon}</div>
                                <h4 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--secondary)' }}>{item.title}</h4>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '24px', background: '#f0fdf4', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                        <p style={{ fontSize: '14px', fontStyle: 'italic', fontWeight: '650', color: 'var(--secondary)', margin: 0 }}>
                            "Freshly changed how we think about food. It's not just a grocery app; it's a partner in our family's wellness journey."
                        </p>
                        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '11px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SJ</div>
                            <span style={{ fontSize: '12px', fontWeight: '800' }}>Sarah Jenkins</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default About;

