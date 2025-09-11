// V2xOverviewView Component - C-V2X deployment overview
function V2xOverviewView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [metrics, setMetrics] = React.useState({
      connectedVehicles: 0,
      messageRate: 0,
      latency: 0,
      reliability: 0
    });

    React.useEffect(() => {
      const updateMetrics = () => {
        try {
          setMetrics({
            connectedVehicles: Math.floor(Math.random() * 50) + 20,
            messageRate: Math.floor(Math.random() * 1000) + 500,
            latency: Math.floor(Math.random() * 10) + 5,
            reliability: (Math.random() * 5 + 95).toFixed(1)
          });
        } catch (error) {
          console.error('V2xOverviewView metrics update error:', error);
        }
      };

      updateMetrics();
      const interval = setInterval(updateMetrics, 3000);
      return () => clearInterval(interval);
    }, []);

    const renderMetricCard = (title, value, unit, icon, color) => {
      try {
        return React.createElement('div', {
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-4'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-sm font-medium text-gray-600'
            }, title),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': icon,
              className: `w-5 h-5 text-${color}-500`
            })
          ]),
          React.createElement('div', {
            key: 'value',
            className: `text-3xl font-bold text-${color}-600`
          }, `${value}${unit}`)
        ]);
      } catch (error) {
        return null;
      }
    };

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'v2x-overview-view',
      'data-file': 'components/views/V2xOverviewView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'C-V2X Overview'),
        React.createElement('div', {
          key: 'status',
          className: 'flex items-center space-x-2'
        }, [
          React.createElement('div', {
            key: 'indicator',
            className: 'w-3 h-3 bg-green-500 rounded-full'
          }),
          React.createElement('span', {
            key: 'text',
            className: 'text-sm text-gray-600'
          }, 'V2X Active')
        ])
      ]),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        renderMetricCard('Connected Vehicles', metrics.connectedVehicles, '', 'car', 'blue'),
        renderMetricCard('Message Rate', metrics.messageRate, ' msg/s', 'activity', 'green'),
        renderMetricCard('Latency', metrics.latency, ' ms', 'clock', 'orange'),
        renderMetricCard('Reliability', metrics.reliability, '%', 'shield-check', 'purple')
      ]),

      React.createElement('div', {
        key: 'content',
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      }, [
        React.createElement('div', {
          key: 'sidelink',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900 mb-4'
          }, 'Sidelink Status'),
          React.createElement('div', {
            key: 'content',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'freq',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Frequency'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, '5.905 GHz')
            ]),
            React.createElement('div', {
              key: 'mode',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Mode'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, 'Mode 4')
            ]),
            React.createElement('div', {
              key: 'pool',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Resource Pool'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, 'Pool 0')
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'channels',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900 mb-4'
          }, 'Channel Status'),
          React.createElement('div', {
            key: 'content',
            className: 'space-y-3'
          }, ['PSSCH', 'PSCCH', 'PC5'].map(channel =>
            React.createElement('div', {
              key: channel,
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'name', className: 'text-gray-600' }, channel),
              React.createElement('span', { 
                key: 'status', 
                className: 'px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium' 
              }, 'Active')
            ])
          ))
        ])
      ])
    ]);

  } catch (error) {
    console.error('V2xOverviewView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'V2X Overview Error');
  }
}

window.V2xOverviewView = V2xOverviewView;
