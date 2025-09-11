// ConfigManagerView Component - Complete configuration management with CLI integration
function ConfigManagerView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [configs, setConfigs] = React.useState({
      gnb: { name: '5G gNodeB', status: 'stopped', selectedConfig: null, pid: null },
      enb: { name: '4G eNodeB', status: 'stopped', selectedConfig: null, pid: null },
      core: { name: '5G Core', status: 'stopped', selectedConfig: null, pid: null },
      ims: { name: 'IMS Core', status: 'stopped', selectedConfig: null, pid: null }
    });

    const [showConfigSelector, setShowConfigSelector] = React.useState(false);
    const [selectorComponentType, setSelectorComponentType] = React.useState('');
    const [operatingMode, setOperatingMode] = React.useState('checking');
    const [showConsole, setShowConsole] = React.useState(true);
    const [selectedLogComponent, setSelectedLogComponent] = React.useState('all');
    const [consoleLogs, setConsoleLogs] = React.useState([]);

    // Check backend availability
    React.useEffect(() => {
      checkBackendStatus();
      const interval = setInterval(checkBackendStatus, 10000);
      return () => clearInterval(interval);
    }, []);

    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        setOperatingMode(response.ok ? 'full' : 'offline');
      } catch (error) {
        setOperatingMode('offline');
      }
    };

    const handleStart = async (component) => {
      if (!configs[component].selectedConfig) {
        alert('Please select a configuration first');
        return;
      }

      setConfigs(prev => ({
        ...prev,
        [component]: { ...prev[component], status: 'starting' }
      }));

      addConsoleLog(component, 'INFO', `Starting ${configs[component].name}...`);

      try {
        if (operatingMode === 'full') {
          const response = await window.ConfigAPI.startComponent(
            component, 
            configs[component].selectedConfig.config,
            configs[component].selectedConfig.name
          );
          
          setConfigs(prev => ({
            ...prev,
            [component]: { ...prev[component], status: 'running', pid: response.pid }
          }));
          addConsoleLog(component, 'SUCCESS', `${configs[component].name} started (PID: ${response.pid})`);
        } else {
          setTimeout(() => {
            setConfigs(prev => ({
              ...prev,
              [component]: { ...prev[component], status: 'running', pid: 'simulated' }
            }));
            addConsoleLog(component, 'WARN', `${configs[component].name} started in simulation mode`);
          }, 2000);
        }
      } catch (error) {
        setConfigs(prev => ({
          ...prev,
          [component]: { ...prev[component], status: 'error' }
        }));
        addConsoleLog(component, 'ERROR', `Failed to start: ${error.message}`);
      }
    };

    const handleStop = async (component) => {
      setConfigs(prev => ({
        ...prev,
        [component]: { ...prev[component], status: 'stopping' }
      }));

      addConsoleLog(component, 'INFO', `Stopping ${configs[component].name}...`);

      try {
        if (operatingMode === 'full') {
          await window.ConfigAPI.stopComponent(component);
        }
        
        setTimeout(() => {
          setConfigs(prev => ({
            ...prev,
            [component]: { ...prev[component], status: 'stopped', pid: null }
          }));
          addConsoleLog(component, 'SUCCESS', `${configs[component].name} stopped`);
        }, 1000);
      } catch (error) {
        addConsoleLog(component, 'ERROR', `Failed to stop: ${error.message}`);
      }
    };

    const handleSelectConfig = (component) => {
      setSelectorComponentType(component);
      setShowConfigSelector(true);
    };

    const handleConfigAdd = (config) => {
      setConfigs(prev => ({
        ...prev,
        [selectorComponentType]: {
          ...prev[selectorComponentType],
          selectedConfig: config
        }
      }));
      setShowConfigSelector(false);
      addConsoleLog(selectorComponentType, 'INFO', `Configuration "${config.name}" selected`);
    };

    const addConsoleLog = (component, level, message) => {
      const newLog = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        component: component,
        level: level,
        message: message,
        source: 'system'
      };
      setConsoleLogs(prev => [...prev.slice(-200), newLog]);
    };

    const clearConsoleLogs = () => {
      setConsoleLogs([]);
      addConsoleLog('system', 'INFO', 'Console logs cleared');
    };

    return React.createElement('div', {
      className: 'h-full flex flex-col',
      'data-name': 'config-manager-view',
      'data-file': 'components/views/ConfigManagerView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'p-6 border-b border-gray-200'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900 flex items-center'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'settings',
            className: 'w-6 h-6 text-blue-600 mr-3'
          }),
          'Configuration Manager'
        ]),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-2'
        }, 'Create, manage and run srsRAN, Open5GS, and Kamailio configurations with real-time CLI integration')
      ]),

      React.createElement('div', {
        key: 'content',
        className: 'flex-1 flex flex-col overflow-hidden'
      }, [
        React.createElement('div', {
          key: 'main-content',
          className: 'flex-1 overflow-auto p-6'
        }, React.createElement(ConfigManagerUI, {
          configs,
          operatingMode,
          handleStart,
          handleStop,
          handleSelectConfig,
          showConsole,
          setShowConsole
        })),

        showConsole && React.createElement('div', {
          key: 'console-window',
          className: 'border-t border-gray-200 bg-gray-50'
        }, React.createElement(ComponentConsole, {
          logs: consoleLogs,
          selectedComponent: selectedLogComponent,
          onComponentSelect: setSelectedLogComponent,
          onToggleConsole: () => setShowConsole(!showConsole),
          onClearLogs: clearConsoleLogs
        }))
      ]),

      showConfigSelector && React.createElement(ConfigSelector, {
        key: 'config-selector',
        componentType: selectorComponentType,
        onConfigAdd: handleConfigAdd,
        onClose: () => setShowConfigSelector(false)
      })
    ]);

  } catch (error) {
    console.error('ConfigManagerView component error:', error);
    reportError(error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'ConfigManagerView Error');
  }
}

// Export ConfigManagerView component
window.ConfigManagerView = ConfigManagerView;
