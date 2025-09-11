// NBIoTOverviewView Component - NB-IoT deployment overview
function NBIoTOverviewView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [metrics, setMetrics] = React.useState({
      connectedDevices: 0,
      coverageLevel: 0,
      throughput: 0,
      latency: 0
    });

    React.useEffect(() => {
      const updateMetrics = () => {
        try {
          setMetrics({
            connectedDevices: Math.floor(Math.random() * 100) + 50,
            coverageLevel: Math.floor(Math.random() * 4) + 1,
            throughput: (Math.random() * 10 + 5).toFixed(1),
            latency: Math.floor(Math.random() * 50) + 100
          });
        } catch (error) {
          console.error('NBIoTOverviewView metrics update error:', error);
        }
      };

      updateMetrics();
      const interval = setInterval(updateMetrics, 5000);
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
      'data-name': 'nbiot-overview-view',
      'data-file': 'components/views/NBIoTOverviewView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'NB-IoT Overview'),
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
          }, 'NB-IoT Active')
        ])
      ]),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        renderMetricCard('Connected Devices', metrics.connectedDevices, '', 'satellite', 'blue'),
        renderMetricCard('Coverage Level', metrics.coverageLevel, '', 'signal', 'green'),
        renderMetricCard('Throughput', metrics.throughput, ' kbps', 'activity', 'purple'),
        renderMetricCard('Latency', metrics.latency, ' ms', 'clock', 'orange')
      ]),

      React.createElement('div', {
        key: 'content',
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      }, [
        React.createElement('div', {
          key: 'deployment',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900 mb-4'
          }, 'Deployment Status'),
          React.createElement('div', {
            key: 'content',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'carrier',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Carrier Type'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, 'In-band')
            ]),
            React.createElement('div', {
              key: 'bandwidth',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Bandwidth'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, '200 kHz')
            ]),
            React.createElement('div', {
              key: 'power',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'TX Power'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, '23 dBm')
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'protocols',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900 mb-4'
          }, 'Protocol Status'),
          React.createElement('div', {
            key: 'content',
            className: 'space-y-3'
          }, ['NPRACH', 'NPDCCH', 'NPDSCH', 'MIB-NB'].map(protocol =>
            React.createElement('div', {
              key: protocol,
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'name', className: 'text-gray-600' }, protocol),
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
    console.error('NBIoTOverviewView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NB-IoT Overview Error');
  }
}

window.NBIoTOverviewView = NBIoTOverviewView;
