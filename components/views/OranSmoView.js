// OranSmoView Component - Service Management and Orchestration insights
function OranSmoView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [smoData, setSmoData] = React.useState({
      services: [],
      policies: [],
      orchestration: {
        totalServices: 8,
        activeServices: 6,
        failedServices: 1,
        pendingServices: 1
      }
    });

    React.useEffect(() => {
      const generateSMOData = () => {
        try {
          const services = [
            { name: 'Network Slicing', status: 'active', instances: 3, cpu: 45 },
            { name: 'Resource Management', status: 'active', instances: 2, cpu: 30 },
            { name: 'Policy Engine', status: 'active', instances: 1, cpu: 25 },
            { name: 'Analytics Service', status: 'failed', instances: 0, cpu: 0 },
            { name: 'Configuration Management', status: 'pending', instances: 1, cpu: 15 }
          ];

          const policies = [
            { name: 'QoS Policy', type: 'A1', status: 'active', priority: 'high' },
            { name: 'Resource Allocation', type: 'O1', status: 'active', priority: 'medium' },
            { name: 'Security Policy', type: 'A1', status: 'inactive', priority: 'high' },
            { name: 'Traffic Steering', type: 'A1', status: 'active', priority: 'low' }
          ];

          setSmoData(prev => ({
            ...prev,
            services: services,
            policies: policies
          }));
        } catch (error) {
          console.error('OranSmoView generate data error:', error);
          reportError(error);
        }
      };

      generateSMOData();
      const interval = setInterval(generateSMOData, 12000);
      return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
      const colors = {
        'active': 'bg-green-500',
        'failed': 'bg-red-500',
        'pending': 'bg-yellow-500',
        'inactive': 'bg-gray-500'
      };
      return colors[status] || 'bg-gray-500';
    };

    const getPriorityColor = (priority) => {
      const colors = {
        'high': 'bg-red-100 text-red-800',
        'medium': 'bg-yellow-100 text-yellow-800',
        'low': 'bg-green-100 text-green-800'
      };
      return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'oran-smo',
      'data-file': 'components/views/OranSmoView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'SMO Analysis'),

      React.createElement('div', {
        key: 'overview',
        className: 'grid grid-cols-1 md:grid-cols-4 gap-6'
      }, [
        React.createElement('div', { key: 'total', className: 'bg-white p-4 rounded-lg border' }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Total Services'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-blue-600' }, smoData.orchestration.totalServices)
        ]),
        React.createElement('div', { key: 'active', className: 'bg-white p-4 rounded-lg border' }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Active Services'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-green-600' }, smoData.orchestration.activeServices)
        ]),
        React.createElement('div', { key: 'failed', className: 'bg-white p-4 rounded-lg border' }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Failed Services'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-red-600' }, smoData.orchestration.failedServices)
        ]),
        React.createElement('div', { key: 'pending', className: 'bg-white p-4 rounded-lg border' }, [
          React.createElement('div', { key: 'label', className: 'text-sm text-gray-600' }, 'Pending Services'),
          React.createElement('div', { key: 'value', className: 'text-2xl font-bold text-yellow-600' }, smoData.orchestration.pendingServices)
        ])
      ]),

      React.createElement('div', {
        key: 'content',
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      }, [
        React.createElement('div', { key: 'services', className: 'bg-white p-6 rounded-lg border' }, [
          React.createElement('h3', { key: 'title', className: 'text-lg font-semibold mb-4' }, 'Orchestrated Services'),
          React.createElement('div', { key: 'list', className: 'space-y-3' }, 
            smoData.services.map((service, index) =>
              React.createElement('div', {
                key: index,
                className: 'flex items-center justify-between p-3 bg-gray-50 rounded'
              }, [
                React.createElement('div', { key: 'info', className: 'flex items-center space-x-3' }, [
                  React.createElement('div', { key: 'status', className: `w-3 h-3 rounded-full ${getStatusColor(service.status)}` }),
                  React.createElement('div', { key: 'details' }, [
                    React.createElement('div', { key: 'name', className: 'font-medium' }, service.name),
                    React.createElement('div', { key: 'instances', className: 'text-sm text-gray-500' }, `${service.instances} instances`)
                  ])
                ]),
                React.createElement('div', { key: 'cpu', className: 'text-sm text-gray-600' }, `${service.cpu}% CPU`)
              ])
            )
          )
        ]),

        React.createElement('div', { key: 'policies', className: 'bg-white p-6 rounded-lg border' }, [
          React.createElement('h3', { key: 'title', className: 'text-lg font-semibold mb-4' }, 'Policy Management'),
          React.createElement('div', { key: 'list', className: 'space-y-3' }, 
            smoData.policies.map((policy, index) =>
              React.createElement('div', {
                key: index,
                className: 'flex items-center justify-between p-3 bg-gray-50 rounded'
              }, [
                React.createElement('div', { key: 'info' }, [
                  React.createElement('div', { key: 'name', className: 'font-medium' }, policy.name),
                  React.createElement('div', { key: 'type', className: 'text-sm text-gray-500' }, `Type: ${policy.type}`)
                ]),
                React.createElement('div', { key: 'tags', className: 'flex space-x-2' }, [
                  React.createElement('span', {
                    key: 'priority',
                    className: `px-2 py-1 rounded text-xs ${getPriorityColor(policy.priority)}`
                  }, policy.priority),
                  React.createElement('div', { key: 'status', className: `w-3 h-3 rounded-full ${getStatusColor(policy.status)}` })
                ])
              ])
            )
          )
        ])
      ])
    ]);

  } catch (error) {
    console.error('OranSmoView component error:', error);
    reportError(error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'SMO View failed to load');
  }
}

// Export OranSmoView component
window.OranSmoView = OranSmoView;
