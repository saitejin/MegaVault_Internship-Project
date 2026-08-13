import React from 'react';

export const Rating = ({ rating = 0, count = 0, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="d-flex align-items-center gap-1">
      <div className="d-flex text-warning fs-6">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill"></i>
        ))}
        {hasHalfStar && <i className="bi bi-star-half"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star"></i>
        ))}
      </div>
      {showCount && (
        <small className="text-muted ms-1 fw-medium">
          {rating.toFixed(1)} {count > 0 && `(${count})`}
        </small>
      )}
    </div>
  );
};
