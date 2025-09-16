// OranE1InterfaceView Component - E1AP message analysis
function OranE1InterfaceView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [e1Messages, setE1Messages] = React.useState([]);
    const [e1Stats, setE1Stats] = React.useState({
      totalMessages: 0,
      successRate: 95.2,
      avgLatency: 2.3,
      errorCount: 5
    });

    React.useEffect(() => {
      const generateE1Messages = () => {
        try {
          const messageTypes = [
            'gNB-CU-UP E1 Setup Request',
            'gNB-CU-UP E1 Setup Response', 
            'Bearer Context Setup Request',
            'Bearer Context Setup Response',
            'Bearer Context Modification Request',
            'Bearer Context Release Command'
          ];

          const newMessage = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            messageType: messageTypes[Math.floor(Math.random() * messageTypes.length)],
            source: 'CU-CP',
            destination: 'CU-UP',
            result: Math.random() > 0.1 ? 'Success' : 'Failed',
            latency: Math.floor(Math.random() * 10) + 1
          };

          setE1Messages(prev => [...prev, newMessage].slice(-50));
          setE1Stats(prev => ({
            ...prev,
            totalMessages: prev.totalMessages + 1,
            avgLatency: (Math.random() * 5 + 1).toFixed(1)
          }));
        } catch (error) {
          console.error('E1InterfaceView generate messages error:', error);
          reportError(error);
        }
      };

      const interval = setInterval(generateE1Messages, 3000);
      return () => clearInterval(interval);
    }, []);

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'oran-e1-interface',
      'data-file': 'components/views/OranE1InterfaceView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'E1 Interface Analysis'),

      React.createElement('div', {
        key: 'stats',
        className: 'grid grid-cols-1 md:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'total',
          className: 'bg-white p-4 rounded-lg border'
        }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Total Messages'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-blue-600' }, e1Stats.totalMessages)
        ]),
        React.createElement('div', {
          key: 'success',
          className: 'bg-white p-4 rounded-lg border'
        }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Success Rate'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-green-600' }, `${e1Stats.successRate}%`)
        ]),
        React.createElement('div', {
          key: 'latency',
          className: 'bg-white p-4 rounded-lg border'
        }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Avg Latency'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-orange-600' }, `${e1Stats.avgLatency}ms`)
        ]),
        React.createElement('div', {
          key: 'errors',
          className: 'bg-white p-4 rounded-lg border'
        }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Errors'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-red-600' }, e1Stats.errorCount)
        ])
      ]),

      React.createElement('div', {
        key: 'messages',
        className: 'bg-white rounded-lg border border-gray-200'
      }, [
        React.createElement('div', {
          key: 'header',
          className: 'p-4 border-b border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900'
          }, 'Recent E1AP Messages')
        ]),
        React.createElement('div', {
          key: 'table',
          className: 'overflow-x-auto'
        }, [
          React.createElement('table', {
            key: 'messages-table',
            className: 'w-full text-sm'
          }, [
            React.createElement('thead', {
              key: 'thead',
              className: 'bg-gray-50'
            }, [
              React.createElement('tr', { key: 'header-row' }, [
                React.createElement('th', { key: 'time', className: 'px-4 py-3 text-left' }, 'Time'),
                React.createElement('th', { key: 'type', className: 'px-4 py-3 text-left' }, 'Message Type'),
                React.createElement('th', { key: 'source', className: 'px-4 py-3 text-left' }, 'Source'),
                React.createElement('th', { key: 'dest', className: 'px-4 py-3 text-left' }, 'Destination'),
                React.createElement('th', { key: 'result', className: 'px-4 py-3 text-left' }, 'Result'),
                React.createElement('th', { key: 'latency', className: 'px-4 py-3 text-left' }, 'Latency')
              ])
            ]),
            React.createElement('tbody', {
              key: 'tbody'
            }, e1Messages.map(msg =>
              React.createElement('tr', {
                key: msg.id,
                className: 'border-b border-gray-100'
              }, [
                React.createElement('td', { key: 'time', className: 'px-4 py-3' }, 
                  new Date(msg.timestamp).toLocaleTimeString()),
                React.createElement('td', { key: 'type', className: 'px-4 py-3' }, msg.messageType),
                React.createElement('td', { key: 'source', className: 'px-4 py-3' }, msg.source),
                React.createElement('td', { key: 'dest', className: 'px-4 py-3' }, msg.destination),
                React.createElement('td', { key: 'result', className: 'px-4 py-3' }, [
                  React.createElement('span', {
                    key: 'status',
                    className: `px-2 py-1 rounded text-xs ${
                      msg.result === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`
                  }, msg.result)
                ]),
                React.createElement('td', { key: 'latency', className: 'px-4 py-3' }, `${msg.latency}ms`)
              ])
            ))
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('OranE1InterfaceView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'E1 Interface View failed to load');
  }
}

// Export OranE1InterfaceView component
window.OranE1InterfaceView = OranE1InterfaceView;