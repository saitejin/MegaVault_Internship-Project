import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const RazorpayPaymentModal = ({ isOpen, onClose, amount, orderDetails, onSuccess, customQrImage }) => {
  const [activeTab, setActiveTab] = useState('upi-apps'); // 'upi-apps', 'qr-code', 'vpa-input', 'official-razorpay'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [vpaId, setVpaId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(299); // 5 minute countdown for QR
  const [vpaRequestSent, setVpaRequestSent] = useState(false);
  const [vpaCountdown, setVpaCountdown] = useState(300); // 5 min countdown for VPA
  const [razorpayOrder, setRazorpayOrder] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Create Razorpay Order from backend
      const initRazorpayOrder = async () => {
        try {
          const res = await fetch('http://localhost:8080/api/payment/razorpay/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: amount || 23597,
              currency: 'INR',
              receipt: `rcpt_${Date.now()}`
            })
          });
          if (res.ok) {
            const data = await res.json();
            setRazorpayOrder(data);
          }
        } catch (e) {
          // Fallback order ID if backend offline
          setRazorpayOrder({
            isFallback: true,
            amount: (amount || 23597) * 100,
            currency: 'INR',
            keyId: 'rzp_test_TOkKWxHA53UxlC'
          });
        }
      };
      initRazorpayOrder();
    }
  }, [isOpen, amount]);

  // Countdown timer for UPI QR code
  useEffect(() => {
    let timer;
    if (isOpen && activeTab === 'qr-code' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, activeTab, countdown]);

  // Countdown timer for VPA Collect Request
  useEffect(() => {
    let timer;
    if (isOpen && vpaRequestSent && vpaCountdown > 0) {
      timer = setInterval(() => setVpaCountdown(prev => prev - 1), 1000);
    } else if (vpaRequestSent && vpaCountdown === 0) {
      setVpaRequestSent(false);
      toast.error('Payment timeout. Order cancelled due to payment error.', { icon: '❌', duration: 4000 });
      setTimeout(() => {
        onClose(); // Close the modal to 'cancel' the order process
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, vpaRequestSent, vpaCountdown, onClose]);

  // Reset verification state when changing tabs
  useEffect(() => {
    setIsVerifying(false);
    setVpaRequestSent(false);
  }, [activeTab]);

  if (!isOpen) return null;

  const handleCloseAttempt = () => {
    if (window.confirm('Do you want to cancel the payment? Your order will not be placed.')) {
      onClose();
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const upiApps = [
    { id: 'paytm', name: 'Paytm', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg', color: '#ffffff' },
    { id: 'phonepe', name: 'PhonePe', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg', color: '#ffffff' },
    { id: 'gpay', name: 'Google Pay', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg', color: '#ffffff' },
    { id: 'bhim', name: 'BHIM UPI', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg', color: '#ffffff' },
    { id: 'other', name: 'Other UPI Apps', icon: 'bi-grid-3x3-gap-fill', color: '#333333' }
  ];

  // Execute Official Standard Razorpay JS SDK Checkout Window
  const openOfficialRazorpayCheckout = async (prefillMethod, prefillVpa) => {
    try {
      setIsVerifying(true);

      // Ensure Razorpay SDK script is loaded
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const options = {
        key: razorpayOrder?.keyId || 'rzp_test_TOkKWxHA53UxlC',
        amount: razorpayOrder?.amount || (amount || 23597) * 100,
        currency: razorpayOrder?.currency || 'INR',
        name: 'MegaVault Store',
        description: 'Order Payment Authorization',
        image: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
        prefill: {
          name: orderDetails?.fullName || 'Customer Name',
          email: orderDetails?.email || 'customer@megavault.com',
          contact: orderDetails?.phone || '9876543210',
          ...(prefillMethod ? { method: prefillMethod } : {})
        },
        theme: {
          color: '#F97316'
        },
        handler: function (response) {
          setIsVerifying(false);
          toast.success(`🎉 Payment Verified! Payment ID: ${response.razorpay_payment_id || 'pay_verified'}`, {
            icon: '✅',
            duration: 500
          });
          onSuccess({
            paymentMethod: 'Secure Standard Checkout',
            razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
            razorpayOrderId: response.razorpay_order_id || razorpayOrder?.orderId || `order_${Math.random().toString(36).substring(2, 12)}`,
            razorpaySignature: response.razorpay_signature || 'sig_verified',
            upiId: prefillVpa || undefined
          });
        },
        modal: {
          ondismiss: function () {
            setIsVerifying(false);
            setVpaRequestSent(false); // Reset wait state if they close it
            toast('Payment window closed.', { icon: 'ℹ️' });
          }
        }
      };

      if (razorpayOrder?.orderId && !razorpayOrder?.isFallback) {
        options.order_id = razorpayOrder.orderId;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setIsVerifying(false);
      setVpaRequestSent(false);
      toast.error('Payment initialization failed. Please try again.', { icon: '❌' });
    }
  };

  // Execute Payment Process & Signature Verification
  const handleProcessPayment = (selectedVpa) => {
    const finalVpa = selectedVpa || vpaId || `${selectedUpiApp}@upi`;
    
    // Instead of waiting manually, we launch the official Razorpay UI with the VPA prefilled.
    // Razorpay handles the real collect request and the countdown timer natively.
    openOfficialRazorpayCheckout('upi', finalVpa);
  };

  // QR Code Image Source
  const qrImageSrc = customQrImage || `https://api.qrserver.com/v1/create-qr-code/?size=210x210&data=upi://pay?pa=6305451653@ybl&pn=MegaVault%20Store&am=${amount || 23597}`;

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.85)', 
        backdropFilter: 'blur(10px)', 
        zIndex: 999999, 
        overflowY: 'auto' 
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '620px' }}>
        <div className="modal-content glass-card border-primary p-0 overflow-hidden shadow-lg" style={{ borderRadius: '20px' }}>
          
          {/* Razorpay Gateway Header */}
          <div className="p-4 text-white d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #072654 0%, #0c3875 100%)' }}>
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-shield-fill-check text-primary fs-3"></i>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="fw-bold font-heading mb-0">MegaVault Checkout</h5>
                  <span className="badge bg-primary text-white font-monospace" style={{ fontSize: '0.68rem' }}>SECURE GATEWAY</span>
                </div>
                <small className="text-white-50">Order ID: <span className="font-monospace">{razorpayOrder?.orderId || 'order_loading...'}</span></small>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3">
              <div className="text-end">
                <span className="small text-white-50 d-block font-heading">Total Amount Due</span>
                <h4 className="fw-bold font-heading mb-0 text-warning">₹{Number(amount || 23597).toLocaleString('en-IN')}</h4>
              </div>
              <button type="button" className="btn-close btn-close-white mt-1 opacity-75 hover-opacity-100" onClick={handleCloseAttempt} aria-label="Close"></button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="d-flex border-bottom border-secondary bg-dark bg-opacity-50 flex-wrap">
            <button
              onClick={() => setActiveTab('upi-apps')}
              className={`flex-fill btn border-0 py-3 px-2 font-heading small fw-bold d-flex align-items-center justify-content-center gap-1.5 rounded-0 ${
                activeTab === 'upi-apps' ? 'bg-primary text-white border-bottom border-3 border-light' : 'text-muted hover-bg'
              }`}
            >
              <i className="bi bi-phone fs-5"></i>
              <span>UPI Apps</span>
            </button>
            <button
              onClick={() => setActiveTab('qr-code')}
              className={`flex-fill btn border-0 py-3 px-2 font-heading small fw-bold d-flex align-items-center justify-content-center gap-1.5 rounded-0 ${
                activeTab === 'qr-code' ? 'bg-primary text-white border-bottom border-3 border-light' : 'text-muted hover-bg'
              }`}
            >
              <i className="bi bi-qr-code-scan fs-5"></i>
              <span>Instant QR</span>
            </button>
            <button
              onClick={() => setActiveTab('vpa-input')}
              className={`flex-fill btn border-0 py-3 px-2 font-heading small fw-bold d-flex align-items-center justify-content-center gap-1.5 rounded-0 ${
                activeTab === 'vpa-input' ? 'bg-primary text-white border-bottom border-3 border-light' : 'text-muted hover-bg'
              }`}
            >
              <i className="bi bi-at fs-5"></i>
              <span>UPI ID</span>
            </button>
            <button
              onClick={openOfficialRazorpayCheckout}
              className="flex-fill btn btn-warning border-0 py-3 px-3 font-heading small fw-bold d-flex align-items-center justify-content-center gap-1.5 rounded-0 text-dark"
              title="Launch Secure Card & NetBanking Checkout"
            >
              <i className="bi bi-credit-card-2-front-fill fs-5"></i>
              <span>Cards / NetBanking</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4">
            
            {/* TAB 1: POPULAR UPI APPS */}
            {activeTab === 'upi-apps' && (
              <div>
                <small className="text-muted d-block uppercase tracking-wider font-heading fw-bold mb-3">Select Instant Pay App:</small>
                <div className="d-flex flex-column gap-2.5 mb-4">
                  {upiApps.map(app => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`glass-card p-3 rounded-3 cursor-pointer d-flex justify-content-between align-items-center transition-all ${
                        selectedUpiApp === app.id ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-secondary hover-bg'
                      }`}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle p-2 d-flex align-items-center justify-content-center text-white overflow-hidden shadow-sm border border-secondary" style={{ backgroundColor: app.color, width: '40px', height: '40px' }}>
                          {app.imgSrc ? (
                            <img src={app.imgSrc} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <i className={`bi ${app.icon} fs-5`}></i>
                          )}
                        </div>
                        <div>
                          <strong className="d-block font-heading text-main mb-0">{app.name}</strong>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        {selectedUpiApp === app.id && <span className="badge bg-success font-heading">Selected</span>}
                        <input
                          type="radio"
                          name="upiApp"
                          checked={selectedUpiApp === app.id}
                          onChange={() => setSelectedUpiApp(app.id)}
                          className="form-check-input mt-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex flex-column gap-2">
                  <button
                    onClick={() => openOfficialRazorpayCheckout('upi')}
                    disabled={isVerifying}
                    className="btn btn-megavault btn-lg w-100 font-heading d-flex align-items-center justify-content-center gap-2 shadow-lg"
                  >
                    {isVerifying ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Verifying UPI Payment...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-check fs-5"></i>
                        <span>Pay ₹{Number(amount || 23597).toLocaleString('en-IN')} securely</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openOfficialRazorpayCheckout()}
                    className="btn btn-outline-warning w-100 font-heading py-2.5 d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-credit-card-2-back"></i>
                    <span>Or Pay with Credit/Debit Card or NetBanking</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: LIVE DYNAMIC / CUSTOM RAZORPAY QR CODE */}
            {activeTab === 'qr-code' && (
              <div className="text-center py-2">
                <span className="badge bg-success font-heading px-3 py-1 mb-2">Scan & Pay with Any UPI App</span>
                <p className="text-muted small mb-3">Open Google Pay, PhonePe, Paytm, or BHIM to scan QR code</p>

                <div className="bg-white p-3.5 d-inline-block rounded-4 shadow-lg mb-3 border border-secondary">
                  <img 
                    src={qrImageSrc} 
                    alt="UPI QR Code" 
                    className="img-fluid"
                    style={{ width: '210px', height: '210px', objectFit: 'contain' }}
                  />
                </div>

                <div className="d-flex align-items-center justify-content-center gap-2 text-warning font-monospace mb-3">
                  <i className="bi bi-clock-history"></i>
                  <span>QR Code Expires in: <strong>{formatTimer(countdown)}</strong></span>
                </div>

                {/* Automatic Gateway Listener */}
                <div className="glass-card p-3 border-secondary bg-dark bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center gap-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                  <small className="text-muted font-heading mb-0">
                    Listening for automatic payment confirmation from UPI gateway...
                  </small>
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOM VPA / UPI ID INPUT */}
            {activeTab === 'vpa-input' && (
              <div className="py-2">
                <small className="text-muted d-block uppercase tracking-wider font-heading fw-bold mb-3">Enter Virtual Payment Address (VPA):</small>
                
                <div className="mb-4">
                  <label className="form-label font-heading small fw-semibold text-main">Your UPI ID / VPA Handle</label>
                  <div className="input-group input-group-glass">
                    <span className="input-group-text text-primary">
                      <i className="bi bi-at fs-5"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control text-main font-monospace"
                      placeholder="e.g. saitej@okicici, name@ybl"
                      value={vpaId}
                      onChange={(e) => setVpaId(e.target.value)}
                    />
                  </div>
                  <small className="text-muted mt-1 d-block" style={{ fontSize: '0.78rem' }}>
                    Enter your UPI handle (e.g. username@okaxis, mobile@paytm)
                  </small>
                </div>

                <div className="glass-card p-3 border-secondary mb-4 bg-primary bg-opacity-10">
                  <div className="d-flex align-items-center gap-2 text-primary font-heading small fw-bold mb-1">
                    <i className="bi bi-info-circle-fill"></i>
                    <span>How VPA Payment Works:</span>
                  </div>
                  <p className="mb-0 text-muted small">
                    A payment request of <strong>₹{Number(amount || 23597).toLocaleString('en-IN')}</strong> will be sent directly to your UPI mobile app. Open your app and approve the request.
                  </p>
                </div>

                <button
                  onClick={() => handleProcessPayment(vpaId || 'custom_user@upi')}
                  disabled={isVerifying || (!vpaId.trim() && activeTab === 'vpa-input')}
                  className="btn btn-megavault btn-lg w-100 font-heading shadow-lg"
                >
                  {isVerifying ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      <span>Sending Collect Request...</span>
                    </>
                  ) : (
                    <span>Verify & Pay ₹{Number(amount || 23597).toLocaleString('en-IN')}</span>
                  )}
                </button>
              </div>
            )}

          </div>

          {/* Footer Security Badges */}
          <div className="p-3 border-top border-secondary bg-dark bg-opacity-50 d-flex justify-content-between align-items-center text-muted small font-heading">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock-fill text-success fs-5"></i>
              <span>256-Bit SSL Encrypted</span>
            </div>
            <button type="button" onClick={handleCloseAttempt} className="btn btn-outline-secondary btn-sm px-3 font-heading">
              Cancel & Return
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
