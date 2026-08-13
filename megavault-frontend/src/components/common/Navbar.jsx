import React, { useState, useEffect, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { categoriesData, allProductsData } from '../../utils/mockData';
import { VoiceSearchModal } from './VoiceSearchModal';

export const Navbar = ({ onOpenAI }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleVoiceSearch = () => {
    setIsVoiceModalOpen(true);
  };

  // Compute live auto-suggestions based on search query
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 1) return [];
    const q = searchQuery.toLowerCase().trim();

    return allProductsData.filter(product => {
      const matchTitle = product.title && product.title.toLowerCase().includes(q);
      const matchCode = product.productCode && product.productCode.toLowerCase().includes(q);
      const matchCat = product.category && product.category.toLowerCase().includes(q);
      return matchTitle || matchCode || matchCat;
    }).slice(0, 5); // Limit to top 5 accurate suggestions
  }, [searchQuery]);

  // Auto-close open dropdowns when clicking anywhere outside their container or focusing elsewhere
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const isCategoriesClick = e.target.closest('.categories-container');
      const isProfileClick = e.target.closest('.profile-container');
      const isSearchClick = e.target.closest('.search-box-container');

      if (!isCategoriesClick) {
        setIsCategoriesDropdownOpen(false);
      }
      if (!isProfileClick) {
        setIsProfileDropdownOpen(false);
      }
      if (!isSearchClick) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const toggleCategories = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsHelpModalOpen(false);
    setIsSearchFocused(false);
    setIsCategoriesDropdownOpen(prev => !prev);
  };

  const toggleProfile = (e) => {
    e.stopPropagation();
    setIsCategoriesDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsHelpModalOpen(false);
    setIsSearchFocused(false);
    setIsProfileDropdownOpen(prev => !prev);
  };

  const openHelpModal = () => {
    setIsCategoriesDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsSearchFocused(false);
    setIsHelpModalOpen(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsCategoriesDropdownOpen(false);
      setIsProfileDropdownOpen(false);
      setIsSearchFocused(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSelectSuggestion = (product) => {
    setIsSearchFocused(false);
    setSearchQuery(product.title);
    navigate(`/products?search=${encodeURIComponent(product.title)}`);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const handleCallHelpline = () => {
    navigator.clipboard?.writeText('+9118006342828');
    toast.success('Helpline +91 1800 634 2828 copied to clipboard!', { icon: '📞' });
  };

  const handleSendEmail = () => {
    navigator.clipboard?.writeText('tejs59985@gmail.com');
    toast.success('Email tejs59985@gmail.com copied to clipboard!', { icon: '✉️' });
  };

  const handleSupportFormSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    setIsSendingMessage(true);
    
    const adminEmail = 'tejs59985@gmail.com';
    const subject = encodeURIComponent('MegaVault Quick Support Message');
    const bodyText = user?.email 
      ? `User: ${user.name || 'Registered User'} (${user.email})\n\nMessage:\n${supportMessage}`
      : `Guest User\n\nMessage:\n${supportMessage}`;
    const body = encodeURIComponent(bodyText);

    setTimeout(() => {
      setIsSendingMessage(false);
      setSupportMessage('');
      toast.success('Opening your default mail app...', { icon: '✉️', duration: 3000 });
      window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
      setIsHelpModalOpen(false);
    }, 600);
  };

  return (
    <>
      <nav className="glass-nav sticky-top py-3 px-3 px-md-4 px-lg-5 transition-all z-1030 shadow-sm">
        <div className="container-fluid max-w-7xl d-flex align-items-center justify-content-between gap-3 gap-xl-4 flex-nowrap">
          
          {/* 1. Brand Logo & Name */}
          <Link 
            to="/" 
            onClick={() => {
              setIsCategoriesDropdownOpen(false);
              setIsProfileDropdownOpen(false);
              setIsSearchFocused(false);
            }}
            className="d-flex align-items-center gap-3 text-decoration-none flex-shrink-0 pe-xl-2"
          >
            <div 
              className="rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm me-2" 
              style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                color: '#FFFFFF' 
              }}
            >
              <i className="bi bi-shield-lock-fill fs-5"></i>
            </div>
            <span className="h4 mb-0 fw-bold font-heading text-main tracking-tight text-nowrap ms-1">
              Mega<span style={{ color: '#F97316' }}>Vault</span>
            </span>
          </Link>

          {/* 2. Global Search Bar with Real-Time Auto-Suggest & Voice Microphone */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-grow-1 mx-1 mx-md-4 position-relative search-box-container" 
            style={{ maxWidth: '520px', minWidth: '140px' }}
          >
            <div className="input-group input-group-glass rounded-pill align-items-center p-1" style={{ border: '1.5px solid var(--border-color)' }}>
              <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                <i className="bi bi-search fs-6"></i>
              </span>
              <input
                type="text"
                className="form-control bg-transparent border-0 shadow-none text-main py-1.5 px-2"
                placeholder="Search headphones, watches, gaming..."
                value={searchQuery}
                onFocus={() => {
                  setIsCategoriesDropdownOpen(false);
                  setIsProfileDropdownOpen(false);
                  setIsSearchFocused(true);
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
              />
              <button 
                type="button" 
                onClick={handleVoiceSearch}
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 me-1 border-0"
                style={{ width: '36px', height: '36px' }}
                title="Search with Voice"
              >
                <i className="bi bi-mic-fill text-warning fs-5"></i>
              </button>
            </div>

            {/* Real-Time Auto-Suggest Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div 
                className="position-absolute start-0 end-0 mt-2 p-3 shadow-lg rounded-3 animated fadeIn"
                style={{ 
                  zIndex: 999999, 
                  overflowY: 'auto',
                  maxHeight: '400px',
                  background: theme === 'light' ? '#FFFFFF' : '#0F172A',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 30px -5px rgba(0, 0, 0, 0.8), 0 10px 15px -5px rgba(0, 0, 0, 0.6)',
                  border: '2px solid rgba(249, 115, 22, 0.6)'
                }}
              >
                <div className="small font-heading fw-bold text-muted px-2 py-1.5 uppercase tracking-wider border-bottom border-secondary mb-2 d-flex justify-content-between align-items-center" style={{ fontSize: '0.75rem' }}>
                  <span><i className="bi bi-lightning-charge-fill text-warning me-1"></i>Product Suggestions ({searchSuggestions.length})</span>
                  <span className="text-primary font-monospace">Live Search</span>
                </div>
                <div className="d-flex flex-column gap-2">
                  {searchSuggestions.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectSuggestion(prod)}
                      className="p-2.5 rounded-3 text-main d-flex align-items-center justify-content-between hover-bg cursor-pointer transition-all border border-secondary border-opacity-25"
                      style={{ cursor: 'pointer', minHeight: '64px' }}
                    >
                      <div className="d-flex align-items-center gap-3 overflow-hidden w-100">
                        <img 
                          src={prod.image} 
                          alt={prod.title} 
                          className="rounded-3 object-fit-cover flex-shrink-0 shadow-sm" 
                          style={{ width: '48px', height: '48px' }} 
                        />
                        <div className="text-truncate flex-grow-1">
                          <strong className="d-block text-main text-truncate fw-bold" style={{ fontSize: '0.9rem' }}>{prod.title}</strong>
                          <div className="d-flex align-items-center gap-2 mt-1">
                            <span className="badge bg-primary bg-opacity-25 text-primary font-monospace border border-primary border-opacity-25 px-2 py-1" style={{ fontSize: '0.72rem' }}>{prod.productCode || 'SKU'}</span>
                            <small className="text-muted" style={{ fontSize: '0.8rem' }}>{prod.category}</small>
                          </div>
                        </div>
                        <i className="bi bi-chevron-right text-muted small ms-2"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>

          {/* 3. Navigation Links & Actions */}
          <div className="d-flex align-items-center gap-3 gap-xl-4 flex-shrink-0">
            
            {/* Desktop Navigation */}
            <div className="d-none d-lg-flex align-items-center gap-2 font-heading fw-semibold me-xl-2">
              <NavLink 
                to="/" 
                end
                onClick={() => {
                  setIsCategoriesDropdownOpen(false);
                  setIsProfileDropdownOpen(false);
                  setIsSearchFocused(false);
                }}
                className={({ isActive }) => `nav-link-custom text-nowrap ${isActive ? 'active' : ''}`}
              >
                Home
              </NavLink>
              
              {/* Categories Dropdown Container */}
              <div className="position-relative categories-container">
                <button
                  onClick={toggleCategories}
                  className={`btn btn-link nav-link-custom text-nowrap border-0 text-decoration-none ${isCategoriesDropdownOpen ? 'active' : ''}`}
                >
                  <span>Categories</span>
                  <i className={`bi bi-chevron-down small transition-transform ${isCategoriesDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {isCategoriesDropdownOpen && (
                  <div 
                    className="position-absolute start-0 mt-2 glass-card p-3 shadow-lg animated fadeIn"
                    style={{ minWidth: '280px', zIndex: 99999 }}
                  >
                    <div className="small font-heading fw-bold text-muted px-3 py-2 uppercase tracking-wider border-bottom border-secondary mb-2">
                      All Departments
                    </div>
                    <div className="d-flex flex-column gap-1.5">
                      {categoriesData.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setIsCategoriesDropdownOpen(false);
                            navigate(`/products?category=${cat.id}`);
                          }}
                          className="dropdown-item px-3 py-2.5 rounded-3 text-main font-heading d-flex align-items-center justify-content-between hover-bg border-0 bg-transparent text-start w-100"
                          style={{ fontSize: '0.92rem' }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div 
                              className="rounded-2 p-1.5 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" 
                              style={{ width: '30px', height: '30px' }}
                            >
                              <i className="bi bi-grid-fill fs-6"></i>
                            </div>
                            <span className="fw-medium">{cat.name}</span>
                          </div>
                          <i className="bi bi-chevron-right text-muted small ms-2"></i>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <NavLink 
                to="/products" 
                onClick={() => {
                  setIsCategoriesDropdownOpen(false);
                  setIsProfileDropdownOpen(false);
                  setIsSearchFocused(false);
                }}
                className={({ isActive }) => `nav-link-custom text-nowrap ${isActive ? 'active' : ''}`}
              >
                Shop
              </NavLink>

              <button
                onClick={openHelpModal}
                className={`btn btn-link nav-link-custom text-nowrap border-0 text-decoration-none ${isHelpModalOpen ? 'active' : ''}`}
              >
                Contact
              </button>
            </div>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              onClick={() => {
                setIsCategoriesDropdownOpen(false);
                setIsProfileDropdownOpen(false);
                setIsSearchFocused(false);
              }}
              className="btn btn-icon-highlight btn-sm rounded-circle position-relative d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '38px', height: '38px' }}
              title="Wishlist"
            >
              <i className="bi bi-heart"></i>
            </Link>

            {/* Cart Button with Dynamic Badge */}
            <Link
              to="/cart"
              onClick={() => {
                setIsCategoriesDropdownOpen(false);
                setIsProfileDropdownOpen(false);
                setIsSearchFocused(false);
              }}
              className="btn btn-megavault btn-sm rounded-pill px-3.5 py-2 d-flex align-items-center gap-2 text-nowrap flex-shrink-0 shadow-sm position-relative"
              title="Shopping Cart"
            >
              <i className="bi bi-cart3 fs-6"></i>
              <span className="d-none d-md-inline font-heading">Cart</span>
              {cartCount > 0 && (
                <span className="badge bg-warning text-dark rounded-pill font-heading ms-0.5" style={{ fontSize: '0.75rem' }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown Container (Contains User Details, Theme Toggle, About, Help & Support) */}
            <div className="position-relative flex-shrink-0 profile-container">
              <button
                onClick={toggleProfile}
                className="btn btn-icon-highlight btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px' }}
                title="Account & Profile Settings"
              >
                <i className="bi bi-person fs-5"></i>
              </button>

              {isProfileDropdownOpen && (
                <div 
                  className="position-absolute end-0 mt-2 glass-card p-3 shadow-lg animated fadeIn"
                  style={{ minWidth: '290px', zIndex: 99999 }}
                >
                  {isLoggedIn ? (
                    <>
                      <div className="p-2.5 border-bottom border-secondary mb-2 bg-secondary bg-opacity-10 rounded-3">
                        <strong className="d-block font-heading text-main mb-0.5">{user.name}</strong>
                        <small className="text-muted d-block text-break" style={{ fontSize: '0.82rem', wordBreak: 'break-all' }}>
                          {user.email}
                        </small>
                      </div>

                      {/* Section 1: User Details */}
                      <Link 
                        to="/profile?tab=details" 
                        onClick={() => setIsProfileDropdownOpen(false)} 
                        className="dropdown-item p-2.5 rounded-3 text-main font-heading small d-flex align-items-center justify-content-between hover-bg mb-1"
                      >
                        <div className="d-flex align-items-center gap-2.5">
                          <i className="bi bi-person-badge text-primary fs-5"></i>
                          <span>User Details</span>
                        </div>
                        <i className="bi bi-chevron-right text-muted small"></i>
                      </Link>

                      {/* Section 2: Theme Toggle Button inside Profile */}
                      <div className="dropdown-item p-2.5 rounded-3 text-main font-heading small d-flex align-items-center justify-content-between hover-bg mb-1 cursor-pointer" onClick={toggleTheme}>
                        <div className="d-flex align-items-center gap-2.5">
                          <i className={`bi ${theme === 'light' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-warning'} fs-5`}></i>
                          <span>Theme ({theme === 'light' ? 'Light' : 'Dark'})</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm rounded-pill px-2.5 py-0.5 text-nowrap font-monospace"
                          style={{
                            fontSize: '0.72rem',
                            backgroundColor: theme === 'light' ? '#f59e0b' : '#3b82f6',
                            color: '#ffffff'
                          }}
                        >
                          {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
                        </button>
                      </div>

                      {/* Section 3: About MegaVault */}
                      <Link 
                        to="/profile?tab=about" 
                        onClick={() => setIsProfileDropdownOpen(false)} 
                        className="dropdown-item p-2.5 rounded-3 text-main font-heading small d-flex align-items-center justify-content-between hover-bg mb-1"
                      >
                        <div className="d-flex align-items-center gap-2.5">
                          <i className="bi bi-info-circle text-info fs-5"></i>
                          <span>About MegaVault</span>
                        </div>
                        <span className="badge bg-info text-dark font-monospace" style={{ fontSize: '0.65rem' }}>v2.4</span>
                      </Link>

                      {/* Section 4: Help and Support */}
                      <Link 
                        to="/profile?tab=support" 
                        onClick={() => setIsProfileDropdownOpen(false)} 
                        className="dropdown-item p-2.5 rounded-3 text-main font-heading small d-flex align-items-center justify-content-between hover-bg mb-2"
                      >
                        <div className="d-flex align-items-center gap-2.5">
                          <i className="bi bi-headset text-success fs-5"></i>
                          <span>Help &amp; Support</span>
                        </div>
                        <span className="badge bg-success font-monospace" style={{ fontSize: '0.65rem' }}>24/7</span>
                      </Link>

                      <div className="pt-2 border-top border-secondary">
                        <button onClick={handleLogout} className="dropdown-item p-2.5 rounded-3 text-danger font-heading small d-flex align-items-center gap-2.5 hover-bg w-100 text-start border-0 bg-transparent">
                          <i className="bi bi-box-arrow-right fs-5 flex-shrink-0"></i>
                          <span>Logout Session</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Theme Toggle Button inside Profile for Guests */}
                      <div className="dropdown-item p-2.5 rounded-3 text-main font-heading small d-flex align-items-center justify-content-between hover-bg mb-2 cursor-pointer" onClick={toggleTheme}>
                        <div className="d-flex align-items-center gap-2.5">
                          <i className={`bi ${theme === 'light' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-warning'} fs-5`}></i>
                          <span>Theme Mode</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm rounded-pill px-2.5 py-0.5 text-nowrap font-monospace"
                          style={{
                            fontSize: '0.72rem',
                            backgroundColor: theme === 'light' ? '#f59e0b' : '#3b82f6',
                            color: '#ffffff'
                          }}
                        >
                          {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
                        </button>
                      </div>

                      <Link to="/login" onClick={() => setIsProfileDropdownOpen(false)} className="dropdown-item p-2.5 rounded-3 text-main font-heading small d-flex align-items-center gap-2.5 hover-bg mb-1">
                        <i className="bi bi-box-arrow-in-right text-primary fs-5"></i>
                        <span>Sign In</span>
                      </Link>
                      <Link to="/register" onClick={() => setIsProfileDropdownOpen(false)} className="dropdown-item p-2.5 rounded-3 text-main font-heading small d-flex align-items-center gap-2.5 hover-bg">
                        <i className="bi bi-person-plus text-primary fs-5"></i>
                        <span>Create Account</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button className="btn btn-outline-secondary btn-sm d-lg-none rounded-2 ms-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-5`}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Slide-Out / Dropdown */}
      {isMobileMenuOpen && (
        <div className="d-lg-none glass-card p-3 mx-3 my-2 shadow-lg border-primary rounded-3 animated fadeIn position-relative z-1030">
          <div className="d-flex flex-column gap-2">
            <NavLink 
              to="/" 
              end
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `nav-link-custom text-nowrap w-100 ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-house-door me-2"></i>Home
            </NavLink>
            <NavLink 
              to="/products" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `nav-link-custom text-nowrap w-100 ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-bag-check me-2"></i>Shop
            </NavLink>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openHelpModal();
              }}
              className="btn btn-link nav-link-custom text-nowrap border-0 text-decoration-none w-100 text-start"
            >
              <i className="bi bi-headset me-2"></i>Contact Support
            </button>
          </div>
        </div>
      )}

      {/* Viewport Fixed Help & Support Modal */}
      {isHelpModalOpen && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.75)', 
            backdropFilter: 'blur(8px)', 
            zIndex: 999999,
            overflowY: 'auto'
          }}
        >
          <div className="modal-dialog modal-dialog-centered my-5" style={{ maxWidth: '540px' }}>
            <div className="modal-content glass-card border-primary p-4 shadow-lg">
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
                <h5 className="fw-bold font-heading mb-0 text-main d-flex align-items-center gap-2">
                  <i className="bi bi-headset text-primary fs-4"></i>
                  <span>Help & Support Center</span>
                </h5>
                <button type="button" className="btn-close" onClick={() => setIsHelpModalOpen(false)}></button>
              </div>

              <div className="py-2 d-flex flex-column gap-3">
                <a 
                  href="tel:+9118006342828"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCallHelpline}
                  className="glass-card p-3 d-flex align-items-center justify-content-between gap-3 hover-bg transition-all border-secondary text-decoration-none"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary text-white rounded-circle p-2.5 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '46px', height: '46px' }}>
                      <i className="bi bi-telephone-fill fs-5"></i>
                    </div>
                    <div>
                      <strong className="d-block font-heading text-main">Customer Helpline (India)</strong>
                      <small className="text-muted">1800-MEGAVAULT (+91 1800 634 2828)</small>
                    </div>
                  </div>
                  <button type="button" className="btn btn-outline-primary btn-sm rounded-pill px-3 font-heading text-nowrap">
                    <i className="bi bi-telephone-out me-1"></i>Call Now
                  </button>
                </a>

                <a 
                  href={`mailto:tejs59985@gmail.com?subject=MegaVault%20Customer%20Support%20Inquiry${user?.email ? `&cc=${user.email}&body=Hello Support Team,%0D%0A%0D%0AMy registered email is: ${user.email}%0D%0A%0D%0A[Please type your issue here]` : ''}`}
                  onClick={handleSendEmail}
                  className="glass-card p-3 d-flex align-items-center justify-content-between gap-3 hover-bg transition-all border-secondary text-decoration-none"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-success text-white rounded-circle p-2.5 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '46px', height: '46px' }}>
                      <i className="bi bi-envelope-fill fs-5"></i>
                    </div>
                    <div>
                      <strong className="d-block font-heading text-main">Email Support</strong>
                      <small className="text-muted">tejs59985@gmail.com</small>
                    </div>
                  </div>
                  <button type="button" className="btn btn-outline-success btn-sm rounded-pill px-3 font-heading text-nowrap">
                    <i className="bi bi-send me-1"></i>Email Us
                  </button>
                </a>

                <div 
                  onClick={() => {
                    setIsHelpModalOpen(false);
                    onOpenAI();
                  }}
                  className="glass-card p-3 d-flex align-items-center justify-content-between gap-3 hover-bg cursor-pointer transition-all border-secondary"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-warning text-dark rounded-circle p-2.5 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '46px', height: '46px' }}>
                      <i className="bi bi-stars fs-5"></i>
                    </div>
                    <div>
                      <strong className="d-block font-heading text-main">Instant AI Live Support</strong>
                      <small className="text-muted">Mon - Sat: 9:00 AM - 9:00 PM IST (24/7 AI)</small>
                    </div>
                  </div>
                  <button type="button" className="btn btn-warning btn-sm rounded-pill px-3 font-heading text-dark text-nowrap fw-bold">
                    <i className="bi bi-chat-dots-fill me-1"></i>Live Chat
                  </button>
                </div>

                <form onSubmit={handleSupportFormSubmit} className="mt-2 pt-2 border-top border-secondary">
                  <label className="form-label small fw-semibold text-main mb-1.5 d-block">
                    <i className="bi bi-pencil-square text-primary me-1"></i>Send a Quick Support Message:
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control glass-card border-secondary text-main"
                      placeholder="Type your question or issue here..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      required
                    />
                    <button 
                      type="submit" 
                      disabled={isSendingMessage} 
                      className="btn btn-megavault font-heading text-nowrap px-3"
                    >
                      {isSendingMessage ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="d-flex justify-content-end mt-3 pt-2 border-top border-secondary">
                <button type="button" onClick={() => setIsHelpModalOpen(false)} className="btn btn-outline-secondary btn-sm px-4 font-heading">
                  Close Help
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Viewport Fixed Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearchSubmit={(queryText) => setSearchQuery(queryText)}
      />
    </>
  );
};
