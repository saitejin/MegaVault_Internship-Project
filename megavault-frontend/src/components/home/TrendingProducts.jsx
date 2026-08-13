import React, { useState } from 'react';
import { ProductCard } from '../common/ProductCard';
import { trendingProductsData } from '../../utils/mockData';

export const TrendingProducts = () => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Audio', 'Wearables', 'Gaming', 'Electronics'];

  const filteredProducts = activeTab === 'All'
    ? trendingProductsData
    : trendingProductsData.filter(p => p.category === activeTab);

  return (
    <section className="py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
        <div>
          <span className="badge badge-megavault mb-2">🔥 Hot Right Now</span>
          <h2 className="fw-bold mb-1 font-heading">Trending Products in India</h2>
          <p className="text-muted mb-0">Most popular products bought by shoppers this week.</p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn btn-sm rounded-pill font-heading px-3 ${
                activeTab === tab ? 'btn-megavault' : 'btn-outline-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="col-lg-3 col-md-6">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
