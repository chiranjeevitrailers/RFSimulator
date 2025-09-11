// NBIoTMacLayerView Component - NB-IoT MAC layer analysis
function NBIoTMacLayerView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [macStats, setMacStats] = React.useState({
      pduCount: 450,
      harqRetrans: 12,
      schedulingRequests: 89,
      bufferStatus: 75
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'nbiot-mac-layer-view',
      'data-file': 'components/views/NBIoTMacLayerView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'NB-IoT MAC Layer'),

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
          key: 'scheduling',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Scheduling Requests'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-green-600'
          }, macStats.schedulingRequests)
        ]),

        React.createElement('div', {
          key: 'buffer',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Buffer Status'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-purple-600'
          }, `${macStats.bufferStatus}%`)
        ])
      ])
    ]);

  } catch (error) {
    console.error('NBIoTMacLayerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NB-IoT MAC Layer Error');
  }
}

window.NBIoTMacLayerView = NBIoTMacLayerView;
