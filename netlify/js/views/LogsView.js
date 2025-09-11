// Logs View Component for 5GLabX Platform Frontend Demo
function LogsView({ appState, onStateChange }) {
  const [logs, setLogs] = React.useState([]);
  const [filters, setFilters] = React.useState({
    level: 'all',
    source: 'all',
    search: ''
  });
  const [selectedLog, setSelectedLog] = React.useState(null);
  
  React.useEffect(() => {
    // Get initial logs
    updateLogs();
    
    // Subscribe to state changes
    const unsubscribe = MockStateService.subscribe((newState) => {
      if (newState.logs !== logs) {
        setLogs(newState.logs);
      }
    });
    
    return unsubscribe;
  }, []);
  
  const updateLogs = () => {
    const allLogs = MockStateService.getFilteredLogs();
    setLogs(allLogs);
  };
  
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    MockStateService.updateFilters(newFilters);
    updateLogs();
  };
  
  const handleLogClick = (log) => {
    setSelectedLog(log);
  };
  
  const filteredLogs = logs.filter(log => {
    if (filters.level !== 'all' && log.level !== filters.level) return false;
    if (filters.source !== 'all' && log.source !== filters.source) return false;
    if (filters.search && !log.message.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
  
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
      }, 'Log Analysis'),
      React.createElement('div', {
        key: 'log-count',
        className: 'text-sm text-gray-500'
      }, `${filteredLogs.length} logs`)
    ]),
    
    // Filters
    React.createElement('div', {
      key: 'filters',
      className: 'bg-white p-4 rounded-lg shadow space-y-4'
    }, [
      React.createElement('div', {
        key: 'filter-row',
        className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
      }, [
        // Level filter
        React.createElement('div', {
          key: 'level-filter'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-2'
          }, 'Log Level'),
          React.createElement('select', {
            key: 'select',
            value: filters.level,
            onChange: (e) => handleFilterChange('level', e.target.value),
            className: 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Levels'),
            React.createElement('option', { key: 'error', value: 'error' }, 'Error'),
            React.createElement('option', { key: 'warning', value: 'warning' }, 'Warning'),
            React.createElement('option', { key: 'info', value: 'info' }, 'Info'),
            React.createElement('option', { key: 'debug', value: 'debug' }, 'Debug')
          ])
        ]),
        
        // Source filter
        React.createElement('div', {
          key: 'source-filter'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-2'
          }, 'Source'),
          React.createElement('select', {
            key: 'select',
            value: filters.source,
            onChange: (e) => handleFilterChange('source', e.target.value),
            className: 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Sources'),
            React.createElement('option', { key: 'srsran', value: 'srsran' }, 'srsRAN'),
            React.createElement('option', { key: 'open5gs', value: 'open5gs' }, 'Open5GS'),
            React.createElement('option', { key: 'kamailio', value: 'kamailio' }, 'Kamailio')
          ])
        ]),
        
        // Search filter
        React.createElement('div', {
          key: 'search-filter'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-2'
          }, 'Search'),
          React.createElement('input', {
            key: 'input',
            type: 'text',
            placeholder: 'Search logs...',
            value: filters.search,
            onChange: (e) => handleFilterChange('search', e.target.value),
            className: 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          })
        ])
      ])
    ]),
    
    // Logs and Details
    React.createElement('div', {
      key: 'logs-content',
      className: 'grid grid-cols-1 lg:grid-cols-3 gap-6'
    }, [
      // Logs List
      React.createElement('div', {
        key: 'logs-list',
        className: 'lg:col-span-2'
      }, [
        React.createElement('div', {
          key: 'logs-header',
          className: 'bg-white p-4 rounded-lg shadow mb-4'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900'
          }, 'Log Entries')
        ]),
        
        React.createElement('div', {
          key: 'logs-container',
          className: 'bg-white rounded-lg shadow max-h-96 overflow-y-auto'
        }, filteredLogs.length > 0 ? filteredLogs.map((log, index) => 
          React.createElement('div', {
            key: index,
            onClick: () => handleLogClick(log),
            className: `log-entry ${log.level} cursor-pointer hover:bg-gray-50 ${
              selectedLog === log ? 'ring-2 ring-blue-500' : ''
            }`
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
          className: 'p-8 text-center text-gray-500'
        }, 'No logs match the current filters'))
      ]),
      
      // Log Details
      React.createElement('div', {
        key: 'log-details',
        className: 'lg:col-span-1'
      }, [
        React.createElement('div', {
          key: 'details-header',
          className: 'bg-white p-4 rounded-lg shadow mb-4'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900'
          }, 'Log Details')
        ]),
        
        React.createElement('div', {
          key: 'details-content',
          className: 'bg-white rounded-lg shadow p-4'
        }, selectedLog ? [
          React.createElement('div', {
            key: 'details',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'timestamp'
            }, [
              React.createElement('label', {
                key: 'label',
                className: 'block text-sm font-medium text-gray-700'
              }, 'Timestamp'),
              React.createElement('p', {
                key: 'value',
                className: 'text-sm text-gray-900 font-mono'
              }, Helpers.formatTimestamp(selectedLog.timestamp))
            ]),
            React.createElement('div', {
              key: 'source'
            }, [
              React.createElement('label', {
                key: 'label',
                className: 'block text-sm font-medium text-gray-700'
              }, 'Source'),
              React.createElement('p', {
                key: 'value',
                className: 'text-sm text-gray-900'
              }, Helpers.formatSource(selectedLog.source))
            ]),
            React.createElement('div', {
              key: 'level'
            }, [
              React.createElement('label', {
                key: 'label',
                className: 'block text-sm font-medium text-gray-700'
              }, 'Level'),
              React.createElement('span', {
                key: 'value',
                className: `text-xs px-2 py-1 rounded ${Helpers.formatLogLevel(selectedLog.level).bg} ${Helpers.formatLogLevel(selectedLog.level).color}`
              }, Helpers.formatLogLevel(selectedLog.level).text)
            ]),
            React.createElement('div', {
              key: 'message'
            }, [
              React.createElement('label', {
                key: 'label',
                className: 'block text-sm font-medium text-gray-700'
              }, 'Message'),
              React.createElement('p', {
                key: 'value',
                className: 'text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded'
              }, selectedLog.message)
            ]),
            selectedLog.parsed && Object.keys(selectedLog.parsed).length > 0 && React.createElement('div', {
              key: 'parsed'
            }, [
              React.createElement('label', {
                key: 'label',
                className: 'block text-sm font-medium text-gray-700'
              }, 'Parsed Data'),
              React.createElement('pre', {
                key: 'value',
                className: 'text-xs text-gray-900 bg-gray-50 p-2 rounded overflow-x-auto'
              }, JSON.stringify(selectedLog.parsed, null, 2))
            ])
          ])
        ] : React.createElement('div', {
          key: 'no-selection',
          className: 'text-center text-gray-500 py-8'
        }, 'Select a log entry to view details'))
      ])
    ])
  ]);
}