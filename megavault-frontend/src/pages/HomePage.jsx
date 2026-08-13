import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategorySection } from '../components/home/CategorySection';
import { BudgetSegmentSection } from '../components/home/BudgetSegmentSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { TrendingProducts } from '../components/home/TrendingProducts';
import { AIRecommendationSection } from '../components/home/AIRecommendationSection';
import { NewsletterSection } from '../components/home/NewsletterSection';

export const HomePage = () => {
  return (
    <div className="d-flex flex-column gap-3">
      <HeroSection />
      <CategorySection />
      <BudgetSegmentSection />
      <ServicesSection />
      <FeaturedProducts />
      <TrendingProducts />
      <AIRecommendationSection />
      <NewsletterSection />
    </div>
  );
};
