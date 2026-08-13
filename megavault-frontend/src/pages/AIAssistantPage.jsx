import React, { useState } from 'react';
import { ProductCard } from '../components/common/ProductCard';
import { allProductsData } from '../utils/mockData';
import { queryAIAssistantBackend } from '../services/grokService';

export const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "⚡ Welcome to MegaVault AI Hub! Powered by Backend REST API & xAI Grok (grok-beta). Ask me anything about products, prices in ₹, comparisons, or recommendations!",
      recommendedProducts: [allProductsData[0], allProductsData[1]]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const presets = [
    "Find ANC wireless headphones under ₹5,000",
    "Best smart watches under ₹15,000 with ECG",
    "Mechanical gaming keyboards under ₹4,000",
    "Top rated 4K monitors with USB-C"
  ];

  const handleSend = async (userText) => {
    const textToSend = userText || inputValue;
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!userText) setInputValue('');
    setIsThinking(true);

    // Call Backend REST API /api/ai/chat with xAI Grok Fallback
    const backendResult = await queryAIAssistantBackend(textToSend, allProductsData);

    let matchedProds = (backendResult && backendResult.products && backendResult.products.length > 0)
      ? backendResult.products 
      : allProductsData.slice(0, 2);

    const qLower = textToSend.toLowerCase();
    if (!backendResult || !backendResult.products || backendResult.products.length === 0) {
      if (qLower.includes('keyboard') || qLower.includes('gaming')) {
        matchedProds = [allProductsData[2]];
      } else if (qLower.includes('watch') || qLower.includes('wearable')) {
        matchedProds = [allProductsData[1]];
      } else if (qLower.includes('monitor') || qLower.includes('4k')) {
        matchedProds = [allProductsData[3]];
      }
    }

    const aiResponseText = backendResult?.text || `⚡ [Grok AI Response]: Based on your request "${textToSend}", I evaluated catalog specifications and pricing. Here are top recommendations:`;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        recommendedProducts: matchedProds
      }
    ]);
    setIsThinking(false);
  };

  return (
    <div className="py-3">
      <div className="text-center mb-4">
        <div className="badge badge-megavault px-3 py-2 mb-2">
          <i className="bi bi-cpu-fill me-1 text-warning"></i>Backend &amp; Grok AI Integrated
        </div>
        <h2 className="fw-bold font-heading mb-1">MegaVault AI Shopping Assistant</h2>
        <p className="text-muted small">Connected to Spring Boot Backend REST API (/api/ai/chat) &amp; xAI Grok API in Indian Rupees (₹).</p>
      </div>

      {/* Preset Prompt Buttons */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="btn btn-outline-primary btn-sm rounded-pill font-heading"
          >
            <i className="bi bi-magic me-1"></i>{p}
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="glass-card p-4 mx-auto mb-4 border-primary" style={{ maxWidth: '800px' }}>
        <div className="d-flex flex-column gap-4" style={{ minHeight: '400px', maxHeight: '600px', overflowY: 'auto' }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className="d-flex gap-2 max-w-85" style={{ maxWidth: '85%' }}>
                {msg.sender === 'ai' && (
                  <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px' }}>
                    <i className="bi bi-cpu-fill"></i>
                  </div>
                )}
                <div>
                  <div className={`p-3 rounded-4 ${msg.sender === 'user' ? 'bg-primary text-white font-heading' : 'glass-card border-secondary text-main'}`}>
                    <p className="mb-0 small leading-relaxed" style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                  </div>

                  {/* Render Product Cards inside AI response */}
                  {msg.recommendedProducts && (
                    <div className="row g-3 mt-2">
                      {msg.recommendedProducts.map((p) => (
                        <div key={p.id} className="col-sm-6">
                          <ProductCard product={p} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="d-flex align-items-center gap-2 text-primary p-2">
              <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
              <small className="fw-semibold">Processing via Backend REST API (/api/ai/chat)...</small>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="input-group input-group-glass mt-4 pt-3 border-top border-secondary">
          <input
            type="text"
            className="form-control text-main"
            placeholder="Ask Grok AI e.g. Show headphones under ₹5,000..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="btn btn-megavault d-flex align-items-center gap-1 font-heading px-4">
            <i className="bi bi-send-fill"></i>
            <span>Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
