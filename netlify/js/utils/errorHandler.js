// Error handling utilities for 5GLabX Platform Frontend Demo
window.ErrorHandler = {
  // Global error handler
  handleError(error, context = 'unknown') {
    console.error(`[${context}] Error:`, error);
    
    // In demo mode, just log the error
    if (Constants.IS_DEMO) {
      console.log('Demo mode: Error logged to console');
      return;
    }
    
    // In production, you would send to error tracking service
    // Example: Sentry.captureException(error, { tags: { context } });
  },
  
  // React error boundary helper
  createErrorBoundary() {
    return class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      
      componentDidCatch(error, errorInfo) {
        ErrorHandler.handleError(error, 'react-error-boundary');
        console.error('Error Info:', errorInfo);
      }
      
      render() {
        if (this.state.hasError) {
          return React.createElement('div', {
            className: 'flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg'
          }, [
            React.createElement('div', {
              key: 'error-content',
              className: 'text-center'
            }, [
              React.createElement('h3', {
                key: 'error-title',
                className: 'text-lg font-semibold text-red-600 mb-2'
              }, 'Something went wrong'),
              React.createElement('p', {
                key: 'error-message',
                className: 'text-red-500 mb-4'
              }, 'An error occurred while rendering this component'),
              React.createElement('button', {
                key: 'retry-button',
                onClick: () => this.setState({ hasError: false, error: null }),
                className: 'px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
              }, 'Try Again')
            ])
          ]);
        }
        
        return this.props.children;
      }
    };
  },
  
  // Safe component wrapper
  withErrorHandling(Component, fallbackComponent = null) {
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }
      
      static getDerivedStateFromError(error) {
        return { hasError: true };
      }
      
      componentDidCatch(error, errorInfo) {
        ErrorHandler.handleError(error, Component.name || 'unknown-component');
      }
      
      render() {
        if (this.state.hasError) {
          if (fallbackComponent) {
            return React.createElement(fallbackComponent, this.props);
          }
          return React.createElement('div', {
            className: 'p-4 bg-yellow-50 border border-yellow-200 rounded'
          }, 'Component failed to render');
        }
        
        return React.createElement(Component, this.props);
      }
    };
  }
};