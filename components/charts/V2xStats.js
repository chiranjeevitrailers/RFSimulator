// V2xStats Component - V2X statistics widget for dashboard
function V2xStats({ data, className }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [stats, setStats] = React.useState({
      vehicles: 0,
      messages: 0,
      latency: 0,
      reliability: 0
    });

    React.useEffect(() => {
      const updateStats = () => {
        try {
          setStats({
            vehicles: Math.floor(Math.random() * 50) + 20,
            messages: Math.floor(Math.random() * 1000) + 500,
            latency: Math.floor(Math.random() * 10) + 5,
            reliability: (Math.random() * 5 + 95).toFixed(1)
          });
        } catch (error) {
          console.error('V2xStats update error:', error);
        }
      };

      updateStats();
      const interval = setInterval(updateStats, 3000);
      return () => clearInterval(interval);
    }, []);

    return React.createElement('div', {
      className: `bg-white p-4 rounded-lg border border-gray-200 ${className || ''}`,
      'data-name': 'v2x-stats',
      'data-file': 'components/charts/V2xStats.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between mb-4'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900'
        }, 'C-V2X Statistics'),
        React.createElement('i', {
          key: 'icon',
          'data-lucide': 'car',
          className: 'w-5 h-5 text-green-600'
        })
      ]),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-2 gap-4'
      }, [
        React.createElement('div', {
          key: 'vehicles',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-green-600'
          }, stats.vehicles),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Connected Vehicles')
        ]),
        React.createElement('div', {
          key: 'messages',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-blue-600'
          }, stats.messages),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Messages/sec')
        ]),
        React.createElement('div', {
          key: 'latency',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-orange-600'
          }, `${stats.latency}ms`),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Avg Latency')
        ]),
        React.createElement('div', {
          key: 'reliability',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-purple-600'
          }, `${stats.reliability}%`),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Reliability')
        ])
      ])
    ]);

  } catch (error) {
    console.error('V2xStats component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'V2X Stats Error');
  }
}

window.V2xStats = V2xStats;
