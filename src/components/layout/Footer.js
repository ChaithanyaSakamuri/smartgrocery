import React from 'react';
import { motion } from 'framer-motion';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ArrowRight
} from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '80px 0 40px',
            marginTop: 'auto'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 24px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '40px',
                    marginBottom: '60px'
                }}>
                    {/* Brand Info */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <div style={{ fontSize: '32px', fontWeight: '1000', marginBottom: '24px', letterSpacing: '-1.5px' }}>
                            Freshly
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontSize: '15px', marginBottom: '32px' }}>
                            Your one-stop destination for fresh groceries and daily essentials delivered right to your doorstep.
                        </p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                <motion.a
                                    key={idx}
                                    href="#"
                                    whileHover={{ y: -5, background: 'var(--accent)' }}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Department</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['Vegetables', 'Fruits', 'Dairy & Milk', 'Meat & Seafood', 'Grains & Pasta'].map(link => (
                                <li key={link}>
                                    <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Quick Link</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['About Us', 'Contact Us', 'Our Services', 'Recent News', 'Privacy Policy'].map(link => (
                                <li key={link}>
                                    <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>Contact</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ color: 'var(--accent)' }}><MapPin size={20} /></div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>
                                    123 Grocery Lane, Fresh Market, <br />
                                    Mumbai, Maharashtra 400001
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ color: 'var(--accent)' }}><Phone size={20} /></div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>+91 98765 43210</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ color: 'var(--accent)' }}><Mail size={20} /></div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>hello@freshly.com</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    paddingTop: '40px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                        © 2026 Freshly. All Rights Reserved. Designed by Antigravity.
                    </div>
                    <div style={{ display: 'flex', gap: '12px', opacity: 0.6 }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '20px' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '20px' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '20px' }} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
