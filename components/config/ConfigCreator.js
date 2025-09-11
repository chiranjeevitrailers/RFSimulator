// ConfigCreator Component - Create new configurations with guided form
function ConfigCreator({ componentType, onSave, onClose }) {
  try {
    const [configName, setConfigName] = React.useState('');
    const [configDescription, setConfigDescription] = React.useState('');
    const [selectedTemplate, setSelectedTemplate] = React.useState('');
    const [customConfig, setCustomConfig] = React.useState({});
    const [activeSection, setActiveSection] = React.useState('basic');

    const getTemplatesForType = () => {
      const templates = {
        gnb: [
          { id: 'basic_5g_nr', name: 'Basic 5G NR', config: window.GNodeBConfigs?.basic_5g_nr },
          { id: 'high_performance_5g', name: 'High Performance', config: window.GNodeBConfigs?.high_performance_5g }
        ],
        enb: [
          { id: 'basic_lte', name: 'Basic LTE', config: window.ENodeBConfigs?.basic_lte },
          { id: 'high_capacity_lte', name: 'High Capacity', config: window.ENodeBConfigs?.high_capacity_lte }
        ],
        core: [
          { id: 'basic_5g_core', name: 'Basic 5G Core', config: window.CoreConfigs?.basic_5g_core },
          { id: 'cloud_native_5g_core', name: 'Cloud Native', config: window.CoreConfigs?.cloud_native_5g_core }
        ],
        ims: [
          { id: 'basic_ims', name: 'Basic IMS', config: window.IMSConfigs?.basic_ims },
          { id: 'enterprise_ims', name: 'Enterprise IMS', config: window.IMSConfigs?.enterprise_ims }
        ]
      };
      return templates[componentType] || [];
    };

    const handleTemplateSelect = (templateId) => {
      setSelectedTemplate(templateId);
      const template = getTemplatesForType().find(t => t.id === templateId);
      if (template?.config) {
        setCustomConfig({ ...template.config });
      }
    };

    const handleSave = () => {
      if (!configName.trim()) {
        alert('Please enter a configuration name');
        return;
      }

      const newConfig = {
        id: Date.now().toString(),
        name: configName,
        description: configDescription,
        type: 'custom',
        componentType: componentType,
        config: customConfig,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const myConfigs = JSON.parse(localStorage.getItem('my_configs') || '{}');
      if (!myConfigs[componentType]) myConfigs[componentType] = [];
      myConfigs[componentType].push(newConfig);
      localStorage.setItem('my_configs', JSON.stringify(myConfigs));

      onSave(newConfig);
      onClose();
    };

    const getComponentTitle = () => {
      const titles = { gnb: '5G gNodeB', enb: '4G eNodeB', core: '5G Core', ims: 'IMS Core' };
      return titles[componentType] || 'Component';
    };

    const sections = ['basic', 'network', 'advanced', 'logging'];

    return React.createElement('div', {
      className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      'data-name': 'config-creator',
      'data-file': 'components/config/ConfigCreator.js'
    }, React.createElement('div', {
      className: 'bg-white rounded-lg shadow-xl w-4/5 max-w-5xl max-h-4/5 overflow-hidden'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex justify-between items-center p-4 border-b'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-bold'
        }, `Create New ${getComponentTitle()} Configuration`),
        React.createElement('button', {
          key: 'close',
          onClick: onClose,
          className: 'text-gray-400 hover:text-gray-600'
        }, React.createElement('i', { 'data-lucide': 'x', className: 'w-5 h-5' }))
      ]),

      React.createElement('div', {
        key: 'content',
        className: 'flex'
      }, [
        React.createElement('div', {
          key: 'sidebar',
          className: 'w-1/4 border-r bg-gray-50 p-4'
        }, [
          React.createElement('div', {
            key: 'basic-info',
            className: 'space-y-3 mb-4'
          }, [
            React.createElement('input', {
              key: 'name',
              type: 'text',
              placeholder: 'Configuration Name',
              value: configName,
              onChange: (e) => setConfigName(e.target.value),
              className: 'w-full px-3 py-2 border rounded text-sm'
            }),
            React.createElement('textarea', {
              key: 'description',
              placeholder: 'Description',
              value: configDescription,
              onChange: (e) => setConfigDescription(e.target.value),
              className: 'w-full px-3 py-2 border rounded text-sm',
              rows: 2
            })
          ]),
          
          React.createElement('div', {
            key: 'templates',
            className: 'space-y-2 mb-4'
          }, [
            React.createElement('label', {
              key: 'label',
              className: 'block text-sm font-medium'
            }, 'Base Template'),
            ...getTemplatesForType().map(template =>
              React.createElement('button', {
                key: template.id,
                onClick: () => handleTemplateSelect(template.id),
                className: `w-full text-left p-2 rounded text-sm ${
                  selectedTemplate === template.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`
              }, template.name)
            )
          ]),

          React.createElement('div', {
            key: 'sections',
            className: 'space-y-1'
          }, sections.map(section =>
            React.createElement('button', {
              key: section,
              onClick: () => setActiveSection(section),
              className: `w-full text-left p-2 rounded text-sm capitalize ${
                activeSection === section ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`
            }, section)
          ))
        ]),

        React.createElement('div', {
          key: 'editor',
          className: 'flex-1 p-4'
        }, [
          React.createElement('div', {
            key: 'section-content',
            className: 'h-96 overflow-y-auto'
          }, [
            React.createElement('h4', {
              key: 'section-title',
              className: 'text-lg font-medium mb-3 capitalize'
            }, `${activeSection} Configuration`),
            React.createElement('textarea', {
              key: 'config-editor',
              value: JSON.stringify(customConfig, null, 2),
              onChange: (e) => {
                try {
                  setCustomConfig(JSON.parse(e.target.value));
                } catch (err) {
                  // Invalid JSON, keep current state
                }
              },
              className: 'w-full h-80 px-3 py-2 border rounded font-mono text-xs',
              placeholder: 'Configuration will appear here when you select a template...'
            })
          ])
        ])
      ]),

      React.createElement('div', {
        key: 'footer',
        className: 'flex justify-end space-x-3 p-4 border-t bg-gray-50'
      }, [
        React.createElement('button', {
          key: 'cancel',
          onClick: onClose,
          className: 'px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300'
        }, 'Cancel'),
        React.createElement('button', {
          key: 'save',
          onClick: handleSave,
          disabled: !configName.trim() || Object.keys(customConfig).length === 0,
          className: 'px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50'
        }, 'Create Configuration')
      ])
    ]));

  } catch (error) {
    console.error('ConfigCreator component error:', error);
    reportError(error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'ConfigCreator Error');
  }
}

// Export ConfigCreator component
window.ConfigCreator = ConfigCreator;
