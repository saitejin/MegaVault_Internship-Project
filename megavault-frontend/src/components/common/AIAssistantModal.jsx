import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { allProductsData } from '../../utils/mockData';
import { queryAIAssistantBackend } from '../../services/grokService';

export const AIAssistantModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hey! I'm MegaVault AI ⚡\nWhat are you shopping for today? Type your query or choose a quick search:"
    }
  ]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    { icon: "bi-speaker", label: "Audio & Sound", query: "audio" },
    { icon: "bi-smartwatch", label: "Wearables", query: "wearables" },
    { icon: "bi-controller", label: "Gaming Gear", query: "gaming" },
    { icon: "bi-phone", label: "Mobiles & Tech", query: "mobile phones" },
    { icon: "bi-handbag", label: "Fashion", query: "fashion" },
    { icon: "bi-house-gear", label: "Smart Home", query: "smart home" }
  ];

  const handleAskPrompt = (promptQuery) => {
    setQuery(promptQuery);
    processQuery(promptQuery);
  };

  const processQuery = async (userQueryText) => {
    if (!userQueryText || !userQueryText.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: userQueryText };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsSearching(true);

    try {
      // Call AI Integration Service (Frontend Logic)
      const backendResult = await queryAIAssistantBackend([...messages, userMsg], allProductsData || []);

      let matchedProds = (backendResult && Array.isArray(backendResult.products) && backendResult.products.length > 0)
        ? backendResult.products 
        : (allProductsData || []).slice(0, 4);

      const aiText = backendResult?.text || (matchedProds.length > 0 
        ? `⚡ Found top results for "${userQueryText}":`
        : `⚡ Showing recommendations for "${userQueryText}":`);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: aiText, products: matchedProds.slice(0, 6) }
      ]);
    } catch (err) {
      console.error('Error processing AI query:', err);
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: 'ai', 
          text: `⚡ Here are some top recommendations for "${userQueryText}":`, 
          products: (allProductsData || []).slice(0, 4) 
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    processQuery(query);
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content glass-card border-primary p-0 overflow-hidden shadow-lg">
          
          {/* Header */}
          <div className="modal-header border-bottom border-secondary px-4 py-3 bg-opacity-25 bg-primary">
            <div className="d-flex align-items-center gap-3.5">
              <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm flex-shrink-0" style={{ width: '42px', height: '42px' }}>
                <i className="bi bi-cpu-fill fs-5 text-warning"></i>
              </div>
              <div className="ms-1">
                <h5 className="modal-title font-heading fw-bold mb-0 text-main d-flex align-items-center gap-2">
                  <span>MegaVault AI Assistant</span>
                  <span className="badge bg-warning text-dark font-monospace" style={{ fontSize: '0.68rem' }}>Smart Matching</span>
                </h5>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>Your Intelligent Shopping Companion</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>

          {/* Chat Body */}
          <div className="modal-body p-3 p-md-4" style={{ height: '420px', overflowY: 'auto' }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`d-flex mb-3 ${msg.id === 1 ? 'justify-content-center text-center w-100' : msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                <div className={`p-3 rounded-4 ${msg.sender === 'user' ? 'bg-primary text-white font-heading shadow-sm' : 'glass-card border-secondary text-main'} ${msg.id === 1 ? 'w-100 border-0 bg-transparent text-center' : ''}`} style={{ maxWidth: msg.id === 1 ? '100%' : '90%' }}>
                  <p className={`mb-3 pb-1 small leading-relaxed fw-semibold ${msg.id === 1 ? 'text-center fs-6 text-main' : ''}`} style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>

                  {/* Modern Centered Quick Prompt Cards */}
                  {msg.id === 1 && (
                    <div 
                      className="mt-3 pt-2 mx-auto" 
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '14px',
                        maxWidth: '560px'
                      }}
                    >
                      {quickPrompts.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAskPrompt(p.query)}
                          className="btn btn-outline-secondary btn-sm p-3 rounded-3 glass-card text-main d-flex flex-column align-items-center justify-content-center text-center gap-1.5 border-secondary hover-bg transition-all shadow-sm"
                          style={{ fontSize: '0.86rem', minHeight: '90px' }}
                        >
                          <i className={`bi ${p.icon} text-primary fs-5 mb-1`}></i>
                          <span className="font-heading fw-semibold text-main text-center">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Render Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="row g-2 mt-3">
                      {msg.products.map(p => (
                        <div key={p.id} className="col-sm-6">
                          <div className="position-relative">
                            <span className="position-absolute top-0 end-0 m-2 badge bg-primary text-white font-monospace z-1" style={{ fontSize: '0.68rem' }}>
                              Recommended
                            </span>
                            <ProductCard product={p} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSearching && (
              <div className="d-flex align-items-center gap-2 text-primary small p-2 font-heading">
                <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
                <span>Finding the best matches for you...</span>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="modal-footer border-top border-secondary p-3">
            <form onSubmit={handleSend} className="w-100 d-flex gap-2">
              <div className="input-group input-group-glass flex-fill">
                <input
                  type="text"
                  className="form-control text-main"
                  placeholder="Ask AI e.g. Show headphones under ₹5,000..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-megavault d-flex align-items-center gap-1.5 px-4 flex-shrink-0">
                <i className="bi bi-send-fill fs-6"></i>
                <span className="d-none d-sm-inline font-heading">Ask AI</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
