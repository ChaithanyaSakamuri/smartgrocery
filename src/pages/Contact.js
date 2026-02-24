import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const Contact = () => {
    const { addNotification } = useNotifications();
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('General Inquiry');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addNotification({
            type: 'contact',
            title: 'New Contact Message',
            from: name,
            email,
            subject,
            message,
        });
        setSubmitted(true);
        setName(''); setEmail(''); setSubject('General Inquiry'); setMessage('');
    };

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
                maxWidth: '1000px',
                width: '100%',
                maxHeight: '600px'
            }}>
                {/* Info Side */}
                <div style={{
                    flex: '1',
                    padding: '40px',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <h2 style={{ fontSize: '32px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '16px', lineHeight: '1.1' }}>
                        Let's start a <br /><span style={{ color: 'var(--primary)' }}>conversation.</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px', fontWeight: '600', lineHeight: '1.4' }}>
                        Whether you have a question about features or organic sourcing, our team is ready to help.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { icon: <Mail size={18} />, text: 'hello@freshly.com', color: '#6366f1' },
                            { icon: <Phone size={18} />, text: '+1 (234) 567-890', color: 'var(--primary)' },
                            { icon: <MapPin size={18} />, text: '123 Organic Lane, Bangalore', color: '#f59e0b' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.icon}
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--secondary)' }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Side */}
                <div style={{ flex: '1.2', padding: '40px', background: 'white', overflowY: 'auto' }}>
                    <AnimatePresence mode="wait">
                        {submitted ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ textAlign: 'center', padding: '40px 0' }}
                            >
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0fdf4', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <CheckCircle2 size={28} />
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: '1000', color: 'var(--secondary)', marginBottom: '12px' }}>Message Sent!</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>We'll get back to you shortly.</p>
                                <button onClick={() => setSubmitted(false)} style={{ padding: '12px 32px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer' }}>Send Another</button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '800' }}>Full Name</label>
                                        <input required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: '#f8fafc', fontSize: '13px' }} placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '800' }}>Email</label>
                                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: '#f8fafc', fontSize: '13px' }} placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '800' }}>Subject</label>
                                    <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: '#f8fafc', fontSize: '13px' }}>
                                        <option>General Inquiry</option>
                                        <option>Order Status</option>
                                        <option>Feedback</option>
                                        <option>Partnership</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '800' }}>Message</label>
                                    <textarea rows="3" required value={message} onChange={e => setMessage(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-light)', background: '#f8fafc', fontSize: '13px', resize: 'none' }} placeholder="How can we help?" />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    style={{ padding: '14px', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '1000', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}
                                >
                                    <Send size={16} /> Send Message
                                </motion.button>
                            </form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default Contact;
