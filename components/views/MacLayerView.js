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

    // Load MAC logs and listen for Test Manager data
    React.useEffect(() => {
      // Listen for Test Manager data
      const handleTestManagerData = (event) => {
        if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
          console.log('📊 MAC Layer: Received test manager data:', event.data.testCaseId);
          const { testCaseData } = event.data;
          
          if (testCaseData && testCaseData.expectedMessages) {
            const macMessages = testCaseData.expectedMessages.filter(msg => 
              msg.layer === 'MAC' || msg.messageType.includes('MAC')
            );
            
            if (macMessages.length > 0) {
              console.log(`📊 MAC Layer: Processing ${macMessages.length} MAC messages`);
              const macLogs = macMessages.map((msg, idx) => ({
                id: Date.now() + idx,
                timestamp: (Date.now() / 1000 + idx * 0.5).toFixed(1),
                layer: 'MAC',
                message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {})}`,
                source: 'TestManager',
                fields: msg.messagePayload
              }));
              setLogs(prev => [...prev.slice(-50), ...macLogs]);
            }
          }
        }
      };

      const handleMacLayerUpdate = (event) => {
        if (event.detail && event.detail.layer === 'MAC') {
          console.log('📊 MAC Layer: Direct update received');
          const macLog = {
            id: Date.now(),
            timestamp: (Date.now() / 1000).toFixed(1),
            layer: 'MAC',
            message: event.detail.message || `${event.detail.messageType}: ${JSON.stringify(event.detail.payload || {})}`,
            source: 'TestManager',
            fields: event.detail.payload || event.detail.data
          };
          setLogs(prev => [...prev.slice(-99), macLog]);
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('message', handleTestManagerData);
        window.addEventListener('maclayerupdate', handleMacLayerUpdate);
        console.log('✅ MAC Layer: Event listeners registered for Test Manager integration');
      }

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
          return () => {
            unsubscribe();
            if (typeof window !== 'undefined') {
              window.removeEventListener('message', handleTestManagerData);
              window.removeEventListener('maclayerupdate', handleMacLayerUpdate);
            }
          };
        } else {
          const interval = setInterval(() => {
            setLogs([]);
          }, 1000);
          return () => {
            clearInterval(interval);
            if (typeof window !== 'undefined') {
              window.removeEventListener('message', handleTestManagerData);
              window.removeEventListener('maclayerupdate', handleMacLayerUpdate);
            }
          };
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
