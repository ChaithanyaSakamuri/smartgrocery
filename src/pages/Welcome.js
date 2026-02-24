import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, Sparkles } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      background: 'var(--bg-main)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, #f0fdf4 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 1
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, #f0fdf4 0%, transparent 70%)',
          filter: 'blur(100px)',
          zIndex: 1
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '16px', maxWidth: '700px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '28px',
                color: 'var(--primary)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-light)'
              }}
            >
              <Leaf size={40} style={{ fill: 'var(--primary)', fillOpacity: 0.1 }} />
            </motion.div>
          </div>

          <h1 style={{
            fontSize: '56px',
            fontWeight: '1000',
            color: 'var(--secondary)',
            margin: '0 0 12px',
            letterSpacing: '-2px',
            lineHeight: '0.9'
          }}>
            Freshly<span style={{ color: 'var(--primary)' }}>.</span>
          </h1>

          <p style={{
            fontSize: '16px',
            color: 'var(--text-muted)',
            marginBottom: '32px',
            fontWeight: '600',
            letterSpacing: '-0.2px',
            lineHeight: '1.4'
          }}>
            Elevate your grocery experience with <br />
            <span style={{ color: 'var(--secondary)' }}>AI-driven freshness</span> handpicked for you.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 15px 30px var(--primary-glow)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            style={{
              padding: '16px 40px',
              borderRadius: '16px',
              border: 'none',
              background: 'var(--primary)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '1000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              margin: '0 auto',
              boxShadow: '0 8px 16px var(--primary-glow)',
              transition: 'all 0.3s ease'
            }}
          >
            Start Shopping <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative Floating Elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            y: [null, '-20%', '10%'],
            opacity: [0, 0.15, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          style={{ position: 'absolute', color: 'var(--primary)', zIndex: 1 }}
        >
          <Leaf size={24 + Math.random() * 24} style={{ fill: 'currentColor', fillOpacity: 0.05 }} />
        </motion.div>
      ))}
    </div>
  );
};

export default Welcome;
