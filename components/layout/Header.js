// Header Component
function Header({ appState, onToggleSidebar }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const { currentView, systemStatus } = appState;

    const handleToggleSidebar = () => {
      try {
        if (onToggleSidebar) {
          onToggleSidebar();
        }
      } catch (error) {
        console.error('Header toggle sidebar error:', error);
        reportError(error);
      }
    };

    // Get status indicator
    const getStatusColor = (status) => {
      try {
        switch (status) {
          case 'connected': return 'bg-green-500';
          case 'connecting': return 'bg-yellow-500';
          case 'disconnected': return 'bg-red-500';
          default: return 'bg-gray-500';
        }
      } catch (error) {
        console.error('Header get status color error:', error);
        return 'bg-gray-500';
      }
    };

    return React.createElement('header', {
      className: 'bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between',
      'data-name': 'header',
      'data-file': 'components/layout/Header.js'
    }, [
      React.createElement('div', {
        key: 'header-left',
        className: 'flex items-center space-x-4'
      }, [
        React.createElement('button', {
          key: 'toggle-sidebar',
          className: 'p-2 rounded-lg hover:bg-gray-100',
          onClick: handleToggleSidebar
        }, React.createElement('i', {
          'data-lucide': 'menu',
          className: 'w-5 h-5'
        })),
        React.createElement('div', {
          key: 'title-section'
        }, [
          React.createElement('h1', {
            key: 'app-title',
            className: 'text-xl font-bold text-gray-900'
          }, window.CONSTANTS.APP_NAME),
          React.createElement('p', {
            key: 'current-view',
            className: 'text-sm text-gray-600'
          }, currentView.charAt(0).toUpperCase() + currentView.slice(1))
        ])
      ]),
      React.createElement('div', {
        key: 'header-right',
        className: 'flex items-center space-x-4'
      }, [
        React.createElement('div', {
          key: 'system-status',
          className: 'flex items-center space-x-3'
        }, [
          React.createElement('div', {
            key: 'srsran-status',
            className: 'flex items-center space-x-1'
          }, [
            React.createElement('div', {
              key: 'srsran-indicator',
              className: `w-2 h-2 rounded-full ${getStatusColor(systemStatus?.srsran?.status)}`
            }),
            React.createElement('span', {
              key: 'srsran-label',
              className: 'text-xs text-gray-600'
            }, 'srsRAN')
          ]),
          React.createElement('div', {
            key: 'open5gs-status',
            className: 'flex items-center space-x-1'
          }, [
            React.createElement('div', {
              key: 'open5gs-indicator',
              className: `w-2 h-2 rounded-full ${getStatusColor(systemStatus?.open5gs?.status)}`
            }),
            React.createElement('span', {
              key: 'open5gs-label',
              className: 'text-xs text-gray-600'
            }, 'Open5GS')
          ]),
          React.createElement('div', {
            key: 'kamailio-status',
            className: 'flex items-center space-x-1'
          }, [
            React.createElement('div', {
              key: 'kamailio-indicator',
              className: `w-2 h-2 rounded-full ${getStatusColor(systemStatus?.kamailio?.status)}`
            }),
            React.createElement('span', {
              key: 'kamailio-label',
              className: 'text-xs text-gray-600'
            }, 'Kamailio')
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('Header component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'bg-red-50 p-4 text-red-800'
    }, 'Header failed to load');
  }
}

// Export Header component
window.Header = Header;
