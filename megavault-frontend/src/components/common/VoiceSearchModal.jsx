import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const VoiceSearchModal = ({ isOpen, onClose, onSearchSubmit }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Listening... Speak now!');
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopListening();
    }
    return () => stopListening();
  }, [isOpen]);

  const startListening = () => {
    setTranscript('');
    setStatusMessage('Listening... Speak now!');
    setIsListening(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onstart = () => {
          setIsListening(true);
          setStatusMessage('Listening... Speak into your microphone!');
        };

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          setStatusMessage('Processing your speech...');

          if (event.results[0].isFinal) {
            handleFinalSpeech(currentTranscript);
          }
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition notice:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setStatusMessage('Microphone access denied. Try clicking a voice sample prompt below!');
          } else {
            setStatusMessage('Could not hear clearly. Speak again or pick a voice prompt below:');
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.error('Speech recognition error:', err);
        setStatusMessage('Voice recognition starting... Pick a voice query below if mic is disabled.');
        setIsListening(false);
      }
    } else {
      setStatusMessage('Voice recognition simulated. Click a quick sample prompt below:');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const handleFinalSpeech = (finalText) => {
    stopListening();
    const query = finalText.trim();
    if (!query) return;

    toast.success(`Voice Search: "${query}"`, { icon: '🎤' });
    onSearchSubmit(query);
    onClose();
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleSamplePromptClick = (e, promptText) => {
    e.preventDefault();
    e.stopPropagation();
    setTranscript(promptText);
    setStatusMessage('Voice prompt selected!');
    handleFinalSpeech(promptText);
  };

  if (!isOpen) return null;

  const sampleVoicePrompts = [
    "Headphones under ₹5,000",
    "Smartwatches",
    "Gaming Laptops",
    "Wireless Earbuds",
    "Smart Home Devices",
    "Backpacks & Bags"
  ];

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.85)', 
        backdropFilter: 'blur(12px)', 
        zIndex: 999999,
        overflowY: 'auto'
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '480px' }}>
        <div className="modal-content glass-card border-primary p-4 text-center shadow-lg position-relative overflow-hidden">
          
          <button 
            type="button" 
            className="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
            onClick={onClose}
          ></button>

          {/* Glowing Animated Microphone Circle */}
          <div className="my-4 d-flex justify-content-center align-items-center">
            <div 
              onClick={isListening ? stopListening : startListening}
              className={`rounded-circle p-4 d-flex align-items-center justify-content-center cursor-pointer transition-all ${
                isListening ? 'bg-danger text-white shadow-lg' : 'bg-primary text-white hover-scale'
              }`}
              style={{ 
                width: '90px', 
                height: '90px', 
                cursor: 'pointer',
                boxShadow: isListening 
                  ? '0 0 35px rgba(220, 38, 38, 0.8), 0 0 70px rgba(220, 38, 38, 0.4)' 
                  : '0 0 25px rgba(249, 115, 22, 0.6)'
              }}
              title={isListening ? 'Click to Stop' : 'Click to Speak'}
            >
              <i className={`bi ${isListening ? 'bi-mic-fill fs-1 animate-pulse' : 'bi-mic-fill fs-1'}`}></i>
            </div>
          </div>

          <h4 className="fw-bold font-heading mb-2 text-main">
            {isListening ? 'Listening...' : 'Voice Search'}
          </h4>

          <p className="text-primary font-heading small fw-semibold mb-3">
            {statusMessage}
          </p>

          {/* Transcript Box */}
          <div className="glass-card p-3 rounded-3 mb-4 border-secondary min-vh-10 d-flex align-items-center justify-content-center">
            {transcript ? (
              <span className="h5 fw-bold font-heading text-warning mb-0">
                "{transcript}"
              </span>
            ) : (
              <span className="text-muted small font-monospace">
                (Speak now into your microphone...)
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
