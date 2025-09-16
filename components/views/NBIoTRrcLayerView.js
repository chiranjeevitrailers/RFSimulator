// NBIoTRrcLayerView Component - NB-IoT RRC layer analysis
function NBIoTRrcLayerView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }
    }, []);

    const [rrcStats, setRrcStats] = React.useState({
      connections: 25,
      establishments: 180,
      releases: 175,
      reconfigurations: 45
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'nbiot-rrc-layer-view',
      'data-file': 'components/views/NBIoTRrcLayerView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'NB-IoT RRC Layer'),

      React.createElement('div', {
        key: 'stats',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
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
            className: 'text-2xl font-bold text-blue-600'
          }, rrcStats.connections)
        ]),

        React.createElement('div', {
          key: 'establishments',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Establishments'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-green-600'
          }, rrcStats.establishments)
        ]),

        React.createElement('div', {
          key: 'releases',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Releases'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-orange-600'
          }, rrcStats.releases)
        ]),

        React.createElement('div', {
          key: 'reconfigurations',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Reconfigurations'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-purple-600'
          }, rrcStats.reconfigurations)
        ])
      ])
    ]);

  } catch (error) {
    console.error('NBIoTRrcLayerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NB-IoT RRC Layer Error');
  }
}

NBIoTRrcLayerView.defaultProps = {
  appState: {},
  onStateChange: () => {}
};

window.NBIoTRrcLayerView = NBIoTRrcLayerView;
