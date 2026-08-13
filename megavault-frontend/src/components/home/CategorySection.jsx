import React from 'react';
import { Link } from 'react-router-dom';
import { SectionTitle } from '../common/SectionTitle';
import { categoriesData } from '../../utils/mockData';

export const CategorySection = () => {
  return (
    <section className="py-5">
      <SectionTitle
        badge="Browse Collections"
        title="Popular Shopping Categories"
        subtitle="Explore our top curated departments powered by intelligent search."
        actionText="View All Categories"
        actionLink="/products"
      />

      <div className="row g-4">
        {categoriesData.map((cat) => (
          <div key={cat.id} className="col-lg-2 col-md-4 col-6">
            <Link
              to={`/products?category=${cat.id}`}
              className="glass-card p-3 d-flex flex-column text-center text-decoration-none h-100 position-relative overflow-hidden product-card-box"
            >
              <div 
                className="rounded-3 mb-3 bg-secondary overflow-hidden position-relative" 
                style={{ height: '110px' }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-100 h-100 object-fit-cover rounded-3"
                />
              </div>

              <h6 className="fw-bold font-heading text-main mb-1 text-truncate" title={cat.name}>
                {cat.name}
              </h6>
              <small className="text-primary font-heading fw-medium">{cat.itemCount}</small>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
