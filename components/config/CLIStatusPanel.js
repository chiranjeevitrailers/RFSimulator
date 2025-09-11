// CLIStatusPanel Component - Monitor CLI tool availability
function CLIStatusPanel() {
  try {
    const [cliStatus, setCLIStatus] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
      checkEnvironment();
      const interval = setInterval(checkEnvironment, 30000);
      return () => clearInterval(interval);
    }, []);

    const checkEnvironment = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/environment-check');
        const data = await response.json();
        
        if (data.success) {
          setCLIStatus(data.environment);
        } else {
          console.error('Environment check failed:', data.error);
        }
      } catch (error) {
        console.error('Failed to check environment:', error);
        setCLIStatus({});
      } finally {
        setIsLoading(false);
      }
    };

    const getStatusIcon = (status) => {
      if (status.ready) return '🟢';
      if (status.cli_available) return '🟡';
      return '🔴';
    };

    const getStatusText = (status) => {
      if (status.ready) return 'Ready';
      if (status.cli_available) return 'Config Issues';
      return 'Not Available';
    };

    return React.createElement('div', {
      className: 'bg-white rounded-lg shadow-md p-6',
      'data-name': 'cli-status-panel',
      'data-file': 'components/config/CLIStatusPanel.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between mb-4'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900'
        }, 'CLI Integration Status'),
        React.createElement('button', {
          key: 'refresh',
          onClick: checkEnvironment,
          disabled: isLoading,
          className: 'px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50'
        }, isLoading ? 'Checking...' : 'Refresh')
      ]),

      Object.keys(cliStatus).length > 0 ? React.createElement('div', {
        key: 'status-grid',
        className: 'space-y-4'
      }, Object.entries(cliStatus).map(([component, status]) =>
        React.createElement('div', {
          key: component,
          className: 'border rounded-lg p-4'
        }, [
          React.createElement('div', {
            key: 'status-header',
            className: 'flex items-center justify-between mb-2'
          }, [
            React.createElement('div', {
              key: 'status-info',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('span', {
                key: 'icon',
                className: 'text-lg'
              }, getStatusIcon(status)),
              React.createElement('span', {
                key: 'name',
                className: 'font-medium capitalize'
              }, component),
              React.createElement('span', {
                key: 'status-badge',
                className: `text-sm px-2 py-1 rounded ${
                  status.ready ? 'bg-green-100 text-green-800' :
                  status.cli_available ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`
              }, getStatusText(status))
            ])
          ]),
          
          React.createElement('div', {
            key: 'details',
            className: 'text-sm text-gray-600 space-y-1'
          }, [
            status.cli_path && React.createElement('div', {
              key: 'cli-path'
            }, [
              'CLI Path: ',
              React.createElement('code', {
                className: 'bg-gray-100 px-1 rounded'
              }, status.cli_path)
            ]),
            status.config_file && React.createElement('div', {
              key: 'config-file'
            }, [
              'Config: ',
              React.createElement('code', {
                className: 'bg-gray-100 px-1 rounded'
              }, status.config_file)
            ]),
            
            status.errors && status.errors.length > 0 && React.createElement('div', {
              key: 'errors',
              className: 'mt-2'
            }, [
              React.createElement('div', {
                key: 'errors-title',
                className: 'text-red-600 font-medium'
              }, 'Errors:'),
              status.errors.map((error, idx) =>
                React.createElement('div', {
                  key: idx,
                  className: 'text-red-600 text-xs ml-2'
                }, `• ${error}`)
              )
            ])
          ])
        ])
      )) : React.createElement('div', {
        key: 'no-status',
        className: 'text-center py-8 text-gray-500'
      }, isLoading ? 'Checking CLI environment...' : 'Click Refresh to check CLI status')
    ]);

  } catch (error) {
    console.error('CLIStatusPanel component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'CLI Status Panel Error');
  }
}

// Export CLIStatusPanel component
window.CLIStatusPanel = CLIStatusPanel;
