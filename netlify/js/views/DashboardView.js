// Dashboard View Component for 5GLabX Platform Frontend Demo
function DashboardView({ appState, onStateChange }) {
  const [metrics, setMetrics] = React.useState(Constants.DEMO_DATA.SAMPLE_METRICS);
  const [recentLogs, setRecentLogs] = React.useState([]);
  
  React.useEffect(() => {
    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(Helpers.generateRandomMetrics());
    }, 5000);
    
    // Get recent logs
    const logs = MockStateService.getFilteredLogs().slice(0, 5);
    setRecentLogs(logs);
    
    return () => clearInterval(interval);
  }, []);
  
  const metricCards = [
    {
      title: 'srsRAN (eNB/gNB)',
      color: 'blue',
      metrics: metrics.srsran,
      icon: '📡'
    },
    {
      title: 'Open5GS (Core)',
      color: 'green',
      metrics: metrics.open5gs,
      icon: '🌐'
    },
    {
      title: 'Kamailio (IMS)',
      color: 'purple',
      metrics: metrics.kamailio,
      icon: '📞'
    }
  ];
  
  return React.createElement('div', {
    className: 'p-6 space-y-6'
  }, [
    // Header
    React.createElement('div', {
      key: 'header',
      className: 'flex items-center justify-between'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-3xl font-bold text-gray-900'
      }, 'Dashboard'),
      React.createElement('div', {
        key: 'last-update',
        className: 'text-sm text-gray-500'
      }, `Last updated: ${Helpers.formatTimestamp(new Date().toISOString())}`)
    ]),
    
    // Metrics Cards
    React.createElement('div', {
      key: 'metrics-cards',
      className: 'grid grid-cols-1 md:grid-cols-3 gap-6'
    }, metricCards.map(card => 
      React.createElement('div', {
        key: card.title,
        className: `bg-white p-6 rounded-lg shadow border-l-4 border-${card.color}-500`
      }, [
        React.createElement('div', {
          key: 'card-header',
          className: 'flex items-center justify-between mb-4'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900'
          }, card.title),
          React.createElement('span', {
            key: 'icon',
            className: 'text-2xl'
          }, card.icon)
        ]),
        
        React.createElement('div', {
          key: 'metrics',
          className: 'grid grid-cols-2 gap-4'
        }, Object.entries(card.metrics).map(([key, value]) => 
          React.createElement('div', {
            key: key,
            className: 'text-center'
          }, [
            React.createElement('div', {
              key: 'value',
              className: 'text-2xl font-bold text-gray-900'
            }, value),
            React.createElement('div', {
              key: 'label',
              className: 'text-sm text-gray-500 capitalize'
            }, key.replace('_', ' '))
          ])
        ))
      ])
    )),
    
    // Recent Logs
    React.createElement('div', {
      key: 'recent-logs',
      className: 'bg-white rounded-lg shadow'
    }, [
      React.createElement('div', {
        key: 'logs-header',
        className: 'p-6 border-b border-gray-200'
      }, [
        React.createElement('h2', {
          key: 'title',
          className: 'text-xl font-semibold text-gray-900'
        }, 'Recent Logs'),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-1'
        }, 'Latest log entries from all sources')
      ]),
      
      React.createElement('div', {
        key: 'logs-content',
        className: 'p-6'
      }, recentLogs.length > 0 ? recentLogs.map((log, index) => 
        React.createElement('div', {
          key: index,
          className: `log-entry ${log.level} mb-3`
        }, [
          React.createElement('div', {
            key: 'log-header',
            className: 'flex items-center justify-between mb-1'
          }, [
            React.createElement('div', {
              key: 'source-level',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('span', {
                key: 'source',
                className: 'text-sm font-medium text-gray-700'
              }, Helpers.formatSource(log.source)),
              React.createElement('span', {
                key: 'level',
                className: `text-xs px-2 py-1 rounded ${Helpers.formatLogLevel(log.level).bg} ${Helpers.formatLogLevel(log.level).color}`
              }, Helpers.formatLogLevel(log.level).text)
            ]),
            React.createElement('span', {
              key: 'timestamp',
              className: 'text-xs text-gray-500'
            }, Helpers.formatTimestamp(log.timestamp))
          ]),
          React.createElement('div', {
            key: 'message',
            className: 'text-sm text-gray-800 font-mono'
          }, log.message)
        ])
      ) : React.createElement('div', {
        key: 'no-logs',
        className: 'text-center text-gray-500 py-8'
      }, 'No recent logs available'))
    ]),
    
    // Demo Notice
    React.createElement('div', {
      key: 'demo-notice',
      className: 'bg-blue-50 border border-blue-200 rounded-lg p-4'
    }, [
      React.createElement('div', {
        key: 'notice-content',
        className: 'flex items-center space-x-3'
      }, [
        React.createElement('span', {
          key: 'icon',
          className: 'text-blue-600 text-xl'
        }, 'ℹ️'),
        React.createElement('div', {
          key: 'text'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'font-semibold text-blue-900'
          }, 'Demo Mode'),
          React.createElement('p', {
            key: 'description',
            className: 'text-blue-700 text-sm'
          }, 'This is a frontend demo. Real CLI integration requires the full platform deployment.')
        ])
      ])
    ])
  ]);
}