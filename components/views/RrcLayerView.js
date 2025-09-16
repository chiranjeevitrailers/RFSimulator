// RrcLayerView Component - Dedicated RRC Layer Analysis
function RrcLayerView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [logs, setLogs] = React.useState([]);
    const [rrcStats, setRrcStats] = React.useState({});

    // Load RRC logs
    React.useEffect(() => {
      try {
        if (window.LogProcessor) {
          const logProcessor = new window.LogProcessor();
          const unsubscribe = logProcessor.subscribe((processedLogs) => {
            const rrcLogs = processedLogs.filter(log => 
              log.layer === 'RRC' || log.fields?.layer === 'RRC' ||
              log.protocol === 'RRC' || log.component === 'RRC' ||
              log.messageType?.includes('RRC') || log.message?.includes('RRC')
            );
            setLogs(rrcLogs);
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
        console.error('RRC CLI integration failed:', error);
      }
    }, []);

    return React.createElement('div', {
      className: 'h-full flex flex-col',
      'data-name': 'rrc-layer-view',
      'data-file': 'components/views/RrcLayerView.js'
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
            className: 'w-6 h-6 text-red-600 mr-3'
          }),
          'RRC Layer Analysis'
        ]),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-2'
        }, 'Radio Resource Control Layer Connection and Mobility Management')
      ]),
      
      React.createElement('div', {
        key: 'content',
        className: 'flex-1 overflow-auto'
      }, React.createElement((window.RRCStats || (()=>null)), { logs, stats: rrcStats }))
    ]);

  } catch (error) {
    console.error('RrcLayerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'RrcLayerView Error');
  }
}

// Export RrcLayerView component
window.RrcLayerView = RrcLayerView;
