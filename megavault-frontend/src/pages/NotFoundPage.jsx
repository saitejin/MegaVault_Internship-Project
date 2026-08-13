import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="glass-card p-5 text-center my-4">
      <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
      <h3 className="fw-semibold mb-3">Page Not Found</h3>
      <Link to="/" className="btn btn-megavault">Back to Home</Link>
    </div>
  );
};
