// SgwAnalyzerView Component - Serving Gateway analyzer
function SgwAnalyzerView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [sgwData, setSgwData] = React.useState({
      activeTunnels: 387,
      dataVolume: 2.4,
      throughput: 450,
      sessionCount: 245
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'sgw-analyzer-view',
      'data-file': 'components/views/SgwAnalyzerView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'SGW Analyzer'),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'tunnels',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Active Tunnels'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-blue-600'
          }, sgwData.activeTunnels)
        ]),

        React.createElement('div', {
          key: 'data-volume',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Data Volume'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-green-600'
          }, `${sgwData.dataVolume} GB`)
        ]),

        React.createElement('div', {
          key: 'throughput',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Throughput'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-purple-600'
          }, `${sgwData.throughput} Mbps`)
        ]),

        React.createElement('div', {
          key: 'sessions',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Session Count'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-orange-600'
          }, sgwData.sessionCount)
        ])
      ])
    ]);

  } catch (error) {
    console.error('SgwAnalyzerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'SGW Analyzer Error');
  }
}

window.SgwAnalyzerView = SgwAnalyzerView;
