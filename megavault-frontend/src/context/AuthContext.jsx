import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const formatNameFromEmail = (email) => {
  if (!email) return 'Valued Customer';
  const prefix = email.split('@')[0];
  const cleanName = prefix
    .replace(/[._-]/g, ' ')
    .replace(/\d+/g, ' ')
    .trim();

  if (!cleanName) return prefix.charAt(0).toUpperCase() + prefix.slice(1);

  return cleanName
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('megavault_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const login = (userData) => {
    const finalName = userData.name
      ? userData.name
      : formatNameFromEmail(userData.email);

    const userObj = {
      name: finalName,
      email: userData.email,
      role: userData.role || 'ROLE_CUSTOMER',
      isVerified: userData.isVerified || false
    };

    setUser(userObj);
    localStorage.setItem('megavault_user', JSON.stringify(userObj));
    localStorage.setItem('megavault_token', 'jwt_token_active_user');
    toast.success(`Welcome, ${userObj.name}!`, { icon: '👋' });
  };

  const updateProfile = (updatedData) => {
    const newObj = { ...user, ...updatedData };
    setUser(newObj);
    localStorage.setItem('megavault_user', JSON.stringify(newObj));
    toast.success('Profile updated successfully!', { icon: '✨' });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('megavault_user');
    localStorage.removeItem('megavault_token');
    toast.success('Logged out successfully', { icon: '🚪' });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
