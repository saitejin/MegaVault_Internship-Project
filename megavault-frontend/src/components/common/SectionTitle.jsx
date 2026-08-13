import React from 'react';
import { Link } from 'react-router-dom';

export const SectionTitle = ({ 
  badge, 
  title, 
  subtitle, 
  actionText, 
  actionLink 
}) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
      <div>
        {badge && (
          <span className="badge badge-megavault mb-2 text-uppercase tracking-wider">
            {badge}
          </span>
        )}
        <h2 className="fw-bold mb-1 font-heading">{title}</h2>
        {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      </div>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-megavault-outline btn-sm align-self-start align-self-md-auto">
          {actionText} <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      )}
    </div>
  );
};
