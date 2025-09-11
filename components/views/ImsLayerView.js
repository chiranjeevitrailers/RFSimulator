// ImsLayerView Component - Dedicated IMS/SIP Analysis
function ImsLayerView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [logs, setLogs] = React.useState([]);
    const [imsStats, setImsStats] = React.useState({});

    // Load IMS/SIP logs
    React.useEffect(() => {
      try {
        if (window.LogProcessor) {
          const logProcessor = new window.LogProcessor();
          const unsubscribe = logProcessor.subscribe((processedLogs) => {
            const imsLogs = processedLogs.filter(log => 
              log.source === 'Kamailio' || log.layer === 'IMS' ||
              log.protocol === 'SIP' || log.component === 'IMS' ||
              log.message?.includes('SIP') || log.message?.includes('INVITE') ||
              log.message?.includes('REGISTER') || log.message?.includes('BYE')
            );
            setLogs(imsLogs);
          });
          
          if (window.CLIDataBridge) {
            const cliBridge = new window.CLIDataBridge();
            cliBridge.startCollection(['kamailio']).catch(() => {});
          }
          return unsubscribe;
        } else {
          const interval = setInterval(() => {
            setLogs([]);
          }, 1000);
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error('IMS CLI integration failed:', error);
      }
    }, []);

    return React.createElement('div', {
      className: 'h-full flex flex-col',
      'data-name': 'ims-layer-view',
      'data-file': 'components/views/ImsLayerView.js'
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
            'data-lucide': 'phone',
            className: 'w-6 h-6 text-purple-600 mr-3'
          }),
          'IMS/SIP Analysis'
        ]),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-2'
        }, 'IP Multimedia Subsystem and Session Initiation Protocol Analysis')
      ]),
      
      React.createElement('div', {
        key: 'content',
        className: 'flex-1 overflow-auto p-6'
      }, React.createElement(IMSStats, { logs }))
    ]);

  } catch (error) {
    console.error('ImsLayerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'ImsLayerView Error');
  }
}

// Export ImsLayerView component
window.ImsLayerView = ImsLayerView;
