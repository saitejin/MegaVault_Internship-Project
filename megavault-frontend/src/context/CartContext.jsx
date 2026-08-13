import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('megavault_cart');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
    }
    return [];
  });

  // Sync cart items to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('megavault_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cartItems]);

  // Add Product to Cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => String(item.id) === String(product.id));

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });

    toast.success(`Added ${product.title || 'Product'} to Cart!`, {
      icon: '🛒',
      duration: 3000
    });
  };

  // Remove Product from Cart
  const removeFromCart = (productId, title) => {
    setCartItems((prevItems) => prevItems.filter((item) => String(item.id) !== String(productId)));
    toast.success(`${title || 'Item'} removed from cart`, { icon: '🗑️' });
  };

  // Update Quantity (+1 / -1)
  const updateQuantity = (productId, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (String(item.id) === String(productId)) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // Clear Entire Cart
  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared successfully', { icon: '🧹' });
  };

  // Total Item Quantity Count for Navbar Badge
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Subtotal Price Sum
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
