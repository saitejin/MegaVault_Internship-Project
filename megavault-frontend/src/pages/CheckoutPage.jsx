import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { RazorpayPaymentModal } from '../components/common/RazorpayPaymentModal';
import { AVAILABLE_BACKEND_COUPONS, applyBackendCoupon } from '../services/couponService';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, subtotal } = useCart();
  const { placeOrder } = useOrders();

  const [paymentMethod, setPaymentMethod] = useState('razorpay-upi');
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCouponCode = async (codeToApply) => {
    const targetCode = codeToApply || couponCodeInput;
    if (!targetCode) return;

    const baseSubtotal = subtotal > 0 ? subtotal : 19998;
    const result = await applyBackendCoupon(targetCode, baseSubtotal);

    if (result.success) {
      setAppliedCoupon(result);
      setCouponCodeInput(result.code);
      toast.success(result.message, { duration: 500 });
    } else {
      toast.error(result.message, { duration: 500 });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    toast('Coupon removed', { icon: 'ℹ️', duration: 500 });
  };

  // Calculations with Coupon Discount
  const baseSubtotal = subtotal > 0 ? subtotal : 19998;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const netSubtotal = Math.max(0, baseSubtotal - discountAmount);
  const shipping = netSubtotal > 499 || cartItems.length === 0 ? 0 : 99;
  const tax = netSubtotal * 0.18;
  const grandTotal = netSubtotal + shipping + tax;

  // Complete & Save Order
  const executeOrderPlacement = (methodName, upiDetail = 'N/A') => {
    const finalItems = cartItems.length > 0 
      ? cartItems 
      : [{ id: '101', title: 'Wireless Bluetooth Headphones', price: 4999, quantity: 1, category: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' }];

    const orderRecord = placeOrder({
      items: finalItems,
      subtotal: baseSubtotal,
      discountAmount: discountAmount,
      appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
      totalAmount: grandTotal,
      paymentMethod: methodName,
      upiId: upiDetail,
      shippingAddress: formData
    });

    // Clear cart immediately upon successful placement
    clearCart();

    toast.success(`🎉 Order ${orderRecord.orderId} Placed Successfully!`, { duration: 500 });
    navigate('/profile');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'cod') {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        executeOrderPlacement('Cash on Delivery (COD)', 'Cash on Delivery');
      }, 1200);
    } else {
      setIsRazorpayModalOpen(true);
    }
  };

  const handleRazorpayPaymentSuccess = (paymentData) => {
    setIsRazorpayModalOpen(false);
    executeOrderPlacement(paymentData.paymentMethod || 'Razorpay UPI', paymentData.upiId || 'customer@upi');
  };

  return (
    <div className="py-3">
      <h2 className="fw-bold font-heading mb-4">
        <i className="bi bi-shield-check text-primary me-2"></i>Checkout & Payment
      </h2>

      <form onSubmit={handleFormSubmit} className="row g-4">
        {/* Shipping Address Column */}
        <div className="col-lg-8">
          <div className="glass-card p-4 mb-4">
            <h5 className="fw-bold font-heading mb-3">
              <i className="bi bi-geo-alt-fill text-primary me-2"></i>1. Shipping Address
            </h5>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-main">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control glass-card border-secondary text-main"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-main">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control glass-card border-secondary text-main"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-main">Phone Number (+91)</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control glass-card border-secondary text-main"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-main">Street Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control glass-card border-secondary text-main"
                  placeholder="House / Flat No., Street"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-main">City / State</label>
                <input
                  type="text"
                  name="city"
                  className="form-control glass-card border-secondary text-main"
                  placeholder="City, State"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-main">PIN Code</label>
                <input
                  type="text"
                  name="zip"
                  className="form-control glass-card border-secondary text-main"
                  placeholder="6-digit PIN code"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Options Selection */}
          <div className="glass-card p-4">
            <h5 className="fw-bold font-heading mb-3">
              <i className="bi bi-credit-card-2-front-fill text-primary me-2"></i>2. Select Payment Method
            </h5>

            <div className="d-flex flex-column gap-3 mb-4">
              <label className={`glass-card p-4 d-flex align-items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'razorpay-upi' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-secondary hover-bg'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'razorpay-upi'}
                  onChange={() => setPaymentMethod('razorpay-upi')}
                  className="form-check-input cursor-pointer my-0 flex-shrink-0"
                />
                <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                  <i className="bi bi-qr-code-scan fs-4"></i>
                </div>
                <div className="flex-fill">
                  <div className="d-flex align-items-center gap-2">
                    <strong className="font-heading text-main">UPI & Instant QR</strong>
                    <span className="badge bg-primary font-monospace" style={{ fontSize: '0.68rem' }}>RECOMMENDED</span>
                  </div>
                  <small className="text-muted d-block mt-1">Google Pay, PhonePe, Paytm, BHIM, Cred UPI & Instant QR Code</small>
                </div>
              </label>

              <label className={`glass-card p-4 d-flex align-items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-secondary hover-bg'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="form-check-input cursor-pointer my-0 flex-shrink-0"
                />
                <div className="bg-info text-white rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                  <i className="bi bi-credit-card fs-4"></i>
                </div>
                <div className="flex-fill">
                  <strong className="font-heading text-main d-block">Credit / Debit Card / NetBanking</strong>
                  <small className="text-muted d-block mt-1">Visa, Mastercard, RuPay, HDFC, ICICI, SBI</small>
                </div>
              </label>

              <label className={`glass-card p-4 d-flex align-items-center gap-3 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-secondary hover-bg'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="form-check-input cursor-pointer my-0 flex-shrink-0"
                />
                <div className="bg-warning text-dark rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                  <i className="bi bi-cash-stack fs-4"></i>
                </div>
                <div className="flex-fill">
                  <strong className="font-heading text-main d-block">Cash on Delivery (COD)</strong>
                  <small className="text-muted d-block mt-1">Pay with cash upon package delivery</small>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Submit Button */}
        <div className="col-lg-4">
          
          {/* Backend Coupons Section */}
          <div className="glass-card p-4 mb-4 border-warning">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold font-heading mb-0 text-main d-flex align-items-center gap-2">
                <i className="bi bi-ticket-perforated-fill text-warning fs-5"></i>
                <span>Available Coupons (2)</span>
              </h6>
            </div>

            {/* Quick Click Available Coupons */}
            <div className="d-flex flex-column gap-2 mb-3">
              {AVAILABLE_BACKEND_COUPONS.map((c) => (
                <div 
                  key={c.code}
                  onClick={() => handleApplyCouponCode(c.code)}
                  className={`p-3 rounded-3 glass-card d-flex justify-content-between align-items-center cursor-pointer transition-all border ${
                    appliedCoupon?.code === c.code ? 'border-success bg-success bg-opacity-10' : 'border-secondary hover-bg'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex-grow-1 pe-3">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                      <span className="badge bg-warning text-dark font-monospace fw-bold">{c.code}</span>
                      <strong className="small font-heading text-main mb-0">{c.title}</strong>
                    </div>
                    <small className="text-muted d-block lh-sm" style={{ fontSize: '0.8rem' }}>{c.description}</small>
                  </div>
                  <div className="flex-shrink-0">
                    <button 
                      type="button"
                      className={`btn btn-sm font-heading rounded-pill px-3 py-1 ${appliedCoupon?.code === c.code ? 'btn-success' : 'btn-outline-warning'}`}
                    >
                      {appliedCoupon?.code === c.code ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Manual Code Input Bar */}
            <div className="d-flex align-items-center bg-dark bg-opacity-25 border border-secondary rounded-3 p-1 mt-3">
              <input
                type="text"
                className="form-control bg-transparent border-0 text-main font-monospace shadow-none"
                placeholder="Enter coupon (e.g. MEGA20)"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
              />
              {appliedCoupon ? (
                <button type="button" onClick={handleRemoveCoupon} className="btn btn-sm btn-outline-danger font-heading px-3 py-2 rounded-2">
                  Remove
                </button>
              ) : (
                <button type="button" onClick={() => handleApplyCouponCode()} className="btn btn-sm btn-megavault font-heading px-3 py-2 rounded-2">
                  Apply
                </button>
              )}
            </div>
          </div>

          <div className="glass-card p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold font-heading mb-3 border-bottom border-secondary pb-3">Final Order Review</h5>

            <div className="d-flex justify-content-between mb-2 text-muted small">
              <span>Items Subtotal</span>
              <span className="fw-bold text-main font-heading">₹{baseSubtotal.toLocaleString('en-IN')}</span>
            </div>

            {appliedCoupon && (
              <div className="d-flex justify-content-between mb-2 text-success small">
                <span>Backend Coupon ({appliedCoupon.code})</span>
                <span className="fw-bold font-heading">-₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2 text-muted small">
              <span>Express Delivery</span>
              <span className="fw-bold text-success font-heading">
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-muted small border-bottom border-secondary pb-3">
              <span>Estimated GST (18%)</span>
              <span className="fw-bold text-main font-heading">₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold font-heading h5 mb-0">Total Due:</span>
              <span className="display-6 fw-bold text-primary font-heading">₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-megavault btn-lg w-100 font-heading d-flex align-items-center justify-content-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-shield-lock-fill"></i>
                  <span>{paymentMethod === 'cod' ? 'Place Order (COD)' : 'Proceed to Secure UPI Payment'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Razorpay UPI Payment Gateway Modal */}
      <RazorpayPaymentModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        amount={grandTotal}
        onSuccess={handleRazorpayPaymentSuccess}
      />
    </div>
  );
};
