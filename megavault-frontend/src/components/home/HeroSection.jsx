import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

export const HeroSection = () => {
  const context = useOutletContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = [
    {
      id: 1,
      tag: "🔥 FLASH SALE • UP TO 60% OFF",
      title: "Audio & Sound Vault",
      highlight: "ANC Headphones",
      shortDesc: "Studio-grade noise cancellation & 40-hour battery life.",
      category: "audio",
      ctaText: "Shop Audio Deals",
      productName: "Wireless Studio Headphones",
      productCode: "AUD-101",
      price: "₹4,999",
      originalPrice: "₹6,999",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      badge: "60% Off"
    },
    {
      id: 2,
      tag: "⌚ SMART TECH • HEALTH & FITNESS",
      title: "Smart Wearables",
      highlight: "AMOLED ECG Watch",
      shortDesc: "ECG heart tracking, SpO2 monitoring & 14-day battery.",
      category: "wearables",
      ctaText: "Explore Wearables",
      productName: "Next-Gen Health Smartwatch",
      productCode: "WRB-201",
      price: "₹14,999",
      originalPrice: "₹18,999",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      badge: "Bestseller"
    },
    {
      id: 3,
      tag: "🎮 GAMING GEAR • 165Hz CURVED",
      title: "Ultimate Gaming Setup",
      highlight: "165Hz Monitors & RGB",
      description: "Mechanical switches, anti-drift joysticks & 1500R curved screens.",
      category: "gaming",
      ctaText: "Explore Gaming",
      productName: "Curved 34-inch WQHD Monitor",
      productCode: "GAM-305",
      price: "₹34,999",
      originalPrice: "₹42,999",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      badge: "Top Gamer"
    },
    {
      id: 4,
      tag: "💻 HIGH PERFORMANCE • M3 TECH",
      title: "Electronics & Tech",
      highlight: "Pro Developer Laptop",
      shortDesc: "Liquid Retina display, USB-C 65W PD & fast power banks.",
      category: "electronics",
      ctaText: "Shop Electronics",
      productName: "Pro Laptop M3 High Spec",
      productCode: "ELE-402",
      price: "₹89,999",
      originalPrice: "₹99,999",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      badge: "M3 Tech"
    },
    {
      id: 5,
      tag: "🎒 TRENDING FASHION • WATERPROOF",
      title: "Fashion & Travel",
      highlight: "Anti-Theft Backpacks",
      shortDesc: "TAC aviators, top-grain leather wallets & weather-resistant bags.",
      category: "fashion",
      ctaText: "Shop Fashion",
      productName: "Waterproof Laptop Backpack",
      productCode: "FSH-501",
      price: "₹1,799",
      originalPrice: "₹2,499",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      badge: "Anti-Theft"
    }
  ];

  // Auto-advance slides every 1.5 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 1500); // Fast 1.5s automatic slide rotation
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const slide = heroSlides[currentSlide];

  return (
    <section 
      className="position-relative py-3 py-lg-4 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Radial Glow */}
      <div 
        className="position-absolute top-50 start-50 translate-middle rounded-circle blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, #F97316 0%, rgba(249, 115, 22, 0) 70%)',
          zIndex: 0
        }}
      ></div>

      <div className="glass-card p-3 p-md-4 border-primary shadow-lg position-relative z-1 overflow-hidden" style={{ minHeight: '340px' }}>
        
        {/* Previous / Next Arrow Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="btn btn-icon-highlight btn-sm rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2 z-3 d-none d-md-flex align-items-center justify-content-center shadow"
          style={{ width: '36px', height: '36px' }}
          title="Previous Banner"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="btn btn-icon-highlight btn-sm rounded-circle position-absolute top-50 end-0 translate-middle-y me-2 z-3 d-none d-md-flex align-items-center justify-content-center shadow"
          style={{ width: '36px', height: '36px' }}
          title="Next Banner"
        >
          <i className="bi bi-chevron-right"></i>
        </button>

        {/* Animated Slide Content with Protected Inner Padding */}
        <div key={slide.id} className="row align-items-center g-3 g-lg-4 animated fadeIn px-3 px-md-5">
          
          {/* Left Text Column */}
          <div className="col-lg-7 text-center text-lg-start">
            <div className="d-inline-flex align-items-center gap-2 badge badge-megavault px-2.5 py-1.5 mb-2 shadow-sm" style={{ fontSize: '0.78rem' }}>
              <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
              <span className="font-heading fw-semibold">{slide.tag}</span>
            </div>

            <h3 className="fw-bold font-heading mb-2 tracking-tight leading-snug text-main">
              {slide.title} • <span className="text-primary">{slide.highlight}</span>
            </h3>

            <p className="text-muted mb-3 font-heading small text-truncate" style={{ maxWidth: '520px' }}>
              {slide.shortDesc || slide.description}
            </p>

            {/* Action Buttons */}
            <div className="d-flex flex-row justify-content-center justify-content-lg-start gap-3.5 gap-md-4">
              <Link 
                to={`/products?category=${slide.category}`} 
                className="btn btn-megavault btn-md px-3.5 py-2.5 d-flex align-items-center gap-2 font-heading shadow"
              >
                <span>{slide.ctaText}</span>
                <i className="bi bi-arrow-right"></i>
              </Link>

              <button
                onClick={() => context?.openAIModal()}
                className="btn btn-outline-secondary btn-md px-3.5 py-2.5 d-flex align-items-center gap-2 glass-card font-heading"
              >
                <i className="bi bi-stars text-warning fs-6"></i>
                <span>Ask AI</span>
              </button>
            </div>
          </div>

          {/* Right Product Image Spotlight Column */}
          <div className="col-lg-5">
            <div className="position-relative text-center">
              <div className="position-absolute top-0 end-0 me-2 mt-2 badge bg-primary px-2.5 py-1 shadow-sm font-heading d-flex align-items-center gap-1 z-2" style={{ fontSize: '0.72rem' }}>
                <i className="bi bi-tag-fill text-warning"></i>
                <span>{slide.badge}</span>
              </div>

              <div className="d-flex align-items-center justify-content-center mb-2" style={{ height: '190px' }}>
                <img
                  src={slide.image}
                  alt={slide.productName}
                  className="mw-100 mh-100 object-fit-contain rounded-4 shadow-lg transition-transform hover-scale"
                  style={{ objectFit: 'contain', maxHeight: '185px' }}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center px-2 mt-2">
                <div className="text-start">
                  <span className="badge bg-primary bg-opacity-25 text-primary font-monospace mb-0.5" style={{ fontSize: '0.7rem' }}>{slide.productCode}</span>
                  <strong className="d-block small font-heading text-main text-truncate" style={{ maxWidth: '210px' }}>{slide.productName}</strong>
                </div>
                <div className="text-end">
                  <span className="fw-bold text-primary font-heading mb-0 fs-6">{slide.price}</span>
                  <small className="text-muted d-block text-decoration-line-through" style={{ fontSize: '0.75rem' }}>{slide.originalPrice}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="d-flex align-items-center justify-content-center gap-1.5 mt-3">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`btn p-0 transition-all ${
                currentSlide === idx ? 'bg-primary' : 'bg-secondary opacity-50'
              }`}
              style={{
                width: currentSlide === idx ? '24px' : '8px',
                height: '8px',
                border: 'none',
                borderRadius: '4px'
              }}
              title={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};
