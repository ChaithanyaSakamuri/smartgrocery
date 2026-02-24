import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Lock,
    ArrowRight,
    User,
    Store,
    ShoppingBag,
    Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, signInWithPopup, googleProvider } from '../firebase';
import axios from 'axios';
import { loginWithGoogle } from '../services/authService';

const Login = () => {
    const { login } = useAuth();
    const [authMode, setAuthMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupRole, setSignupRole] = useState('customer');
    const navigate = useNavigate();
    const API_BASE = 'http://localhost:5000/api/auth';

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (!result.user) throw new Error('No user returned from Firebase login');
            const idToken = await result.user.getIdToken();
            try {
                const data = await loginWithGoogle(idToken);
                const photoURL = result.user.photoURL || (result.user.providerData && result.user.providerData[0]?.photoURL);
                if (data?.token && data.user) {
                    login({ ...data.user, photoURL }, data.token);
                } else {
                    login({
                        id: result.user.uid,
                        name: result.user.displayName,
                        email: result.user.email,
                        photoURL,
                        role: 'customer'
                    }, 'firebase-token-' + result.user.uid);
                }
            } catch (err) {
                console.warn('Backend login failed, using fallback');
                login({
                    id: result.user.uid,
                    name: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    role: 'customer'
                }, 'firebase-token-' + result.user.uid);
            }
            navigate('/home');
        } catch (error) {
            console.error('Google auth error:', error);
        }
    };

    const handleEmailLogin = async () => {
        /* ── Hardcoded admin credentials (no backend needed) ── */
        if (email.trim() === 'admin@freshly.com' && password === 'Admin@123') {
            login({ id: 'admin-local', name: 'Admin', email: 'admin@freshly.com', role: 'admin' }, 'admin-local-token');
            navigate('/admin');
            return;
        }

        /* ── Vendor login via localStorage (no backend needed) ── */
        const vendors = JSON.parse(localStorage.getItem('freshly_vendors') || '[]');
        const matchedVendor = vendors.find(v => v.email === email.trim());
        if (matchedVendor) {
            if (matchedVendor.status === 'pending') {
                alert('⏳ Your vendor application is still pending admin approval. Please wait for admin to review your request.');
                return;
            }
            if (matchedVendor.status === 'rejected') {
                alert('❌ Your vendor application was rejected by the admin. Please contact support for more information.');
                return;
            }
            if (matchedVendor.status === 'accepted') {
                login(
                    { id: matchedVendor.id, name: matchedVendor.name, email: matchedVendor.email, role: 'vendor' },
                    'vendor-local-token-' + matchedVendor.id
                );
                navigate('/vendor');
                return;
            }
        }

        try {
            const res = await axios.post(`${API_BASE}/login`, { email, password });
            login(res.data.user, res.data.token);
            navigate('/home');
        } catch (error) {
            alert(error.response?.data?.error || 'Login failed');
        }
    };

    const handleSignup = async () => {
        const name = email.split('@')[0];
        /* Always save vendor registrations locally for admin review */
        if (signupRole === 'vendor') {
            const existing = JSON.parse(localStorage.getItem('freshly_vendors') || '[]');
            const alreadyExists = existing.some(v => v.email === email.trim());
            if (!alreadyExists) {
                const newVendor = {
                    id: 'VND-' + Date.now(),
                    name,
                    email: email.trim(),
                    role: 'vendor',
                    status: 'pending',
                    registeredAt: new Date().toISOString()
                };
                localStorage.setItem('freshly_vendors', JSON.stringify([newVendor, ...existing]));
            }
            alert('Vendor application submitted! Admin will review your request.');
            setAuthMode('login');
            return;
        }
        try {
            await axios.post(`${API_BASE}/register`, { name, email, password, role: signupRole });
            setAuthMode('login');
        } catch (error) {
            alert(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{
            display: 'flex',
            borderRadius: '32px',
            overflow: 'hidden',
            minHeight: '600px',
            border: '1px solid var(--border-light)',
            background: 'white',
            boxShadow: 'var(--shadow-lg)',
            margin: '20px auto',
            maxWidth: '1100px'
        }}>
            {/* Left Side: Illustration / Branding */}
            <div style={{
                flex: '1.1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '40px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                color: 'var(--secondary)',
                position: 'relative',
                overflow: 'hidden',
                borderRight: '1px solid var(--border-light)'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ position: 'relative', zIndex: 2 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', color: 'white', boxShadow: '0 8px 16px var(--primary-glow)' }}>
                            <Leaf size={20} />
                        </div>
                        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '1000', letterSpacing: '-1px', color: 'var(--secondary)' }}>Freshly</h1>
                    </div>

                    <h2 style={{ fontSize: '40px', fontWeight: '1000', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-1.5px', color: 'var(--secondary)' }}>
                        Better Food <br />
                        <span style={{ color: 'var(--primary)' }}>Better Mood.</span>
                    </h2>
                    <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '360px', lineHeight: '1.4', marginBottom: '32px', fontWeight: '600' }}>
                        Experience the finest groceries handpicked from local farms, delivered fresh to your doorstep within hours.
                    </p>

                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            <span style={{ fontSize: '20px', fontWeight: '1000', color: 'var(--secondary)' }}>50k+</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Happy Users</span>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border-light)' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            <span style={{ fontSize: '20px', fontWeight: '1000', color: 'var(--secondary)' }}>100%</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800' }}>Organic</span>
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'white', opacity: 0.5, borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'white', opacity: 0.5, borderRadius: '50%' }}></div>
            </div>

            {/* Right Side: Auth Form */}
            <div style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 60px',
                background: 'white'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ maxWidth: '400px', width: '100%' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '1000', color: 'var(--secondary)', letterSpacing: '-1.2px' }}>
                            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px', fontWeight: '600' }}>
                            {authMode === 'login' ? 'Please enter your details to login.' : 'Join us to start your fresh journey.'}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--bg-main)', padding: '5px', borderRadius: '18px', border: '1px solid var(--border-light)' }}>
                        <button
                            onClick={() => setAuthMode('login')}
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: 'none',
                                borderRadius: '14px',
                                background: authMode === 'login' ? 'var(--primary)' : 'transparent',
                                color: authMode === 'login' ? 'white' : 'var(--text-muted)',
                                fontWeight: '1000',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontSize: '14px'
                            }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setAuthMode('signup')}
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: 'none',
                                borderRadius: '14px',
                                background: authMode === 'signup' ? 'var(--primary)' : 'transparent',
                                color: authMode === 'signup' ? 'white' : 'var(--text-muted)',
                                fontWeight: '1000',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontSize: '14px'
                            }}
                        >
                            Register
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={authMode}
                            initial={{ opacity: 0, x: authMode === 'login' ? -10 : 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: authMode === 'login' ? 10 : -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {authMode === 'signup' && (
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '14px', fontWeight: '1000', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>Join As</label>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSignupRole('customer')}
                                            style={{
                                                flex: 1,
                                                padding: '24px 16px',
                                                borderRadius: '24px',
                                                border: '2px solid',
                                                borderColor: signupRole === 'customer' ? 'var(--primary)' : 'var(--border-light)',
                                                background: signupRole === 'customer' ? '#f0fdf4' : 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '12px',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <ShoppingBag size={24} color={signupRole === 'customer' ? 'var(--primary)' : 'var(--text-muted)'} />
                                            <span style={{ fontWeight: '1000', fontSize: '14px', color: signupRole === 'customer' ? 'var(--secondary)' : 'var(--text-muted)' }}>Customer</span>
                                        </motion.button>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSignupRole('vendor')}
                                            style={{
                                                flex: 1,
                                                padding: '24px 16px',
                                                borderRadius: '24px',
                                                border: '2px solid',
                                                borderColor: signupRole === 'vendor' ? 'var(--primary)' : 'var(--border-light)',
                                                background: signupRole === 'vendor' ? '#f0fdf4' : 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '12px',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <Store size={24} color={signupRole === 'vendor' ? 'var(--primary)' : 'var(--text-muted)'} />
                                            <span style={{ fontWeight: '1000', fontSize: '14px', color: signupRole === 'vendor' ? 'var(--secondary)' : 'var(--text-muted)' }}>Vendor</span>
                                        </motion.button>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        style={{ width: '100%', padding: '15px 20px 15px 48px', borderRadius: '16px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--secondary)', outline: 'none', fontWeight: '700', fontSize: '15px' }}
                                    />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        style={{ width: '100%', padding: '15px 20px 15px 48px', borderRadius: '16px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', color: 'var(--secondary)', outline: 'none', fontWeight: '700', fontSize: '15px' }}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 15px 30px var(--primary-glow)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={authMode === 'login' ? handleEmailLogin : handleSignup}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: '1000',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    marginBottom: '24px',
                                    boxShadow: '0 8px 16px var(--primary-glow)'
                                }}
                            >
                                {authMode === 'login' ? 'Login' : 'Create Account'} <ArrowRight size={20} />
                            </motion.button>
                        </motion.div>
                    </AnimatePresence>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '1000' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
                        </div>

                        <motion.button
                            whileHover={{ y: -2, background: 'var(--bg-main)' }}
                            onClick={handleGoogleAuth}
                            style={{
                                width: '100%',
                                padding: '15px',
                                borderRadius: '16px',
                                border: '1px solid var(--border-light)',
                                background: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                fontWeight: '900',
                                color: 'var(--secondary)',
                                fontSize: '15px',
                                transition: 'all 0.3s ease',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            Continue with Google
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;

