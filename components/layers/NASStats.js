// NASStats Component
function NASStats({ logs, stats }) {
  try {
    const safeLogs = Array.isArray(logs) ? logs : [];

    const nasLogs = safeLogs.filter(log => 
      log.protocol === 'NAS' || log.component === 'NAS' ||
      log.layer === 'nas' || (log.message || '').toUpperCase().includes('NAS')
    );
    
    const nasStats = React.useMemo(() => {
      let registrationRequests = 0;
      let authenticationRequests = 0;
      let pduSessions = 0;
      let securityModeCommands = 0;
      let serviceRequests = 0;
      let failures = 0;
      
      nasLogs.forEach(log => {
        const msg = (log.message || '').toLowerCase();
        if (msg.includes('registration')) registrationRequests++;
        if (msg.includes('authentication')) authenticationRequests++;
        if (msg.includes('pdu session')) pduSessions++;
        if (msg.includes('security mode')) securityModeCommands++;
        if (msg.includes('service request')) serviceRequests++;
        if (msg.includes('reject') || msg.includes('failure')) failures++;
      });
      
      return {
        registrationRequests,
        authenticationRequests,
        pduSessions,
        securityModeCommands,
        serviceRequests,
        successRate: registrationRequests > 0 ? 
          (((registrationRequests - failures) / registrationRequests) * 100).toFixed(1) : '100',
        totalMessages: nasLogs.length
      };
    }, [nasLogs]);
    
    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'nas-stats',
      'data-file': 'components/layers/NASStats.js'
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
            'data-lucide': 'network',
            className: 'w-6 h-6 text-indigo-600 mr-3'
          }),
          'NAS Layer Analysis'
        ]),
        React.createElement('span', {
          key: 'count',
          className: 'text-sm text-gray-600'
        }, `${nasStats.totalMessages} messages`)
      ]),
      
      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-2 md:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'registrations',
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
              }, 'Registrations'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-green-600'
              }, nasStats.registrationRequests)
            ]),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'user-plus',
              className: 'w-6 h-6 text-green-600'
            })
          ])
        ]),
        React.createElement('div', {
          key: 'pdu-sessions',
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
              }, 'PDU Sessions'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-blue-600'
              }, nasStats.pduSessions)
            ]),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'route',
              className: 'w-6 h-6 text-blue-600'
            })
          ])
        ]),
        React.createElement('div', {
          key: 'success-rate',
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
              }, 'Success Rate'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-purple-600'
              }, `${nasStats.successRate}%`)
            ]),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'check-circle',
              className: 'w-6 h-6 text-purple-600'
            })
          ])
        ]),
        React.createElement('div', {
          key: 'authentications',
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
              }, 'Authentications'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-orange-600'
              }, nasStats.authenticationRequests)
            ]),
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'key',
              className: 'w-6 h-6 text-orange-600'
            })
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('NASStats component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NASStats Error');
  }
}

NASStats.defaultProps = {
  logs: []
};

// Export NASStats component
window.NASStats = NASStats;
