// Kamailio IMS Configuration Editor Component
function KamailioConfigEditor({ config, onChange, onSave }) {
  const [localConfig, setLocalConfig] = React.useState(config || {
    global: {
      log_facility: 'LOG_LOCAL0',
      log_prefix: '"KAMAILIO: "',
      port: 5060,
      listen: 'udp:127.0.0.1:5060',
      sip_warning: 'yes'
    },
    modules: {
      sl: 'yes',
      tm: 'yes',
      rr: 'yes',
      pv: 'yes',
      textops: 'yes',
      usrloc: 'yes',
      registrar: 'yes',
      auth: 'yes',
      auth_db: 'yes'
    },
    database: {
      db_url: 'mysql://kamailio:kamailiorw@localhost/kamailio',
      db_mode: 0
    },
    ims: {
      ims_ipsec_pcscf_port: 4060,
      ims_ipsec_scscf_port: 6060,
      ims_diameter_peer: '"127.0.0.1"',
      ims_auth_service_type: 0,
      ims_auth_expires: 3600
    }
  });

  const [hasChanges, setHasChanges] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('global');

  const handleFieldChange = (section, field, value) => {
    const newConfig = {
      ...localConfig,
      [section]: {
        ...localConfig[section],
        [field]: value
      }
    };
    setLocalConfig(newConfig);
    setHasChanges(true);
    onChange && onChange(newConfig);
  };

  const handleModuleToggle = (module, enabled) => {
    const newConfig = {
      ...localConfig,
      modules: {
        ...localConfig.modules,
        [module]: enabled ? 'yes' : 'no'
      }
    };
    setLocalConfig(newConfig);
    setHasChanges(true);
    onChange && onChange(newConfig);
  };

  const handleSave = () => {
    onSave && onSave(localConfig);
    setHasChanges(false);
  };

  const handleLoadDefault = () => {
    const defaultConfig = {
      global: {
        log_facility: 'LOG_LOCAL0',
        log_prefix: '"KAMAILIO: "',
        port: 5060,
        listen: 'udp:127.0.0.1:5060',
        sip_warning: 'yes'
      },
      modules: {
        sl: 'yes',
        tm: 'yes',
        rr: 'yes',
        pv: 'yes',
        textops: 'yes',
        usrloc: 'yes',
        registrar: 'yes',
        auth: 'yes',
        auth_db: 'yes'
      },
      database: {
        db_url: 'mysql://kamailio:kamailiorw@localhost/kamailio',
        db_mode: 0
      },
      ims: {
        ims_ipsec_pcscf_port: 4060,
        ims_ipsec_scscf_port: 6060,
        ims_diameter_peer: '"127.0.0.1"',
        ims_auth_service_type: 0,
        ims_auth_expires: 3600
      }
    };
    setLocalConfig(defaultConfig);
    setHasChanges(true);
    onChange && onChange(defaultConfig);
  };

  const tabs = [
    { id: 'global', label: 'Global', description: 'Global Parameters' },
    { id: 'modules', label: 'Modules', description: 'Module Configuration' },
    { id: 'database', label: 'Database', description: 'Database Settings' },
    { id: 'ims', label: 'IMS', description: 'IMS Configuration' }
  ];

  const modules = [
    { key: 'sl', name: 'Stateless', description: 'Stateless replies' },
    { key: 'tm', name: 'Transaction', description: 'Transaction management' },
    { key: 'rr', name: 'Record Route', description: 'Record routing' },
    { key: 'pv', name: 'Pseudo Variables', description: 'Variable support' },
    { key: 'textops', name: 'Text Operations', description: 'Text operations' },
    { key: 'usrloc', name: 'User Location', description: 'User location service' },
    { key: 'registrar', name: 'Registrar', description: 'SIP registration' },
    { key: 'auth', name: 'Authentication', description: 'Authentication framework' },
    { key: 'auth_db', name: 'Auth DB', description: 'Database authentication' }
  ];

  return React.createElement('div', { className: 'space-y-6' }, [
    // Header
    React.createElement('div', {
      key: 'header',
      className: 'flex items-center justify-between'
    }, [
      React.createElement('div', { key: 'title' }, [
        React.createElement('h2', {
          key: 'title-text',
          className: 'text-2xl font-bold text-gray-900'
        }, 'Kamailio IMS Configuration'),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-1'
        }, 'Configure IMS core network settings')
      ]),
      React.createElement('div', { key: 'actions', className: 'flex gap-2' }, [
        React.createElement('button', {
          key: 'load-default',
          onClick: handleLoadDefault,
          className: 'px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600'
        }, 'Load Default'),
        React.createElement('button', {
          key: 'save',
          onClick: handleSave,
          disabled: !hasChanges,
          className: `px-4 py-2 text-sm rounded ${
            hasChanges
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`
        }, 'Save Configuration')
      ])
    ]),

    // Tab Navigation
    React.createElement('div', { key: 'tabs', className: 'border-b border-gray-200' }, [
      React.createElement('nav', { key: 'nav', className: 'flex space-x-8' },
        tabs.map(tab =>
          React.createElement('button', {
            key: tab.id,
            onClick: () => setActiveTab(tab.id),
            className: `py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`
          }, [
            React.createElement('span', { key: 'label' }, tab.label),
            React.createElement('span', {
              key: 'description',
              className: 'block text-xs text-gray-400 mt-1'
            }, tab.description)
          ])
        )
      )
    ]),

    // Tab Content
    React.createElement('div', { key: 'content', className: 'mt-6' }, [

      // Global Configuration
      activeTab === 'global' && React.createElement('div', { key: 'global-config', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'global-title',
          className: 'text-lg font-semibold mb-4'
        }, 'Global Parameters'),
        React.createElement('div', { key: 'global-fields', className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, [
          React.createElement('div', { key: 'log-facility' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Log Facility'),
            React.createElement('select', {
              value: localConfig.global.log_facility,
              onChange: (e) => handleFieldChange('global', 'log_facility', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            }, [
              React.createElement('option', { key: 'LOG_LOCAL0', value: 'LOG_LOCAL0' }, 'LOG_LOCAL0'),
              React.createElement('option', { key: 'LOG_LOCAL1', value: 'LOG_LOCAL1' }, 'LOG_LOCAL1'),
              React.createElement('option', { key: 'LOG_LOCAL2', value: 'LOG_LOCAL2' }, 'LOG_LOCAL2'),
              React.createElement('option', { key: 'LOG_LOCAL3', value: 'LOG_LOCAL3' }, 'LOG_LOCAL3')
            ])
          ]),
          React.createElement('div', { key: 'log-prefix' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Log Prefix'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.global.log_prefix,
              onChange: (e) => handleFieldChange('global', 'log_prefix', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'port' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'SIP Port'),
            React.createElement('input', {
              type: 'number',
              value: localConfig.global.port,
              onChange: (e) => handleFieldChange('global', 'port', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'listen' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Listen Address'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.global.listen,
              onChange: (e) => handleFieldChange('global', 'listen', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ])
        ])
      ]),

      // Modules Configuration
      activeTab === 'modules' && React.createElement('div', { key: 'modules-config', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'modules-title',
          className: 'text-lg font-semibold mb-4'
        }, 'Module Configuration'),
        React.createElement('div', { key: 'modules-grid', className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
          modules.map(module =>
            React.createElement('div', {
              key: module.key,
              className: 'border border-gray-200 rounded-lg p-4'
            }, [
              React.createElement('div', { key: 'module-header', className: 'flex items-center justify-between mb-2' }, [
                React.createElement('div', { key: 'module-info' }, [
                  React.createElement('h4', {
                    key: 'name',
                    className: 'font-medium text-gray-900'
                  }, module.name),
                  React.createElement('p', {
                    key: 'description',
                    className: 'text-sm text-gray-500'
                  }, module.description)
                ]),
                React.createElement('label', { key: 'toggle', className: 'flex items-center' }, [
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: localConfig.modules[module.key] === 'yes',
                    onChange: (e) => handleModuleToggle(module.key, e.target.checked),
                    className: 'mr-2'
                  }),
                  React.createElement('span', {
                    key: 'status',
                    className: `text-sm font-medium ${
                      localConfig.modules[module.key] === 'yes' ? 'text-green-600' : 'text-red-600'
                    }`
                  }, localConfig.modules[module.key] === 'yes' ? 'Enabled' : 'Disabled')
                ])
              ])
            ])
          )
        )
      ]),

      // Database Configuration
      activeTab === 'database' && React.createElement('div', { key: 'database-config', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'database-title',
          className: 'text-lg font-semibold mb-4'
        }, 'Database Configuration'),
        React.createElement('div', { key: 'database-fields', className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, [
          React.createElement('div', { key: 'db-url' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Database URL'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.database.db_url,
              onChange: (e) => handleFieldChange('database', 'db_url', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'db-mode' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Database Mode'),
            React.createElement('select', {
              value: localConfig.database.db_mode,
              onChange: (e) => handleFieldChange('database', 'db_mode', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            }, [
              React.createElement('option', { key: '0', value: '0' }, 'No DB (0)'),
              React.createElement('option', { key: '1', value: '1' }, 'DB Only (1)'),
              React.createElement('option', { key: '2', value: '2' }, 'Cache Only (2)'),
              React.createElement('option', { key: '3', value: '3' }, 'DB + Cache (3)')
            ])
          ])
        ])
      ]),

      // IMS Configuration
      activeTab === 'ims' && React.createElement('div', { key: 'ims-config', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'ims-title',
          className: 'text-lg font-semibold mb-4'
        }, 'IMS Configuration'),
        React.createElement('div', { key: 'ims-fields', className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, [
          React.createElement('div', { key: 'pcscf-port' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'P-CSCF Port'),
            React.createElement('input', {
              type: 'number',
              value: localConfig.ims.ims_ipsec_pcscf_port,
              onChange: (e) => handleFieldChange('ims', 'ims_ipsec_pcscf_port', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'scscf-port' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'S-CSCF Port'),
            React.createElement('input', {
              type: 'number',
              value: localConfig.ims.ims_ipsec_scscf_port,
              onChange: (e) => handleFieldChange('ims', 'ims_ipsec_scscf_port', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'diameter-peer' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Diameter Peer'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.ims.ims_diameter_peer,
              onChange: (e) => handleFieldChange('ims', 'ims_diameter_peer', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'auth-expires' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Auth Expires (seconds)'),
            React.createElement('input', {
              type: 'number',
              value: localConfig.ims.ims_auth_expires,
              onChange: (e) => handleFieldChange('ims', 'ims_auth_expires', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ])
        ])
      ])
    ]),

    // Configuration Preview
    React.createElement('div', { key: 'preview', className: 'bg-white p-6 rounded-lg shadow' }, [
      React.createElement('h3', {
        key: 'preview-title',
        className: 'text-lg font-semibold mb-4'
      }, 'Configuration Preview'),
      React.createElement('pre', {
        key: 'preview-content',
        className: 'bg-gray-100 p-4 rounded text-sm overflow-x-auto'
      }, JSON.stringify(localConfig, null, 2))
    ])
  ]);
}