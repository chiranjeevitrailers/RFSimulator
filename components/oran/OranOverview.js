// OranOverview Component - Network status and overview
function OranOverview() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [oranStatus, setOranStatus] = React.useState({
      totalNodes: 0,
      activeNodes: 0,
      totalInterfaces: 0,
      activeInterfaces: 0,
      throughput: 0,
      latency: 0
    });

    const [nodes, setNodes] = React.useState([]);
    const [interfaces, setInterfaces] = React.useState([]);

    React.useEffect(() => {
      // Simulate O-RAN network data
      const simulateData = () => {
        try {
          const nodeTypes = ['cu-cp', 'cu-up', 'du', 'ru'];
          const interfaceTypes = ['f1-c', 'f1-u', 'e1', 'o1', 'a1'];
          
          const mockNodes = nodeTypes.map((type, index) => ({
            id: `${type}-${index}`,
            type: type,
            name: `${type.toUpperCase()}-${index + 1}`,
            status: Math.random() > 0.2 ? 'online' : 'offline',
            ipAddress: `192.168.1.${10 + index}`,
            cpu: Math.floor(Math.random() * 100),
            memory: Math.floor(Math.random() * 100)
          }));

          const mockInterfaces = interfaceTypes.map((type, index) => ({
            id: `${type}-${index}`,
            type: type,
            status: Math.random() > 0.3 ? 'up' : 'down',
            latency: Math.floor(Math.random() * 10) + 1,
            throughput: Math.floor(Math.random() * 1000) + 100,
            errorRate: Math.random() * 5
          }));

          setNodes(mockNodes);
          setInterfaces(mockInterfaces);

          const activeNodes = mockNodes.filter(n => n.status === 'online').length;
          const activeInterfaces = mockInterfaces.filter(i => i.status === 'up').length;

          setOranStatus({
            totalNodes: mockNodes.length,
            activeNodes: activeNodes,
            totalInterfaces: mockInterfaces.length,
            activeInterfaces: activeInterfaces,
            throughput: mockInterfaces.reduce((sum, i) => sum + i.throughput, 0),
            latency: mockInterfaces.reduce((sum, i) => sum + i.latency, 0) / mockInterfaces.length
          });
        } catch (error) {
          console.error('OranOverview simulate data error:', error);
          reportError(error);
        }
      };

      simulateData();
      const interval = setInterval(simulateData, 5000);
      return () => clearInterval(interval);
    }, []);

    const renderStatusCard = (title, value, subtitle, icon, color) => {
      return React.createElement('div', {
        className: 'bg-white p-6 rounded-lg border border-gray-200'
      }, [
        React.createElement('div', {
          key: 'header',
          className: 'flex items-center justify-between mb-4'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600'
          }, title),
          React.createElement('i', {
            key: 'icon',
            'data-lucide': icon,
            className: `w-5 h-5 text-${color}-500`
          })
        ]),
        React.createElement('div', {
          key: 'content'
        }, [
          React.createElement('div', {
            key: 'value',
            className: `text-3xl font-bold text-${color}-600`
          }, value),
          React.createElement('p', {
            key: 'subtitle',
            className: 'text-sm text-gray-500 mt-1'
          }, subtitle)
        ])
      ]);
    };

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'oran-overview',
      'data-file': 'components/oran/OranOverview.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'O-RAN Network Overview'),
        React.createElement('div', {
          key: 'status',
          className: 'flex items-center space-x-2'
        }, [
          React.createElement('div', {
            key: 'indicator',
            className: 'w-3 h-3 rounded-full bg-green-500'
          }),
          React.createElement('span', {
            key: 'text',
            className: 'text-sm text-gray-600'
          }, 'Network Active')
        ])
      ]),

      React.createElement('div', {
        key: 'stats',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        renderStatusCard('Total Nodes', oranStatus.totalNodes, `${oranStatus.activeNodes} active`, 'server', 'blue'),
        renderStatusCard('Interfaces', oranStatus.totalInterfaces, `${oranStatus.activeInterfaces} up`, 'link', 'green'),
        renderStatusCard('Throughput', `${Math.floor(oranStatus.throughput)} Mbps`, 'Total network', 'activity', 'purple'),
        renderStatusCard('Avg Latency', `${oranStatus.latency.toFixed(1)} ms`, 'Network latency', 'clock', 'orange')
      ]),

      React.createElement('div', {
        key: 'details',
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      }, [
        React.createElement('div', {
          key: 'nodes',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900 mb-4'
          }, 'O-RAN Nodes'),
          React.createElement('div', {
            key: 'list',
            className: 'space-y-3'
          }, nodes.map(node =>
            React.createElement('div', {
              key: node.id,
              className: 'flex items-center justify-between p-3 bg-gray-50 rounded'
            }, [
              React.createElement('div', {
                key: 'info',
                className: 'flex items-center space-x-3'
              }, [
                React.createElement('div', {
                  key: 'status',
                  className: `w-3 h-3 rounded-full ${node.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`
                }),
                React.createElement('div', { key: 'details' }, [
                  React.createElement('span', {
                    key: 'name',
                    className: 'font-medium text-gray-900'
                  }, node.name),
                  React.createElement('span', {
                    key: 'ip',
                    className: 'text-sm text-gray-500 ml-2'
                  }, node.ipAddress)
                ])
              ]),
              React.createElement('span', {
                key: 'type',
                className: 'text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'
              }, node.type.toUpperCase())
            ])
          ))
        ]),

        React.createElement('div', {
          key: 'interfaces',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900 mb-4'
          }, 'Interface Status'),
          React.createElement('div', {
            key: 'list',
            className: 'space-y-3'
          }, interfaces.map(intf =>
            React.createElement('div', {
              key: intf.id,
              className: 'flex items-center justify-between p-3 bg-gray-50 rounded'
            }, [
              React.createElement('div', {
                key: 'info',
                className: 'flex items-center space-x-3'
              }, [
                React.createElement('div', {
                  key: 'status',
                  className: `w-3 h-3 rounded-full ${intf.status === 'up' ? 'bg-green-500' : 'bg-red-500'}`
                }),
                React.createElement('span', {
                  key: 'name',
                  className: 'font-medium text-gray-900'
                }, intf.type.toUpperCase()),
                React.createElement('span', {
                  key: 'latency',
                  className: 'text-sm text-gray-500'
                }, `${intf.latency}ms`)
              ]),
              React.createElement('span', {
                key: 'throughput',
                className: 'text-sm text-gray-600'
              }, `${intf.throughput} Mbps`)
            ])
          ))
        ])
      ])
    ]);

  } catch (error) {
    console.error('OranOverview component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'O-RAN Overview failed to load');
  }
}

// Export OranOverview component
window.OranOverview = OranOverview;
