import React from "react";
import { HeroSection } from "../../components/home/HeroSection";
import { CategorySection } from "../../components/home/CategorySection";
import { ServicesSection } from "../../components/home/ServicesSection";
import { FeaturedProducts } from "../../components/home/FeaturedProducts";
import { TrendingProducts } from "../../components/home/TrendingProducts";
import { AIRecommendationSection } from "../../components/home/AIRecommendationSection";
import { NewsletterSection } from "../../components/home/NewsletterSection";
import "./index.css";

const Home = () => {
  return (
    <div className="home-container d-flex flex-column gap-4 py-4 container">
      {/* 1. Hero Spotlight */}
      <HeroSection />

      {/* 2. Categories */}
      <CategorySection />

      {/* 3. Value Badges */}
      <ServicesSection />

      {/* 4. Featured Products */}
      <FeaturedProducts />

      {/* 5. Trending Products */}
      <TrendingProducts />

      {/* 6. AI Recommendations */}
      <AIRecommendationSection />

      {/* 7. Newsletter */}
      <NewsletterSection />
    </div>
  );
};

export default Home;
