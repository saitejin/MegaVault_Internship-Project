import React from 'react';
import { SectionTitle } from '../common/SectionTitle';
import { ProductCard } from '../common/ProductCard';
import { featuredProductsData } from '../../utils/mockData';

export const FeaturedProducts = () => {
  return (
    <section className="py-5">
      <SectionTitle
        badge="Handpicked For You"
        title="Featured Deals & Products"
        subtitle="Check out top-rated tech and gadgets selected for quality and value in Indian Rupees (₹)."
        actionText="Explore All Products"
        actionLink="/products"
      />

      <div className="row g-4">
        {featuredProductsData.map((product) => (
          <div key={product.id} className="col-lg-3 col-md-6">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
