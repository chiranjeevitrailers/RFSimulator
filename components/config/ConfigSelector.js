// ConfigSelector Component - Simplified with library integration
function ConfigSelector({ componentType, onConfigAdd, onClose }) {
  try {
    const [showLibrary, setShowLibrary] = React.useState(false);

    const handleConfigSelect = (config) => {
      onConfigAdd(config);
      onClose();
    };

    const getComponentTitle = () => {
      const titles = { gnb: '5G gNodeB', enb: '4G eNodeB', core: '5G Core', ims: 'IMS Core' };
      return titles[componentType] || 'Component';
    };

    return React.createElement('div', {
      className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      'data-name': 'config-selector',
      'data-file': 'components/config/ConfigSelector.js'
    }, [
      !showLibrary && React.createElement('div', {
        key: 'selector',
        className: 'bg-white rounded-lg shadow-xl w-96 p-6'
      }, [
        React.createElement('div', {
          key: 'header',
          className: 'flex justify-between items-center mb-4'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-bold'
          }, `Select ${getComponentTitle()} Configuration`),
          React.createElement('button', {
            key: 'close',
            onClick: onClose,
            className: 'text-gray-400 hover:text-gray-600'
          }, React.createElement('i', { 'data-lucide': 'x', className: 'w-5 h-5' }))
        ]),

        React.createElement('div', {
          key: 'options',
          className: 'space-y-3'
        }, [
          React.createElement('button', {
            key: 'library',
            onClick: () => setShowLibrary(true),
            className: 'w-full p-4 border border-blue-300 rounded-lg hover:bg-blue-50 text-left'
          }, [
            React.createElement('div', {
              key: 'content',
              className: 'flex items-center'
            }, [
              React.createElement('i', {
                key: 'icon',
                'data-lucide': 'library',
                className: 'w-6 h-6 text-blue-600 mr-3'
              }),
              React.createElement('div', { key: 'text' }, [
                React.createElement('h4', {
                  key: 'title',
                  className: 'font-medium text-gray-900'
                }, 'Browse Configuration Library'),
                React.createElement('p', {
                  key: 'desc',
                  className: 'text-sm text-gray-600'
                }, 'Choose from pre-built templates or create new configurations')
              ])
            ])
          ]),

          React.createElement('button', {
            key: 'upload',
            onClick: () => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json,.yml,.yaml';
              input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const config = JSON.parse(event.target.result);
                      handleConfigSelect({
                        id: Date.now().toString(),
                        name: file.name.replace(/\.[^/.]+$/, ''),
                        description: 'Imported configuration',
                        type: 'imported',
                        config: config,
                        createdAt: new Date().toISOString()
                      });
                    } catch (error) {
                      alert('Invalid configuration file format');
                    }
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            },
            className: 'w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left'
          }, [
            React.createElement('div', {
              key: 'content',
              className: 'flex items-center'
            }, [
              React.createElement('i', {
                key: 'icon',
                'data-lucide': 'upload',
                className: 'w-6 h-6 text-gray-600 mr-3'
              }),
              React.createElement('div', { key: 'text' }, [
                React.createElement('h4', {
                  key: 'title',
                  className: 'font-medium text-gray-900'
                }, 'Upload Configuration File'),
                React.createElement('p', {
                  key: 'desc',
                  className: 'text-sm text-gray-600'
                }, 'Import JSON/YAML configuration from file')
              ])
            ])
          ])
        ])
      ]),

      showLibrary && React.createElement(ConfigLibrary, {
        key: 'library',
        onConfigSelect: handleConfigSelect,
        onClose: () => setShowLibrary(false)
      })
    ]);

  } catch (error) {
    console.error('ConfigSelector component error:', error);
    reportError(error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'ConfigSelector Error');
  }
}

// Export ConfigSelector component
window.ConfigSelector = ConfigSelector;
