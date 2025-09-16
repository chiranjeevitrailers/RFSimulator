// NtnScenariosView Component - NTN test scenarios management
function NtnScenariosView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [scenarios, setScenarios] = React.useState([
      {
        id: 1,
        name: 'GEO Satellite Link',
        description: 'Geostationary satellite communication test',
        satelliteType: 'GEO',
        duration: 600,
        status: 'configured'
      },
      {
        id: 2,
        name: 'MEO Handover',
        description: 'Medium Earth Orbit satellite handover scenario',
        satelliteType: 'MEO',
        duration: 300,
        status: 'running'
      },
      {
        id: 3,
        name: 'LEO Constellation',
        description: 'Low Earth Orbit constellation test',
        satelliteType: 'LEO',
        duration: 180,
        status: 'completed'
      }
    ]);

    const getStatusColor = (status) => {
      const colors = {
        configured: 'bg-blue-100 text-blue-700',
        running: 'bg-green-100 text-green-700',
        completed: 'bg-gray-100 text-gray-700',
        failed: 'bg-red-100 text-red-700'
      };
      return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getSatelliteIcon = (type) => {
      const icons = {
        GEO: 'globe',
        MEO: 'satellite',
        LEO: 'orbit'
      };
      return icons[type] || 'satellite';
    };

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'ntn-scenarios-view',
      'data-file': 'components/views/NtnScenariosView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'NTN Test Scenarios'),
        React.createElement('button', {
          key: 'new-scenario',
          className: 'px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'plus',
            className: 'w-4 h-4 mr-2 inline'
          }),
          'New Scenario'
        ])
      ]),

      React.createElement('div', {
        key: 'scenarios-grid',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      }, scenarios.map(scenario =>
        React.createElement('div', {
          key: scenario.id,
          className: 'bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-4'
          }, [
            React.createElement('div', {
              key: 'info',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('i', {
                key: 'icon',
                'data-lucide': getSatelliteIcon(scenario.satelliteType),
                className: 'w-5 h-5 text-indigo-600'
              }),
              React.createElement('h3', {
                key: 'name',
                className: 'text-lg font-semibold text-gray-900'
              }, scenario.name)
            ]),
            React.createElement('span', {
              key: 'status',
              className: `px-2 py-1 rounded text-xs font-medium ${getStatusColor(scenario.status)}`
            }, scenario.status.toUpperCase())
          ]),
          
          React.createElement('p', {
            key: 'description',
            className: 'text-gray-600 text-sm mb-4'
          }, scenario.description),
          
          React.createElement('div', {
            key: 'details',
            className: 'space-y-2 mb-4'
          }, [
            React.createElement('div', {
              key: 'satellite-type',
              className: 'flex justify-between text-sm'
            }, [
              React.createElement('span', { key: 'label' }, 'Satellite Type:'),
              React.createElement('span', { key: 'value' }, scenario.satelliteType)
            ]),
            React.createElement('div', {
              key: 'duration',
              className: 'flex justify-between text-sm'
            }, [
              React.createElement('span', { key: 'label' }, 'Duration:'),
              React.createElement('span', { key: 'value' }, `${scenario.duration}s`)
            ])
          ]),
          
          React.createElement('div', {
            key: 'actions',
            className: 'flex space-x-2'
          }, [
            React.createElement('button', {
              key: 'run',
              className: 'flex-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm',
              disabled: scenario.status === 'running'
            }, scenario.status === 'running' ? 'Running' : 'Run'),
            React.createElement('button', {
              key: 'edit',
              className: 'px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm'
            }, 'Edit')
          ])
        ])
      ))
    ]);

  } catch (error) {
    console.error('NtnScenariosView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NTN Scenarios Error');
  }
}

window.NtnScenariosView = NtnScenariosView;