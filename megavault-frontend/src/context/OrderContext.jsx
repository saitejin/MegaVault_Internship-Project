import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('megavault_orders');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading orders from localStorage', e);
    }
    return [];
  });

  // Sync orders to localStorage whenever orders state updates
  useEffect(() => {
    try {
      localStorage.setItem('megavault_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders to localStorage', e);
    }
  }, [orders]);

  // Send Email Helper
  const sendEmailNotification = async (endpoint, payload) => {
    try {
      const res = await fetch(`http://localhost:8080/api/email/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`📧 [Email Sent]: ${data.message}`);
      }
    } catch (err) {
      console.warn('Backend Email Notification API unreachable, logged locally.');
    }
  };

  // Place a new order
  const placeOrder = (orderData) => {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const userEmail = orderData.shippingAddress?.email || 'customer@megavault.com';
    const userName = orderData.shippingAddress?.fullName || 'Valued Customer';

    const newOrder = {
      orderId,
      id: orderId,
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || 'Razorpay UPI',
      upiId: orderData.upiId || 'N/A',
      shippingAddress: orderData.shippingAddress || {},
      status: 'CONFIRMED',
      placedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send Order Confirmation Email via Backend API
    sendEmailNotification('order-confirmation', {
      email: userEmail,
      name: userName,
      orderId,
      totalAmount: newOrder.totalAmount,
      paymentMethod: newOrder.paymentMethod,
      upiId: newOrder.upiId
    });

    toast.success(`📧 Confirmation email sent to ${userEmail}!`, { icon: '📩', duration: 4500 });

    return newOrder;
  };

  // Cancel an existing order
  const cancelOrder = (orderId) => {
    let targetOrder = null;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order.orderId === orderId) {
          targetOrder = {
            ...order,
            status: 'CANCELLED',
            cancelledAt: new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };
          return targetOrder;
        }
        return order;
      })
    );

    if (targetOrder) {
      const userEmail = targetOrder.shippingAddress?.email || 'customer@megavault.com';
      const userName = targetOrder.shippingAddress?.fullName || 'Valued Customer';

      // Send Order Cancellation Email via Backend API
      sendEmailNotification('order-cancellation', {
        email: userEmail,
        name: userName,
        orderId: targetOrder.orderId,
        totalAmount: targetOrder.totalAmount,
        upiId: targetOrder.upiId
      });

      toast.success(`📧 Order cancellation & refund email sent to ${userEmail}!`, { icon: '📩', duration: 5000 });
    }
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
