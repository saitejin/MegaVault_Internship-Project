import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('megavault_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('megavault_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlistItems]);

  const isWishlisted = (productId) => {
    return wishlistItems.some(item => String(item.id) === String(productId));
  };

  const toggleWishlist = (product) => {
    if (!product || !product.id) return;

    if (isWishlisted(product.id)) {
      setWishlistItems(prev => prev.filter(item => String(item.id) !== String(product.id)));
      toast.success(`${product.title || 'Product'} removed from Wishlist`, { icon: '💔' });
    } else {
      setWishlistItems(prev => [...prev, product]);
      toast.success(`${product.title || 'Product'} added to Wishlist!`, { icon: '💖' });
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => String(item.id) !== String(productId)));
    toast.success('Removed from Wishlist', { icon: '💔' });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('megavault_wishlist');
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
