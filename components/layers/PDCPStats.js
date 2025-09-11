// PDCPStats Component
function PDCPStats({ logs, stats }) {
  try {
    const pdcpLogs = logs.filter(log => 
      log.protocol === 'PDCP' || log.component === 'PDCP'
    );
    
    const pdcpStats = React.useMemo(() => {
      let txPackets = 0;
      let rxPackets = 0;
      let encryptedPackets = 0;
      let integrityProtectedPackets = 0;
      let compressionEnabled = 0;
      let sequenceErrors = 0;
      
      pdcpLogs.forEach(log => {
        const msg = log.message.toLowerCase();
        if (msg.includes('tx') || msg.includes('transmit')) txPackets++;
        if (msg.includes('rx') || msg.includes('receive')) rxPackets++;
        if (msg.includes('encrypt') || msg.includes('cipher')) encryptedPackets++;
        if (msg.includes('integrity') || msg.includes('protect')) integrityProtectedPackets++;
        if (msg.includes('compress')) compressionEnabled++;
        if (msg.includes('sequence') && msg.includes('error')) sequenceErrors++;
      });
      
      return {
        txPackets,
        rxPackets,
        encryptedPackets,
        integrityProtectedPackets,
        compressionEnabled,
        sequenceErrors,
        encryptionRate: txPackets > 0 ? 
          ((encryptedPackets / txPackets) * 100).toFixed(1) : '0',
        totalMessages: pdcpLogs.length
      };
    }, [pdcpLogs]);
    
    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'pdcp-stats',
      'data-file': 'components/layers/PDCPStats.js'
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
            'data-lucide': 'shield',
            className: 'w-6 h-6 text-yellow-600 mr-3'
          }),
          'PDCP Layer Analysis'
        ]),
        React.createElement('span', {
          key: 'count',
          className: 'text-sm text-gray-600'
        }, `${pdcpStats.totalMessages} messages`)
      ]),
      
      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-2 md:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'tx-packets',
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
              }, 'TX Packets'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-green-600'
              }, pdcpStats.txPackets)
            ]),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'arrow-up',
              className: 'w-6 h-6 text-green-600'
            })
          ])
        ]),
        React.createElement('div', {
          key: 'rx-packets',
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
              }, 'RX Packets'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-blue-600'
              }, pdcpStats.rxPackets)
            ]),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'arrow-down',
              className: 'w-6 h-6 text-blue-600'
            })
          ])
        ]),
        React.createElement('div', {
          key: 'encryption-rate',
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
              }, 'Encryption Rate'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-purple-600'
              }, `${pdcpStats.encryptionRate}%`)
            ]),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'lock',
              className: 'w-6 h-6 text-purple-600'
            })
          ])
        ]),
        React.createElement('div', {
          key: 'sequence-errors',
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
              }, 'Sequence Errors'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-red-600'
              }, pdcpStats.sequenceErrors)
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
    console.error('PDCPStats component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'PDCPStats Error');
  }
}

// Export PDCPStats component
window.PDCPStats = PDCPStats;
