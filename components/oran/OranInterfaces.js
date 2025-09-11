// OranInterfaces Component - Monitor O-RAN interface status
function OranInterfaces() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [interfaces, setInterfaces] = React.useState([]);
    const [selectedInterface, setSelectedInterface] = React.useState(null);
    const [filterType, setFilterType] = React.useState('all');

    React.useEffect(() => {
      const generateInterfaces = () => {
        try {
          const interfaceTypes = [
            { type: 'f1-c', name: 'F1-C Control', description: 'F1 Control Plane' },
            { type: 'f1-u', name: 'F1-U User', description: 'F1 User Plane' },
            { type: 'e1', name: 'E1', description: 'E1 Interface' },
            { type: 'o1', name: 'O1', description: 'O1 Management' },
            { type: 'a1', name: 'A1', description: 'A1 Policy' },
            { type: 'e2', name: 'E2', description: 'E2 Service' }
          ];

          const mockInterfaces = interfaceTypes.map((type, index) => ({
            id: `${type.type}-${index}`,
            ...type,
            status: Math.random() > 0.3 ? 'up' : 'down',
            sourceNode: `CU-${index + 1}`,
            targetNode: `DU-${index + 1}`,
            metrics: {
              latency: Math.floor(Math.random() * 10) + 1,
              throughput: Math.floor(Math.random() * 1000) + 100,
              errorRate: (Math.random() * 5).toFixed(2),
              messageCount: Math.floor(Math.random() * 10000)
            },
            lastActivity: new Date().toISOString()
          }));

          setInterfaces(mockInterfaces);
        } catch (error) {
          console.error('OranInterfaces generate data error:', error);
          reportError(error);
        }
      };

      generateInterfaces();
      const interval = setInterval(generateInterfaces, 10000);
      return () => clearInterval(interval);
    }, []);

    const filteredInterfaces = filterType === 'all' 
      ? interfaces 
      : interfaces.filter(i => i.type === filterType);

    const getStatusColor = (status) => {
      return status === 'up' ? 'bg-green-500' : 'bg-red-500';
    };

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'oran-interfaces',
      'data-file': 'components/oran/OranInterfaces.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'O-RAN Interfaces'),
        React.createElement('select', {
          key: 'filter',
          value: filterType,
          onChange: (e) => setFilterType(e.target.value),
          className: 'px-3 py-2 border border-gray-300 rounded'
        }, [
          React.createElement('option', { key: 'all', value: 'all' }, 'All Interfaces'),
          React.createElement('option', { key: 'f1-c', value: 'f1-c' }, 'F1-C'),
          React.createElement('option', { key: 'f1-u', value: 'f1-u' }, 'F1-U'),
          React.createElement('option', { key: 'e1', value: 'e1' }, 'E1'),
          React.createElement('option', { key: 'o1', value: 'o1' }, 'O1'),
          React.createElement('option', { key: 'a1', value: 'a1' }, 'A1'),
          React.createElement('option', { key: 'e2', value: 'e2' }, 'E2')
        ])
      ]),

      React.createElement('div', {
        key: 'interfaces-grid',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      }, filteredInterfaces.map(intf =>
        React.createElement('div', {
          key: intf.id,
          className: 'bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer',
          onClick: () => setSelectedInterface(intf)
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-4'
          }, [
            React.createElement('h3', {
              key: 'name',
              className: 'text-lg font-semibold text-gray-900'
            }, intf.name),
            React.createElement('div', {
              key: 'status',
              className: `w-3 h-3 rounded-full ${getStatusColor(intf.status)}`
            })
          ]),
          React.createElement('div', {
            key: 'metrics',
            className: 'space-y-2 text-sm'
          }, [
            React.createElement('div', {
              key: 'latency',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Latency:'),
              React.createElement('span', { key: 'value' }, `${intf.metrics.latency}ms`)
            ]),
            React.createElement('div', {
              key: 'throughput',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Throughput:'),
              React.createElement('span', { key: 'value' }, `${intf.metrics.throughput} Mbps`)
            ])
          ])
        ])
      ))
    ]);

  } catch (error) {
    console.error('OranInterfaces component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'O-RAN Interfaces failed to load');
  }
}

// Export OranInterfaces component
window.OranInterfaces = OranInterfaces;
