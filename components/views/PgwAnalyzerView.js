// PgwAnalyzerView Component - PDN Gateway analyzer
function PgwAnalyzerView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [pgwData, setPgwData] = React.useState({
      pdnConnections: 245,
      ipPools: 12,
      qosRules: 156,
      chargingRecords: 2340
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'pgw-analyzer-view',
      'data-file': 'components/views/PgwAnalyzerView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'PGW Analyzer'),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'connections',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'PDN Connections'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-blue-600'
          }, pgwData.pdnConnections)
        ]),

        React.createElement('div', {
          key: 'ip-pools',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'IP Pools'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-green-600'
          }, pgwData.ipPools)
        ]),

        React.createElement('div', {
          key: 'qos-rules',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'QoS Rules'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-purple-600'
          }, pgwData.qosRules)
        ]),

        React.createElement('div', {
          key: 'charging',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Charging Records'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-orange-600'
          }, pgwData.chargingRecords.toLocaleString())
        ])
      ])
    ]);

  } catch (error) {
    console.error('PgwAnalyzerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'PGW Analyzer Error');
  }
}

window.PgwAnalyzerView = PgwAnalyzerView;
