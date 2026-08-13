import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Rating } from '../components/common/Rating';
import { allProductsData } from '../utils/mockData';
import { useCart } from '../context/CartContext';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = allProductsData.find((p) => p.id === id) || allProductsData[0];
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);

  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (addToCart) addToCart(product, quantity);
    toast.success(`${quantity}x ${product.title} added to cart!`, { icon: '🛒' });
  };

  const handleBuyNow = () => {
    toast.success('Redirecting to checkout...', { icon: '⚡' });
    navigate('/checkout');
  };

  return (
    <div className="py-3">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/" className="text-muted">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products" className="text-muted">Products</Link></li>
          <li className="breadcrumb-item active text-primary">{product.title}</li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="glass-card p-4 text-center mb-3">
            <img src={selectedImage} alt={product.title} className="img-fluid object-fit-contain" style={{ maxHeight: '380px' }} />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="glass-card p-4">
            <span className="badge badge-megavault mb-2">{product.category}</span>
            <h2 className="fw-bold font-heading mb-2">{product.title}</h2>
            <div className="mb-3">
              <Rating rating={product.rating} count={product.reviewsCount} />
            </div>
            <div className="d-flex align-items-baseline gap-3 mb-4 pb-3 border-bottom border-secondary">
              <span className="display-6 fw-bold text-primary font-heading">₹{product.price.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-muted mb-4">{product.description}</p>
            <div className="d-flex gap-3">
              <button onClick={handleAddToCart} className="btn btn-megavault flex-grow-1">Add to Cart</button>
              <button onClick={handleBuyNow} className="btn btn-megavault-outline flex-grow-1">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
