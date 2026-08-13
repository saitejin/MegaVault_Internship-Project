import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { AVAILABLE_BACKEND_COUPONS, applyBackendCoupon } from '../services/couponService';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCouponCode = async (codeToApply) => {
    const targetCode = codeToApply || couponCode;
    if (!targetCode) return;

    const result = await applyBackendCoupon(targetCode, subtotal);
    if (result.success) {
      setAppliedCoupon(result);
      setCouponCode(result.code);
      toast.success(result.message, { duration: 500 });
    } else {
      toast.error(result.message, { duration: 500 });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast('Coupon removed', { icon: 'ℹ️', duration: 500 });
  };

  // Calculations
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const netSubtotal = Math.max(0, subtotal - discountAmount);
  const shipping = netSubtotal > 499 || cartItems.length === 0 ? 0 : 99;
  const tax = netSubtotal * 0.18; // 18% GST
  const grandTotal = netSubtotal + shipping + tax;

  return (
    <div className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold font-heading mb-0">
          <i className="bi bi-cart3 text-primary me-2"></i>Shopping Cart
        </h2>
        {cartItems.length > 0 && (
          <button 
            onClick={clearCart} 
            className="btn btn-outline-danger btn-sm font-heading px-3 rounded-pill d-flex align-items-center gap-1.5"
            title="Clear all cart items"
          >
            <i className="bi bi-trash3"></i>
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="glass-card p-5 text-center my-4 border-primary shadow-lg">
          <i className="bi bi-cart-x display-3 text-muted mb-3 d-block"></i>
          <h4 className="fw-bold font-heading mb-2">Your Cart is Empty</h4>
          <p className="text-muted mb-4">Explore our catalog and add your favorite products to your cart.</p>
          <Link to="/products" className="btn btn-megavault font-heading px-4 py-2.5">
            <i className="bi bi-bag me-2"></i>Explore Products
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Table Column */}
          <div className="col-lg-8">
            <div className="glass-card p-4 mb-4">
              <div className="table-responsive">
                <table className="table table-borderless text-main align-middle mb-0">
                  <thead className="border-bottom border-secondary text-muted small font-heading">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th className="text-center">Quantity</th>
                      <th>Total</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-bottom border-secondary border-opacity-25">
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img src={item.image} alt={item.title} className="rounded-3 object-fit-cover bg-secondary" style={{ width: '60px', height: '60px' }} />
                            <div>
                              <Link to={`/products/${item.id}`} className="fw-bold font-heading text-main text-decoration-none d-block text-truncate" style={{ maxWidth: '200px' }}>
                                {item.title}
                              </Link>
                              <small className="text-muted">{item.category}</small>
                            </div>
                          </div>
                        </td>
                        <td className="fw-semibold font-heading">₹{Number(item.price).toLocaleString('en-IN')}</td>
                        <td>
                          <div className="input-group input-group-sm mx-auto" style={{ width: '100px' }}>
                            <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, -1)}>-</button>
                            <span className="form-control text-center glass-card border-secondary text-main font-heading fw-bold">
                              {item.quantity}
                            </span>
                            <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, 1)}>+</button>
                          </div>
                        </td>
                        <td className="fw-bold text-primary font-heading">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </td>
                        <td className="text-end">
                          <button onClick={() => removeFromCart(item.id, item.title)} className="btn btn-outline-danger btn-sm rounded-circle p-1" style={{ width: '32px', height: '32px' }} title="Remove item">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Promo Code Input & Backend Coupons List Below */}
            <div className="glass-card p-4 border-warning">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold font-heading mb-0 text-main d-flex align-items-center gap-2">
                  <i className="bi bi-ticket-perforated-fill text-warning fs-5"></i>
                  <span>Have a Promo Code or Store Coupon?</span>
                </h6>
                <span className="badge bg-warning text-dark font-monospace" style={{ fontSize: '0.68rem' }}>STORE COUPONS</span>
              </div>

              {/* Input Bar */}
              <form onSubmit={(e) => { e.preventDefault(); handleApplyCouponCode(); }} className="input-group input-group-glass mb-3">
                <input
                  type="text"
                  className="form-control text-main font-monospace"
                  placeholder="Enter coupon e.g. MEGA20 or FLAT500"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                {appliedCoupon ? (
                  <button type="button" onClick={handleRemoveCoupon} className="btn btn-outline-danger font-heading px-4">
                    Remove
                  </button>
                ) : (
                  <button type="submit" className="btn btn-megavault font-heading px-4">
                    Apply Code
                  </button>
                )}
              </form>

              {/* Display Backend Store Coupons Below */}
              <div className="mt-3 pt-3 border-top border-secondary">
                <small className="text-muted d-block uppercase tracking-wider font-heading fw-bold mb-2.5" style={{ fontSize: '0.74rem' }}>
                  <i className="bi bi-stars text-warning me-1"></i>Available Store Coupons (Click to Apply):
                </small>

                <div className="d-flex flex-column gap-2.5">
                  {AVAILABLE_BACKEND_COUPONS.map((c) => (
                    <div
                      key={c.code}
                      onClick={() => handleApplyCouponCode(c.code)}
                      className={`p-3 rounded-3 glass-card d-flex justify-content-between align-items-center cursor-pointer transition-all border ${
                        appliedCoupon?.code === c.code ? 'border-success bg-success bg-opacity-10 shadow-sm' : 'border-secondary hover-bg'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 p-2 bg-warning bg-opacity-15 text-warning d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                          <i className="bi bi-tag-fill fs-5"></i>
                        </div>
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-warning text-dark font-monospace fw-bold">{c.code}</span>
                            <strong className="font-heading text-main small">{c.title}</strong>
                          </div>
                          <small className="text-muted d-block mt-1" style={{ fontSize: '0.78rem' }}>{c.description}</small>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`btn btn-sm font-heading rounded-pill px-3 py-1 flex-shrink-0 ${
                          appliedCoupon?.code === c.code ? 'btn-success' : 'btn-outline-warning'
                        }`}
                      >
                        {appliedCoupon?.code === c.code ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Cart Order Summary Sidebar Column */}
          <div className="col-lg-4">
            <div className="glass-card p-4 sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold font-heading mb-3 border-bottom border-secondary pb-3">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)</span>
                <span className="fw-bold text-main font-heading">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {appliedCoupon && (
                <div className="d-flex justify-content-between mb-2 text-success small">
                  <span>Store Coupon ({appliedCoupon.code})</span>
                  <span className="fw-bold font-heading">-₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>Shipping Fee</span>
                <span className="fw-bold text-main font-heading">
                  {shipping === 0 ? <span className="text-success">FREE</span> : `₹${shipping}`}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-3 text-muted small border-bottom border-secondary pb-3">
                <span>Estimated GST (18%)</span>
                <span className="fw-bold text-main font-heading">₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold font-heading h5 mb-0">Total:</span>
                <span className="display-6 fw-bold text-primary font-heading">₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-megavault btn-lg w-100 font-heading d-flex align-items-center justify-content-center gap-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
