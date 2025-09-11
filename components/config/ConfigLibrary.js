// ConfigLibrary Component - Enhanced with create new configuration
function ConfigLibrary({ onClose, onConfigSelect }) {
  try {
    const [selectedCategory, setSelectedCategory] = React.useState('gnb');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showCreator, setShowCreator] = React.useState(false);

    const categories = [
      { id: 'gnb', name: '5G gNodeB', icon: 'radio' },
      { id: 'enb', name: '4G eNodeB', icon: 'tower' },
      { id: 'core', name: '5G Core', icon: 'server' },
      { id: 'ims', name: 'IMS Core', icon: 'phone' }
    ];

    const getConfigsForCategory = (category) => {
      const configSources = {
        gnb: [
          { source: 'GNodeBConfigs', configs: ['basic_5g_nr', 'high_performance_5g'] },
          { source: 'SrsRAN5GConfigs', configs: ['srsran_complete_5g', 'srsran_enterprise_5g'] }
        ],
        enb: [
          { source: 'ENodeBConfigs', configs: ['basic_lte', 'high_capacity_lte'] },
          { source: 'SrsRAN4GConfigs', configs: ['srsran_complete_lte', 'srsran_enterprise_lte'] }
        ],
        core: [
          { source: 'CoreConfigs', configs: ['basic_5g_core', 'cloud_native_5g_core'] },
          { source: 'Open5GSConfigs', configs: ['open5gs_5g_core', 'open5gs_4g_epc'] }
        ],
        ims: [
          { source: 'IMSConfigs', configs: ['basic_ims', 'enterprise_ims'] },
          { source: 'KamailioIMSConfigs', configs: ['kamailio_basic_ims', 'kamailio_enterprise_ims'] }
        ]
      };

      const allConfigs = [];
      const sources = configSources[category] || [];
      
      sources.forEach(({ source, configs }) => {
        const configSource = window[source];
        if (configSource) {
          configs.forEach(configId => {
            const config = configSource[configId] || configSource.getConfig?.(configId);
            if (config) {
              allConfigs.push({
                id: configId,
                name: config.name,
                description: config.description,
                type: 'library',
                config: config
              });
            }
          });
        }
      });

      return allConfigs;
    };

    const filteredConfigs = getConfigsForCategory(selectedCategory).filter(config =>
      config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleConfigSelect = (config) => {
      onConfigSelect(config);
      onClose();
    };

    const handleNewConfigSaved = (newConfig) => {
      setShowCreator(false);
      handleConfigSelect(newConfig);
    };

    return React.createElement('div', {
      className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      'data-name': 'config-library',
      'data-file': 'components/config/ConfigLibrary.js'
    }, [
      !showCreator && React.createElement('div', {
        key: 'library',
        className: 'bg-white rounded-lg shadow-xl w-4/5 max-w-4xl max-h-4/5 overflow-hidden'
      }, [
        React.createElement('div', {
          key: 'header',
          className: 'flex justify-between items-center p-4 border-b'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-bold'
          }, 'Configuration Library'),
          React.createElement('div', {
            key: 'actions',
            className: 'flex space-x-2'
          }, [
            React.createElement('button', {
              key: 'create-new',
              onClick: () => setShowCreator(true),
              className: 'px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700'
            }, [
              React.createElement('i', { key: 'icon', 'data-lucide': 'plus', className: 'w-4 h-4 mr-1 inline' }),
              'Create New'
            ]),
            React.createElement('button', {
              key: 'close',
              onClick: onClose,
              className: 'text-gray-400 hover:text-gray-600'
            }, React.createElement('i', { 'data-lucide': 'x', className: 'w-5 h-5' }))
          ])
        ]),

        React.createElement('div', {
          key: 'content',
          className: 'flex'
        }, [
          React.createElement('div', {
            key: 'categories',
            className: 'w-1/4 border-r bg-gray-50 p-4'
          }, categories.map(cat =>
            React.createElement('button', {
              key: cat.id,
              onClick: () => setSelectedCategory(cat.id),
              className: `w-full text-left p-2 rounded mb-2 flex items-center ${
                selectedCategory === cat.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`
            }, [
              React.createElement('i', { key: 'icon', 'data-lucide': cat.icon, className: 'w-4 h-4 mr-2' }),
              cat.name
            ])
          )),

          React.createElement('div', {
            key: 'configs',
            className: 'flex-1 p-4'
          }, [
            React.createElement('input', {
              key: 'search',
              type: 'text',
              placeholder: 'Search configurations...',
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: 'w-full px-3 py-2 border rounded mb-4'
            }),

            React.createElement('div', {
              key: 'config-grid',
              className: 'grid grid-cols-2 gap-3 max-h-80 overflow-y-auto'
            }, filteredConfigs.map((config, idx) =>
              React.createElement('div', {
                key: idx,
                className: 'border rounded p-3 hover:bg-gray-50 cursor-pointer',
                onClick: () => handleConfigSelect(config)
              }, [
                React.createElement('div', {
                  key: 'config-header',
                  className: 'flex justify-between items-start mb-2'
                }, [
                  React.createElement('h4', { key: 'name', className: 'font-medium' }, config.name),
                  React.createElement('span', {
                    key: 'type',
                    className: 'px-2 py-1 rounded text-xs bg-blue-100 text-blue-800'
                  }, config.type)
                ]),
                React.createElement('p', {
                  key: 'description',
                  className: 'text-sm text-gray-600'
                }, config.description)
              ])
            ))
          ])
        ])
      ]),

      showCreator && React.createElement(ConfigCreator, {
        key: 'creator',
        componentType: selectedCategory,
        onSave: handleNewConfigSaved,
        onClose: () => setShowCreator(false)
      })
    ]);

  } catch (error) {
    console.error('ConfigLibrary component error:', error);
    reportError(error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'ConfigLibrary Error');
  }
}

// Export ConfigLibrary component
window.ConfigLibrary = ConfigLibrary;
