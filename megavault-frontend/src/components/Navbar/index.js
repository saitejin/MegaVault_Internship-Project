import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoriesData } from "../../utils/mockData";
import "./index.css";

const Navbar = ({ onOpenAI }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("megavault_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const handleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add("dark-mode");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("megavault_user");
    localStorage.removeItem("megavault_token");
    setUser(null);
    setIsProfileDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="glass-nav sticky-top py-3 px-3 px-md-4 px-lg-5 transition-all z-1030 shadow-sm">
      <div className="container-fluid max-w-7xl d-flex align-items-center justify-content-between gap-3 gap-xl-4 flex-nowrap">
        
        {/* Brand Logo */}
        <Link to="/" className="d-flex align-items-center gap-2.5 text-decoration-none flex-shrink-0 pe-xl-2">
          <div 
            className="rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm" 
            style={{ 
              width: "40px", 
              height: "40px", 
              background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
              color: "#FFFFFF" 
            }}
          >
            <i className="bi bi-shield-lock-fill fs-5"></i>
          </div>
          <span className="h4 mb-0 fw-bold font-heading text-main tracking-tight text-nowrap">
            Mega<span style={{ color: "#F97316" }}>Vault</span>
          </span>
        </Link>

        {/* Search Bar + AI Assist Button */}
        <form onSubmit={handleSearchSubmit} className="flex-grow-1 d-none d-md-block mx-2 mx-xl-4" style={{ maxWidth: "380px", minWidth: "220px" }}>
          <div className="input-group flex-nowrap align-items-center">
            <span className="input-group-text glass-card border-end-0 border-secondary text-muted rounded-start-pill ps-3 py-2">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control glass-card border-start-0 border-secondary shadow-none py-2 text-main text-truncate"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: "90px" }}
            />
            <button 
              type="button" 
              onClick={onOpenAI}
              className="btn btn-megavault rounded-end-pill px-3 py-2 text-nowrap d-flex align-items-center gap-1.5 flex-shrink-0"
              title="Open AI Shopping Assistant"
            >
              <i className="bi bi-stars text-warning fs-6"></i>
              <span className="d-none d-lg-inline small font-heading">AI Assist</span>
            </button>
          </div>
        </form>

        {/* Navigation Links */}
        <div className="d-flex align-items-center gap-3 gap-xl-4 flex-shrink-0">
          <div className="d-none d-lg-flex align-items-center gap-4 font-heading fw-semibold me-xl-2">
            <Link to="/" className="text-muted text-hover-primary text-nowrap py-2 px-1" style={{ fontSize: "0.95rem" }}>
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <div className="position-relative">
              <button
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                onBlur={() => setTimeout(() => setIsCategoriesDropdownOpen(false), 200)}
                className="btn btn-link text-muted text-hover-primary text-nowrap p-0 py-2 px-1 border-0 font-heading fw-semibold d-flex align-items-center gap-1.5 text-decoration-none"
                style={{ fontSize: "0.95rem" }}
              >
                <span>Categories</span>
                <i className={`bi bi-chevron-down small transition-transform ${isCategoriesDropdownOpen ? "rotate-180" : ""}`}></i>
              </button>

              {isCategoriesDropdownOpen && (
                <div 
                  className="position-absolute start-0 mt-2 glass-card p-2.5 shadow-lg animated fadeIn"
                  style={{ width: "250px", zIndex: 99999 }}
                >
                  <div className="small font-heading fw-bold text-muted px-3 py-1.5 uppercase tracking-wider border-bottom border-secondary mb-1">
                    All Departments
                  </div>
                  {categoriesData.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.id}`}
                      onClick={() => setIsCategoriesDropdownOpen(false)}
                      className="dropdown-item p-2.5 rounded-3 text-main font-heading small d-flex align-items-center gap-2.5 hover-bg"
                    >
                      <i className="bi bi-grid-fill text-primary"></i>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/products" className="text-muted text-hover-primary text-nowrap py-2 px-1" style={{ fontSize: "0.95rem" }}>
              Shop
            </Link>

            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="btn btn-link text-muted text-hover-primary text-nowrap p-0 py-2 px-1 border-0 font-heading fw-semibold text-decoration-none"
              style={{ fontSize: "0.95rem" }}
            >
              Contact
            </button>
          </div>

          {/* Theme Button */}
          <button
            onClick={handleTheme}
            className="btn btn-icon-highlight btn-sm rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "38px", height: "38px" }}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <i className="bi bi-sun-fill text-warning"></i>
            ) : (
              <i className="bi bi-moon-stars-fill text-dark"></i>
            )}
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="btn btn-icon-highlight btn-sm rounded-circle position-relative d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "38px", height: "38px" }}
            title="Wishlist"
          >
            <i className="bi bi-heart"></i>
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="btn btn-megavault btn-sm rounded-pill px-3.5 py-2 d-flex align-items-center gap-2 text-nowrap flex-shrink-0 shadow-sm"
            title="Shopping Cart"
          >
            <i className="bi bi-cart3 fs-6"></i>
            <span className="d-none d-md-inline font-heading">Cart</span>
          </Link>

          {/* Profile Dropdown */}
          <div className="position-relative flex-shrink-0">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="btn btn-icon-highlight btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "38px", height: "38px" }}
              title="Account Options"
            >
              <i className="bi bi-person"></i>
            </button>

            {isProfileDropdownOpen && (
              <div 
                className="position-absolute end-0 mt-2 glass-card p-3 shadow-lg animated fadeIn"
                style={{ minWidth: "270px", zIndex: 99999 }}
              >
                {user ? (
                  <>
                    <div className="p-2.5 border-bottom border-secondary mb-2 bg-secondary bg-opacity-10 rounded-3">
                      <strong className="d-block font-heading text-main mb-0.5">{user.name}</strong>
                      <small className="text-muted d-block text-break" style={{ fontSize: "0.82rem", wordBreak: "break-all" }}>
                        {user.email}
                      </small>
                    </div>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="dropdown-item p-2.5 rounded-3 text-main font-heading small d-flex align-items-center gap-2.5 hover-bg mb-1"
                    >
                      <i className="bi bi-person-gear text-primary fs-6"></i>My Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item p-2.5 rounded-3 text-danger font-heading small d-flex align-items-center gap-2.5 hover-bg w-100 text-start border-0 bg-transparent"
                    >
                      <i className="bi bi-box-arrow-right fs-6"></i>Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="dropdown-item p-2.5 rounded-3 text-main font-heading small d-flex align-items-center gap-2.5 hover-bg mb-1"
                    >
                      <i className="bi bi-box-arrow-in-right text-primary fs-6"></i>Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="dropdown-item p-2.5 rounded-3 text-main font-heading small d-flex align-items-center gap-2.5 hover-bg"
                    >
                      <i className="bi bi-person-plus text-primary fs-6"></i>Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="btn btn-outline-secondary btn-sm d-lg-none rounded-2 ms-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`bi ${isMobileMenuOpen ? "bi-x-lg" : "bi-list"} fs-5`}></i>
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {isHelpModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border-primary p-4">
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
                <h5 className="fw-bold font-heading mb-0 text-main">
                  <i className="bi bi-headset text-primary me-2"></i>Help & Support Center
                </h5>
                <button type="button" className="btn-close" onClick={() => setIsHelpModalOpen(false)}></button>
              </div>

              <div className="py-2 d-flex flex-column gap-3">
                <div className="glass-card p-3 d-flex align-items-center gap-3">
                  <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div>
                    <strong className="d-block font-heading text-main">Customer Helpline (India)</strong>
                    <small className="text-muted">1800-MEGAVAULT (+91 1800 634 2828)</small>
                  </div>
                </div>

                <div className="glass-card p-3 d-flex align-items-center gap-3">
                  <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div>
                    <strong className="d-block font-heading text-main">Email Support</strong>
                    <small className="text-muted">support@megavault.in</small>
                  </div>
                </div>

                <div className="glass-card p-3 d-flex align-items-center gap-3">
                  <div className="bg-warning text-dark rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                    <i className="bi bi-clock-fill"></i>
                  </div>
                  <div>
                    <strong className="d-block font-heading text-main">Working Hours</strong>
                    <small className="text-muted">Mon - Sat: 9:00 AM - 9:00 PM IST</small>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3 pt-2 border-top border-secondary">
                <button type="button" onClick={() => setIsHelpModalOpen(false)} className="btn btn-megavault btn-sm px-4 font-heading">
                  Close Help
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
