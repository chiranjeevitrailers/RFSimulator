// Open5GS Configuration Editor Component
function Open5gsConfigEditor({ config, onChange, onSave }) {
  const [localConfig, setLocalConfig] = React.useState(config || {
    logger: {
      file: '/var/log/open5gs/mme.log',
      level: 'info'
    },
    mme: {
      freeDiameter: '/etc/freeDiameter/mme.conf',
      s1ap: { addr: '127.0.0.1' },
      gtpc: { addr: '127.0.0.1' }
    },
    sgw: {
      gtpc: { addr: '127.0.0.1' },
      gtpu: { addr: '127.0.0.1' }
    },
    pgw: {
      gtpc: { addr: '127.0.0.1' },
      gtpu: { addr: '127.0.0.1' }
    },
    hss: {
      freeDiameter: '/etc/freeDiameter/hss.conf',
      db_uri: 'mongodb://localhost/open5gs'
    }
  });

  const [hasChanges, setHasChanges] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('mme');

  const handleFieldChange = (section, subsection, field, value) => {
    const newConfig = {
      ...localConfig,
      [section]: {
        ...localConfig[section],
        [subsection]: {
          ...localConfig[section][subsection],
          [field]: value
        }
      }
    };
    setLocalConfig(newConfig);
    setHasChanges(true);
    onChange && onChange(newConfig);
  };

  const handleSimpleFieldChange = (section, field, value) => {
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

  const handleSave = () => {
    onSave && onSave(localConfig);
    setHasChanges(false);
  };

  const handleLoadDefault = () => {
    const defaultConfig = {
      logger: {
        file: '/var/log/open5gs/mme.log',
        level: 'info'
      },
      mme: {
        freeDiameter: '/etc/freeDiameter/mme.conf',
        s1ap: { addr: '127.0.0.1' },
        gtpc: { addr: '127.0.0.1' }
      },
      sgw: {
        gtpc: { addr: '127.0.0.1' },
        gtpu: { addr: '127.0.0.1' }
      },
      pgw: {
        gtpc: { addr: '127.0.0.1' },
        gtpu: { addr: '127.0.0.1' }
      },
      hss: {
        freeDiameter: '/etc/freeDiameter/hss.conf',
        db_uri: 'mongodb://localhost/open5gs'
      }
    };
    setLocalConfig(defaultConfig);
    setHasChanges(true);
    onChange && onChange(defaultConfig);
  };

  const tabs = [
    { id: 'mme', label: 'MME', description: 'Mobility Management Entity' },
    { id: 'sgw', label: 'SGW', description: 'Serving Gateway' },
    { id: 'pgw', label: 'PGW', description: 'PDN Gateway' },
    { id: 'hss', label: 'HSS', description: 'Home Subscriber Server' },
    { id: 'logger', label: 'Logger', description: 'Logging Configuration' }
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
        }, 'Open5GS Configuration'),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-1'
        }, 'Configure 4G/5G core network components')
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

      // MME Configuration
      activeTab === 'mme' && React.createElement('div', { key: 'mme-config', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'mme-title',
          className: 'text-lg font-semibold mb-4'
        }, 'MME (Mobility Management Entity) Configuration'),
        React.createElement('div', { key: 'mme-fields', className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, [
          React.createElement('div', { key: 'freeDiameter' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'FreeDiameter Config'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.mme.freeDiameter,
              onChange: (e) => handleSimpleFieldChange('mme', 'freeDiameter', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 's1ap-addr' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'S1AP Address'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.mme.s1ap.addr,
              onChange: (e) => handleFieldChange('mme', 's1ap', 'addr', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'gtpc-addr' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'GTPC Address'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.mme.gtpc.addr,
              onChange: (e) => handleFieldChange('mme', 'gtpc', 'addr', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ])
        ])
      ]),

      // SGW Configuration
      activeTab === 'sgw' && React.createElement('div', { key: 'sgw-config', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'sgw-title',
          className: 'text-lg font-semibold mb-4'
        }, 'SGW (Serving Gateway) Configuration'),
        React.createElement('div', { key: 'sgw-fields', className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, [
          React.createElement('div', { key: 'sgw-gtpc' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'GTPC Address'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.sgw.gtpc.addr,
              onChange: (e) => handleFieldChange('sgw', 'gtpc', 'addr', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'sgw-gtpu' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'GTPU Address'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.sgw.gtpu.addr,
              onChange: (e) => handleFieldChange('sgw', 'gtpu', 'addr', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ])
        ])
      ]),

      // PGW Configuration
      activeTab === 'pgw' && React.createElement('div', { key: 'pgw-config', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'pgw-title',
          className: 'text-lg font-semibold mb-4'
        }, 'PGW (PDN Gateway) Configuration'),
        React.createElement('div', { key: 'pgw-fields', className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, [
          React.createElement('div', { key: 'pgw-gtpc' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'GTPC Address'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.pgw.gtpc.addr,
              onChange: (e) => handleFieldChange('pgw', 'gtpc', 'addr', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'pgw-gtpu' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'GTPU Address'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.pgw.gtpu.addr,
              onChange: (e) => handleFieldChange('pgw', 'gtpu', 'addr', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ])
        ])
      ]),

      // HSS Configuration
      activeTab === 'hss' && React.createElement('div', { key: 'hss-config', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'hss-title',
          className: 'text-lg font-semibold mb-4'
        }, 'HSS (Home Subscriber Server) Configuration'),
        React.createElement('div', { key: 'hss-fields', className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, [
          React.createElement('div', { key: 'hss-freediameter' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'FreeDiameter Config'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.hss.freeDiameter,
              onChange: (e) => handleSimpleFieldChange('hss', 'freeDiameter', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'hss-db-uri' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Database URI'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.hss.db_uri,
              onChange: (e) => handleSimpleFieldChange('hss', 'db_uri', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ])
        ])
      ]),

      // Logger Configuration
      activeTab === 'logger' && React.createElement('div', { key: 'logger-config', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'logger-title',
          className: 'text-lg font-semibold mb-4'
        }, 'Logging Configuration'),
        React.createElement('div', { key: 'logger-fields', className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, [
          React.createElement('div', { key: 'log-file' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Log File'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.logger.file,
              onChange: (e) => handleSimpleFieldChange('logger', 'file', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'log-level' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Log Level'),
            React.createElement('select', {
              value: localConfig.logger.level,
              onChange: (e) => handleSimpleFieldChange('logger', 'level', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            }, [
              React.createElement('option', { key: 'error', value: 'error' }, 'Error'),
              React.createElement('option', { key: 'warning', value: 'warning' }, 'Warning'),
              React.createElement('option', { key: 'info', value: 'info' }, 'Info'),
              React.createElement('option', { key: 'debug', value: 'debug' }, 'Debug'),
              React.createElement('option', { key: 'trace', value: 'trace' }, 'Trace')
            ])
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