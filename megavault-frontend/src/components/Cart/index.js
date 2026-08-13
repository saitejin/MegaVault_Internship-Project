import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { allProductsData } from "../../utils/mockData";
import "./index.css";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("megavault_cart");
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error loading cart from localStorage", e);
    }
    return [
      { ...allProductsData[0], quantity: 1 },
      { ...allProductsData[1], quantity: 1 }
    ];
  });

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem("megavault_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
    }
  }, [cartItems]);

  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeItem = (id, title) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.id !== id);
      localStorage.setItem("megavault_cart", JSON.stringify(updated));
      return updated;
    });
    toast.success(`${title || "Item"} removed from cart`, { icon: "🗑️" });
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.setItem("megavault_cart", JSON.stringify([]));
    toast.success("Cart cleared successfully", { icon: "🧹" });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "MEGAVAULT10" || couponCode.trim().toUpperCase() === "AI10") {
      setDiscountPercent(10);
      toast.success("10% AI Promo Code Applied!", { icon: "🎉" });
    } else {
      toast.error('Invalid Promo Code. Try "MEGAVAULT10"');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 499 || cartItems.length === 0 ? 0 : 99;
  const tax = (subtotal - discountAmount) * 0.18;
  const grandTotal = subtotal - discountAmount + shipping + tax;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold font-heading mb-0"><i className="bi bi-cart3 text-primary me-2"></i>Shopping Cart</h2>
        {cartItems.length > 0 && (
          <button 
            onClick={handleClearCart} 
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
          <p className="text-muted mb-4">You have removed all items from your cart.</p>
          <Link to="/products" className="btn btn-megavault font-heading px-4 py-2.5">
            <i className="bi bi-bag me-2"></i>Explore Products
          </Link>
        </div>
      ) : (
        <div className="row g-4">
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
                            <img src={item.image} alt={item.title} className="rounded-3 object-fit-cover bg-secondary" style={{ width: "60px", height: "60px" }} />
                            <div>
                              <Link to={`/products/${item.id}`} className="fw-bold font-heading text-main text-decoration-none d-block text-truncate" style={{ maxWidth: "200px" }}>
                                {item.title}
                              </Link>
                              <small className="text-muted">{item.category}</small>
                            </div>
                          </div>
                        </td>
                        <td className="fw-semibold font-heading">₹{item.price.toLocaleString("en-IN")}</td>
                        <td>
                          <div className="input-group input-group-sm mx-auto" style={{ width: "100px" }}>
                            <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, -1)}>-</button>
                            <span className="form-control text-center glass-card border-secondary text-main font-heading fw-bold">
                              {item.quantity}
                            </span>
                            <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, 1)}>+</button>
                          </div>
                        </td>
                        <td className="fw-bold text-primary font-heading">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </td>
                        <td className="text-end">
                          <button onClick={() => removeItem(item.id, item.title)} className="btn btn-outline-danger btn-sm rounded-circle p-1" style={{ width: "32px", height: "32px" }} title="Remove item">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-card p-4">
              <h6 className="fw-bold font-heading mb-2"><i className="bi bi-ticket-perforated text-primary me-2"></i>Have a Promo Code?</h6>
              <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control glass-card border-secondary text-main"
                  placeholder="Try 'MEGAVAULT10'"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button type="submit" className="btn btn-megavault font-heading">Apply</button>
              </form>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="glass-card p-4 sticky-top" style={{ top: "90px" }}>
              <h5 className="fw-bold font-heading mb-3 border-bottom border-secondary pb-3">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="fw-bold text-main font-heading">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {discountPercent > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success small">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span className="fw-bold font-heading">-₹{discountAmount.toLocaleString("en-IN")}</span>
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
                <span className="fw-bold text-main font-heading">₹{tax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold font-heading h5 mb-0">Total:</span>
                <span className="display-6 fw-bold text-primary font-heading">₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="btn btn-megavault btn-lg w-100 font-heading d-flex align-items-center justify-content-center gap-2"
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

export default Cart;
