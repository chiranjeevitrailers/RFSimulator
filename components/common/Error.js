// Simple Error Component without hooks
function SimpleError({ message = 'An error occurred', onRetry = null }) {
  try {
    return React.createElement('div', {
      className: 'bg-red-50 border border-red-200 rounded-lg p-4',
      'data-name': 'error-container',
      'data-file': 'components/common/Error.js'
    }, [
      React.createElement('div', {
        key: 'error-content',
        className: 'flex items-center space-x-3'
      }, [
        React.createElement('div', {
          key: 'error-icon',
          className: 'icon-alert-circle text-red-600 text-lg'
        }),
        React.createElement('p', {
          key: 'message',
          className: 'text-sm font-medium text-red-800 flex-1'
        }, message),
        onRetry && React.createElement('button', {
          key: 'retry-button',
          className: 'px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700',
          onClick: onRetry
        }, 'Retry')
      ])
    ]);

  } catch (error) {
    console.error('Error component error:', error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Error displaying error');
  }
}

window.SimpleError = SimpleError;
