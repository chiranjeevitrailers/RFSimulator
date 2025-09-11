// CLIPathManager Component - Manage CLI tool paths
function CLIPathManager({ currentPaths, onPathsChange }) {
  try {
    const [cliPaths, setCLIPaths] = React.useState(currentPaths || []);
    const [newPathValue, setNewPathValue] = React.useState('');
    
    const defaultLogPaths = [
      '/tmp/srsran_gnb.log',
      '/tmp/srsran_enb.log', 
      '/tmp/srsran_ue.log',
      '/var/log/srsran/',
      '/tmp/kamailio.log',
      '/tmp/open5gs.log'
    ];
    
    const addPath = () => {
      if (newPathValue.trim() && !cliPaths.includes(newPathValue.trim())) {
        const updatedPaths = [...cliPaths, newPathValue.trim()];
        setCLIPaths(updatedPaths);
        onPathsChange(updatedPaths);
        setNewPathValue('');
      }
    };
    
    const removePath = (pathToRemove) => {
      const updatedPaths = cliPaths.filter(p => p !== pathToRemove);
      setCLIPaths(updatedPaths);
      onPathsChange(updatedPaths);
    };
    
    const addDefaultPath = (defaultPath) => {
      if (!cliPaths.includes(defaultPath)) {
        const updatedPaths = [...cliPaths, defaultPath];
        setCLIPaths(updatedPaths);
        onPathsChange(updatedPaths);
      }
    };
    
    return React.createElement('div', {
      className: 'space-y-4',
      'data-name': 'cli-path-manager',
      'data-file': 'components/config/CLIPathManager.js'
    }, [
      React.createElement('h3', {
        key: 'title',
        className: 'text-lg font-semibold text-gray-900'
      }, 'CLI Log Paths'),
      
      React.createElement('div', {
        key: 'add-path',
        className: 'space-y-2'
      }, [
        React.createElement('label', {
          key: 'label',
          className: 'block text-sm font-medium text-gray-700'
        }, 'Add Custom Path'),
        React.createElement('div', {
          key: 'input-group',
          className: 'flex space-x-2'
        }, [
          React.createElement('input', {
            key: 'input',
            type: 'text',
            value: newPathValue,
            onChange: (e) => setNewPathValue(e.target.value),
            placeholder: '/path/to/log/file.log',
            className: 'flex-1 px-3 py-2 border border-gray-300 rounded text-sm',
            onKeyPress: (e) => e.key === 'Enter' && addPath()
          }),
          React.createElement('button', {
            key: 'add-btn',
            onClick: addPath,
            className: 'px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700'
          }, 'Add')
        ])
      ]),
      
      React.createElement('div', {
        key: 'current-paths',
        className: 'space-y-2'
      }, [
        React.createElement('label', {
          key: 'label',
          className: 'block text-sm font-medium text-gray-700'
        }, `Current Paths (${cliPaths.length})`),
        cliPaths.length === 0 ? React.createElement('p', {
          key: 'no-paths',
          className: 'text-sm text-gray-500'
        }, 'No paths configured') : React.createElement('div', {
          key: 'paths-list',
          className: 'space-y-1'
        }, cliPaths.map((logPath, index) =>
          React.createElement('div', {
            key: index,
            className: 'flex items-center justify-between bg-gray-50 px-3 py-2 rounded'
          }, [
            React.createElement('span', {
              key: 'path',
              className: 'text-sm text-gray-900 font-mono'
            }, logPath),
            React.createElement('button', {
              key: 'remove',
              onClick: () => removePath(logPath),
              className: 'text-red-600 hover:text-red-800 text-sm'
            }, React.createElement('i', {
              'data-lucide': 'x',
              className: 'w-4 h-4'
            }))
          ])
        ))
      ]),
      
      React.createElement('div', {
        key: 'default-paths',
        className: 'space-y-2'
      }, [
        React.createElement('label', {
          key: 'label',
          className: 'block text-sm font-medium text-gray-700'
        }, 'Quick Add Default Paths'),
        React.createElement('div', {
          key: 'defaults-grid',
          className: 'grid grid-cols-1 gap-1'
        }, defaultLogPaths.map((defaultPath, index) =>
          React.createElement('button', {
            key: index,
            onClick: () => addDefaultPath(defaultPath),
            disabled: cliPaths.includes(defaultPath),
            className: `text-left px-3 py-2 rounded text-sm ${
              cliPaths.includes(defaultPath)
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`
          }, [
            React.createElement('span', {
              key: 'path',
              className: 'font-mono'
            }, defaultPath),
            cliPaths.includes(defaultPath) && React.createElement('span', {
              key: 'added',
              className: 'ml-2 text-green-600'
            }, '✓ Added')
          ])
        ))
      ])
    ]);

  } catch (error) {
    console.error('CLIPathManager component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'CLIPathManager Error');
  }
}

// Export CLIPathManager component
window.CLIPathManager = CLIPathManager;
