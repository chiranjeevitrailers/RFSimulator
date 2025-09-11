// OranInterfacesView Component
function OranInterfacesView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    return React.createElement(OranInterfaces);

  } catch (error) {
    console.error('OranInterfacesView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'O-RAN Interfaces View failed to load');
  }
}

// Export OranInterfacesView component
window.OranInterfacesView = OranInterfacesView;
