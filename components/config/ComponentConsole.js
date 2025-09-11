// ComponentConsole Component - Enhanced real-time logs with better UI
function ComponentConsole({ logs, selectedComponent, onComponentSelect, onToggleConsole, onClearLogs }) {
  try {
    const filteredLogs = selectedComponent === 'all' 
      ? logs 
      : logs.filter(log => log.component === selectedComponent);
    
    const getLogLevelColor = (level) => {
      const colors = {
        ERROR: 'text-red-400',
        WARN: 'text-yellow-400',
        INFO: 'text-blue-400',
        SUCCESS: 'text-green-400',
        DEBUG: 'text-gray-400'
      };
      return colors[level] || 'text-gray-400';
    };

    const getLogLevelBadge = (level) => {
      const badges = {
        ERROR: 'bg-red-900 text-red-200',
        WARN: 'bg-yellow-900 text-yellow-200',
        INFO: 'bg-blue-900 text-blue-200',
        SUCCESS: 'bg-green-900 text-green-200',
        DEBUG: 'bg-gray-900 text-gray-200'
      };
      return badges[level] || 'bg-gray-900 text-gray-200';
    };
    
    const components = ['all', 'system', 'gnb', 'enb', 'core', 'ims'];
    
    // Auto-scroll to bottom
    const logContainerRef = React.useRef(null);
    React.useEffect(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, [logs]);
    
    return React.createElement('div', {
      className: 'bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm h-80 flex flex-col',
      'data-name': 'component-console',
      'data-file': 'components/config/ComponentConsole.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between mb-3 text-white border-b border-gray-700 pb-2'
      }, [
        React.createElement('div', {
          key: 'controls',
          className: 'flex items-center space-x-4'
        }, [
          React.createElement('div', {
            key: 'title-section',
            className: 'flex items-center space-x-2'
          }, [
            React.createElement('i', {
              key: 'terminal-icon',
              'data-lucide': 'terminal',
              className: 'w-4 h-4 text-green-400'
            }),
            React.createElement('span', {
              key: 'title',
              className: 'font-bold'
            }, 'CLI Console'),
            React.createElement('span', {
              key: 'log-count',
              className: 'text-xs bg-gray-700 px-2 py-1 rounded'
            }, `${filteredLogs.length} logs`)
          ]),
          React.createElement('select', {
            key: 'component-select',
            value: selectedComponent,
            onChange: (e) => onComponentSelect(e.target.value),
            className: 'bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 text-xs'
          }, components.map(comp =>
            React.createElement('option', {
              key: comp,
              value: comp
            }, comp === 'all' ? 'All Components' : comp.toUpperCase())
          ))
        ]),
        React.createElement('div', {
          key: 'actions',
          className: 'flex items-center space-x-2'
        }, [
          React.createElement('button', {
            key: 'clear',
            onClick: onClearLogs,
            className: 'text-yellow-400 hover:text-yellow-300 px-2 py-1 rounded hover:bg-gray-800',
            title: 'Clear Logs'
          }, [
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'trash-2',
              className: 'w-4 h-4'
            })
          ]),
          React.createElement('button', {
            key: 'close',
            onClick: onToggleConsole,
            className: 'text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-gray-800',
            title: 'Hide Console'
          }, [
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'x',
              className: 'w-4 h-4'
            })
          ])
        ])
      ]),
      
      React.createElement('div', {
        key: 'logs',
        ref: logContainerRef,
        className: 'flex-1 overflow-y-auto space-y-1 bg-black rounded p-2'
      }, filteredLogs.length === 0 ? React.createElement('div', {
        key: 'no-logs',
        className: 'text-gray-500 text-center py-8'
      }, [
        React.createElement('i', {
          key: 'icon',
          'data-lucide': 'activity',
          className: 'w-8 h-8 mx-auto mb-2 opacity-50'
        }),
        React.createElement('p', {
          key: 'message'
        }, 'No logs available'),
        React.createElement('p', {
          key: 'hint',
          className: 'text-xs mt-1'
        }, 'Start a component to see real-time logs')
      ]) : filteredLogs.slice(-100).map(log =>
        React.createElement('div', {
          key: log.id,
          className: 'flex items-start space-x-2 text-xs hover:bg-gray-900 px-1 py-0.5 rounded'
        }, [
          React.createElement('span', {
            key: 'timestamp',
            className: 'text-gray-500 w-20 flex-shrink-0'
          }, new Date(log.timestamp).toLocaleTimeString()),
          React.createElement('span', {
            key: 'level',
            className: `w-16 flex-shrink-0 px-1 rounded text-center text-xs ${getLogLevelBadge(log.level)}`
          }, log.level),
          React.createElement('span', {
            key: 'component',
            className: 'text-cyan-400 w-12 flex-shrink-0 text-center font-medium'
          }, log.component.toUpperCase()),
          React.createElement('span', {
            key: 'message',
            className: `flex-1 ${getLogLevelColor(log.level)}`
          }, log.message)
        ])
      ))
    ]);

  } catch (error) {
    console.error('ComponentConsole component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'ComponentConsole Error');
  }
}

// Export ComponentConsole component
window.ComponentConsole = ComponentConsole;
