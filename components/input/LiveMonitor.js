// LiveMonitor Component
function LiveMonitor({ onLogReceived, isMonitoring = false, onToggleMonitoring }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [connectionStatus, setConnectionStatus] = React.useState('disconnected');
    const [wsUrl, setWsUrl] = React.useState('ws://localhost:8081');
    const [selectedSources, setSelectedSources] = React.useState(['testcase']);
    const [logCount, setLogCount] = React.useState(0);
    const wsRef = React.useRef(null);

    React.useEffect(() => {
      if (isMonitoring) {
        connectWebSocket();
      } else {
        disconnectWebSocket();
      }
      
      return () => {
        disconnectWebSocket();
      };
    }, [isMonitoring, selectedSources]);

    const connectWebSocket = () => {
      try {
        setConnectionStatus('connecting');
        
        // Disable browser DataAdapter path (Node-only readers)
        if (false && typeof window.DataAdapter !== 'undefined') {
          const dataAdapter = new window.DataAdapter();
          dataAdapter.subscribe((logEntry) => {
            if (logEntry && selectedSources.some(src => logEntry.source === src)) {
              handleLogMessage({
                type: 'log',
                source: logEntry.source || 'srsran',
                message: logEntry.message || logEntry.raw
              });
            }
          });
          
          dataAdapter.start(selectedSources).then(() => {
            setConnectionStatus('connected');
          }).catch(() => {
            setConnectionStatus('error');
          });
          
          wsRef.current = dataAdapter;
          return;
        }

        // Disable CLIDataBridge simulation path in browser
        if (false && typeof window.CLIDataBridge !== 'undefined') {
          const simulateRealTimeData = () => {
            try {
              const logs = window.CLIDataBridge.getRealtimeLogs();
              logs.forEach(log => {
                selectedSources.forEach(source => {
                  handleLogMessage({
                    type: 'log',
                    source: source,
                    message: log.message || log.raw || `[${source.toUpperCase()}] Sample message`
                  });
                });
              });
            } catch (error) {
              console.error('Simulation error:', error);
            }
          };
          
          setConnectionStatus('connected');
          const interval = setInterval(simulateRealTimeData, 2000);
          wsRef.current = { close: () => clearInterval(interval) };
          return;
        }

        const ws = new WebSocketService();
        
        ws.on('connected', () => {
          setConnectionStatus('connected');
        });
        
        ws.on('message', (data) => {
          if (data.type === 'log' && selectedSources.includes(data.source)) {
            handleLogMessage(data);
          }
        });
        
        ws.on('disconnected', () => {
          setConnectionStatus('disconnected');
        });
        
        ws.on('error', () => {
          setConnectionStatus('error');
        });
        
        ws.connect(wsUrl);
        wsRef.current = ws;
      } catch (error) {
        console.error('LiveMonitor connect error:', error);
        setConnectionStatus('error');
      }
    };

    const disconnectWebSocket = () => {
      try {
        if (wsRef.current) {
          wsRef.current.ws?.close();
          wsRef.current = null;
        }
        setConnectionStatus('disconnected');
      } catch (error) {
        console.error('LiveMonitor disconnect error:', error);
        reportError(error);
      }
    };

    const handleLogMessage = async (data) => {
      try {
        const logProcessor = new LogProcessor();
        const logEntry = await logProcessor.processLogLine(data.message, data.source);
        
        if (logEntry && onLogReceived) {
          onLogReceived(logEntry);
          setLogCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('LiveMonitor handle log message error:', error);
        reportError(error);
      }
    };

    const handleToggle = () => {
      try {
        if (onToggleMonitoring) {
          onToggleMonitoring();
        }
      } catch (error) {
        console.error('LiveMonitor toggle error:', error);
        reportError(error);
      }
    };

    const handleSourceToggle = (source) => {
      try {
        setSelectedSources(prev => 
          prev.includes(source) 
            ? prev.filter(s => s !== source)
            : [...prev, source]
        );
      } catch (error) {
        console.error('LiveMonitor source toggle error:', error);
        reportError(error);
      }
    };

    const getStatusColor = () => {
      switch (connectionStatus) {
        case 'connected': return 'text-green-600';
        case 'connecting': return 'text-yellow-600';
        case 'error': return 'text-red-600';
        default: return 'text-gray-600';
      }
    };

    const getStatusIcon = () => {
      switch (connectionStatus) {
        case 'connected': return 'wifi';
        case 'connecting': return 'loader-2';
        case 'error': return 'wifi-off';
        default: return 'wifi-off';
      }
    };

    return React.createElement('div', {
      className: 'w-full space-y-4',
      'data-name': 'live-monitor',
      'data-file': 'components/input/LiveMonitor.js'
    }, [
      React.createElement('div', {
        key: 'connection-config',
        className: 'space-y-3'
      }, [
        React.createElement('div', {
          key: 'url-input',
          className: 'flex items-center space-x-2'
        }, [
          React.createElement('label', {
            key: 'url-label',
            className: 'text-sm font-medium text-gray-700 w-20'
          }, 'WebSocket:'),
          React.createElement('input', {
            key: 'url-field',
            type: 'text',
            value: wsUrl,
            onChange: (e) => setWsUrl(e.target.value),
            className: 'flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm',
            disabled: isMonitoring,
            placeholder: 'ws://localhost:8080/logs'
          })
        ]),
        React.createElement('div', {
          key: 'sources-config',
          className: 'space-y-2'
        }, [
          React.createElement('label', {
            key: 'sources-label',
            className: 'text-sm font-medium text-gray-700'
          }, 'Monitor Sources:'),
          React.createElement('div', {
            key: 'sources-checkboxes',
            className: 'flex space-x-4'
          }, [
            ['testcase', 'Test Case'],
            ['srsran', 'srsRAN'],
            ['open5gs', 'Open5GS'],
            ['kamailio', 'Kamailio']
          ].map(([value, label]) => 
            React.createElement('label', {
              key: value,
              className: 'flex items-center space-x-2 text-sm'
            }, [
              React.createElement('input', {
                key: 'checkbox',
                type: 'checkbox',
                checked: selectedSources.includes(value),
                onChange: () => handleSourceToggle(value),
                className: 'rounded border-gray-300'
              }),
              React.createElement('span', { key: 'label' }, label)
            ])
          ))
        ])
      ]),
      React.createElement('div', {
        key: 'status-bar',
        className: 'flex items-center justify-between p-3 bg-gray-50 rounded-lg'
      }, [
        React.createElement('div', {
          key: 'status-info',
          className: 'flex items-center space-x-3'
        }, [
          React.createElement('i', {
            key: 'status-icon',
            'data-lucide': getStatusIcon(),
            className: `w-5 h-5 ${getStatusColor()} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`
          }),
          React.createElement('span', {
            key: 'status-text',
            className: `text-sm font-medium ${getStatusColor()}`
          }, connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)),
          isMonitoring && React.createElement('span', {
            key: 'log-count',
            className: 'text-sm text-gray-600'
          }, `${logCount} logs received`)
        ]),
        React.createElement('button', {
          key: 'toggle-button',
          onClick: handleToggle,
          className: `px-4 py-2 rounded-lg font-medium ${
            isMonitoring 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`
        }, isMonitoring ? 'Stop Monitoring' : 'Start Monitoring')
      ])
    ]);

  } catch (error) {
    console.error('LiveMonitor component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Live monitor failed to load');
  }
}

// Export LiveMonitor component
window.LiveMonitor = LiveMonitor;
