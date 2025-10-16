import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              textAlign: 'center',
              gap: 12,
              padding: 16
            }}
          >
            <div style={{ fontSize: 64 }}>⚠️</div>
            <h1 style={{ margin: 0 }}>Oops! Something went wrong</h1>
            <p style={{ color: '#666' }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button 
              onClick={this.handleRetry}
              style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #1976d2', background: '#1976d2', color: '#fff', cursor: 'pointer', fontSize: 14 }}
            >
              Try Again
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{ marginTop: 12, padding: 12, background: '#f7f7f7', borderRadius: 8, textAlign: 'left', border: '1px solid #eee' }}>
                <div style={{ color: '#b3261e', fontWeight: 600 }}>Error Details (Development Mode):</div>
                <pre style={{ marginTop: 8, fontSize: '0.8rem' }}>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre style={{ marginTop: 8, fontSize: '0.8rem' }}>{this.state.errorInfo.componentStack}</pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
