import React from 'react';
import { useNavigate } from 'react-router-dom';
import { budgetCategoriesData } from '../../utils/mockData';

export const BudgetSegmentSection = () => {
  const navigate = useNavigate();

  const budgetSegments = [
    {
      id: 'under-10k',
      title: 'Under ₹10,000',
      subtitle: 'Budget Vault Tiers',
      badge: 'Best Value',
      icon: 'bi-wallet2',
      colorGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.05) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      accentColor: '#10b981',
      highlights: ['Redmi 13C 5G', 'boAt Airdopes', 'Noise Smartwatches', 'TP-Link Smart Plugs']
    },
    {
      id: 'under-30k',
      title: 'Under ₹30,000',
      subtitle: 'Popular Performance Tiers',
      badge: 'Most Popular',
      icon: 'bi-lightning-charge-fill',
      colorGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.05) 100%)',
      borderColor: 'rgba(59, 130, 246, 0.4)',
      accentColor: '#3b82f6',
      highlights: ['OnePlus 12R 5G', 'Dell 4K Monitors', 'iPad Air 5th Gen', 'Sennheiser Headphones']
    },
    {
      id: 'under-50k',
      title: 'Under ₹50,000',
      subtitle: 'Pro & Gaming Tiers',
      badge: 'Pro Tier',
      icon: 'bi-controller',
      colorGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.05) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.4)',
      accentColor: '#f59e0b',
      highlights: ['Vivo X100 Zeiss 5G', 'iQOO 12 5G', 'Sony 55" OLED TV', 'Apple Watch Series 9']
    },
    {
      id: 'under-1lakh',
      title: 'Under ₹1 Lakh',
      subtitle: 'Ultimate Flagship Tech',
      badge: 'Flagship Vault',
      icon: 'bi-gem',
      colorGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.05) 100%)',
      borderColor: 'rgba(168, 85, 247, 0.4)',
      accentColor: '#a855f7',
      highlights: ['Samsung Galaxy Z Fold5', 'MacBook Pro M3', 'ASUS Zenbook OLED', 'Roborock S8 LiDAR']
    }
  ];

  const handleSegmentClick = (budgetId) => {
    navigate(`/products?budget=${budgetId}`);
  };

  return (
    <section className="py-4">
      <div className="container-fluid px-0">
        {/* Section Title */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <span className="badge bg-warning text-dark font-monospace mb-2 px-3 py-1.5 rounded-pill">
              <i className="bi bi-tag-fill me-1"></i> BUDGET SEGMENTS
            </span>
            <h3 className="fw-bold font-heading mb-1 text-main">Shop Tech by Budget</h3>
            <p className="text-muted mb-0">Discover top-rated smartphones, audio gear, and electronics tailored to your spending limit.</p>
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="btn btn-outline-light btn-sm font-heading rounded-pill px-4 mt-3 mt-md-0 align-self-start align-self-md-auto"
          >
            Explore All Budgets <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>

        {/* 4 Budget Segment Cards Grid */}
        <div className="row g-4">
          {budgetSegments.map((seg) => (
            <div key={seg.id} className="col-12 col-sm-6 col-lg-3">
              <div 
                onClick={() => handleSegmentClick(seg.id)}
                className="glass-card p-4 h-100 position-relative cursor-pointer transition-all hover-lift"
                style={{
                  background: seg.colorGradient,
                  border: `1px solid ${seg.borderColor}`,
                  borderRadius: '18px'
                }}
              >
                {/* Badge */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span 
                    className="badge rounded-pill px-3 py-1 font-heading" 
                    style={{ backgroundColor: `${seg.accentColor}25`, color: seg.accentColor, border: `1px solid ${seg.accentColor}50` }}
                  >
                    {seg.badge}
                  </span>
                  <i className={`bi ${seg.icon} fs-3`} style={{ color: seg.accentColor }}></i>
                </div>

                {/* Title & Price */}
                <h4 className="fw-bold font-heading mb-1 text-main fs-4">{seg.title}</h4>
                <p className="text-muted small mb-3">{seg.subtitle}</p>

                {/* Included Highlights Pills */}
                <div className="mb-4">
                  <small className="text-muted font-heading d-block mb-2 text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                    Popular Products Included:
                  </small>
                  <div className="d-flex flex-wrap gap-1">
                    {seg.highlights.map((item, idx) => (
                      <span 
                        key={idx} 
                        className="badge bg-dark bg-opacity-60 text-light fw-normal rounded-pill px-2.5 py-1 font-monospace"
                        style={{ fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-40 mt-auto">
                  <span className="small fw-semibold font-heading" style={{ color: seg.accentColor }}>
                    Browse Category Products
                  </span>
                  <i className="bi bi-chevron-right fs-6" style={{ color: seg.accentColor }}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
