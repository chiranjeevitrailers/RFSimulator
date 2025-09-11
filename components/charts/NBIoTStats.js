// NBIoTStats Component - NB-IoT protocol statistics
function NBIoTStats({ data, className }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [stats, setStats] = React.useState({
      nprach: { success: 95, attempts: 1200, avgDelay: 45 },
      npdcch: { blocks: 890, errors: 12, utilization: 78 },
      npdsch: { transmissions: 750, retransmissions: 45, efficiency: 92 }
    });

    React.useEffect(() => {
      const updateStats = () => {
        try {
          setStats(prev => ({
            nprach: {
              success: Math.floor(Math.random() * 10) + 90,
              attempts: Math.floor(Math.random() * 200) + 1000,
              avgDelay: Math.floor(Math.random() * 20) + 35
            },
            npdcch: {
              blocks: Math.floor(Math.random() * 100) + 800,
              errors: Math.floor(Math.random() * 10) + 5,
              utilization: Math.floor(Math.random() * 20) + 70
            },
            npdsch: {
              transmissions: Math.floor(Math.random() * 100) + 700,
              retransmissions: Math.floor(Math.random() * 30) + 20,
              efficiency: Math.floor(Math.random() * 10) + 85
            }
          }));
        } catch (error) {
          console.error('NBIoTStats update error:', error);
        }
      };

      const interval = setInterval(updateStats, 5000);
      return () => clearInterval(interval);
    }, []);

    return React.createElement('div', {
      className: `bg-white p-4 rounded-lg border border-gray-200 ${className || ''}`,
      'data-name': 'nbiot-stats',
      'data-file': 'components/charts/NBIoTStats.js'
    }, [
      React.createElement('h3', {
        key: 'title',
        className: 'text-lg font-semibold text-gray-900 mb-4'
      }, 'NB-IoT Protocol Statistics'),

      React.createElement('div', {
        key: 'stats',
        className: 'space-y-4'
      }, [
        React.createElement('div', {
          key: 'nprach',
          className: 'border-l-4 border-blue-500 pl-4'
        }, [
          React.createElement('h4', {
            key: 'title',
            className: 'font-medium text-gray-900'
          }, 'NPRACH'),
          React.createElement('div', {
            key: 'metrics',
            className: 'text-sm text-gray-600 space-y-1'
          }, [
            React.createElement('div', { key: 'success' }, `Success Rate: ${stats.nprach.success}%`),
            React.createElement('div', { key: 'attempts' }, `Attempts: ${stats.nprach.attempts}`),
            React.createElement('div', { key: 'delay' }, `Avg Delay: ${stats.nprach.avgDelay}ms`)
          ])
        ]),

        React.createElement('div', {
          key: 'npdcch',
          className: 'border-l-4 border-green-500 pl-4'
        }, [
          React.createElement('h4', {
            key: 'title',
            className: 'font-medium text-gray-900'
          }, 'NPDCCH'),
          React.createElement('div', {
            key: 'metrics',
            className: 'text-sm text-gray-600 space-y-1'
          }, [
            React.createElement('div', { key: 'blocks' }, `Blocks: ${stats.npdcch.blocks}`),
            React.createElement('div', { key: 'errors' }, `Errors: ${stats.npdcch.errors}`),
            React.createElement('div', { key: 'util' }, `Utilization: ${stats.npdcch.utilization}%`)
          ])
        ]),

        React.createElement('div', {
          key: 'npdsch',
          className: 'border-l-4 border-purple-500 pl-4'
        }, [
          React.createElement('h4', {
            key: 'title',
            className: 'font-medium text-gray-900'
          }, 'NPDSCH'),
          React.createElement('div', {
            key: 'metrics',
            className: 'text-sm text-gray-600 space-y-1'
          }, [
            React.createElement('div', { key: 'tx' }, `Transmissions: ${stats.npdsch.transmissions}`),
            React.createElement('div', { key: 'retx' }, `Retransmissions: ${stats.npdsch.retransmissions}`),
            React.createElement('div', { key: 'eff' }, `Efficiency: ${stats.npdsch.efficiency}%`)
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('NBIoTStats component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NB-IoT Stats Error');
  }
}

window.NBIoTStats = NBIoTStats;
