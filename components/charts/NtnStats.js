// NtnStats Component - NTN statistics widget for dashboard
function NtnStats({ data, className }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [stats, setStats] = React.useState({
      delay: 270,
      doppler: -15,
      quality: 85,
      satellite: 'GEO'
    });

    React.useEffect(() => {
      const updateStats = () => {
        try {
          setStats({
            delay: Math.floor(Math.random() * 50) + 250,
            doppler: Math.floor(Math.random() * 100) - 50,
            quality: Math.floor(Math.random() * 20) + 80,
            satellite: 'GEO'
          });
        } catch (error) {
          console.error('NtnStats update error:', error);
        }
      };

      updateStats();
      const interval = setInterval(updateStats, 5000);
      return () => clearInterval(interval);
    }, []);

    return React.createElement('div', {
      className: `bg-white p-4 rounded-lg border border-gray-200 ${className || ''}`,
      'data-name': 'ntn-stats',
      'data-file': 'components/charts/NtnStats.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between mb-4'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900'
        }, 'NTN Statistics'),
        React.createElement('i', {
          key: 'icon',
          'data-lucide': 'globe',
          className: 'w-5 h-5 text-indigo-600'
        })
      ]),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-2 gap-4'
      }, [
        React.createElement('div', {
          key: 'delay',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-indigo-600'
          }, `${stats.delay}ms`),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Propagation Delay')
        ]),
        React.createElement('div', {
          key: 'doppler',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-blue-600'
          }, `${stats.doppler}Hz`),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Doppler Shift')
        ]),
        React.createElement('div', {
          key: 'quality',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-green-600'
          }, `${stats.quality}%`),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Link Quality')
        ]),
        React.createElement('div', {
          key: 'satellite',
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-2xl font-bold text-purple-600'
          }, stats.satellite),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Satellite Type')
        ])
      ])
    ]);

  } catch (error) {
    console.error('NtnStats component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NTN Stats Error');
  }
}

window.NtnStats = NtnStats;
