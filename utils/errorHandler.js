// Error Handler Utility - Centralized error handling
class ErrorHandler {
  constructor() {
    this.errorCallbacks = [];
    this.setupGlobalErrorHandling();
  }

  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'Global Error');
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Unhandled Promise Rejection');
    });
  }

  handleError(error, context = 'Unknown') {
    console.error(`[${context}] Error:`, error);
    
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error, context);
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError);
      }
    });
  }

  subscribe(callback) {
    this.errorCallbacks.push(callback);
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) this.errorCallbacks.splice(index, 1);
    };
  }
}

const errorHandler = new ErrorHandler();

// Global error reporting function
function reportError(error, context = 'Application') {
  errorHandler.handleError(error, context);
}

window.ErrorHandler = ErrorHandler;
window.reportError = reportError;