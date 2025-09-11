// Loading Component
function Loading({ message = 'Loading...', size = 'md' }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12'
    };

    return React.createElement('div', {
      className: 'flex items-center justify-center p-4',
      'data-name': 'loading-container',
      'data-file': 'components/common/Loading.js'
    }, [
      React.createElement('div', {
        key: 'spinner',
        className: 'flex flex-col items-center space-y-2'
      }, [
        React.createElement('div', {
          key: 'icon-container',
          className: `${sizeClasses[size]} animate-spin text-blue-600`
        }, React.createElement('i', {
          'data-lucide': 'loader-2',
          className: 'w-full h-full'
        })),
        React.createElement('p', {
          key: 'message',
          className: 'text-sm text-gray-600 animate-pulse'
        }, message)
      ])
    ]);

  } catch (error) {
    console.error('Loading component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-gray-500 p-4'
    }, 'Loading...');
  }
}

// Export Loading component
window.Loading = Loading;
