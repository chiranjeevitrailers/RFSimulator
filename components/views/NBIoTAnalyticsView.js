// NBIoTAnalyticsView Component - Detailed NB-IoT analytics
function NBIoTAnalyticsView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [analyticsData, setAnalyticsData] = React.useState({
      coverage: { level0: 45, level1: 30, level2: 20, level3: 5 },
      messages: { nprach: 1200, npdcch: 980, npdsch: 850, mib: 200 },
      performance: { successRate: 95.2, avgLatency: 180, throughput: 8.5 }
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'nbiot-analytics-view',
      'data-file': 'components/views/NBIoTAnalyticsView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'NB-IoT Analytics'),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-1 lg:grid-cols-3 gap-6'
      }, [
        React.createElement('div', {
          key: 'coverage',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, 'Coverage Distribution'),
          React.createElement('div', {
            key: 'levels',
            className: 'space-y-2'
          }, Object.entries(analyticsData.coverage).map(([level, percentage]) =>
            React.createElement('div', {
              key: level,
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, `Level ${level.slice(-1)}`),
              React.createElement('span', { key: 'value' }, `${percentage}%`)
            ])
          ))
        ]),

        React.createElement('div', {
          key: 'messages',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, 'Message Count'),
          React.createElement('div', {
            key: 'counts',
            className: 'space-y-2'
          }, Object.entries(analyticsData.messages).map(([type, count]) =>
            React.createElement('div', {
              key: type,
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, type.toUpperCase()),
              React.createElement('span', { key: 'value' }, count)
            ])
          ))
        ]),

        React.createElement('div', {
          key: 'performance',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, 'Performance'),
          React.createElement('div', {
            key: 'metrics',
            className: 'space-y-2'
          }, [
            React.createElement('div', {
              key: 'success',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Success Rate'),
              React.createElement('span', { key: 'value' }, `${analyticsData.performance.successRate}%`)
            ]),
            React.createElement('div', {
              key: 'latency',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Avg Latency'),
              React.createElement('span', { key: 'value' }, `${analyticsData.performance.avgLatency}ms`)
            ]),
            React.createElement('div', {
              key: 'throughput',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Throughput'),
              React.createElement('span', { key: 'value' }, `${analyticsData.performance.throughput} kbps`)
            ])
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('NBIoTAnalyticsView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NB-IoT Analytics Error');
  }
}

window.NBIoTAnalyticsView = NBIoTAnalyticsView;
