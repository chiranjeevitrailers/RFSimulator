// Layout Component
function Layout({ appState, onNavigate, onToggleSidebar, children }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const { sidebarCollapsed } = appState;

    return React.createElement('div', {
      className: 'min-h-screen bg-gray-50 flex',
      'data-name': 'layout',
      'data-file': 'components/layout/Layout.js'
    }, [
      // Sidebar
      React.createElement(Sidebar, {
        key: 'sidebar',
        appState: appState,
        onNavigate: onNavigate
      }),
      
      // Main Content Area
      React.createElement('div', {
        key: 'main-content',
        className: `flex-1 flex flex-col content-transition ${
          sidebarCollapsed ? 'ml-0' : 'ml-0'
        }`
      }, [
        // Header
        React.createElement(Header, {
          key: 'header',
          appState: appState,
          onToggleSidebar: onToggleSidebar
        }),
        
        // Main Content
        React.createElement('main', {
          key: 'main',
          className: 'flex-1 overflow-auto'
        }, children)
      ])
    ]);

  } catch (error) {
    console.error('Layout component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'min-h-screen bg-red-50 flex items-center justify-center'
    }, React.createElement('div', {
      className: 'text-red-800'
    }, 'Layout failed to load'));
  }
}

// Export Layout component
window.Layout = Layout;
