import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Subscribed to MegaVault AI Deals!', { icon: '🎉' });
      setEmail('');
    }
  };

  return (
    <footer className="glass-nav border-top border-secondary pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* 1. Brand Logo & Info (Theme Aligned: Orange #F97316) */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="d-inline-flex align-items-center gap-2.5 text-decoration-none mb-3">
              <div 
                className="rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm" 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                  color: '#FFFFFF' 
                }}
              >
                <i className="bi bi-shield-lock-fill fs-5"></i>
              </div>
              <span className="h4 mb-0 fw-bold font-heading text-main tracking-tight">
                Mega<span style={{ color: '#F97316' }}>Vault</span>
              </span>
            </Link>

            <p className="text-muted small mb-4 leading-relaxed">
              MegaVault is India's next-generation AI-powered eCommerce platform. Discover intelligent recommendations, instant search, and top-rated products in Indian Rupees (₹).
            </p>

            <div className="d-flex gap-2">
              <a href="#twitter" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#facebook" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#instagram" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#linkedin" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* 2. Shop Categories Column */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold font-heading text-main mb-3 text-uppercase tracking-wider small" style={{ color: '#F97316' }}>
              Departments
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0 font-heading fw-medium">
              <li><Link to="/products?category=audio" className="text-muted text-hover-primary">Audio & Sound</Link></li>
              <li><Link to="/products?category=wearables" className="text-muted text-hover-primary">Smart Wearables</Link></li>
              <li><Link to="/products?category=gaming" className="text-muted text-hover-primary">Gaming & Gear</Link></li>
              <li><Link to="/products?category=electronics" className="text-muted text-hover-primary">Electronics & Tech</Link></li>
              <li><Link to="/products?category=fashion" className="text-muted text-hover-primary">Fashion & Wear</Link></li>
              <li><Link to="/products?category=smart-home" className="text-muted text-hover-primary">Smart Home</Link></li>
            </ul>
          </div>

          {/* 3. Customer Care Column */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold font-heading text-main mb-3 text-uppercase tracking-wider small" style={{ color: '#F97316' }}>
              Support
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0 font-heading fw-medium">
              <li><Link to="/products" className="text-muted text-hover-primary">Shop Catalog</Link></li>
              <li><Link to="/cart" className="text-muted text-hover-primary">View Cart</Link></li>
              <li><Link to="/wishlist" className="text-muted text-hover-primary">Wishlist</Link></li>
              <li><Link to="/profile" className="text-muted text-hover-primary">My Account</Link></li>
              <li><a href="#help" className="text-muted text-hover-primary">1800-MEGAVAULT</a></li>
            </ul>
          </div>

          {/* 4. Newsletter Subscription Column */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold font-heading text-main mb-2">Subscribe for Secret AI Deals</h6>
            <p className="text-muted small mb-3">
              Get personalized price drop alerts and exclusive promo codes in Indian Rupees (₹) sent directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="input-group">
              <input
                type="email"
                className="form-control glass-card border-secondary text-main"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-megavault font-heading">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Line */}
        <div className="pt-4 border-top border-secondary d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-muted small">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} <strong style={{ color: '#F97316' }}>MegaVault India</strong>. Next-Gen AI Shopping. All rights reserved.
          </p>
          <div className="d-flex align-items-center gap-3 fs-5">
            <i className="bi bi-qr-code-scan text-success" title="UPI Payments Supported"></i>
            <i className="bi bi-credit-card text-primary" title="Visa / Mastercard / RuPay"></i>
            <i className="bi bi-shield-check text-success" title="256-Bit Encrypted Security"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};
