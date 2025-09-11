// OranF1InterfaceView Component - F1AP message analysis
function OranF1InterfaceView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [f1Messages, setF1Messages] = React.useState([]);
    const [f1Stats, setF1Stats] = React.useState({
      totalMessages: 0,
      setupSuccess: 98.5,
      avgLatency: 1.8,
      activeConnections: 12
    });

    React.useEffect(() => {
      const generateF1Messages = () => {
        try {
          const messageTypes = [
            'F1 Setup Request', 'F1 Setup Response', 'gNB-DU Configuration Update',
            'gNB-CU Configuration Update', 'UE Context Setup Request', 'UE Context Setup Response'
          ];

          const newMessage = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            messageType: messageTypes[Math.floor(Math.random() * messageTypes.length)],
            source: Math.random() > 0.5 ? 'CU' : 'DU',
            destination: Math.random() > 0.5 ? 'DU' : 'CU',
            result: Math.random() > 0.05 ? 'Success' : 'Failed',
            latency: Math.floor(Math.random() * 8) + 1
          };

          setF1Messages(prev => [...prev, newMessage].slice(-50));
          setF1Stats(prev => ({
            ...prev,
            totalMessages: prev.totalMessages + 1,
            avgLatency: (Math.random() * 3 + 1).toFixed(1)
          }));
        } catch (error) {
          console.error('F1InterfaceView generate messages error:', error);
          reportError(error);
        }
      };

      const interval = setInterval(generateF1Messages, 4000);
      return () => clearInterval(interval);
    }, []);

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'oran-f1-interface',
      'data-file': 'components/views/OranF1InterfaceView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'F1 Interface Analysis'),

      React.createElement('div', {
        key: 'stats',
        className: 'grid grid-cols-1 md:grid-cols-4 gap-6'
      }, [
        React.createElement('div', { key: 'total', className: 'bg-white p-4 rounded-lg border' }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Total Messages'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-blue-600' }, f1Stats.totalMessages)
        ]),
        React.createElement('div', { key: 'success', className: 'bg-white p-4 rounded-lg border' }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Setup Success'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-green-600' }, `${f1Stats.setupSuccess}%`)
        ]),
        React.createElement('div', { key: 'latency', className: 'bg-white p-4 rounded-lg border' }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Avg Latency'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-orange-600' }, `${f1Stats.avgLatency}ms`)
        ]),
        React.createElement('div', { key: 'connections', className: 'bg-white p-4 rounded-lg border' }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Active Connections'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-purple-600' }, f1Stats.activeConnections)
        ])
      ]),

      React.createElement('div', {
        key: 'messages',
        className: 'bg-white rounded-lg border border-gray-200'
      }, [
        React.createElement('div', { key: 'header', className: 'p-4 border-b' }, [
          React.createElement('h3', { key: 'title', className: 'text-lg font-semibold' }, 'Recent F1AP Messages')
        ]),
        React.createElement('div', { key: 'content', className: 'max-h-96 overflow-y-auto' }, 
          f1Messages.slice(-20).map(msg =>
            React.createElement('div', {
              key: msg.id,
              className: 'flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0'
            }, [
              React.createElement('div', { key: 'info' }, [
                React.createElement('div', { key: 'type', className: 'font-medium' }, msg.messageType),
                React.createElement('div', { key: 'path', className: 'text-sm text-gray-500' }, `${msg.source} → ${msg.destination}`)
              ]),
              React.createElement('div', { key: 'status', className: 'text-right' }, [
                React.createElement('span', {
                  key: 'result',
                  className: `px-2 py-1 rounded text-xs ${
                    msg.result === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`
                }, msg.result),
                React.createElement('div', { key: 'latency', className: 'text-xs text-gray-500 mt-1' }, `${msg.latency}ms`)
              ])
            ])
          )
        )
      ])
    ]);

  } catch (error) {
    console.error('OranF1InterfaceView component error:', error);
    reportError(error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'F1 Interface View failed to load');
  }
}

// Export OranF1InterfaceView component
window.OranF1InterfaceView = OranF1InterfaceView;
