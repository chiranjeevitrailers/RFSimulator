// PdcpLayerView Component - Dedicated PDCP Layer Analysis
function PdcpLayerView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [logs, setLogs] = React.useState([]);
    const [pdcpStats, setPdcpStats] = React.useState({});

    // Load PDCP logs
    React.useEffect(() => {
      try {
        if (window.LogProcessor) {
          const logProcessor = new window.LogProcessor();
          const unsubscribe = logProcessor.subscribe((processedLogs) => {
            const pdcpLogs = processedLogs.filter(log => 
              log.layer === 'PDCP' || log.fields?.layer === 'PDCP' ||
              log.protocol === 'PDCP' || log.component === 'PDCP' ||
              log.message?.includes('PDCP')
            );
            setLogs(pdcpLogs);
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
        console.error('PDCP CLI integration failed:', error);
      }
    }, []);

    return React.createElement('div', {
      className: 'h-full flex flex-col',
      'data-name': 'pdcp-layer-view',
      'data-file': 'components/views/PdcpLayerView.js'
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
            'data-lucide': 'shield',
            className: 'w-6 h-6 text-yellow-600 mr-3'
          }),
          'PDCP Layer Analysis'
        ]),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-2'
        }, 'Packet Data Convergence Protocol Layer Security and Compression')
      ]),
      
      React.createElement('div', {
        key: 'content',
        className: 'flex-1 overflow-auto'
      }, React.createElement(PDCPStats, { logs, stats: pdcpStats }))
    ]);

  } catch (error) {
    console.error('PdcpLayerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'PdcpLayerView Error');
  }
}

// Export PdcpLayerView component
window.PdcpLayerView = PdcpLayerView;
