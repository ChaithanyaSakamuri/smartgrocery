import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    ShoppingBag,
    User,
    Search,
    Menu,
    X,
    Home as HomeIcon,
    Info,
    Phone,
    LogOut,
    Package,
    Truck,
    Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ cartCount, setShowWishlist, searchTerm, setSearchTerm }) => {
    const { user, role, logout } = useAuth();
    const [showAccount, setShowAccount] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const isPathActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, children }) => (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '14px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    transition: 'all 0.2s ease',
                    background: isPathActive(to) ? 'var(--primary-light)' : 'transparent',
                    color: isPathActive(to) ? 'var(--primary)' : 'var(--text-muted)',
                }}
            >
                {children}
            </motion.div>
        </Link>
    );

    if (role === 'admin' && location.pathname.startsWith('/admin')) {
        return (
            <header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    background: 'white',
                    height: '72px',
                    boxShadow: 'var(--shadow-md)',
                    borderBottom: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 24px',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/admin')}>
                        <span style={{ fontSize: '20px', fontWeight: '1000', color: 'var(--primary)', letterSpacing: '-1px' }}>Freshly</span>
                        <span style={{ fontSize: '10px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '1px 6px', borderRadius: '4px', fontWeight: '800' }}>ADMIN</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '8px 20px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: '800',
                                fontSize: '14px',
                                boxShadow: '0 8px 16px rgba(239, 68, 68, 0.15)'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'white',
                height: scrolled ? '72px' : '84px',
                boxShadow: scrolled ? 'var(--shadow-lg)' : 'none',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <div style={{
                width: '100%',
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ flex: '1 1 0', display: 'flex', justifyContent: 'flex-start' }}>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={() => navigate('/home')}
                    >
                        <span style={{ fontSize: '24px', fontWeight: '1000', color: 'var(--primary)', letterSpacing: '-1.5px' }}>Freshly</span>
                    </motion.div>
                </div>

                {/* 2. Middle Section: Navigation */}
                <div className="desktop-only-flex" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: '0 0 auto'
                }}>
                    <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <NavLink to="/home">Home</NavLink>
                        <NavLink to="/about">About</NavLink>
                        <NavLink to="/contact">Contact</NavLink>
                        {role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
                        {role === 'vendor' && user?.vendorApproved && <NavLink to="/vendor">Vendor</NavLink>}
                    </nav>
                </div>

                {/* 3. Right Section: Search & Actions */}
                <div style={{ flex: '1 1 0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>

                    {/* Compact Search Bar */}
                    <div className="desktop-only" style={{ position: 'relative', width: '220px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{
                                background: '#f1f5f9',
                                border: '1px solid transparent',
                                outline: 'none',
                                color: 'var(--text-main)',
                                padding: '10px 12px 10px 38px',
                                borderRadius: '14px',
                                width: '100%',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Wishlist */}
                        <motion.button
                            whileHover={{ scale: 1.1, background: 'var(--primary-light)' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowWishlist(true)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                padding: '10px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Heart size={22} color="var(--text-main)" />
                        </motion.button>

                        {/* Cart */}
                        <motion.div
                            whileHover={{ scale: 1.1, background: 'var(--primary-light)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/cart')}
                            style={{
                                position: 'relative',
                                cursor: 'pointer',
                                padding: '10px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            <ShoppingBag size={22} color="var(--text-main)" />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    background: 'var(--accent)',
                                    color: 'white',
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 8px rgba(249, 115, 22, 0.3)'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </motion.div>

                        {/* User Account / Login */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            {user ? (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setShowAccount(!showAccount)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '4px 12px 4px 6px',
                                        background: 'var(--accent)',
                                        borderRadius: '30px',
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 16px rgba(249, 115, 22, 0.2)'
                                    }}
                                >
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {user?.photoURL ? <img src={user.photoURL} alt="P" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={18} color="var(--accent)" />}
                                    </div>
                                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'white' }}>{user.displayName?.split(' ')[0] || 'Me'}</span>
                                </motion.div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0, 77, 44, 0.2)' }}
                                    onClick={() => navigate('/login')}
                                    style={{
                                        padding: '10px 24px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '14px',
                                        fontWeight: '900',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Sign Up
                                </motion.button>
                            )}

                            <AnimatePresence>
                                {showAccount && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        style={{
                                            position: 'absolute',
                                            top: '50px',
                                            right: '0',
                                            zIndex: 1000,
                                            minWidth: '220px',
                                            background: 'white',
                                            borderRadius: '20px',
                                            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                                            padding: '12px',
                                            border: '1px solid var(--border-light)'
                                        }}
                                    >
                                        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', marginBottom: '8px' }}>
                                            <div style={{ fontWeight: '1000', color: 'var(--text-main)', fontSize: '15px' }}>{user?.displayName || 'My Account'}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{user?.email}</div>
                                        </div>
                                        <DropdownItem icon={Package} label="My Orders" onClick={() => { navigate('/account'); setShowAccount(false); }} />
                                        <DropdownItem icon={Truck} label="Track Order" onClick={() => { navigate('/account?tab=tracking'); setShowAccount(false); }} />
                                        <DropdownItem icon={Heart} label="Wishlist" onClick={() => { setShowWishlist(true); setShowAccount(false); }} />
                                        <div style={{ margin: '8px 0', borderTop: '1px solid var(--border-light)' }} />
                                        <DropdownItem icon={LogOut} label="Logout" color="#ef4444" onClick={() => { handleLogout(); setShowAccount(false); }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    .desktop-only-flex { display: flex !important; }
                    .desktop-only { display: block !important; }
                }
                @media (max-width: 767px) {
                    .desktop-only-flex, .desktop-only { display: none !important; }
                }
            `}</style>
        </header>
    );

};

const DropdownItem = ({ icon: Icon, label, onClick, color }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: '800',
            fontSize: '14px',
            color: color || 'var(--text-main)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
        <Icon size={18} />
        <span>{label}</span>
    </div>
);

export default Header;
