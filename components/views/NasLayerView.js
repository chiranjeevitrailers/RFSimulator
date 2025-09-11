// NasLayerView Component - Dedicated NAS Layer Analysis
function NasLayerView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [logs, setLogs] = React.useState([]);
    const [nasStats, setNasStats] = React.useState({});

    // Load NAS logs
    React.useEffect(() => {
      try {
        if (window.LogProcessor) {
          const logProcessor = new window.LogProcessor();
          const unsubscribe = logProcessor.subscribe((processedLogs) => {
            const nasLogs = processedLogs.filter(log => 
              log.layer === 'NAS' || log.fields?.layer === 'NAS' ||
              log.protocol === 'NAS' || log.component === 'NAS' ||
              log.message?.includes('NAS') || log.message?.includes('Registration') ||
              log.message?.includes('Authentication')
            );
            setLogs(nasLogs);
          });
          
          if (window.CLIDataBridge) {
            const cliBridge = new window.CLIDataBridge();
            cliBridge.startCollection(['srsran', 'open5gs']).catch(() => {});
          }
          return unsubscribe;
        } else {
          const interval = setInterval(() => {
            setLogs([]);
          }, 1000);
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error('NAS CLI integration failed:', error);
      }
    }, []);

    return React.createElement('div', {
      className: 'h-full flex flex-col',
      'data-name': 'nas-layer-view',
      'data-file': 'components/views/NasLayerView.js'
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
            'data-lucide': 'network',
            className: 'w-6 h-6 text-indigo-600 mr-3'
          }),
          'NAS Layer Analysis'
        ]),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-2'
        }, 'Non-Access Stratum Layer Registration and Session Management')
      ]),
      
      React.createElement('div', {
        key: 'content',
        className: 'flex-1 overflow-auto'
      }, React.createElement(NASStats, { logs, stats: nasStats }))
    ]);

  } catch (error) {
    console.error('NasLayerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NasLayerView Error');
  }
}

// Export NasLayerView component
window.NasLayerView = NasLayerView;
