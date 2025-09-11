// Sidebar Component for 5GLabX Platform Frontend Demo
function Sidebar({ appState, onStateChange }) {
  const [collapsed, setCollapsed] = React.useState(appState.sidebarCollapsed);
  
  React.useEffect(() => {
    setCollapsed(appState.sidebarCollapsed);
  }, [appState.sidebarCollapsed]);
  
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Overview and metrics'
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: '📝',
      description: 'Real-time log analysis'
    },
    {
      id: 'config',
      label: 'Configuration',
      icon: '⚙️',
      description: 'CLI tool configuration'
    },
    {
      id: 'stats',
      label: 'Statistics',
      icon: '📈',
      description: 'Performance statistics'
    }
  ];
  
  const handleItemClick = (itemId) => {
    onStateChange({ currentView: itemId });
  };
  
  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onStateChange({ sidebarCollapsed: newCollapsed });
  };
  
  return React.createElement('aside', {
    className: `bg-gray-900 text-white transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`
  }, [
    // Header
    React.createElement('div', {
      key: 'sidebar-header',
      className: 'p-4 border-b border-gray-700'
    }, [
      React.createElement('div', {
        key: 'header-content',
        className: 'flex items-center justify-between'
      }, [
        !collapsed && React.createElement('h2', {
          key: 'title',
          className: 'text-lg font-semibold'
        }, '5GLabX'),
        React.createElement('button', {
          key: 'toggle-button',
          onClick: toggleCollapse,
          className: 'p-1 hover:bg-gray-700 rounded'
        }, collapsed ? '▶️' : '◀️')
      ])
    ]),
    
    // Navigation
    React.createElement('nav', {
      key: 'navigation',
      className: 'p-4 space-y-2'
    }, menuItems.map(item => 
      React.createElement('button', {
        key: item.id,
        onClick: () => handleItemClick(item.id),
        className: `w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
          appState.currentView === item.id
            ? 'bg-blue-600 text-white'
            : 'hover:bg-gray-700 text-gray-300'
        }`
      }, [
        React.createElement('span', {
          key: 'icon',
          className: 'text-lg'
        }, item.icon),
        !collapsed && React.createElement('div', {
          key: 'content',
          className: 'flex-1 text-left'
        }, [
          React.createElement('div', {
            key: 'label',
            className: 'font-medium'
          }, item.label),
          React.createElement('div', {
            key: 'description',
            className: 'text-xs text-gray-400'
          }, item.description)
        ])
      ])
    )),
    
    // Footer
    React.createElement('div', {
      key: 'sidebar-footer',
      className: 'absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700'
    }, [
      !collapsed && React.createElement('div', {
        key: 'footer-content',
        className: 'text-xs text-gray-400 text-center'
      }, [
        React.createElement('div', {
          key: 'version'
        }, `v${Constants.APP_VERSION}`),
        React.createElement('div', {
          key: 'mode'
        }, 'Demo Mode')
      ])
    ])
  ]);
}