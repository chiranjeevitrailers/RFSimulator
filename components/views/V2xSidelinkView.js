// V2xSidelinkView Component - PC5 Sidelink interface analysis
function V2xSidelinkView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [sidelinkData, setSidelinkData] = React.useState({
      frequency: 5905,
      bandwidth: 10,
      resourcePools: 4,
      activeConnections: 32
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'v2x-sidelink-view',
      'data-file': 'components/views/V2xSidelinkView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'PC5 Sidelink Interface'),

      React.createElement('div', {
        key: 'config',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'frequency',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Frequency'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-blue-600'
          }, `${sidelinkData.frequency} MHz`)
        ]),

        React.createElement('div', {
          key: 'bandwidth',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Bandwidth'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-green-600'
          }, `${sidelinkData.bandwidth} MHz`)
        ]),

        React.createElement('div', {
          key: 'pools',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Resource Pools'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-purple-600'
          }, sidelinkData.resourcePools)
        ]),

        React.createElement('div', {
          key: 'connections',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Active Connections'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-orange-600'
          }, sidelinkData.activeConnections)
        ])
      ]),

      React.createElement('div', {
        key: 'details',
        className: 'bg-white p-6 rounded-lg border border-gray-200'
      }, [
        React.createElement('h2', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900 mb-4'
        }, 'Sidelink Configuration'),
        React.createElement('div', {
          key: 'content',
          className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
        }, [
          React.createElement('div', {
            key: 'left',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'mode',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Resource Selection'),
              React.createElement('span', { key: 'value' }, 'Mode 4')
            ]),
            React.createElement('div', {
              key: 'sync',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Sync Source'),
              React.createElement('span', { key: 'value' }, 'GNSS')
            ]),
            React.createElement('div', {
              key: 'sensing',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Sensing Window'),
              React.createElement('span', { key: 'value' }, '1000 ms')
            ])
          ]),
          React.createElement('div', {
            key: 'right',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'reservation',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Reservation Period'),
              React.createElement('span', { key: 'value' }, '100 ms')
            ]),
            React.createElement('div', {
              key: 'mcs',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'MCS'),
              React.createElement('span', { key: 'value' }, '10')
            ]),
            React.createElement('div', {
              key: 'packet',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Packet Size'),
              React.createElement('span', { key: 'value' }, '300 bytes')
            ])
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('V2xSidelinkView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'V2X Sidelink Error');
  }
}

window.V2xSidelinkView = V2xSidelinkView;
