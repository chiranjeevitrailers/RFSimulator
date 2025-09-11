// Configuration Manager View Component
function ConfigManagerView({ appState, onStateChange, onLogReceived }) {
  const [configs, setConfigs] = React.useState({
    srsran: null,
    open5gs: null,
    kamailio: null
  });
  const [serviceStatus, setServiceStatus] = React.useState({
    srsran: { status: 'stopped', loading: false },
    open5gs: { status: 'stopped', loading: false },
    kamailio: { status: 'stopped', loading: false }
  });
  const [activeTab, setActiveTab] = React.useState('srsran');
  const [configModified, setConfigModified] = React.useState({
    srsran: false,
    open5gs: false,
    kamailio: false
  });

  // Load configurations on mount
  React.useEffect(() => {
    loadConfigurations();
    loadServiceStatus();

    // Set up periodic status updates
    const statusInterval = setInterval(loadServiceStatus, 5000);
    return () => clearInterval(statusInterval);
  }, []);

  const loadConfigurations = async () => {
    try {
      const [srsranRes, open5gsRes, kamailioRes] = await Promise.all([
        fetch('/api/config/srsran'),
        fetch('/api/config/open5gs'),
        fetch('/api/config/kamailio')
      ]);

      if (srsranRes.ok) {
        const srsranConfig = await srsranRes.json();
        setConfigs(prev => ({ ...prev, srsran: srsranConfig }));
      }

      if (open5gsRes.ok) {
        const open5gsConfig = await open5gsRes.json();
        setConfigs(prev => ({ ...prev, open5gs: open5gsConfig }));
      }

      if (kamailioRes.ok) {
        const kamailioConfig = await kamailioRes.json();
        setConfigs(prev => ({ ...prev, kamailio: kamailioConfig }));
      }
    } catch (error) {
      console.error('Failed to load configurations:', error);
      onLogReceived && onLogReceived({
        timestamp: new Date(),
        level: 'ERROR',
        source: 'config-manager',
        message: `Failed to load configurations: ${error.message}`
      });
    }
  };

  const loadServiceStatus = async () => {
    try {
      const response = await fetch('/api/cli/status');
      if (response.ok) {
        const status = await response.json();
        setServiceStatus(prev => ({
          ...prev,
          srsran: { ...prev.srsran, status: status.srsran?.running ? 'running' : 'stopped' },
          open5gs: { ...prev.open5gs, status: status.open5gs?.running ? 'running' : 'stopped' },
          kamailio: { ...prev.kamailio, status: status.kamailio?.running ? 'running' : 'stopped' }
        }));
      }
    } catch (error) {
      console.error('Failed to load service status:', error);
    }
  };

  const handleConfigChange = (tool, newConfig) => {
    setConfigs(prev => ({ ...prev, [tool]: newConfig }));
    setConfigModified(prev => ({ ...prev, [tool]: true }));
  };

  const handleSaveConfig = async (tool) => {
    try {
      const response = await fetch(`/api/config/${tool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configs[tool])
      });

      if (response.ok) {
        setConfigModified(prev => ({ ...prev, [tool]: false }));
        onLogReceived && onLogReceived({
          timestamp: new Date(),
          level: 'INFO',
          source: 'config-manager',
          message: `${tool.toUpperCase()} configuration saved successfully`
        });
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error(`Failed to save ${tool} config:`, error);
      onLogReceived && onLogReceived({
        timestamp: new Date(),
        level: 'ERROR',
        source: 'config-manager',
        message: `Failed to save ${tool.toUpperCase()} configuration: ${error.message}`
      });
    }
  };

  const handleStartService = async (tool) => {
    setServiceStatus(prev => ({
      ...prev,
      [tool]: { ...prev[tool], loading: true }
    }));

    try {
      const response = await fetch(`/api/cli/start/${tool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: configs[tool] })
      });

      if (response.ok) {
        setServiceStatus(prev => ({
          ...prev,
          [tool]: { status: 'running', loading: false }
        }));
        onLogReceived && onLogReceived({
          timestamp: new Date(),
          level: 'INFO',
          source: 'config-manager',
          message: `${tool.toUpperCase()} started successfully`
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start service');
      }
    } catch (error) {
      console.error(`Failed to start ${tool}:`, error);
      setServiceStatus(prev => ({
        ...prev,
        [tool]: { ...prev[tool], loading: false }
      }));
      onLogReceived && onLogReceived({
        timestamp: new Date(),
        level: 'ERROR',
        source: 'config-manager',
        message: `Failed to start ${tool.toUpperCase()}: ${error.message}`
      });
    }
  };

  const handleStopService = async (tool) => {
    setServiceStatus(prev => ({
      ...prev,
      [tool]: { ...prev[tool], loading: true }
    }));

    try {
      const response = await fetch(`/api/cli/stop/${tool}`, {
        method: 'POST'
      });

      if (response.ok) {
        setServiceStatus(prev => ({
          ...prev,
          [tool]: { status: 'stopped', loading: false }
        }));
        onLogReceived && onLogReceived({
          timestamp: new Date(),
          level: 'INFO',
          source: 'config-manager',
          message: `${tool.toUpperCase()} stopped successfully`
        });
      } else {
        throw new Error('Failed to stop service');
      }
    } catch (error) {
      console.error(`Failed to stop ${tool}:`, error);
      setServiceStatus(prev => ({
        ...prev,
        [tool]: { ...prev[tool], loading: false }
      }));
      onLogReceived && onLogReceived({
        timestamp: new Date(),
        level: 'ERROR',
        source: 'config-manager',
        message: `Failed to stop ${tool.toUpperCase()}: ${error.message}`
      });
    }
  };

  const handleRestartService = async (tool) => {
    await handleStopService(tool);
    setTimeout(() => handleStartService(tool), 2000);
  };

  const getStatusIcon = (status, loading) => {
    if (loading) return '⏳';
    switch (status) {
      case 'running': return '🟢';
      case 'stopped': return '🔴';
      default: return '🟡';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'running': return 'Running';
      case 'stopped': return 'Stopped';
      default: return 'Unknown';
    }
  };

  return React.createElement('div', { className: 'p-6 max-w-7xl mx-auto' }, [
    React.createElement('div', { key: 'header', className: 'mb-6' }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-3xl font-bold text-gray-900 mb-2'
      }, 'Configuration Manager'),
      React.createElement('p', {
        key: 'subtitle',
        className: 'text-gray-600'
      }, 'Configure and manage srsRAN, Open5GS, and Kamailio IMS settings')
    ]),

    // Service Status Overview
    React.createElement('div', { key: 'status-overview', className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-6' }, [
      React.createElement('div', {
        key: 'srsran-status',
        className: 'bg-white p-4 rounded-lg shadow border-l-4 border-blue-500'
      }, [
        React.createElement('div', { key: 'status-header', className: 'flex items-center justify-between mb-2' }, [
          React.createElement('h3', { key: 'title', className: 'font-semibold' }, 'srsRAN (eNB/gNB)'),
          React.createElement('span', { key: 'icon' }, getStatusIcon(serviceStatus.srsran.status, serviceStatus.srsran.loading))
        ]),
        React.createElement('p', { key: 'status-text', className: 'text-sm text-gray-600' },
          getStatusText(serviceStatus.srsran.status)
        )
      ]),

      React.createElement('div', {
        key: 'open5gs-status',
        className: 'bg-white p-4 rounded-lg shadow border-l-4 border-green-500'
      }, [
        React.createElement('div', { key: 'status-header', className: 'flex items-center justify-between mb-2' }, [
          React.createElement('h3', { key: 'title', className: 'font-semibold' }, 'Open5GS (Core)'),
          React.createElement('span', { key: 'icon' }, getStatusIcon(serviceStatus.open5gs.status, serviceStatus.open5gs.loading))
        ]),
        React.createElement('p', { key: 'status-text', className: 'text-sm text-gray-600' },
          getStatusText(serviceStatus.open5gs.status)
        )
      ]),

      React.createElement('div', {
        key: 'kamailio-status',
        className: 'bg-white p-4 rounded-lg shadow border-l-4 border-purple-500'
      }, [
        React.createElement('div', { key: 'status-header', className: 'flex items-center justify-between mb-2' }, [
          React.createElement('h3', { key: 'title', className: 'font-semibold' }, 'Kamailio (IMS)'),
          React.createElement('span', { key: 'icon' }, getStatusIcon(serviceStatus.kamailio.status, serviceStatus.kamailio.loading))
        ]),
        React.createElement('p', { key: 'status-text', className: 'text-sm text-gray-600' },
          getStatusText(serviceStatus.kamailio.status)
        )
      ])
    ]),

    // Main Configuration Interface
    React.createElement('div', { key: 'main-config', className: 'bg-white rounded-lg shadow' }, [

      // Tab Navigation
      React.createElement('div', { key: 'tabs', className: 'border-b border-gray-200' }, [
        React.createElement('nav', { key: 'nav', className: 'flex' }, [
          React.createElement('button', {
            key: 'srsran-tab',
            onClick: () => setActiveTab('srsran'),
            className: `px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'srsran'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`
          }, [
            React.createElement('span', { key: 'icon', className: 'mr-2' },
              getStatusIcon(serviceStatus.srsran.status, serviceStatus.srsran.loading)
            ),
            'srsRAN'
          ]),
          React.createElement('button', {
            key: 'open5gs-tab',
            onClick: () => setActiveTab('open5gs'),
            className: `px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'open5gs'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`
          }, [
            React.createElement('span', { key: 'icon', className: 'mr-2' },
              getStatusIcon(serviceStatus.open5gs.status, serviceStatus.open5gs.loading)
            ),
            'Open5GS'
          ]),
          React.createElement('button', {
            key: 'kamailio-tab',
            onClick: () => setActiveTab('kamailio'),
            className: `px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'kamailio'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`
          }, [
            React.createElement('span', { key: 'icon', className: 'mr-2' },
              getStatusIcon(serviceStatus.kamailio.status, serviceStatus.kamailio.loading)
            ),
            'Kamailio'
          ])
        ])
      ]),

      // Service Control Panel
      React.createElement('div', { key: 'control-panel', className: 'p-6 border-b border-gray-200 bg-gray-50' }, [
        React.createElement('div', { key: 'control-header', className: 'flex items-center justify-between mb-4' }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-lg font-semibold'
          }, `${activeTab.toUpperCase()} Service Control`),
          React.createElement('div', { key: 'status-badge', className: `px-3 py-1 rounded-full text-sm font-medium ${
            serviceStatus[activeTab].status === 'running'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }` }, getStatusText(serviceStatus[activeTab].status))
        ]),

        React.createElement('div', { key: 'control-buttons', className: 'flex gap-3' }, [
          React.createElement('button', {
            key: 'save',
            onClick: () => handleSaveConfig(activeTab),
            disabled: !configModified[activeTab],
            className: `px-4 py-2 text-sm rounded ${
              configModified[activeTab]
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`
          }, '💾 Save Config'),

          React.createElement('button', {
            key: 'start',
            onClick: () => handleStartService(activeTab),
            disabled: serviceStatus[activeTab].status === 'running' || serviceStatus[activeTab].loading,
            className: `px-4 py-2 text-sm rounded ${
              serviceStatus[activeTab].status === 'running' || serviceStatus[activeTab].loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`
          }, '▶️ Start'),

          React.createElement('button', {
            key: 'stop',
            onClick: () => handleStopService(activeTab),
            disabled: serviceStatus[activeTab].status === 'stopped' || serviceStatus[activeTab].loading,
            className: `px-4 py-2 text-sm rounded ${
              serviceStatus[activeTab].status === 'stopped' || serviceStatus[activeTab].loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`
          }, '⏹️ Stop'),

          React.createElement('button', {
            key: 'restart',
            onClick: () => handleRestartService(activeTab),
            disabled: serviceStatus[activeTab].loading,
            className: 'px-4 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600'
          }, '🔄 Restart')
        ]),

        configModified[activeTab] && React.createElement('div', {
          key: 'unsaved-warning',
          className: 'mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded'
        }, [
          React.createElement('p', {
            key: 'warning-text',
            className: 'text-yellow-800 text-sm'
          }, '⚠️ Configuration has unsaved changes. Click "Save Config" to apply changes.')
        ])
      ]),

      // Configuration Content
      React.createElement('div', { key: 'config-content', className: 'p-6' }, [
        activeTab === 'srsran' && React.createElement(SrsranConfigEditor, {
          key: 'srsran-editor',
          config: configs.srsran,
          onChange: (config) => handleConfigChange('srsran', config),
          onSave: () => handleSaveConfig('srsran')
        }),

        activeTab === 'open5gs' && React.createElement(Open5gsConfigEditor, {
          key: 'open5gs-editor',
          config: configs.open5gs,
          onChange: (config) => handleConfigChange('open5gs', config),
          onSave: () => handleSaveConfig('open5gs')
        }),

        activeTab === 'kamailio' && React.createElement(KamailioConfigEditor, {
          key: 'kamailio-editor',
          config: configs.kamailio,
          onChange: (config) => handleConfigChange('kamailio', config),
          onSave: () => handleSaveConfig('kamailio')
        })
      ])
    ])
  ]);
}