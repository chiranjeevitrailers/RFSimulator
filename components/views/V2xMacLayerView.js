// V2xMacLayerView Component - V2X MAC layer analysis
function V2xMacLayerView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [macStats, setMacStats] = React.useState({
      pduCount: 1250,
      harqRetrans: 8,
      resourceUtilization: 65,
      collisions: 3
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'v2x-mac-layer-view',
      'data-file': 'components/views/V2xMacLayerView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'V2X MAC Layer'),

      React.createElement('div', {
        key: 'stats',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'pdu',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'PDU Count'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-blue-600'
          }, macStats.pduCount)
        ]),

        React.createElement('div', {
          key: 'harq',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'HARQ Retrans'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-red-600'
          }, macStats.harqRetrans)
        ]),

        React.createElement('div', {
          key: 'utilization',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Resource Utilization'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-green-600'
          }, `${macStats.resourceUtilization}%`)
        ]),

        React.createElement('div', {
          key: 'collisions',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Collisions'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-orange-600'
          }, macStats.collisions)
        ])
      ])
    ]);

  } catch (error) {
    console.error('V2xMacLayerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'V2X MAC Layer Error');
  }
}

window.V2xMacLayerView = V2xMacLayerView;
