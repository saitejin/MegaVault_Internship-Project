import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { AppRouter } from './routes/AppRouter';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <OrderProvider>
                <Toaster 
                  position="top-center" 
                  reverseOrder={false}
                  toastOptions={{
                    duration: 500, // 0.5 seconds auto-dismiss
                    style: {
                      borderRadius: '14px',
                      background: 'rgba(15, 23, 42, 0.92)',
                      color: '#F8FAFC',
                      backdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(249, 115, 22, 0.4)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.65)'
                    }
                  }} 
                />
                <AppRouter />
              </OrderProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
