import React from 'react';

export const ServicesSection = () => {
  const services = [
    { icon: 'bi-robot', title: 'AI Smart Shopping', desc: 'Real-time personalized recommendations matching your style & budget.' },
    { icon: 'bi-truck-flatbed', title: 'Free Express Shipping', desc: 'Enjoy free fast delivery on all eligible orders over ₹499.' },
    { icon: 'bi-shield-check', title: '256-Bit SSL Payment', desc: 'Bank-level encrypted checkout for 100% safe transactions via UPI & Cards.' },
    { icon: 'bi-headset', title: '24/7 Dedicated Support', desc: 'Instant assistance powered by human experts and AI assistant.' }
  ];

  return (
    <section className="py-4">
      <div className="glass-card p-4 p-md-5">
        <div className="row g-4">
          {services.map((item, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className="d-flex align-items-start gap-3">
                <div 
                  className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '50px', height: '50px' }}
                >
                  <i className={`bi ${item.icon} fs-4`}></i>
                </div>
                <div>
                  <h6 className="fw-bold font-heading mb-1">{item.title}</h6>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
