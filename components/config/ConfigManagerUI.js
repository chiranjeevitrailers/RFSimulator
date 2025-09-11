// ConfigManagerUI Component - Enhanced with O-RAN, NB-IoT, V2X and NTN components
function ConfigManagerUI(props) {
  try {
    const {
      configs, operatingMode, handleStart, handleStop, handleSelectConfig,
      showConsole, setShowConsole
    } = props;

    // Enhanced configs to include O-RAN, NB-IoT, V2X and NTN components
    const allConfigs = {
      ...configs,
      'cu-cp': configs['cu-cp'] || { name: 'CU-CP', status: 'stopped', selectedConfig: null },
      'cu-up': configs['cu-up'] || { name: 'CU-UP', status: 'stopped', selectedConfig: null },
      'du': configs['du'] || { name: 'DU', status: 'stopped', selectedConfig: null },
      'nbiot': configs['nbiot'] || { name: 'NB-IoT', status: 'stopped', selectedConfig: null },
      'v2x': configs['v2x'] || { name: 'C-V2X', status: 'stopped', selectedConfig: null },
      'ntn': configs['ntn'] || { name: 'NTN', status: 'stopped', selectedConfig: null }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'running': return 'text-green-600 bg-green-100';
        case 'starting': return 'text-blue-600 bg-blue-100';
        case 'stopping': return 'text-orange-600 bg-orange-100';
        case 'error': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    const getComponentIcon = (component) => {
      const icons = {
        gnb: 'radio', enb: 'tower', core: 'server', ims: 'phone',
        'cu-cp': 'cpu', 'cu-up': 'database', 'du': 'wifi', 
        'nbiot': 'satellite', 'v2x': 'car', 'ntn': 'globe'
      };
      return icons[component] || 'settings';
    };

    const isComponentBusy = (component) => {
      return ['starting', 'stopping'].includes(allConfigs[component].status);
    };

    const getRunningCount = () => {
      return Object.values(allConfigs).filter(config => config.status === 'running').length;
    };

    return React.createElement('div', {
      className: 'space-y-6',
      'data-name': 'config-manager-ui',
      'data-file': 'components/config/ConfigManagerUI.js'
    }, [
      // Status Bar
      React.createElement('div', {
        key: 'status-bar',
        className: 'bg-white border border-gray-300 rounded-lg p-4'
      }, [
        React.createElement('div', {
          key: 'status-content',
          className: 'flex items-center justify-between'
        }, [
          React.createElement('div', {
            key: 'mode-info',
            className: 'flex items-center space-x-4'
          }, [
            React.createElement('div', {
              key: 'mode-indicator',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('div', {
                key: 'indicator',
                className: `w-3 h-3 rounded-full ${
                  operatingMode === 'full' ? 'bg-green-500' : 'bg-red-500'
                }`
              }),
              React.createElement('span', {
                key: 'mode-text',
                className: 'text-sm font-medium text-gray-700'
              }, operatingMode === 'full' ? 'CLI Connected' : 'Offline Mode')
            ]),
            React.createElement('div', {
              key: 'running-count',
              className: 'text-sm text-gray-600'
            }, `Running: ${getRunningCount()}/${Object.keys(allConfigs).length} components`)
          ]),
          React.createElement('button', {
            key: 'console-toggle',
            onClick: () => setShowConsole(!showConsole),
            className: `px-3 py-1 rounded text-sm ${
              showConsole 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`
          }, [
            React.createElement('i', {
              key: 'icon',
              'data-lucide': showConsole ? 'eye-off' : 'eye',
              className: 'w-4 h-4 mr-1 inline'
            }),
            showConsole ? 'Hide Console' : 'Show Console'
          ])
        ])
      ]),

      // Component Grid
      React.createElement('div', {
        key: 'component-grid',
        className: 'grid grid-cols-2 lg:grid-cols-3 gap-4'
      }, Object.entries(allConfigs).map(([key, config]) =>
        React.createElement('div', {
          key,
          className: 'bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-3'
          }, [
            React.createElement('div', {
              key: 'info',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('i', {
                key: 'icon',
                'data-lucide': getComponentIcon(key),
                className: 'w-5 h-5 text-blue-600'
              }),
              React.createElement('span', {
                key: 'name',
                className: 'font-medium text-gray-900'
              }, config.name)
            ]),
            React.createElement('span', {
              key: 'status',
              className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(config.status)}`
            }, config.status.toUpperCase())
          ]),

          React.createElement('div', {
            key: 'actions',
            className: 'flex space-x-2'
          }, [
            config.status === 'stopped' ? React.createElement('button', {
              key: 'start',
              onClick: () => handleStart(key),
              disabled: !config.selectedConfig || isComponentBusy(key),
              className: 'flex-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm'
            }, 'Start') : React.createElement('button', {
              key: 'stop',
              onClick: () => handleStop(key),
              disabled: isComponentBusy(key),
              className: 'flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm'
            }, 'Stop'),
            React.createElement('button', {
              key: 'config',
              onClick: () => handleSelectConfig(key),
              className: 'px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm'
            }, 'Config')
          ])
        ])
      ))
    ]);

  } catch (error) {
    console.error('ConfigManagerUI component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'ConfigManagerUI Error');
  }
}

window.ConfigManagerUI = ConfigManagerUI;
