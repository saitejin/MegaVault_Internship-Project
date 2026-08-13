import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth, formatNameFromEmail } from '../context/AuthContext';
import { GoogleAccountChooserModal } from '../components/common/GoogleAccountChooserModal';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const determineRole = (userEmail) => {
    const lower = (userEmail || '').toLowerCase().trim();
    if (
      lower.includes('admin') ||
      lower === 'tejs59985@gmail.com' ||
      lower === 'tejs59885@gmail.com' ||
      lower === 'sainalajala984@gmail.com'
    ) {
      return 'ROLE_SUPER_ADMIN';
    }
    return 'ROLE_CUSTOMER';
  };

  // Google OAuth Browser Callback Listener
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isGoogleCallback = searchParams.get('google_oauth_callback') === 'true' || searchParams.get('google') === 'true';
    const returnedEmail = searchParams.get('email');

    if (isGoogleCallback) {
      const activeEmail = returnedEmail || 'sai9840tej@gmail.com';
      const formattedName = formatNameFromEmail(activeEmail);
      const assignedRole = determineRole(activeEmail);

      login({
        name: formattedName,
        email: activeEmail,
        role: assignedRole,
        provider: 'Google',
        isVerified: true
      });

      toast.success(`🌐 Successfully authenticated via Google! Welcome, ${formattedName}!`, { icon: '🎉', duration: 4000 });

      if (assignedRole === 'ROLE_SUPER_ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [location.search]);

  const handleGoogleOAuthRedirect = () => {
    setIsGoogleModalOpen(true);
  };

  const handleSelectGoogleAccount = (selectedEmail, selectedName) => {
    setIsGoogleModalOpen(false);
    const formattedName = selectedName || formatNameFromEmail(selectedEmail);
    const assignedRole = determineRole(selectedEmail);

    login({
      name: formattedName,
      email: selectedEmail,
      role: assignedRole,
      provider: 'Google',
      isVerified: true
    });

    toast.success(`🌐 Successfully authenticated via Google! Welcome, ${formattedName}!`, { icon: '🎉' });

    if (assignedRole === 'ROLE_SUPER_ADMIN') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  // Direct Account Registration (No OTP Prompts)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const displayName = formData.name.trim() || formatNameFromEmail(formData.email);
    const assignedRole = determineRole(formData.email);

    setTimeout(() => {
      setIsSubmitting(false);
      login({
        name: displayName,
        email: formData.email,
        role: assignedRole,
        provider: 'Manual',
        isVerified: true
      });

      toast.success(`🎉 Account registered successfully! Welcome, ${displayName}!`, { icon: '✅', duration: 500 });

      if (assignedRole === 'ROLE_SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }, 500);
  };

  return (
    <div className="py-5">
      <GoogleAccountChooserModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleSelectGoogleAccount}
      />
      <div className="glass-card p-4 p-md-5 mx-auto border-primary shadow-lg position-relative" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '56px', height: '56px' }}>
            <i className="bi bi-person-plus fs-3"></i>
          </div>
          <h3 className="fw-bold font-heading mb-1">Create Account</h3>
          <p className="text-muted small mb-0">Join MegaVault for personalized AI deals &amp; instant checkout.</p>
        </div>

        {/* 1. Google OAuth Redirection Button */}
        <button
          type="button"
          onClick={handleGoogleOAuthRedirect}
          disabled={isSubmitting}
          className="btn btn-outline-secondary w-100 font-heading py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 mb-3 glass-card shadow-sm hover-bg"
          style={{ border: '1.5px solid var(--border-color)', color: 'var(--text-main)' }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          <span className="fw-semibold small">Sign up with Google</span>
        </button>

        {/* OR Divider */}
        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1 border-secondary opacity-25 my-0" />
          <span className="px-3 text-muted small font-heading text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>OR MANUAL REGISTER</span>
          <hr className="flex-grow-1 border-secondary opacity-25 my-0" />
        </div>

        {/* 2. Standard Form */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label small fw-semibold text-main">Full Name</label>
            <input
              type="text"
              className="form-control glass-card border-secondary text-main"
              placeholder="e.g. Sai Tej"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label small fw-semibold text-main">Email Address</label>
            <input
              type="email"
              className="form-control glass-card border-secondary text-main"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label small fw-semibold text-main">Password</label>
            <div className="input-group input-group-glass">
              <span className="input-group-text text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control text-main"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="btn text-muted px-3"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash-fill text-primary' : 'bi-eye-fill'}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-megavault btn-lg w-100 font-heading mt-2 d-flex align-items-center justify-content-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <i className="bi bi-person-plus-fill"></i>
                <span>Register Account</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-secondary small text-muted">
          Already registered?{' '}
          <Link to="/login" className="text-primary fw-bold text-decoration-none ms-1">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
