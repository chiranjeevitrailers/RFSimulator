// RrcLayerView Component - Dedicated RRC Layer Analysis
function RrcLayerView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [logs, setLogs] = React.useState([]);
    const [rrcStats, setRrcStats] = React.useState({});

    // Load RRC logs and listen for Test Manager data
    React.useEffect(() => {
      // Listen for Test Manager data
      const handleTestManagerData = (event) => {
        if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
          console.log('📊 RRC Layer: Received test manager data:', event.data.testCaseId);
          const { testCaseData } = event.data;
          
          if (testCaseData && testCaseData.expectedMessages) {
            const rrcMessages = testCaseData.expectedMessages.filter(msg => 
              msg.layer === 'RRC' || msg.messageType.includes('RRC')
            );
            
            if (rrcMessages.length > 0) {
              console.log(`📊 RRC Layer: Processing ${rrcMessages.length} RRC messages`);
              const rrcLogs = rrcMessages.map((msg, idx) => ({
                id: Date.now() + idx,
                timestamp: (Date.now() / 1000 + idx * 0.5).toFixed(1),
                layer: 'RRC',
                message: `${msg.messageName}: ${JSON.stringify(msg.messagePayload || {})}`,
                source: 'TestManager',
                fields: msg.messagePayload,
                messageType: msg.messageType,
                direction: msg.direction
              }));
              setLogs(prev => [...prev.slice(-50), ...rrcLogs]);
            }
          }
        }
      };

      const handleRrcLayerUpdate = (event) => {
        if (event.detail && event.detail.layer === 'RRC') {
          console.log('📊 RRC Layer: Direct update received');
          const rrcLog = {
            id: Date.now(),
            timestamp: (Date.now() / 1000).toFixed(1),
            layer: 'RRC',
            message: event.detail.message || `${event.detail.messageType}: ${JSON.stringify(event.detail.payload || {})}`,
            source: 'TestManager',
            fields: event.detail.payload || event.detail.data
          };
          setLogs(prev => [...prev.slice(-99), rrcLog]);
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('message', handleTestManagerData);
        window.addEventListener('rrclayerupdate', handleRrcLayerUpdate);
        console.log('✅ RRC Layer: Event listeners registered for Test Manager integration');
      }

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
          
          return () => {
            unsubscribe();
            if (typeof window !== 'undefined') {
              window.removeEventListener('message', handleTestManagerData);
              window.removeEventListener('rrclayerupdate', handleRrcLayerUpdate);
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
              window.removeEventListener('rrclayerupdate', handleRrcLayerUpdate);
            }
          };
        }
      } catch (error) {
        console.error('RRC CLI integration failed:', error);
        return () => {
          if (typeof window !== 'undefined') {
            window.removeEventListener('message', handleTestManagerData);
            window.removeEventListener('rrclayerupdate', handleRrcLayerUpdate);
          }
        };
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
