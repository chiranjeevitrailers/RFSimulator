// NBIoTTestingView Component - NB-IoT testing and validation
function NBIoTTestingView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [testResults, setTestResults] = React.useState([
      { name: 'Random Access', status: 'passed', duration: '245ms' },
      { name: 'Data Transfer', status: 'passed', duration: '180ms' },
      { name: 'Power Saving', status: 'running', duration: '320ms' },
      { name: 'Coverage Test', status: 'failed', duration: '500ms' }
    ]);

    const getStatusColor = (status) => {
      switch (status) {
        case 'passed': return 'bg-green-100 text-green-700';
        case 'failed': return 'bg-red-100 text-red-700';
        case 'running': return 'bg-blue-100 text-blue-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'nbiot-testing-view',
      'data-file': 'components/views/NBIoTTestingView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'NB-IoT Testing'),
        React.createElement('button', {
          key: 'run-tests',
          className: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'play',
            className: 'w-4 h-4 mr-2 inline'
          }),
          'Run Tests'
        ])
      ]),

      React.createElement('div', {
        key: 'test-results',
        className: 'bg-white rounded-lg border border-gray-200'
      }, [
        React.createElement('div', {
          key: 'header',
          className: 'p-4 border-b border-gray-200'
        }, React.createElement('h2', {
          className: 'text-lg font-semibold text-gray-900'
        }, 'Test Results')),
        React.createElement('div', {
          key: 'results',
          className: 'divide-y divide-gray-200'
        }, testResults.map((test, index) =>
          React.createElement('div', {
            key: index,
            className: 'p-4 flex items-center justify-between'
          }, [
            React.createElement('span', {
              key: 'name',
              className: 'font-medium text-gray-900'
            }, test.name),
            React.createElement('div', {
              key: 'status-duration',
              className: 'flex items-center space-x-3'
            }, [
              React.createElement('span', {
                key: 'status',
                className: `px-2 py-1 rounded text-xs font-medium ${getStatusColor(test.status)}`
              }, test.status.toUpperCase()),
              React.createElement('span', {
                key: 'duration',
                className: 'text-sm text-gray-600'
              }, test.duration)
            ])
          ])
        ))
      ])
    ]);

  } catch (error) {
    console.error('NBIoTTestingView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NB-IoT Testing Error');
  }
}

window.NBIoTTestingView = NBIoTTestingView;
