// CustomConfigManager Component - Enhanced CRUD operations for custom configs
function CustomConfigManager({ componentType, onClose, onConfigSelect }) {
  try {
    const [myConfigs, setMyConfigs] = React.useState([]);
    const [selectedConfig, setSelectedConfig] = React.useState(null);
    const [showEditor, setShowEditor] = React.useState(false);

    React.useEffect(() => {
      loadMyConfigs();
    }, [componentType]);

    const loadMyConfigs = () => {
      const configs = window.ConfigLibraryService.getMyConfigs();
      setMyConfigs(configs[componentType] || []);
    };

    const handleEdit = (config) => {
      setSelectedConfig(config);
      setShowEditor(true);
    };

    const handleDelete = (configId) => {
      if (confirm('Are you sure you want to delete this configuration?')) {
        window.ConfigLibraryService.deleteMyConfig(componentType, configId);
        loadMyConfigs();
      }
    };

    const handleExport = () => {
      window.ConfigLibraryService.exportConfigs(componentType);
    };

    const handleImport = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const configs = JSON.parse(event.target.result);
              window.ConfigLibraryService.importConfigs(componentType, configs);
              loadMyConfigs();
            } catch (error) {
              alert('Invalid configuration file format');
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    };

    const getComponentTitle = () => {
      const titles = { gnb: '5G gNodeB', enb: '4G eNodeB', core: '5G Core', ims: 'IMS Core' };
      return titles[componentType] || 'Component';
    };

    return React.createElement('div', {
      className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      'data-name': 'custom-config-manager',
      'data-file': 'components/config/CustomConfigManager.js'
    }, React.createElement('div', {
      className: 'bg-white rounded-lg shadow-xl w-4/5 max-w-4xl max-h-4/5 overflow-hidden'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex justify-between items-center p-4 border-b'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-bold'
        }, `My ${getComponentTitle()} Configurations`),
        React.createElement('div', {
          key: 'actions',
          className: 'flex space-x-2'
        }, [
          React.createElement('button', {
            key: 'import',
            onClick: handleImport,
            className: 'px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700'
          }, 'Import'),
          React.createElement('button', {
            key: 'export',
            onClick: handleExport,
            disabled: myConfigs.length === 0,
            className: 'px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50'
          }, 'Export'),
          React.createElement('button', {
            key: 'close',
            onClick: onClose,
            className: 'text-gray-400 hover:text-gray-600'
          }, React.createElement('i', { 'data-lucide': 'x', className: 'w-5 h-5' }))
        ])
      ]),

      React.createElement('div', {
        key: 'content',
        className: 'p-4'
      }, myConfigs.length === 0 ? React.createElement('div', {
        key: 'empty',
        className: 'text-center py-8'
      }, [
        React.createElement('i', {
          key: 'icon',
          'data-lucide': 'folder',
          className: 'w-12 h-12 mx-auto text-gray-400 mb-4'
        }),
        React.createElement('p', {
          key: 'message',
          className: 'text-gray-500'
        }, 'No custom configurations found'),
        React.createElement('p', {
          key: 'hint',
          className: 'text-sm text-gray-400 mt-2'
        }, 'Create new configurations or import existing ones')
      ]) : React.createElement('div', {
        key: 'configs',
        className: 'grid grid-cols-1 gap-3 max-h-80 overflow-y-auto'
      }, myConfigs.map(config =>
        React.createElement('div', {
          key: config.id,
          className: 'border rounded p-4 hover:bg-gray-50'
        }, [
          React.createElement('div', {
            key: 'config-header',
            className: 'flex justify-between items-start mb-2'
          }, [
            React.createElement('div', { key: 'info' }, [
              React.createElement('h4', {
                key: 'name',
                className: 'font-medium'
              }, config.name),
              React.createElement('p', {
                key: 'description',
                className: 'text-sm text-gray-600'
              }, config.description),
              React.createElement('p', {
                key: 'date',
                className: 'text-xs text-gray-400 mt-1'
              }, `Created: ${new Date(config.createdAt).toLocaleDateString()}`)
            ]),
            React.createElement('div', {
              key: 'actions',
              className: 'flex space-x-2'
            }, [
              React.createElement('button', {
                key: 'use',
                onClick: () => onConfigSelect(config),
                className: 'px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700'
              }, 'Use'),
              React.createElement('button', {
                key: 'edit',
                onClick: () => handleEdit(config),
                className: 'px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700'
              }, 'Edit'),
              React.createElement('button', {
                key: 'delete',
                onClick: () => handleDelete(config.id),
                className: 'px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700'
              }, 'Delete')
            ])
          ])
        ])
      )))
    ]));

  } catch (error) {
    console.error('CustomConfigManager component error:', error);
    reportError(error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'CustomConfigManager Error');
  }
}

// Export CustomConfigManager component
window.CustomConfigManager = CustomConfigManager;
