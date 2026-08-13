import React from 'react';
import { Link } from 'react-router-dom';
import { Rating } from './Rating';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const {
    id = '1',
    title = 'Sample Product',
    category = 'Electronics',
    price = 4999,
    originalPrice = 6999,
    rating = 4.5,
    reviewsCount = 28,
    image = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    productCode = '',
    isNew = false,
    badgeText = ''
  } = product || {};

  const wishlisted = isWishlisted(id);

  const discount = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="glass-card h-100 d-flex flex-column overflow-hidden position-relative product-card-box border-secondary">
      {/* Badges Container */}
      <div className="position-absolute top-0 start-0 p-3 d-flex flex-column gap-1 z-2">
        {discount > 0 && (
          <span className="badge bg-danger rounded-pill px-2.5 py-1 font-heading shadow-sm">
            -{discount}% OFF
          </span>
        )}
        {isNew && (
          <span className="badge badge-megavault rounded-pill px-2.5 py-1 shadow-sm">
            NEW
          </span>
        )}
        {badgeText && (
          <span className="badge bg-primary rounded-pill px-2.5 py-1 shadow-sm">
            {badgeText}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="btn btn-icon-highlight btn-sm rounded-circle position-absolute top-0 end-0 m-3 z-2 d-flex align-items-center justify-content-center shadow-sm"
        style={{ width: '36px', height: '36px' }}
        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <i className={`bi ${wishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
      </button>

      {/* Image Container */}
      <Link 
        to={`/products/${id}`} 
        className="w-100 overflow-hidden position-relative d-block p-0 bg-dark" 
        style={{ height: '240px' }}
      >
        <img
          src={image}
          alt={title}
          className="w-100 h-100 object-fit-cover d-block rounded-top-3"
          style={{ transition: 'none' }}
        />
      </Link>

      {/* Product Details Body */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
            {category}
          </small>
          {productCode && (
            <span className="badge bg-secondary bg-opacity-25 text-info font-monospace py-0.5 px-2 rounded" style={{ fontSize: '0.7rem' }}>
              <i className="bi bi-qr-code me-1"></i>{productCode}
            </span>
          )}
        </div>

        <Link to={`/products/${id}`} className="text-reset text-decoration-none">
          <h6 className="fw-bold mb-2 text-truncate font-heading" title={title}>
            {title}
          </h6>
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <Rating rating={rating} count={reviewsCount} />
        </div>

        {/* Price & Action Footer */}
        <div className="mt-auto d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25">
          <div>
            <span className="h5 fw-bold text-primary mb-0 font-heading">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {originalPrice > price && (
              <span className="text-muted text-decoration-line-through ms-2 small">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-megavault btn-sm px-3 d-flex align-items-center gap-1 font-heading"
          >
            <i className="bi bi-cart-plus-fill"></i>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
