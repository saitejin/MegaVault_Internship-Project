import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ProductCard } from '../common/ProductCard';
import { aiRecommendationsData } from '../../utils/mockData';

export const AIRecommendationSection = () => {
  const context = useOutletContext();

  return (
    <section className="py-5 position-relative">
      <div className="glass-card p-4 p-md-5 border-primary shadow-lg position-relative overflow-hidden">
        <div className="row align-items-center mb-4 g-3">
          <div className="col-md-8">
            <div className="d-inline-flex align-items-center gap-2 badge badge-megavault mb-2">
              <i className="bi bi-stars"></i>
              <span>AI Curation Engine</span>
            </div>
            <h2 className="fw-bold font-heading mb-1 text-main">Recommended For You</h2>
            <p className="text-muted mb-0">Our Google Gemini AI engine analyzes current trends to suggest products tailored to your preferences.</p>
          </div>

          <div className="col-md-4 text-md-end">
            <button
              onClick={() => context?.openAIModal()}
              className="btn btn-megavault px-4 d-inline-flex align-items-center gap-2"
            >
              <i className="bi bi-robot"></i>
              <span>Customize AI Preferences</span>
            </button>
          </div>
        </div>

        <div className="row g-4">
          {aiRecommendationsData.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6">
              <div className="position-relative h-100">
                <div 
                  className="position-absolute top-0 start-0 z-3 m-3 badge bg-primary font-heading shadow-sm px-3 py-1.5"
                  style={{ borderRadius: '20px' }}
                >
                  <i className="bi bi-cpu me-1"></i>
                  {item.matchScore}% Match
                </div>

                <ProductCard product={item} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
