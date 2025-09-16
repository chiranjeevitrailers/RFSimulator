// RlcLayerView Component - Dedicated RLC Layer Analysis
function RlcLayerView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [logs, setLogs] = React.useState([]);
    const [rlcStats, setRlcStats] = React.useState({});

    // Load RLC logs
    React.useEffect(() => {
      try {
        if (window.LogProcessor) {
          const logProcessor = new window.LogProcessor();
          const unsubscribe = logProcessor.subscribe((processedLogs) => {
            const rlcLogs = processedLogs.filter(log => 
              log.layer === 'RLC' || log.fields?.layer === 'RLC' ||
              log.protocol === 'RLC' || log.component === 'RLC' ||
              log.message?.includes('RLC')
            );
            setLogs(rlcLogs);
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
        console.error('RLC CLI integration failed:', error);
      }
    }, []);

    return React.createElement('div', {
      className: 'h-full flex flex-col',
      'data-name': 'rlc-layer-view',
      'data-file': 'components/views/RlcLayerView.js'
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
            'data-lucide': 'layers',
            className: 'w-6 h-6 text-purple-600 mr-3'
          }),
          'RLC Layer Analysis'
        ]),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-2'
        }, 'Radio Link Control Layer Data Reliability and Flow Control')
      ]),
      
      React.createElement('div', {
        key: 'content',
        className: 'flex-1 overflow-auto'
      }, React.createElement((window.RLCStats || (()=>null)), { logs, stats: rlcStats }))
    ]);

  } catch (error) {
    console.error('RlcLayerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'RlcLayerView Error');
  }
}

// Export RlcLayerView component
window.RlcLayerView = RlcLayerView;
