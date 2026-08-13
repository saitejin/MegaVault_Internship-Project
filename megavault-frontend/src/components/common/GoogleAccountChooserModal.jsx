import React, { useState } from 'react';

export const GoogleAccountChooserModal = ({ isOpen, onClose, onSelectAccount }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const accounts = [
    {
      name: 'Sai Tej',
      email: 'sai9840tej@gmail.com',
      avatarBg: '#0284C7',
      initial: 'S'
    },
    {
      name: 'DS Boys 2022',
      email: 'dsboys2022@gmail.com',
      avatarBg: '#7C3AED',
      initial: 'D'
    }
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customEmail.trim()) {
      onSelectAccount(customEmail.trim());
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.85)', 
        backdropFilter: 'blur(8px)', 
        zIndex: 999999,
        overflowY: 'auto'
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
        <div 
          className="modal-content rounded-4 border-0 p-4 shadow-lg text-white" 
          style={{ backgroundColor: '#1F1F1F', fontFamily: 'Roboto, sans-serif' }}
        >
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              <span className="fw-medium text-light" style={{ fontSize: '0.95rem' }}>Sign in with Google</span>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <h3 className="fw-normal mb-1 text-white" style={{ fontSize: '1.6rem' }}>Choose an account</h3>
          <p className="text-secondary mb-4" style={{ fontSize: '0.92rem' }}>
            to continue to <span className="text-primary fw-medium">megavault.com</span>
          </p>

          {!showCustomInput ? (
            <div className="d-flex flex-column gap-1 mb-4">
              {accounts.map((acc, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectAccount(acc.email, acc.name)}
                  className="d-flex align-items-center gap-3 p-3 rounded-3 cursor-pointer hover-dark-bg transition-all"
                  style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                    style={{ width: '40px', height: '40px', backgroundColor: acc.avatarBg, fontSize: '1.1rem' }}
                  >
                    {acc.initial}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-medium text-white text-truncate">{acc.name}</div>
                    <small className="text-secondary text-truncate d-block">{acc.email}</small>
                  </div>
                </div>
              ))}

              <div
                onClick={() => setShowCustomInput(true)}
                className="d-flex align-items-center gap-3 p-3 rounded-3 cursor-pointer hover-dark-bg transition-all mt-1"
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-secondary border border-secondary flex-shrink-0"
                  style={{ width: '40px', height: '40px' }}
                >
                  <i className="bi bi-person-plus fs-5"></i>
                </div>
                <div className="fw-medium text-light">Use another account</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="mb-4">
              <div className="mb-3">
                <label className="form-label text-secondary small">Enter your Google Email</label>
                <input
                  type="email"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowCustomInput(false)}>Back</button>
                <button type="submit" className="btn btn-primary btn-sm px-4">Continue</button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="d-flex align-items-center justify-content-between pt-3 text-secondary border-top border-secondary border-opacity-25" style={{ fontSize: '0.8rem' }}>
            <span>English (United States)</span>
            <div className="d-flex gap-3">
              <a href="#help" onClick={(e) => e.preventDefault()} className="text-secondary text-decoration-none">Help</a>
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-secondary text-decoration-none">Privacy</a>
              <a href="#terms" onClick={(e) => e.preventDefault()} className="text-secondary text-decoration-none">Terms</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
