// OranOverviewView Component
function OranOverviewView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    return React.createElement(OranOverview);

  } catch (error) {
    console.error('OranOverviewView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'O-RAN Overview View failed to load');
  }
}

// Export OranOverviewView component
window.OranOverviewView = OranOverviewView;
