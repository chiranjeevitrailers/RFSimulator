// NtnOverviewView Component - NTN deployment overview
function NtnOverviewView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [metrics, setMetrics] = React.useState({
      satelliteType: 'GEO',
      propagationDelay: 270,
      dopplerShift: 0,
      linkQuality: 85
    });

    React.useEffect(() => {
      const updateMetrics = () => {
        try {
          setMetrics({
            satelliteType: 'GEO',
            propagationDelay: Math.floor(Math.random() * 50) + 250,
            dopplerShift: Math.floor(Math.random() * 100) - 50,
            linkQuality: Math.floor(Math.random() * 20) + 80
          });
        } catch (error) {
          console.error('NtnOverviewView metrics update error:', error);
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
      'data-name': 'ntn-overview-view',
      'data-file': 'components/views/NtnOverviewView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'NTN Overview'),
        React.createElement('div', {
          key: 'status',
          className: 'flex items-center space-x-2'
        }, [
          React.createElement('div', {
            key: 'indicator',
            className: 'w-3 h-3 bg-indigo-500 rounded-full'
          }),
          React.createElement('span', {
            key: 'text',
            className: 'text-sm text-gray-600'
          }, 'NTN Active')
        ])
      ]),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        renderMetricCard('Satellite Type', metrics.satelliteType, '', 'satellite', 'indigo'),
        renderMetricCard('Propagation Delay', metrics.propagationDelay, ' ms', 'clock', 'blue'),
        renderMetricCard('Doppler Shift', metrics.dopplerShift, ' Hz', 'wave', 'green'),
        renderMetricCard('Link Quality', metrics.linkQuality, '%', 'signal', 'purple')
      ]),

      React.createElement('div', {
        key: 'content',
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      }, [
        React.createElement('div', {
          key: 'satellite-info',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900 mb-4'
          }, 'Satellite Configuration'),
          React.createElement('div', {
            key: 'content',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'band',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Frequency Band'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, 'Band 256')
            ]),
            React.createElement('div', {
              key: 'orbit',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Orbit Type'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, 'Geostationary')
            ]),
            React.createElement('div', {
              key: 'altitude',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Altitude'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, '35,786 km')
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'sib19-status',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900 mb-4'
          }, 'SIB19 Status'),
          React.createElement('div', {
            key: 'content',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'broadcast',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Broadcast'),
              React.createElement('span', { 
                key: 'status', 
                className: 'px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium' 
              }, 'Active')
            ]),
            React.createElement('div', {
              key: 'period',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Period'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, '160 ms')
            ]),
            React.createElement('div', {
              key: 'last-update',
              className: 'flex justify-between items-center'
            }, [
              React.createElement('span', { key: 'label', className: 'text-gray-600' }, 'Last Update'),
              React.createElement('span', { key: 'value', className: 'font-medium' }, '2 sec ago')
            ])
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('NtnOverviewView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NTN Overview Error');
  }
}

window.NtnOverviewView = NtnOverviewView;
