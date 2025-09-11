// NBIoTPhyLayerView Component - NB-IoT PHY layer analysis
function NBIoTPhyLayerView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [phyStats, setPhyStats] = React.useState({
      subcarriers: 12,
      repetitions: 128,
      powerControl: -40,
      channelQuality: 85
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'nbiot-phy-layer-view',
      'data-file': 'components/views/NBIoTPhyLayerView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'NB-IoT PHY Layer'),

      React.createElement('div', {
        key: 'stats',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'subcarriers',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Subcarriers'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-blue-600'
          }, phyStats.subcarriers)
        ]),

        React.createElement('div', {
          key: 'repetitions',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Repetitions'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-green-600'
          }, phyStats.repetitions)
        ]),

        React.createElement('div', {
          key: 'power',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Power Control'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-purple-600'
          }, `${phyStats.powerControl} dBm`)
        ]),

        React.createElement('div', {
          key: 'quality',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Channel Quality'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-orange-600'
          }, `${phyStats.channelQuality}%`)
        ])
      ]),

      React.createElement('div', {
        key: 'details',
        className: 'bg-white p-6 rounded-lg border border-gray-200'
      }, [
        React.createElement('h2', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900 mb-4'
        }, 'PHY Layer Details'),
        React.createElement('div', {
          key: 'content',
          className: 'space-y-3'
        }, [
          React.createElement('div', {
            key: 'bandwidth',
            className: 'flex justify-between'
          }, [
            React.createElement('span', { key: 'label' }, 'Bandwidth'),
            React.createElement('span', { key: 'value' }, '200 kHz')
          ]),
          React.createElement('div', {
            key: 'modulation',
            className: 'flex justify-between'
          }, [
            React.createElement('span', { key: 'label' }, 'Modulation'),
            React.createElement('span', { key: 'value' }, 'QPSK')
          ]),
          React.createElement('div', {
            key: 'coding',
            className: 'flex justify-between'
          }, [
            React.createElement('span', { key: 'label' }, 'Coding Rate'),
            React.createElement('span', { key: 'value' }, '1/3')
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('NBIoTPhyLayerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NB-IoT PHY Layer Error');
  }
}

window.NBIoTPhyLayerView = NBIoTPhyLayerView;
