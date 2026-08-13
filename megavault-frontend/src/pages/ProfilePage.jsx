import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth, formatNameFromEmail } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useTheme } from '../context/ThemeContext';

export const ProfilePage = ({ onOpenAI }) => {
  const { user, isLoggedIn, logout, updateProfile } = useAuth();
  const { orders, cancelOrder } = useOrders();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab State: 'details' | 'theme' | 'about' | 'support'
  const activeTab = searchParams.get('tab') || 'details';

  const setActiveTab = (tabName) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tabName);
    setSearchParams(newParams);
  };

  // Edit Profile Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');

  // Support Form State
  const [supportMessage, setSupportMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartEdit = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditPhone(user?.phone || '');
    setEditAddress(user?.address || '');
    setIsEditing(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (editName.trim() && editEmail.trim()) {
      updateProfile({
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        address: editAddress.trim()
      });
      setIsEditing(false);
    }
  };

  const handleCancelOrder = (ord) => {
    if (window.confirm(`Are you sure you want to cancel Order #${ord.orderId}?`)) {
      cancelOrder(ord.id);
      toast.success(`Order #${ord.orderId} Cancelled Successfully! Refund initiated.`, {
        icon: '🛑',
        duration: 5000
      });
    }
  };

  const handleSupportFormSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setIsSendingMessage(true);
    setTimeout(() => {
      setIsSendingMessage(false);
      setSupportMessage('');
      toast.success('Your message has been sent! Support team will respond within 2 hours.', { icon: '🚀' });
    }, 800);
  };

  // If user is Guest (Not logged in)
  if (!isLoggedIn || !user) {
    return (
      <div className="py-5">
        <div className="glass-card p-5 mx-auto text-center border-primary shadow-lg" style={{ maxWidth: '560px' }}>
          <div className="bg-primary text-white rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '64px', height: '64px' }}>
            <i className="bi bi-person-lock fs-2"></i>
          </div>

          <h3 className="fw-bold font-heading mb-2">Sign In to View Profile</h3>
          <p className="text-muted mb-4 leading-relaxed">
            Please sign in to your MegaVault account to view your user details, manage theme settings, explore about info, or contact support.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Link to="/login" className="btn btn-megavault btn-lg font-heading px-4 py-2.5">
              <i className="bi bi-box-arrow-in-right me-2"></i>Sign In Now
            </Link>
            <Link to="/register" className="btn btn-megavault-outline btn-lg font-heading px-4 py-2.5">
              <i className="bi bi-person-plus me-2"></i>Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userName = user.name && user.name !== 'Alex Morgan' 
    ? user.name 
    : formatNameFromEmail(user.email);

  const userEmail = user.email || 'user@example.com';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="py-4">
      {/* Profile Header Banner */}
      <div className="glass-card p-4 p-md-5 border-primary mb-4 shadow-lg position-relative overflow-hidden">
        <div className="d-flex flex-column flex-md-row align-items-center gap-4">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold font-heading text-white shadow-lg flex-shrink-0"
            style={{ 
              width: '80px', 
              height: '80px', 
              fontSize: '1.8rem',
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' 
            }}
          >
            {userInitials}
          </div>

          <div className="text-center text-md-start flex-grow-1">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <h3 className="fw-bold font-heading mb-0 text-main">{userName}</h3>
              <span className="badge badge-megavault px-2.5 py-1">Customer Account</span>
              <button 
                onClick={handleStartEdit} 
                className="btn btn-outline-primary btn-sm rounded-pill font-heading px-3 ms-md-2 d-inline-flex align-items-center gap-1"
              >
                <i className="bi bi-pencil-square"></i>
                <span>Edit Info</span>
              </button>
            </div>
            <p className="text-muted small mb-0">
              {userEmail} • Active Account • Theme: <strong className="text-warning text-capitalize">{theme} Mode</strong>
            </p>
          </div>

          <div>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm font-heading px-3 py-2 d-flex align-items-center gap-1.5">
              <i className="bi bi-box-arrow-right"></i>
              <span>Logout Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Sections Layout */}
      <div className="row g-4">
        
        {/* 4-Tab Navigation Sidebar */}
        <div className="col-lg-3">
          <div className="glass-card p-3 mb-4 sticky-top" style={{ top: '90px' }}>
            <div className="small font-heading fw-bold text-muted px-2 py-1.5 mb-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>
              Profile Navigation
            </div>
            <div className="nav nav-pills flex-column gap-1.5">
              
              {/* Tab 1: User Details */}
              <button
                onClick={() => setActiveTab('details')}
                className={`nav-link text-start font-heading py-2.5 px-3 rounded-3 d-flex align-items-center justify-content-between ${
                  activeTab === 'details' ? 'active btn-megavault text-white fw-bold shadow-sm' : 'text-main hover-bg bg-transparent'
                }`}
              >
                <div className="d-flex align-items-center gap-2.5">
                  <i className="bi bi-person-badge fs-5"></i>
                  <span>User Details</span>
                </div>
                <span className="badge bg-secondary rounded-pill">{orders.length}</span>
              </button>

              {/* Tab 2: Theme Settings */}
              <button
                onClick={() => setActiveTab('theme')}
                className={`nav-link text-start font-heading py-2.5 px-3 rounded-3 d-flex align-items-center justify-content-between ${
                  activeTab === 'theme' ? 'active btn-megavault text-white fw-bold shadow-sm' : 'text-main hover-bg bg-transparent'
                }`}
              >
                <div className="d-flex align-items-center gap-2.5">
                  <i className={`bi ${theme === 'light' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-warning'} fs-5`}></i>
                  <span>Theme & Display</span>
                </div>
                <span className="badge bg-warning text-dark font-monospace" style={{ fontSize: '0.65rem' }}>{theme.toUpperCase()}</span>
              </button>

              {/* Tab 3: About */}
              <button
                onClick={() => setActiveTab('about')}
                className={`nav-link text-start font-heading py-2.5 px-3 rounded-3 d-flex align-items-center justify-content-between ${
                  activeTab === 'about' ? 'active btn-megavault text-white fw-bold shadow-sm' : 'text-main hover-bg bg-transparent'
                }`}
              >
                <div className="d-flex align-items-center gap-2.5">
                  <i className="bi bi-info-circle fs-5 text-info"></i>
                  <span>About MegaVault</span>
                </div>
                <span className="badge bg-info text-dark font-monospace" style={{ fontSize: '0.65rem' }}>v2.4.0</span>
              </button>

              {/* Tab 4: Help and Support */}
              <button
                onClick={() => setActiveTab('support')}
                className={`nav-link text-start font-heading py-2.5 px-3 rounded-3 d-flex align-items-center justify-content-between ${
                  activeTab === 'support' ? 'active btn-megavault text-white fw-bold shadow-sm' : 'text-main hover-bg bg-transparent'
                }`}
              >
                <div className="d-flex align-items-center gap-2.5">
                  <i className="bi bi-headset fs-5 text-success"></i>
                  <span>Help & Support</span>
                </div>
                <span className="badge bg-success font-monospace" style={{ fontSize: '0.65rem' }}>24/7</span>
              </button>

            </div>
          </div>
        </div>

        {/* Dynamic Tab Content Panel */}
        <div className="col-lg-9">
          
          {/* TAB 1: USER DETAILS */}
          {activeTab === 'details' && (
            <div className="d-flex flex-column gap-4">
              {/* Personal Info Box */}
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-3">
                  <h5 className="fw-bold font-heading mb-0 text-main d-flex align-items-center gap-2">
                    <i className="bi bi-person-vcard text-primary fs-4"></i>
                    <span>Personal Details &amp; Info</span>
                  </h5>
                  <button onClick={handleStartEdit} className="btn btn-outline-primary btn-sm font-heading rounded-pill px-3">
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                </div>

                <div className="row g-3">
                  <div className="col-sm-6">
                    <small className="text-muted font-heading d-block">Full Name</small>
                    <strong className="text-main fs-6">{userName}</strong>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted font-heading d-block">Email Address</small>
                    <strong className="text-main fs-6">{userEmail}</strong>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted font-heading d-block">Primary Contact Phone</small>
                    <span className="text-main font-monospace">{user?.phone || '+91 98765 43210'}</span>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted font-heading d-block">Default Delivery Location</small>
                    <span className="text-main font-heading">{user?.address || 'Hyderabad, Telangana, India'}</span>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                  <h5 className="fw-bold font-heading mb-0 text-main d-flex align-items-center gap-2">
                    <i className="bi bi-box-seam text-primary fs-4"></i>
                    <span>My Order History</span>
                  </h5>
                  <span className="badge bg-primary font-monospace">{orders.length} Orders</span>
                </div>

                {orders.length === 0 ? (
                  <div className="glass-card p-4 border-secondary text-center py-5">
                    <i className="bi bi-bag-check fs-1 text-muted mb-3 d-block"></i>
                    <h6 className="fw-bold font-heading text-main mb-1">No Orders Placed Yet</h6>
                    <p className="text-muted small mb-4">Your Razorpay & COD orders will be tracked here!</p>
                    <Link to="/products" className="btn btn-megavault btn-sm font-heading px-4 py-2">
                      <i className="bi bi-bag me-1"></i>Explore Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3.5">
                    {orders.map((ord) => {
                      const isCancelled = ord.status === 'CANCELLED';
                      return (
                        <div key={ord.id} className={`glass-card p-4 shadow-sm rounded-4 transition-all ${isCancelled ? 'border-danger bg-danger bg-opacity-10' : 'border-secondary'}`}>
                          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom border-secondary pb-3 mb-3 gap-2">
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="badge bg-primary font-monospace fs-6 px-2.5 py-1">#{ord.orderId}</span>
                                {isCancelled ? (
                                  <span className="badge bg-danger font-heading px-2.5 py-1">
                                    <i className="bi bi-x-circle-fill me-1"></i>CANCELLED
                                  </span>
                                ) : (
                                  <span className="badge bg-success font-heading px-2.5 py-1">
                                    <i className="bi bi-check-circle-fill me-1"></i>{ord.status || 'CONFIRMED'}
                                  </span>
                                )}
                              </div>
                              <small className="text-muted">
                                {isCancelled ? `Cancelled on ${ord.cancelledAt}` : `Placed on ${ord.placedAt}`}
                              </small>
                            </div>

                            <div className="text-sm-end">
                              <span className="badge bg-secondary font-heading mb-1">{ord.paymentMethod}</span>
                              <h4 className={`fw-bold font-heading mb-0 ${isCancelled ? 'text-danger text-decoration-line-through' : 'text-primary'}`}>
                                ₹{Number(ord.totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                              </h4>
                            </div>
                          </div>

                          <div className="d-flex flex-column gap-2 mb-3">
                            {ord.items.map((item, idx) => (
                              <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-25">
                                <div className="d-flex align-items-center gap-3">
                                  <img src={item.image} alt={item.title} className="rounded-3 object-fit-cover shadow-sm" style={{ width: '48px', height: '48px' }} />
                                  <div>
                                    <strong className="d-block font-heading text-main small">{item.title}</strong>
                                    <small className="text-muted">Qty: {item.quantity} • ₹{Number(item.price).toLocaleString('en-IN')} each</small>
                                  </div>
                                </div>
                                <strong className="text-main font-heading small">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </strong>
                              </div>
                            ))}
                          </div>

                          <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                            <small className="text-muted font-monospace">
                              VPA: <strong className="text-main">{ord.upiId || 'Direct'}</strong>
                            </small>
                            <div className="d-flex gap-2">
                              {!isCancelled && (
                                <button
                                  onClick={() => handleCancelOrder(ord)}
                                  className="btn btn-outline-danger btn-sm rounded-pill font-heading px-3"
                                >
                                  <i className="bi bi-x-circle me-1"></i>Cancel
                                </button>
                              )}
                              <button 
                                onClick={() => toast.success(`Invoice #${ord.orderId} downloaded!`, { icon: '📄' })}
                                className="btn btn-outline-info btn-sm rounded-pill font-heading px-3"
                              >
                                <i className="bi bi-download me-1"></i>Invoice
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: THEME & DISPLAY */}
          {activeTab === 'theme' && (
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                <h5 className="fw-bold font-heading mb-0 text-main d-flex align-items-center gap-2">
                  <i className={`bi ${theme === 'light' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-warning'} fs-4`}></i>
                  <span>Theme &amp; Appearance Settings</span>
                </h5>
                <span className="badge bg-warning text-dark font-monospace uppercase">{theme} Mode Active</span>
              </div>

              {/* Theme Toggle Card */}
              <div className="glass-card p-4 border-secondary mb-4">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                  <div>
                    <h6 className="fw-bold font-heading mb-1 text-main">Interface Display Theme</h6>
                    <p className="text-muted small mb-0">Switch between sleek dark mode and vibrant light mode anytime.</p>
                  </div>
                  
                  {/* Interactive Sun/Moon Toggle Button */}
                  <button
                    onClick={toggleTheme}
                    className="btn btn-megavault btn-lg font-heading rounded-pill px-4 py-2.5 d-flex align-items-center gap-2 text-nowrap"
                  >
                    {theme === 'light' ? (
                      <>
                        <i className="bi bi-moon-stars-fill"></i>
                        <span>Switch to Dark Mode</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-sun-fill text-warning"></i>
                        <span>Switch to Light Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Theme Preview Cards */}
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className={`p-4 rounded-4 border text-center transition-all ${theme === 'dark' ? 'border-primary bg-dark text-white shadow-lg' : 'border-secondary bg-dark text-white opacity-75'}`}>
                    <i className="bi bi-moon-stars fs-1 text-primary mb-2 d-block"></i>
                    <strong className="font-heading d-block">Dark Mode (Default)</strong>
                    <small className="text-muted">High-contrast futuristic neon aesthetic for OLED screens.</small>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className={`p-4 rounded-4 border text-center transition-all ${theme === 'light' ? 'border-warning bg-light text-dark shadow-lg' : 'border-secondary bg-light text-dark opacity-75'}`}>
                    <i className="bi bi-sun fs-1 text-warning mb-2 d-block"></i>
                    <strong className="font-heading d-block text-dark">Light Mode</strong>
                    <small className="text-secondary">Clean, high-legibility light theme for daytime shopping.</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT MEGAVAULT */}
          {activeTab === 'about' && (
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                <h5 className="fw-bold font-heading mb-0 text-main d-flex align-items-center gap-2">
                  <i className="bi bi-info-circle text-info fs-4"></i>
                  <span>About MegaVault Tech E-Commerce</span>
                </h5>
                <span className="badge bg-info text-dark font-monospace">Version 2.4.0</span>
              </div>

              <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-25">
                <div className="rounded-3 p-3 bg-primary text-white d-flex align-items-center justify-content-center">
                  <i className="bi bi-shield-lock-fill fs-2"></i>
                </div>
                <div>
                  <h5 className="fw-bold font-heading mb-0 text-main">MegaVault India Premium Tech Store</h5>
                  <p className="text-muted small mb-0">Official Next-Gen E-Commerce Platform for Flagship Tech &amp; Electronics in India.</p>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="glass-card p-3 text-center border-secondary h-100">
                    <i className="bi bi-shield-check fs-2 text-success mb-2 d-block"></i>
                    <strong className="font-heading text-main d-block mb-1">Razorpay Verified</strong>
                    <small className="text-muted">256-Bit SSL Encrypted Instant UPI, Cards &amp; NetBanking.</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="glass-card p-3 text-center border-secondary h-100">
                    <i className="bi bi-truck fs-2 text-warning mb-2 d-block"></i>
                    <strong className="font-heading text-main d-block mb-1">Express Delivery</strong>
                    <small className="text-muted">Insured 24-48 Hour Shipping to 19,000+ PIN Codes across India.</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="glass-card p-3 text-center border-secondary h-100">
                    <i className="bi bi-arrow-counterclockwise fs-2 text-info mb-2 d-block"></i>
                    <strong className="font-heading text-main d-block mb-1">Easy 7-Day Returns</strong>
                    <small className="text-muted">No-questions-asked replacement &amp; instant refund policy.</small>
                  </div>
                </div>
              </div>

              <div className="small text-muted font-monospace border-top border-secondary pt-3 d-flex justify-content-between flex-wrap gap-2">
                <span>© 2026 MegaVault India Technologies Inc. All Rights Reserved.</span>
                <span>Terms of Service • Privacy Policy</span>
              </div>
            </div>
          )}

          {/* TAB 4: HELP AND SUPPORT */}
          {activeTab === 'support' && (
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                <h5 className="fw-bold font-heading mb-0 text-main d-flex align-items-center gap-2">
                  <i className="bi bi-headset text-success fs-4"></i>
                  <span>Customer Help &amp; Support Desk</span>
                </h5>
                <span className="badge bg-success font-monospace">24/7 SUPPORT</span>
              </div>

              <div className="row g-3 mb-4">
                {/* Helpline */}
                <div className="col-md-6">
                  <div className="glass-card p-3 d-flex align-items-center gap-3 border-secondary">
                    <div className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                      <i className="bi bi-telephone-fill fs-5"></i>
                    </div>
                    <div>
                      <small className="text-muted font-heading d-block">India Toll-Free Helpline</small>
                      <strong className="text-main font-monospace fs-6">+91 1800 634 2828</strong>
                    </div>
                  </div>
                </div>

                {/* Email Support */}
                <div className="col-md-6">
                  <div className="glass-card p-3 d-flex align-items-center gap-3 border-secondary">
                    <div className="bg-success text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                      <i className="bi bi-envelope-fill fs-5"></i>
                    </div>
                    <div>
                      <small className="text-muted font-heading d-block">Official Email Desk</small>
                      <strong className="text-main font-monospace fs-6">support@megavault.in</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Chat Launcher Card */}
              <div className="glass-card p-4 border-warning mb-4 bg-warning bg-opacity-10">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                  <div>
                    <h6 className="fw-bold font-heading text-main mb-1">Need Immediate Assistance?</h6>
                    <p className="text-muted small mb-0">Chat live with our AI Shopping Assistant for product recommendations, order tracking, and coupons.</p>
                  </div>
                  <button 
                    onClick={onOpenAI}
                    className="btn btn-warning text-dark font-heading fw-bold rounded-pill px-4 py-2 text-nowrap"
                  >
                    <i className="bi bi-stars me-1"></i>Launch AI Assistant
                  </button>
                </div>
              </div>

              {/* Support Form */}
              <form onSubmit={handleSupportFormSubmit} className="pt-2">
                <label className="form-label font-heading fw-bold small text-main mb-2">
                  <i className="bi bi-pencil-square text-primary me-1"></i>Submit a Direct Support Ticket:
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control glass-card border-secondary text-main"
                    placeholder="Describe your issue or order inquiry..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={isSendingMessage} className="btn btn-megavault font-heading px-4">
                    {isSendingMessage ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border-primary p-4">
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
                <h5 className="fw-bold font-heading mb-0 text-main">
                  <i className="bi bi-pencil-square text-primary me-2"></i>Edit Profile Information
                </h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
              </div>

              <form onSubmit={handleSaveProfile} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label small fw-semibold text-main">Full Name</label>
                  <input
                    type="text"
                    className="form-control glass-card text-main"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label small fw-semibold text-main">Email Address</label>
                  <input
                    type="email"
                    className="form-control glass-card text-main"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label small fw-semibold text-main">Phone Number</label>
                  <input
                    type="text"
                    className="form-control glass-card text-main"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label small fw-semibold text-main">Delivery Location</label>
                  <input
                    type="text"
                    className="form-control glass-card text-main"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2 justify-content-end mt-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm font-heading">Cancel</button>
                  <button type="submit" className="btn btn-megavault btn-sm font-heading px-4">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
