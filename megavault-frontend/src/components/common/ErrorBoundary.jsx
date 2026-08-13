import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Runtime Error Boundary caught an exception:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 p-4" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>
          <div className="glass-card p-5 text-center shadow-lg border-primary" style={{ maxWidth: '500px' }}>
            <div className="bg-primary bg-opacity-25 text-warning rounded-circle p-3 d-inline-flex mb-3">
              <i className="bi bi-exclamation-triangle-fill fs-1"></i>
            </div>
            <h3 className="fw-bold font-heading mb-2">Something went wrong</h3>
            <p className="text-muted small mb-4">
              An unexpected display issue occurred. Don't worry, your session and saved items are completely safe.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <button 
                onClick={this.handleReload} 
                className="btn btn-megavault px-4 font-heading"
              >
                <i className="bi bi-arrow-clockwise me-1"></i> Reload Page
              </button>
              <a 
                href="/" 
                onClick={() => this.setState({ hasError: false })}
                className="btn btn-outline-secondary px-4 font-heading"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
