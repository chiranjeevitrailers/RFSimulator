// NtnSatellitesView Component - Satellite links management
function NtnSatellitesView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [satellites, setSatellites] = React.useState([
      {
        id: 'geo-1',
        name: 'GEO-SAT-1',
        type: 'GEO',
        altitude: 35786,
        status: 'active',
        delay: 270,
        doppler: 0
      },
      {
        id: 'meo-1',
        name: 'MEO-SAT-1',
        type: 'MEO',
        altitude: 8000,
        status: 'active',
        delay: 50,
        doppler: 1500
      },
      {
        id: 'leo-1',
        name: 'LEO-SAT-1',
        type: 'LEO',
        altitude: 600,
        status: 'handover',
        delay: 5,
        doppler: 7200
      }
    ]);

    const getStatusColor = (status) => {
      const colors = {
        active: 'bg-green-100 text-green-700',
        handover: 'bg-yellow-100 text-yellow-700',
        inactive: 'bg-red-100 text-red-700'
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
      'data-name': 'ntn-satellites-view',
      'data-file': 'components/views/NtnSatellitesView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'Satellite Links'),
        React.createElement('div', {
          key: 'summary',
          className: 'text-sm text-gray-600'
        }, `${satellites.filter(s => s.status === 'active').length} active / ${satellites.length} total`)
      ]),

      React.createElement('div', {
        key: 'satellites-grid',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      }, satellites.map(satellite =>
        React.createElement('div', {
          key: satellite.id,
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
                'data-lucide': getSatelliteIcon(satellite.type),
                className: 'w-5 h-5 text-indigo-600'
              }),
              React.createElement('h3', {
                key: 'name',
                className: 'text-lg font-semibold text-gray-900'
              }, satellite.name)
            ]),
            React.createElement('span', {
              key: 'status',
              className: `px-2 py-1 rounded text-xs font-medium ${getStatusColor(satellite.status)}`
            }, satellite.status.toUpperCase())
          ]),
          
          React.createElement('div', {
            key: 'details',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'type',
              className: 'flex justify-between text-sm'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Type:'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, satellite.type)
            ]),
            React.createElement('div', {
              key: 'altitude',
              className: 'flex justify-between text-sm'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Altitude:'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, `${satellite.altitude} km`)
            ]),
            React.createElement('div', {
              key: 'delay',
              className: 'flex justify-between text-sm'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Delay:'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, `${satellite.delay} ms`)
            ]),
            React.createElement('div', {
              key: 'doppler',
              className: 'flex justify-between text-sm'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Doppler:'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, `${satellite.doppler} Hz`)
            ])
          ]),
          
          React.createElement('div', {
            key: 'actions',
            className: 'mt-4 flex space-x-2'
          }, [
            React.createElement('button', {
              key: 'monitor',
              className: 'flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm'
            }, 'Monitor'),
            React.createElement('button', {
              key: 'config',
              className: 'px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm'
            }, 'Config')
          ])
        ])
      ))
    ]);

  } catch (error) {
    console.error('NtnSatellitesView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NTN Satellites Error');
  }
}

window.NtnSatellitesView = NtnSatellitesView;