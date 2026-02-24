import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SupportChatbot from '../ui/SupportChatbot';

const Layout = ({ cartCount, setShowWishlist, searchTerm, setSearchTerm }) => {
    const location = useLocation();
    const isHome = location.pathname === '/' || location.pathname === '/home';

    return (
        <div style={{
            background: '#f8fafc',
            minHeight: '100vh',
            transition: 'background 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            color: 'var(--secondary)'
        }}>
            <Header cartCount={cartCount} setShowWishlist={setShowWishlist} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <main style={{
                padding: '0 0 120px',
                maxWidth: isHome ? '1400px' : '1200px',
                margin: '0 auto',
                width: '100%',
                flex: 1
            }}>
                <Outlet context={{ searchTerm, setSearchTerm }} />
            </main>
            <SupportChatbot />
            <Footer />
        </div>
    );
};

export default Layout;
