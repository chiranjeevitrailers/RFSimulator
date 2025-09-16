// IMSStats Component
function IMSStats({ logs }) {
  try {
    const safeLogs = Array.isArray(logs) ? logs : [];

    const imsLogs = safeLogs.filter(log => {
      const msg = (log.message || '').toUpperCase();
      return log.protocol === 'SIP' ||
             log.component === 'IMS' ||
             msg.includes('SIP') ||
             msg.includes('INVITE') ||
             msg.includes('REGISTER');
    });

    const sessionStats = React.useMemo(() => {
      return {
        totalSessions: imsLogs.filter(log => log.message?.includes('INVITE')).length,
        registrations: imsLogs.filter(log => log.message?.includes('REGISTER')).length,
        responses200: imsLogs.filter(log => log.message?.includes('200 OK')).length,
        responses4xx: imsLogs.filter(log => log.message?.match(/4\d\d/)).length,
        responses5xx: imsLogs.filter(log => log.message?.match(/5\d\d/)).length
      };
    }, [imsLogs]);

    const successRate = sessionStats.totalSessions > 0 
      ? ((sessionStats.responses200 / sessionStats.totalSessions) * 100).toFixed(1)
      : 0;

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'ims-stats',
      'data-file': 'components/layers/IMSStats.js'
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
            'data-lucide': 'phone',
            className: 'w-6 h-6 text-purple-600 mr-3'
          }),
          'IMS/SIP Statistics'
        ]),
        React.createElement('span', {
          key: 'count',
          className: 'text-sm text-gray-600'
        }, `${imsLogs.length} messages`)
      ]),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-2 md:grid-cols-3 gap-6'
      }, [
        React.createElement('div', {
          key: 'total-sessions',
          className: 'bg-white rounded-lg shadow p-6'
        }, [
          React.createElement('div', {
            key: 'content',
            className: 'text-center'
          }, [
            React.createElement('div', {
              key: 'value',
              className: 'text-2xl font-bold text-blue-600'
            }, sessionStats.totalSessions),
            React.createElement('div', {
              key: 'label',
              className: 'text-sm text-gray-600'
            }, 'Total Sessions')
          ])
        ]),
        React.createElement('div', {
          key: 'registrations',
          className: 'bg-white rounded-lg shadow p-6'
        }, [
          React.createElement('div', {
            key: 'content',
            className: 'text-center'
          }, [
            React.createElement('div', {
              key: 'value',
              className: 'text-2xl font-bold text-green-600'
            }, sessionStats.registrations),
            React.createElement('div', {
              key: 'label',
              className: 'text-sm text-gray-600'
            }, 'Registrations')
          ])
        ]),
        React.createElement('div', {
          key: 'success-rate',
          className: 'bg-white rounded-lg shadow p-6'
        }, [
          React.createElement('div', {
            key: 'content',
            className: 'text-center'
          }, [
            React.createElement('div', {
              key: 'value',
              className: 'text-2xl font-bold text-purple-600'
            }, `${successRate}%`),
            React.createElement('div', {
              key: 'label',
              className: 'text-sm text-gray-600'
            }, 'Success Rate')
          ])
        ])
      ]),

      React.createElement('div', {
        key: 'response-codes',
        className: 'bg-white rounded-lg shadow p-6'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900 mb-4'
        }, 'Response Codes'),
        React.createElement('div', {
          key: 'codes',
          className: 'space-y-3'
        }, [
          React.createElement('div', {
            key: '200-ok',
            className: 'flex justify-between'
          }, [
            React.createElement('span', {
              key: 'label',
              className: 'text-gray-600'
            }, '200 OK:'),
            React.createElement('span', {
              key: 'value',
              className: 'font-medium text-green-600'
            }, sessionStats.responses200)
          ]),
          React.createElement('div', {
            key: '4xx-errors',
            className: 'flex justify-between'
          }, [
            React.createElement('span', {
              key: 'label',
              className: 'text-gray-600'
            }, '4xx Errors:'),
            React.createElement('span', {
              key: 'value',
              className: 'font-medium text-orange-600'
            }, sessionStats.responses4xx)
          ]),
          React.createElement('div', {
            key: '5xx-errors',
            className: 'flex justify-between'
          }, [
            React.createElement('span', {
              key: 'label',
              className: 'text-gray-600'
            }, '5xx Errors:'),
            React.createElement('span', {
              key: 'value',
              className: 'font-medium text-red-600'
            }, sessionStats.responses5xx)
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('IMSStats component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'IMSStats Error');
  }
}

// Default props to avoid undefined errors
IMSStats.defaultProps = {
  logs: []
};

// Export IMSStats component
window.IMSStats = IMSStats;
