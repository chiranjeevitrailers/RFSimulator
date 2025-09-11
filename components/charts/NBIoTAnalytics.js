// NBIoTAnalytics Component - Analytics widget for NB-IoT
function NBIoTAnalytics({ data, className }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [metrics, setMetrics] = React.useState({
      deviceCount: 0,
      messageCount: 0,
      successRate: 0,
      avgLatency: 0
    });

    React.useEffect(() => {
      const updateMetrics = () => {
        try {
          setMetrics({
            deviceCount: Math.floor(Math.random() * 200) + 100,
            messageCount: Math.floor(Math.random() * 1000) + 500,
            successRate: (Math.random() * 10 + 90).toFixed(1),
            avgLatency: Math.floor(Math.random() * 100) + 150
          });
        } catch (error) {
          console.error('NBIoTAnalytics metrics update error:', error);
        }
      };

      updateMetrics();
      const interval = setInterval(updateMetrics, 3000);
      return () => clearInterval(interval);
    }, []);

    return React.createElement('div', {
      className: `bg-white p-4 rounded-lg border border-gray-200 ${className || ''}`,
      'data-name': 'nbiot-analytics',
      'data-file': 'components/charts/NBIoTAnalytics.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between mb-4'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900'
        }, 'NB-IoT Analytics'),
        React.createElement('i', {
          key: 'icon',
          'data-lucide': 'satellite',
          className: 'w-5 h-5 text-purple-600'
        })
      ]),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-2 gap-4'
      }, [
        React.createElement('div', {
          key: 'devices',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-purple-600'
          }, metrics.deviceCount),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Connected Devices')
        ]),
        React.createElement('div', {
          key: 'messages',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-blue-600'
          }, metrics.messageCount),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Messages/Hour')
        ]),
        React.createElement('div', {
          key: 'success',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-green-600'
          }, `${metrics.successRate}%`),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Success Rate')
        ]),
        React.createElement('div', {
          key: 'latency',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-orange-600'
          }, `${metrics.avgLatency}ms`),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Avg Latency')
        ])
      ])
    ]);

  } catch (error) {
    console.error('NBIoTAnalytics component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NB-IoT Analytics Error');
  }
}

window.NBIoTAnalytics = NBIoTAnalytics;
