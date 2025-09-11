// Header Component for 5GLabX Platform Frontend Demo
function Header({ appState, onStateChange }) {
  const connectionStatus = MockStateService.getConnectionInfo();
  
  return React.createElement('header', {
    className: 'bg-white border-b border-gray-200 px-6 py-4'
  }, [
    React.createElement('div', {
      key: 'header-content',
      className: 'flex items-center justify-between'
    }, [
      // Logo and title
      React.createElement('div', {
        key: 'logo-section',
        className: 'flex items-center space-x-4'
      }, [
        React.createElement('div', {
          key: 'logo',
          className: 'w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'
        }, [
          React.createElement('span', {
            key: 'logo-text',
            className: 'text-white font-bold text-sm'
          }, '5G')
        ]),
        React.createElement('div', {
          key: 'title-section'
        }, [
          React.createElement('h1', {
            key: 'title',
            className: 'text-xl font-bold text-gray-900'
          }, '5GLabX Platform'),
          React.createElement('p', {
            key: 'subtitle',
            className: 'text-sm text-gray-500'
          }, 'Advanced 5G Network Analysis')
        ])
      ]),
      
      // Connection status and demo badge
      React.createElement('div', {
        key: 'status-section',
        className: 'flex items-center space-x-4'
      }, [
        // Demo badge
        React.createElement('div', {
          key: 'demo-badge',
          className: 'badge-demo'
        }, 'DEMO'),
        
        // Connection status
        React.createElement('div', {
          key: 'connection-status',
          className: 'flex items-center space-x-2'
        }, [
          React.createElement('div', {
            key: 'status-indicator',
            className: `status-indicator ${connectionStatus.connected ? 'online' : 'offline'}`
          }),
          React.createElement('span', {
            key: 'status-text',
            className: 'text-sm text-gray-600'
          }, connectionStatus.connected ? 'Connected' : 'Disconnected')
        ]),
        
        // Last update
        connectionStatus.lastUpdate && React.createElement('div', {
          key: 'last-update',
          className: 'text-xs text-gray-400'
        }, `Updated: ${Helpers.formatTimestamp(connectionStatus.lastUpdate)}`)
      ])
    ])
  ]);
}