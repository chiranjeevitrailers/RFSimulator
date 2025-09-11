// V2xPhyLayerView Component - V2X PHY layer analysis
function V2xPhyLayerView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [phyStats, setPhyStats] = React.useState({
      snr: 15.2,
      rsrp: -85,
      mcs: 10,
      bler: 0.1
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'v2x-phy-layer-view',
      'data-file': 'components/views/V2xPhyLayerView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'V2X PHY Layer'),

      React.createElement('div', {
        key: 'stats',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'snr',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'SNR'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-blue-600'
          }, `${phyStats.snr} dB`)
        ]),

        React.createElement('div', {
          key: 'rsrp',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'RSRP'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-green-600'
          }, `${phyStats.rsrp} dBm`)
        ]),

        React.createElement('div', {
          key: 'mcs',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'MCS'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-purple-600'
          }, phyStats.mcs)
        ]),

        React.createElement('div', {
          key: 'bler',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'BLER'),
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-orange-600'
          }, `${phyStats.bler}%`)
        ])
      ])
    ]);

  } catch (error) {
    console.error('V2xPhyLayerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'V2X PHY Layer Error');
  }
}

window.V2xPhyLayerView = V2xPhyLayerView;
