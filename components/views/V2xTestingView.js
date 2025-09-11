// V2xTestingView Component - V2X testing and scenarios
function V2xTestingView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [testScenarios, setTestScenarios] = React.useState([
      { name: 'Highway Communication', status: 'passed', vehicles: 25, duration: '5min' },
      { name: 'Intersection Safety', status: 'running', vehicles: 12, duration: '3min' },
      { name: 'Emergency Broadcast', status: 'passed', vehicles: 50, duration: '2min' },
      { name: 'Platooning Test', status: 'failed', vehicles: 8, duration: '10min' }
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
      'data-name': 'v2x-testing-view',
      'data-file': 'components/views/V2xTestingView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'V2X Testing'),
        React.createElement('button', {
          key: 'run-tests',
          className: 'px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
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
        key: 'test-scenarios',
        className: 'bg-white rounded-lg border border-gray-200'
      }, [
        React.createElement('div', {
          key: 'header',
          className: 'p-4 border-b border-gray-200'
        }, React.createElement('h2', {
          className: 'text-lg font-semibold text-gray-900'
        }, 'Test Scenarios')),
        React.createElement('div', {
          key: 'scenarios',
          className: 'divide-y divide-gray-200'
        }, testScenarios.map((scenario, index) =>
          React.createElement('div', {
            key: index,
            className: 'p-4 flex items-center justify-between'
          }, [
            React.createElement('div', {
              key: 'info',
              className: 'flex-1'
            }, [
              React.createElement('div', {
                key: 'name',
                className: 'font-medium text-gray-900'
              }, scenario.name),
              React.createElement('div', {
                key: 'details',
                className: 'text-sm text-gray-600'
              }, `${scenario.vehicles} vehicles • ${scenario.duration}`)
            ]),
            React.createElement('span', {
              key: 'status',
              className: `px-2 py-1 rounded text-xs font-medium ${getStatusColor(scenario.status)}`
            }, scenario.status.toUpperCase())
          ])
        ))
      ])
    ]);

  } catch (error) {
    console.error('V2xTestingView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'V2X Testing Error');
  }
}

window.V2xTestingView = V2xTestingView;
