// CLI Status Monitor Component - Verifies CLI tool functionality
function CLIStatusMonitor({ appState, onStateChange, onLogReceived }) {
  const [cliStatus, setCliStatus] = React.useState({
    srsran: {
      process: { running: false, pid: null, startTime: null },
      health: { status: 'unknown', lastCheck: null, responseTime: null },
      connections: { open5gs: 'unknown', ue: 'unknown' },
      metrics: { ue_count: 0, cell_load: 0, errors: 0 }
    },
    open5gs: {
      process: { running: false, pid: null, startTime: null },
      health: { status: 'unknown', lastCheck: null, responseTime: null },
      connections: { srsran: 'unknown', database: 'unknown' },
      metrics: { subscribers: 0, sessions: 0, throughput: 0 }
    },
    kamailio: {
      process: { running: false, pid: null, startTime: null },
      health: { status: 'unknown', lastCheck: null, responseTime: null },
      connections: { database: 'unknown', sip_clients: 'unknown' },
      metrics: { registrations: 0, calls: 0, sip_errors: 0 }
    }
  });

  const [monitoringActive, setMonitoringActive] = React.useState(false);
  const [alerts, setAlerts] = React.useState([]);
  const [selectedTool, setSelectedTool] = React.useState('all');

  // Auto-refresh status every 5 seconds when monitoring is active
  React.useEffect(() => {
    let interval;
    if (monitoringActive) {
      interval = setInterval(() => {
        checkAllCLIStatus();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [monitoringActive]);

  // Initial status check
  React.useEffect(() => {
    checkAllCLIStatus();
  }, []);

  const checkAllCLIStatus = async () => {
    try {
      const [processStatus, healthStatus, connectionStatus] = await Promise.all([
        fetch('/api/cli/status').then(r => r.json()),
        fetch('/api/cli/health').then(r => r.json()),
        fetch('/api/cli/connections').then(r => r.json())
      ]);

      setCliStatus(prev => ({
        srsran: {
          ...prev.srsran,
          process: processStatus.srsran || prev.srsran.process,
          health: healthStatus.srsran || prev.srsran.health,
          connections: connectionStatus.srsran || prev.srsran.connections,
          metrics: healthStatus.srsran?.metrics || prev.srsran.metrics
        },
        open5gs: {
          ...prev.open5gs,
          process: processStatus.open5gs || prev.open5gs.process,
          health: healthStatus.open5gs || prev.open5gs.health,
          connections: connectionStatus.open5gs || prev.open5gs.connections,
          metrics: healthStatus.open5gs?.metrics || prev.open5gs.metrics
        },
        kamailio: {
          ...prev.kamailio,
          process: processStatus.kamailio || prev.kamailio.process,
          health: healthStatus.kamailio || prev.kamailio.health,
          connections: connectionStatus.kamailio || prev.kamailio.connections,
          metrics: healthStatus.kamailio?.metrics || prev.kamailio.metrics
        }
      }));

      // Check for alerts
      checkForAlerts(processStatus, healthStatus, connectionStatus);

    } catch (error) {
      console.error('Failed to check CLI status:', error);
      addAlert('error', 'Status Check Failed', `Failed to check CLI status: ${error.message}`);
    }
  };

  const checkForAlerts = (processStatus, healthStatus, connectionStatus) => {
    const newAlerts = [];

    // Check srsRAN
    if (processStatus.srsran?.running && healthStatus.srsran?.status !== 'healthy') {
      newAlerts.push({
        type: 'warning',
        tool: 'srsRAN',
        message: 'srsRAN process running but health check failed',
        timestamp: new Date()
      });
    }

    if (connectionStatus.srsran?.open5gs === 'disconnected') {
      newAlerts.push({
        type: 'error',
        tool: 'srsRAN',
        message: 'srsRAN not connected to Open5GS',
        timestamp: new Date()
      });
    }

    // Check Open5GS
    if (processStatus.open5gs?.running && healthStatus.open5gs?.status !== 'healthy') {
      newAlerts.push({
        type: 'warning',
        tool: 'Open5GS',
        message: 'Open5GS process running but health check failed',
        timestamp: new Date()
      });
    }

    if (connectionStatus.open5gs?.database === 'disconnected') {
      newAlerts.push({
        type: 'error',
        tool: 'Open5GS',
        message: 'Open5GS database connection failed',
        timestamp: new Date()
      });
    }

    // Check Kamailio
    if (processStatus.kamailio?.running && healthStatus.kamailio?.status !== 'healthy') {
      newAlerts.push({
        type: 'warning',
        tool: 'Kamailio',
        message: 'Kamailio process running but health check failed',
        timestamp: new Date()
      });
    }

    if (connectionStatus.kamailio?.database === 'disconnected') {
      newAlerts.push({
        type: 'error',
        tool: 'Kamailio',
        message: 'Kamailio database connection failed',
        timestamp: new Date()
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep last 10 alerts
    }
  };

  const addAlert = (type, title, message) => {
    const alert = {
      type,
      title,
      message,
      timestamp: new Date(),
      id: Date.now()
    };
    setAlerts(prev => [alert, ...prev].slice(0, 10));

    // Send to log receiver if available
    if (onLogReceived) {
      onLogReceived({
        timestamp: alert.timestamp,
        level: type.toUpperCase(),
        source: 'cli-monitor',
        message: `${title}: ${message}`
      });
    }
  };

  const runHealthCheck = async (tool) => {
    try {
      const response = await fetch(`/api/cli/health/${tool}`);
      const result = await response.json();

      if (result.success) {
        addAlert('success', `${tool.toUpperCase()} Health Check`, 'Health check passed successfully');
      } else {
        addAlert('error', `${tool.toUpperCase()} Health Check`, result.error || 'Health check failed');
      }

      // Refresh status
      await checkAllCLIStatus();
    } catch (error) {
      addAlert('error', `${tool.toUpperCase()} Health Check`, `Failed: ${error.message}`);
    }
  };

  const testConnection = async (tool, target) => {
    try {
      const response = await fetch(`/api/cli/test-connection/${tool}/${target}`);
      const result = await response.json();

      if (result.success) {
        addAlert('success', 'Connection Test', `${tool.toUpperCase()} ↔ ${target.toUpperCase()}: Connected`);
      } else {
        addAlert('error', 'Connection Test', `${tool.toUpperCase()} ↔ ${target.toUpperCase()}: ${result.error || 'Failed'}`);
      }

      // Refresh status
      await checkAllCLIStatus();
    } catch (error) {
      addAlert('error', 'Connection Test', `Failed to test ${tool} ↔ ${target}: ${error.message}`);
    }
  };

  const getStatusIcon = (status, health) => {
    if (!status.running) return '🔴'; // Not running
    if (health.status === 'healthy') return '🟢'; // Healthy
    if (health.status === 'warning') return '🟡'; // Warning
    if (health.status === 'error') return '🔴'; // Error
    return '⚪'; // Unknown
  };

  const getStatusText = (status, health) => {
    if (!status.running) return 'Not Running';
    if (health.status === 'healthy') return 'Healthy';
    if (health.status === 'warning') return 'Warning';
    if (health.status === 'error') return 'Error';
    return 'Checking...';
  };

  const getConnectionIcon = (connectionStatus) => {
    switch (connectionStatus) {
      case 'connected': return '🟢';
      case 'disconnected': return '🔴';
      case 'unknown': return '⚪';
      default: return '⚪';
    }
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const filteredAlerts = selectedTool === 'all'
    ? alerts
    : alerts.filter(alert => alert.tool?.toLowerCase() === selectedTool.toLowerCase());

  return React.createElement('div', { className: 'space-y-6' }, [
    // Header
    React.createElement('div', {
      key: 'header',
      className: 'flex items-center justify-between'
    }, [
      React.createElement('div', { key: 'title' }, [
        React.createElement('h1', {
          key: 'title-text',
          className: 'text-3xl font-bold text-gray-900'
        }, 'CLI Status Monitor'),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-1'
        }, 'Monitor and verify CLI tool functionality and connections')
      ]),
      React.createElement('div', { key: 'controls', className: 'flex gap-2' }, [
        React.createElement('button', {
          key: 'toggle-monitoring',
          onClick: () => setMonitoringActive(!monitoringActive),
          className: `px-4 py-2 text-sm rounded ${
            monitoringActive
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`
        }, monitoringActive ? '⏹️ Stop Monitoring' : '▶️ Start Monitoring'),
        React.createElement('button', {
          key: 'refresh',
          onClick: checkAllCLIStatus,
          className: 'px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
        }, '🔄 Refresh Status')
      ])
    ]),

    // Status Overview Cards
    React.createElement('div', { key: 'status-cards', className: 'grid grid-cols-1 md:grid-cols-3 gap-4' }, [

      // srsRAN Status Card
      React.createElement('div', {
        key: 'srsran-card',
        className: 'bg-white p-6 rounded-lg shadow border-l-4 border-blue-500'
      }, [
        React.createElement('div', { key: 'header', className: 'flex items-center justify-between mb-4' }, [
          React.createElement('h3', { key: 'title', className: 'font-semibold text-lg' }, 'srsRAN (eNB/gNB)'),
          React.createElement('span', {
            key: 'status-icon',
            className: 'text-2xl'
          }, getStatusIcon(cliStatus.srsran.process, cliStatus.srsran.health))
        ]),

        React.createElement('div', { key: 'status-info', className: 'space-y-2 mb-4' }, [
          React.createElement('div', { key: 'process-status' }, [
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'Process: '),
            React.createElement('span', {
              className: `font-medium ${
                cliStatus.srsran.process.running ? 'text-green-600' : 'text-red-600'
              }`
            }, cliStatus.srsran.process.running ? 'Running' : 'Stopped')
          ]),
          React.createElement('div', { key: 'health-status' }, [
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'Health: '),
            React.createElement('span', {
              className: `font-medium ${
                cliStatus.srsran.health.status === 'healthy' ? 'text-green-600' :
                cliStatus.srsran.health.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`
            }, getStatusText(cliStatus.srsran.process, cliStatus.srsran.health))
          ]),
          cliStatus.srsran.process.pid && React.createElement('div', { key: 'pid' }, [
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'PID: '),
            React.createElement('span', { className: 'font-mono text-sm' }, cliStatus.srsran.process.pid)
          ])
        ]),

        React.createElement('div', { key: 'connections', className: 'mb-4' }, [
          React.createElement('h4', { key: 'conn-title', className: 'font-medium mb-2' }, 'Connections'),
          React.createElement('div', { key: 'conn-list', className: 'space-y-1 text-sm' }, [
            React.createElement('div', { key: 'open5gs-conn', className: 'flex items-center gap-2' }, [
              React.createElement('span', { key: 'icon' }, getConnectionIcon(cliStatus.srsran.connections.open5gs)),
              React.createElement('span', { key: 'text' }, 'Open5GS: '),
              React.createElement('span', { className: 'capitalize' }, cliStatus.srsran.connections.open5gs)
            ]),
            React.createElement('div', { key: 'ue-conn', className: 'flex items-center gap-2' }, [
              React.createElement('span', { key: 'icon' }, getConnectionIcon(cliStatus.srsran.connections.ue)),
              React.createElement('span', { key: 'text' }, 'UE: '),
              React.createElement('span', { className: 'capitalize' }, cliStatus.srsran.connections.ue)
            ])
          ])
        ]),

        React.createElement('div', { key: 'metrics', className: 'mb-4' }, [
          React.createElement('h4', { key: 'metrics-title', className: 'font-medium mb-2' }, 'Metrics'),
          React.createElement('div', { key: 'metrics-grid', className: 'grid grid-cols-2 gap-2 text-sm' }, [
            React.createElement('div', { key: 'ue-count' }, [
              React.createElement('span', { className: 'text-gray-600' }, 'UE Count: '),
              React.createElement('span', { className: 'font-medium' }, cliStatus.srsran.metrics.ue_count)
            ]),
            React.createElement('div', { key: 'cell-load' }, [
              React.createElement('span', { className: 'text-gray-600' }, 'Cell Load: '),
              React.createElement('span', { className: 'font-medium' }, `${cliStatus.srsran.metrics.cell_load}%`)
            ])
          ])
        ]),

        React.createElement('div', { key: 'actions', className: 'flex gap-2' }, [
          React.createElement('button', {
            key: 'health-check',
            onClick: () => runHealthCheck('srsran'),
            className: 'px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600'
          }, 'Health Check'),
          React.createElement('button', {
            key: 'test-conn',
            onClick: () => testConnection('srsran', 'open5gs'),
            className: 'px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600'
          }, 'Test Open5GS')
        ])
      ]),

      // Open5GS Status Card
      React.createElement('div', {
        key: 'open5gs-card',
        className: 'bg-white p-6 rounded-lg shadow border-l-4 border-green-500'
      }, [
        React.createElement('div', { key: 'header', className: 'flex items-center justify-between mb-4' }, [
          React.createElement('h3', { key: 'title', className: 'font-semibold text-lg' }, 'Open5GS (Core)'),
          React.createElement('span', {
            key: 'status-icon',
            className: 'text-2xl'
          }, getStatusIcon(cliStatus.open5gs.process, cliStatus.open5gs.health))
        ]),

        React.createElement('div', { key: 'status-info', className: 'space-y-2 mb-4' }, [
          React.createElement('div', { key: 'process-status' }, [
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'Process: '),
            React.createElement('span', {
              className: `font-medium ${
                cliStatus.open5gs.process.running ? 'text-green-600' : 'text-red-600'
              }`
            }, cliStatus.open5gs.process.running ? 'Running' : 'Stopped')
          ]),
          React.createElement('div', { key: 'health-status' }, [
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'Health: '),
            React.createElement('span', {
              className: `font-medium ${
                cliStatus.open5gs.health.status === 'healthy' ? 'text-green-600' :
                cliStatus.open5gs.health.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`
            }, getStatusText(cliStatus.open5gs.process, cliStatus.open5gs.health))
          ]),
          cliStatus.open5gs.process.pid && React.createElement('div', { key: 'pid' }, [
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'PID: '),
            React.createElement('span', { className: 'font-mono text-sm' }, cliStatus.open5gs.process.pid)
          ])
        ]),

        React.createElement('div', { key: 'connections', className: 'mb-4' }, [
          React.createElement('h4', { key: 'conn-title', className: 'font-medium mb-2' }, 'Connections'),
          React.createElement('div', { key: 'conn-list', className: 'space-y-1 text-sm' }, [
            React.createElement('div', { key: 'srsran-conn', className: 'flex items-center gap-2' }, [
              React.createElement('span', { key: 'icon' }, getConnectionIcon(cliStatus.open5gs.connections.srsran)),
              React.createElement('span', { key: 'text' }, 'srsRAN: '),
              React.createElement('span', { className: 'capitalize' }, cliStatus.open5gs.connections.srsran)
            ]),
            React.createElement('div', { key: 'db-conn', className: 'flex items-center gap-2' }, [
              React.createElement('span', { key: 'icon' }, getConnectionIcon(cliStatus.open5gs.connections.database)),
              React.createElement('span', { key: 'text' }, 'Database: '),
              React.createElement('span', { className: 'capitalize' }, cliStatus.open5gs.connections.database)
            ])
          ])
        ]),

        React.createElement('div', { key: 'metrics', className: 'mb-4' }, [
          React.createElement('h4', { key: 'metrics-title', className: 'font-medium mb-2' }, 'Metrics'),
          React.createElement('div', { key: 'metrics-grid', className: 'grid grid-cols-2 gap-2 text-sm' }, [
            React.createElement('div', { key: 'subscribers' }, [
              React.createElement('span', { className: 'text-gray-600' }, 'Subscribers: '),
              React.createElement('span', { className: 'font-medium' }, cliStatus.open5gs.metrics.subscribers)
            ]),
            React.createElement('div', { key: 'sessions' }, [
              React.createElement('span', { className: 'text-gray-600' }, 'Sessions: '),
              React.createElement('span', { className: 'font-medium' }, cliStatus.open5gs.metrics.sessions)
            ])
          ])
        ]),

        React.createElement('div', { key: 'actions', className: 'flex gap-2' }, [
          React.createElement('button', {
            key: 'health-check',
            onClick: () => runHealthCheck('open5gs'),
            className: 'px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600'
          }, 'Health Check'),
          React.createElement('button', {
            key: 'test-db',
            onClick: () => testConnection('open5gs', 'database'),
            className: 'px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600'
          }, 'Test DB')
        ])
      ]),

      // Kamailio Status Card
      React.createElement('div', {
        key: 'kamailio-card',
        className: 'bg-white p-6 rounded-lg shadow border-l-4 border-purple-500'
      }, [
        React.createElement('div', { key: 'header', className: 'flex items-center justify-between mb-4' }, [
          React.createElement('h3', { key: 'title', className: 'font-semibold text-lg' }, 'Kamailio (IMS)'),
          React.createElement('span', {
            key: 'status-icon',
            className: 'text-2xl'
          }, getStatusIcon(cliStatus.kamailio.process, cliStatus.kamailio.health))
        ]),

        React.createElement('div', { key: 'status-info', className: 'space-y-2 mb-4' }, [
          React.createElement('div', { key: 'process-status' }, [
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'Process: '),
            React.createElement('span', {
              className: `font-medium ${
                cliStatus.kamailio.process.running ? 'text-green-600' : 'text-red-600'
              }`
            }, cliStatus.kamailio.process.running ? 'Running' : 'Stopped')
          ]),
          React.createElement('div', { key: 'health-status' }, [
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'Health: '),
            React.createElement('span', {
              className: `font-medium ${
                cliStatus.kamailio.health.status === 'healthy' ? 'text-green-600' :
                cliStatus.kamailio.health.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`
            }, getStatusText(cliStatus.kamailio.process, cliStatus.kamailio.health))
          ]),
          cliStatus.kamailio.process.pid && React.createElement('div', { key: 'pid' }, [
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'PID: '),
            React.createElement('span', { className: 'font-mono text-sm' }, cliStatus.kamailio.process.pid)
          ])
        ]),

        React.createElement('div', { key: 'connections', className: 'mb-4' }, [
          React.createElement('h4', { key: 'conn-title', className: 'font-medium mb-2' }, 'Connections'),
          React.createElement('div', { key: 'conn-list', className: 'space-y-1 text-sm' }, [
            React.createElement('div', { key: 'db-conn', className: 'flex items-center gap-2' }, [
              React.createElement('span', { key: 'icon' }, getConnectionIcon(cliStatus.kamailio.connections.database)),
              React.createElement('span', { key: 'text' }, 'Database: '),
              React.createElement('span', { className: 'capitalize' }, cliStatus.kamailio.connections.database)
            ]),
            React.createElement('div', { key: 'sip-conn', className: 'flex items-center gap-2' }, [
              React.createElement('span', { key: 'icon' }, getConnectionIcon(cliStatus.kamailio.connections.sip_clients)),
              React.createElement('span', { key: 'text' }, 'SIP Clients: '),
              React.createElement('span', { className: 'capitalize' }, cliStatus.kamailio.connections.sip_clients)
            ])
          ])
        ]),

        React.createElement('div', { key: 'metrics', className: 'mb-4' }, [
          React.createElement('h4', { key: 'metrics-title', className: 'font-medium mb-2' }, 'Metrics'),
          React.createElement('div', { key: 'metrics-grid', className: 'grid grid-cols-2 gap-2 text-sm' }, [
            React.createElement('div', { key: 'registrations' }, [
              React.createElement('span', { className: 'text-gray-600' }, 'Registrations: '),
              React.createElement('span', { className: 'font-medium' }, cliStatus.kamailio.metrics.registrations)
            ]),
            React.createElement('div', { key: 'calls' }, [
              React.createElement('span', { className: 'text-sm text-gray-600' }, 'Active Calls: '),
              React.createElement('span', { className: 'font-medium' }, cliStatus.kamailio.metrics.calls)
            ])
          ])
        ]),

        React.createElement('div', { key: 'actions', className: 'flex gap-2' }, [
          React.createElement('button', {
            key: 'health-check',
            onClick: () => runHealthCheck('kamailio'),
            className: 'px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600'
          }, 'Health Check'),
          React.createElement('button', {
            key: 'test-db',
            onClick: () => testConnection('kamailio', 'database'),
            className: 'px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600'
          }, 'Test DB')
        ])
      ])
    ]),

    // Alerts Panel
    React.createElement('div', { key: 'alerts-panel', className: 'bg-white rounded-lg shadow' }, [
      React.createElement('div', { key: 'alerts-header', className: 'p-6 border-b border-gray-200' }, [
        React.createElement('div', { key: 'header-content', className: 'flex items-center justify-between' }, [
          React.createElement('h2', { key: 'title', className: 'text-lg font-semibold' }, 'System Alerts'),
          React.createElement('div', { key: 'alert-controls', className: 'flex items-center gap-2' }, [
            React.createElement('select', {
              key: 'filter',
              value: selectedTool,
              onChange: (e) => setSelectedTool(e.target.value),
              className: 'px-3 py-1 text-sm border border-gray-300 rounded'
            }, [
              React.createElement('option', { key: 'all', value: 'all' }, 'All Tools'),
              React.createElement('option', { key: 'srsran', value: 'srsran' }, 'srsRAN'),
              React.createElement('option', { key: 'open5gs', value: 'open5gs' }, 'Open5GS'),
              React.createElement('option', { key: 'kamailio', value: 'kamailio' }, 'Kamailio')
            ]),
            React.createElement('button', {
              key: 'clear',
              onClick: clearAlerts,
              className: 'px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600'
            }, 'Clear Alerts')
          ])
        ])
      ]),

      React.createElement('div', { key: 'alerts-content', className: 'p-6' }, [
        filteredAlerts.length === 0
          ? React.createElement('div', {
              key: 'no-alerts',
              className: 'text-center text-gray-500 py-8'
            }, 'No alerts at this time')
          : React.createElement('div', { key: 'alerts-list', className: 'space-y-3' },
              filteredAlerts.map(alert =>
                React.createElement('div', {
                  key: alert.id,
                  className: `p-4 rounded-lg border-l-4 ${
                    alert.type === 'error' ? 'border-red-500 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`
                }, [
                  React.createElement('div', { key: 'alert-header', className: 'flex items-center justify-between mb-2' }, [
                    React.createElement('div', { key: 'alert-title', className: 'flex items-center gap-2' }, [
                      React.createElement('span', {
                        key: 'icon',
                        className: 'text-lg'
                      }, alert.type === 'error' ? '🚨' : alert.type === 'warning' ? '⚠️' : '✅'),
                      React.createElement('h3', {
                        key: 'title',
                        className: 'font-medium'
                      }, alert.title),
                      alert.tool && React.createElement('span', {
                        key: 'tool-badge',
                        className: 'px-2 py-1 text-xs bg-gray-200 rounded'
                      }, alert.tool)
                    ]),
                    React.createElement('span', {
                      key: 'timestamp',
                      className: 'text-sm text-gray-500'
                    }, new Date(alert.timestamp).toLocaleTimeString())
                  ]),
                  React.createElement('p', {
                    key: 'message',
                    className: 'text-sm text-gray-700'
                  }, alert.message)
                ])
              )
            )
      ])
    ]),

    // Monitoring Status
    React.createElement('div', { key: 'monitoring-status', className: 'bg-white p-6 rounded-lg shadow' }, [
      React.createElement('div', { key: 'status-header', className: 'flex items-center justify-between mb-4' }, [
        React.createElement('h2', { key: 'title', className: 'text-lg font-semibold' }, 'Monitoring Status'),
        React.createElement('div', { key: 'status-indicator', className: 'flex items-center gap-2' }, [
          React.createElement('span', {
            key: 'icon',
            className: 'text-lg'
          }, monitoringActive ? '🟢' : '🔴'),
          React.createElement('span', {
            key: 'text',
            className: 'text-sm font-medium'
          }, monitoringActive ? 'Active' : 'Inactive')
        ])
      ]),

      React.createElement('div', { key: 'status-details', className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm' }, [
        React.createElement('div', { key: 'last-check' }, [
          React.createElement('span', { className: 'text-gray-600' }, 'Last Check: '),
          React.createElement('span', { className: 'font-medium' },
            cliStatus.srsran.health.lastCheck
              ? new Date(cliStatus.srsran.health.lastCheck).toLocaleTimeString()
              : 'Never'
          )
        ]),
        React.createElement('div', { key: 'alerts-count' }, [
          React.createElement('span', { className: 'text-gray-600' }, 'Active Alerts: '),
          React.createElement('span', { className: 'font-medium' }, alerts.length)
        ]),
        React.createElement('div', { key: 'monitoring-interval' }, [
          React.createElement('span', { className: 'text-gray-600' }, 'Check Interval: '),
          React.createElement('span', { className: 'font-medium' }, '5 seconds')
        ])
      ])
    ])
  ]);
}