import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { useWishlist } from '../context/WishlistContext';

export const WishlistPage = () => {
  const { wishlistItems, clearWishlist } = useWishlist();

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="py-5 text-center">
        <div className="glass-card p-5 border-secondary shadow-lg rounded-4 max-w-md mx-auto">
          <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
            <i className="bi bi-heart fs-1"></i>
          </div>
          <h3 className="fw-bold font-heading mb-2 text-main">Your Wishlist is Empty</h3>
          <p className="text-muted small mb-4">
            You haven't saved any items yet. Explore our catalog and click the heart icon on any product to save it here!
          </p>
          <Link to="/products" className="btn btn-megavault px-4 py-2.5 font-heading">
            <i className="bi bi-shop me-2"></i>Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
        <div className="d-flex align-items-center gap-2">
          <h2 className="fw-bold font-heading mb-0 text-main">
            <i className="bi bi-heart-fill text-danger me-2"></i>My Wishlist
          </h2>
          <span className="badge bg-primary rounded-pill font-monospace">{wishlistItems.length} Saved</span>
        </div>
        <button onClick={clearWishlist} className="btn btn-outline-danger btn-sm font-heading rounded-pill px-3">
          <i className="bi bi-trash me-1"></i>Clear Wishlist
        </button>
      </div>

      <div className="row g-4">
        {wishlistItems.map((p) => (
          <div key={p.id} className="col-lg-3 col-md-6">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};
