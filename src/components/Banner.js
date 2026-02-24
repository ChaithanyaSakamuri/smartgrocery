// src/components/Banner.js
import React from 'react';
import { motion } from 'framer-motion';
import './Banner.css';

const Banner = () => {
  const imageUrl = 'https://img.freepik.com/premium-photo/vegetables-dairy-products-isolated-white_392895-352125.jpg';

  return (
    <section className="hero-banner premium-gradient">
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="hero-badge">Premium Quality</span>
          <h1>Stock up on <br />daily essentials</h1>
          <p>Get farm-fresh goodness & a range of exotic fruits, vegetables, eggs & more delivered to your doorstep.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hero-cta"
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
          >
            Start Shopping Now
          </motion.button>
        </motion.div>
      </div>
      <div className="hero-image-wrap">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="image-container"
        >
          <img src={imageUrl} alt="Fresh groceries" className="hero-image-img" />
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="hero-decoration-1"></div>
      <div className="hero-decoration-2"></div>
    </section>
  );
};

export default Banner;

