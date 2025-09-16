// MacLayerView Component - Dedicated MAC Layer Analysis
function MacLayerView() {
  try {
    React.useEffect(() => {
      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }
    }, []);

    const [logs, setLogs] = React.useState([]);
    const [macStats, setMacStats] = React.useState({});

    // Load MAC logs
    React.useEffect(() => {
      try {
        if (window.LogProcessor) {
          const logProcessor = new window.LogProcessor();
          const unsubscribe = logProcessor.subscribe((processedLogs) => {
            const macLogs = processedLogs.filter(log => 
              log.layer === 'MAC' || log.fields?.layer === 'MAC' ||
              log.protocol === 'MAC' || log.component === 'MAC' ||
              log.message?.includes('MAC') || log.message?.includes('DL PDU') || log.message?.includes('UL PDU')
            );
            setLogs(macLogs);
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
        console.error('MAC CLI integration failed:', error);
      }
    }, []);

    return React.createElement('div', {
      className: 'h-full flex flex-col',
      'data-name': 'mac-layer-view',
      'data-file': 'components/views/MacLayerView.js'
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
            className: 'w-6 h-6 text-blue-600 mr-3'
          }),
          'MAC Layer Analysis'
        ]),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-2'
        }, 'Medium Access Control Layer Scheduling and Resource Allocation')
      ]),
      
      React.createElement('div', {
        key: 'content',
        className: 'flex-1 overflow-auto'
      }, React.createElement((window.MACStats || (()=>null)), { logs, stats: macStats }))
    ]);

  } catch (error) {
    console.error('MacLayerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'MacLayerView Error');
  }
}

MacLayerView.defaultProps = {};

// Export MacLayerView component
window.MacLayerView = MacLayerView;
