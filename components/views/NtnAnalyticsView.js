// NtnAnalyticsView Component - Detailed NTN analytics
function NtnAnalyticsView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [analyticsData, setAnalyticsData] = React.useState({
      delay: { min: 250, max: 290, avg: 270, variance: 15 },
      doppler: { current: -25, max: 100, compensation: 98 },
      harq: { enabled: false, retransmissions: 0, success: 100 }
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'ntn-analytics-view',
      'data-file': 'components/views/NtnAnalyticsView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'NTN Analytics'),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-1 lg:grid-cols-3 gap-6'
      }, [
        React.createElement('div', {
          key: 'delay',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, 'Propagation Delay'),
          React.createElement('div', {
            key: 'stats',
            className: 'space-y-2'
          }, [
            React.createElement('div', {
              key: 'min',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Minimum'),
              React.createElement('span', { key: 'value' }, `${analyticsData.delay.min} ms`)
            ]),
            React.createElement('div', {
              key: 'max',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Maximum'),
              React.createElement('span', { key: 'value' }, `${analyticsData.delay.max} ms`)
            ]),
            React.createElement('div', {
              key: 'avg',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Average'),
              React.createElement('span', { key: 'value' }, `${analyticsData.delay.avg} ms`)
            ]),
            React.createElement('div', {
              key: 'variance',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Variance'),
              React.createElement('span', { key: 'value' }, `${analyticsData.delay.variance} ms`)
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'doppler',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, 'Doppler Analysis'),
          React.createElement('div', {
            key: 'stats',
            className: 'space-y-2'
          }, [
            React.createElement('div', {
              key: 'current',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Current Shift'),
              React.createElement('span', { key: 'value' }, `${analyticsData.doppler.current} Hz`)
            ]),
            React.createElement('div', {
              key: 'max',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Max Expected'),
              React.createElement('span', { key: 'value' }, `${analyticsData.doppler.max} Hz`)
            ]),
            React.createElement('div', {
              key: 'compensation',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Compensation'),
              React.createElement('span', { key: 'value' }, `${analyticsData.doppler.compensation}%`)
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'harq',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, 'HARQ Status'),
          React.createElement('div', {
            key: 'stats',
            className: 'space-y-2'
          }, [
            React.createElement('div', {
              key: 'enabled',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'HARQ Enabled'),
              React.createElement('span', { key: 'value' }, analyticsData.harq.enabled ? 'Yes' : 'No')
            ]),
            React.createElement('div', {
              key: 'retrans',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Retransmissions'),
              React.createElement('span', { key: 'value' }, analyticsData.harq.retransmissions)
            ]),
            React.createElement('div', {
              key: 'success',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Success Rate'),
              React.createElement('span', { key: 'value' }, `${analyticsData.harq.success}%`)
            ])
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('NtnAnalyticsView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NTN Analytics Error');
  }
}

window.NtnAnalyticsView = NtnAnalyticsView;
