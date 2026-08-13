import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AIAssistantModal } from '../components/common/AIAssistantModal';

export const MainLayout = () => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <Navbar onOpenAI={() => setIsAIModalOpen(true)} />
      
      <main className="flex-grow-1 container py-4">
        <Outlet context={{ openAIModal: () => setIsAIModalOpen(true) }} />
      </main>

      <Footer />

      {/* Floating AI Assistant Trigger Button (Bottom Right) */}
      <button
        onClick={() => setIsAIModalOpen(true)}
        className="btn border-0 shadow-lg d-flex align-items-center gap-2.5 px-3.5 py-2.5 rounded-pill text-white transition-all hover-scale"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 1040,
          background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
          boxShadow: '0 8px 24px rgba(249, 115, 22, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
          border: '1.5px solid rgba(255, 255, 255, 0.3)',
          cursor: 'pointer'
        }}
        title="Open MegaVault AI Assistant"
      >
        <div className="bg-white text-primary rounded-circle p-1.5 d-flex align-items-center justify-content-center shadow-sm flex-shrink-0" style={{ width: '34px', height: '34px' }}>
          <i className="bi bi-stars fs-5"></i>
        </div>
        <div className="text-start pe-1 font-heading">
          <strong className="d-block text-white fw-bold leading-tight" style={{ fontSize: '0.9rem' }}>Ask AI Assistant</strong>
          <small className="text-white text-opacity-85 d-block" style={{ fontSize: '0.74rem' }}>Smart Product Recommendations</small>
        </div>
      </button>

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </div>
  );
};
