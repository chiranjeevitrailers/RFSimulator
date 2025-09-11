// V2xAnalyticsView Component - Detailed V2X analytics
function V2xAnalyticsView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [analyticsData, setAnalyticsData] = React.useState({
      pssch: { utilization: 75, errors: 5, throughput: 850 },
      pscch: { blocks: 1200, success: 98.5, avgDelay: 12 },
      pc5: { connections: 45, handovers: 8, qos: 92 }
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'v2x-analytics-view',
      'data-file': 'components/views/V2xAnalyticsView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'V2X Analytics'),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-1 lg:grid-cols-3 gap-6'
      }, [
        React.createElement('div', {
          key: 'pssch',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, 'PSSCH Statistics'),
          React.createElement('div', {
            key: 'stats',
            className: 'space-y-2'
          }, [
            React.createElement('div', {
              key: 'util',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Utilization'),
              React.createElement('span', { key: 'value' }, `${analyticsData.pssch.utilization}%`)
            ]),
            React.createElement('div', {
              key: 'errors',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Errors'),
              React.createElement('span', { key: 'value' }, analyticsData.pssch.errors)
            ]),
            React.createElement('div', {
              key: 'throughput',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Throughput'),
              React.createElement('span', { key: 'value' }, `${analyticsData.pssch.throughput} kbps`)
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'pscch',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, 'PSCCH Statistics'),
          React.createElement('div', {
            key: 'stats',
            className: 'space-y-2'
          }, [
            React.createElement('div', {
              key: 'blocks',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Blocks'),
              React.createElement('span', { key: 'value' }, analyticsData.pscch.blocks)
            ]),
            React.createElement('div', {
              key: 'success',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Success Rate'),
              React.createElement('span', { key: 'value' }, `${analyticsData.pscch.success}%`)
            ]),
            React.createElement('div', {
              key: 'delay',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Avg Delay'),
              React.createElement('span', { key: 'value' }, `${analyticsData.pscch.avgDelay} ms`)
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'pc5',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, 'PC5 Interface'),
          React.createElement('div', {
            key: 'stats',
            className: 'space-y-2'
          }, [
            React.createElement('div', {
              key: 'connections',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Connections'),
              React.createElement('span', { key: 'value' }, analyticsData.pc5.connections)
            ]),
            React.createElement('div', {
              key: 'handovers',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Handovers'),
              React.createElement('span', { key: 'value' }, analyticsData.pc5.handovers)
            ]),
            React.createElement('div', {
              key: 'qos',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'QoS Score'),
              React.createElement('span', { key: 'value' }, `${analyticsData.pc5.qos}%`)
            ])
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('V2xAnalyticsView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'V2X Analytics Error');
  }
}

window.V2xAnalyticsView = V2xAnalyticsView;
