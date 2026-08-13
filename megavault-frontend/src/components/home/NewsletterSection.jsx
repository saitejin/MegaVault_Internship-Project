import React, { useState } from 'react';
import toast from 'react-hot-toast';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to MegaVault AI Deals!', { icon: '🎉' });
      setEmail('');
    }
  };

  return (
    <section className="py-5">
      <div className="glass-card p-4 p-md-5 text-center position-relative overflow-hidden border-primary">
        <div className="max-w-2xl mx-auto" style={{ maxWidth: '650px' }}>
          <div className="bg-primary text-white rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '60px', height: '60px' }}>
            <i className="bi bi-envelope-open-fill fs-3"></i>
          </div>

          <h2 className="fw-bold font-heading mb-2">Get AI Smart Deals First</h2>
          <p className="text-muted mb-4">
            Subscribe to receive personalized price drop alerts, secret discount codes, and weekly AI recommendations in Indian Rupees (₹).
          </p>

          <form onSubmit={handleSubmit} className="row g-2 justify-content-center">
            <div className="col-sm-8">
              <input
                type="email"
                className="form-control form-control-lg glass-card border-secondary px-4 text-main"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-sm-4 col-md-3">
              <button type="submit" className="btn btn-megavault btn-lg w-100 font-heading">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
