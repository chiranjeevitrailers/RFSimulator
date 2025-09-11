// InputTabs Component
function InputTabs({ onDataProcessed, onLogReceived }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [activeTab, setActiveTab] = React.useState('upload');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [isMonitoring, setIsMonitoring] = React.useState(false);

    const tabs = [
      { id: 'upload', label: 'File Upload', icon: 'upload' },
      { id: 'paste', label: 'Text Paste', icon: 'clipboard' },
      { id: 'live', label: 'Live Monitor', icon: 'radio' }
    ];

    const handleTabChange = (tabId) => {
      try {
        setActiveTab(tabId);
      } catch (error) {
        console.error('InputTabs tab change error:', error);
        reportError(error);
      }
    };

    const handleFileProcessed = (result) => {
      try {
        setIsProcessing(false);
        if (onDataProcessed) {
          onDataProcessed(result);
        }
      } catch (error) {
        console.error('InputTabs file processed error:', error);
        reportError(error);
      }
    };

    const handleTextProcessed = (result) => {
      try {
        setIsProcessing(false);
        if (onDataProcessed) {
          onDataProcessed(result);
        }
      } catch (error) {
        console.error('InputTabs text processed error:', error);
        reportError(error);
      }
    };

    const handleLogReceived = (logEntry) => {
      try {
        if (onLogReceived) {
          onLogReceived(logEntry);
        }
      } catch (error) {
        console.error('InputTabs log received error:', error);
        reportError(error);
      }
    };

    const handleToggleMonitoring = () => {
      try {
        setIsMonitoring(prev => !prev);
      } catch (error) {
        console.error('InputTabs toggle monitoring error:', error);
        reportError(error);
      }
    };

    const renderTabContent = () => {
      try {
        switch (activeTab) {
          case 'upload':
            return React.createElement(FileUpload, {
              onFileProcessed: handleFileProcessed,
              isProcessing: isProcessing
            });
          case 'paste':
            return React.createElement(TextPaste, {
              onTextProcessed: handleTextProcessed,
              isProcessing: isProcessing
            });
          case 'live':
            return React.createElement(LiveMonitor, {
              onLogReceived: handleLogReceived,
              isMonitoring: isMonitoring,
              onToggleMonitoring: handleToggleMonitoring
            });
          default:
            return null;
        }
      } catch (error) {
        console.error('InputTabs render content error:', error);
        reportError(error);
        return React.createElement('div', {
          className: 'text-red-600 p-4'
        }, 'Failed to render tab content');
      }
    };

    return React.createElement('div', {
      className: 'w-full',
      'data-name': 'input-tabs',
      'data-file': 'components/input/InputTabs.js'
    }, [
      React.createElement('div', {
        key: 'tab-header',
        className: 'border-b border-gray-200'
      }, React.createElement('nav', {
        className: 'flex space-x-8'
      }, tabs.map(tab => 
        React.createElement('button', {
          key: tab.id,
          onClick: () => handleTabChange(tab.id),
          className: `flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': tab.icon,
            className: 'w-4 h-4'
          }),
          React.createElement('span', { key: 'label' }, tab.label)
        ])
      ))),
      React.createElement('div', {
        key: 'tab-content',
        className: 'py-6'
      }, renderTabContent())
    ]);

  } catch (error) {
    console.error('InputTabs component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Input tabs failed to load');
  }
}

// Export InputTabs component
window.InputTabs = InputTabs;
