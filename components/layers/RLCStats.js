// RLCStats Component
function RLCStats({ logs, stats }) {
  try {
    const safeLogs = Array.isArray(logs) ? logs : [];

    const rlcLogs = safeLogs.filter(log => 
      log.protocol === 'RLC' || log.component === 'RLC'
    );
    
    const rlcStats = React.useMemo(() => {
      let amPackets = 0;
      let umPackets = 0;
      let tmPackets = 0;
      let retransmissions = 0;
      let statusReports = 0;
      let bufferOverflows = 0;
      
      rlcLogs.forEach(log => {
        const msg = (log.message || '').toLowerCase();
        if (msg.includes('am mode') || msg.includes(' am ')) amPackets++;
        if (msg.includes('um mode') || msg.includes(' um ')) umPackets++;
        if (msg.includes('tm mode') || msg.includes(' tm ')) tmPackets++;
        if (msg.includes('retx') || msg.includes('retransmit')) retransmissions++;
        if (msg.includes('status report')) statusReports++;
        if (msg.includes('buffer') && msg.includes('overflow')) bufferOverflows++;
      });
      
      return {
        amPackets,
        umPackets,
        tmPackets,
        retransmissions,
        statusReports,
        bufferOverflows,
        retxRate: (amPackets + umPackets) > 0 ? 
          ((retransmissions / (amPackets + umPackets)) * 100).toFixed(2) : '0',
        totalMessages: rlcLogs.length
      };
    }, [rlcLogs]);
    
    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'rlc-stats',
      'data-file': 'components/layers/RLCStats.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900 flex items-center'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'layers',
            className: 'w-6 h-6 text-purple-600 mr-3'
          }),
          'RLC Layer Analysis'
        ]),
        React.createElement('span', {
          key: 'count',
          className: 'text-sm text-gray-600'
        }, `${rlcStats.totalMessages} messages`)
      ]),
      
      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-2 md:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'am-packets',
          className: 'bg-white rounded-lg shadow p-6'
        }, [
          React.createElement('div', {
            key: 'content',
            className: 'flex items-center justify-between'
          }, [
            React.createElement('div', { key: 'data' }, [
              React.createElement('p', {
                key: 'label',
                className: 'text-sm font-medium text-gray-600'
              }, 'AM Packets'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-green-600'
              }, rlcStats.amPackets)
            ]),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'check-circle-2',
              className: 'w-6 h-6 text-green-600'
            })
          ])
        ]),
        React.createElement('div', {
          key: 'um-packets',
          className: 'bg-white rounded-lg shadow p-6'
        }, [
          React.createElement('div', {
            key: 'content',
            className: 'flex items-center justify-between'
          }, [
            React.createElement('div', { key: 'data' }, [
              React.createElement('p', {
                key: 'label',
                className: 'text-sm font-medium text-gray-600'
              }, 'UM Packets'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-blue-600'
              }, rlcStats.umPackets)
            ]),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'fast-forward',
              className: 'w-6 h-6 text-blue-600'
            })
          ])
        ]),
        React.createElement('div', {
          key: 'retx-rate',
          className: 'bg-white rounded-lg shadow p-6'
        }, [
          React.createElement('div', {
            key: 'content',
            className: 'flex items-center justify-between'
          }, [
            React.createElement('div', { key: 'data' }, [
              React.createElement('p', {
                key: 'label',
                className: 'text-sm font-medium text-gray-600'
              }, 'Retx Rate'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-orange-600'
              }, `${rlcStats.retxRate}%`)
            ]),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'rotate-cw',
              className: 'w-6 h-6 text-orange-600'
            })
          ])
        ]),
        React.createElement('div', {
          key: 'buffer-overflows',
          className: 'bg-white rounded-lg shadow p-6'
        }, [
          React.createElement('div', {
            key: 'content',
            className: 'flex items-center justify-between'
          }, [
            React.createElement('div', { key: 'data' }, [
              React.createElement('p', {
                key: 'label',
                className: 'text-sm font-medium text-gray-600'
              }, 'Buffer Overflows'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-red-600'
              }, rlcStats.bufferOverflows)
            ]),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'alert-triangle',
              className: 'w-6 h-6 text-red-600'
            })
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('RLCStats component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'RLCStats Error');
  }
}

RLCStats.defaultProps = {
  logs: []
};

// Export RLCStats component
window.RLCStats = RLCStats;
