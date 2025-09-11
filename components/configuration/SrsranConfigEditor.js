// srsRAN Configuration Editor Component
function SrsranConfigEditor({ config, onChange, onSave }) {
  const [localConfig, setLocalConfig] = React.useState(config || {
    enb: {
      enb_id: '0x19B',
      cell_id: '0x01',
      tac: '0x0007',
      mcc: '001',
      mnc: '01',
      mme_addr: '127.0.0.1',
      gtp_bind_addr: '127.0.0.1'
    },
    log: {
      filename: '/var/log/srsran/enb.log',
      file_max_size: '-1',
      print_level: 'info',
      log_level: 'info'
    },
    rf: {
      device_name: 'zmq',
      device_args: 'fail_on_disconnect=true',
      tx_gain: '50',
      rx_gain: '40'
    },
    expert: {
      lte_sample_rates: false,
      clock_ppm: '0'
    }
  });

  const [hasChanges, setHasChanges] = React.useState(false);

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

  const handleSave = () => {
    onSave && onSave(localConfig);
    setHasChanges(false);
  };

  const handleLoadDefault = () => {
    const defaultConfig = {
      enb: {
        enb_id: '0x19B',
        cell_id: '0x01',
        tac: '0x0007',
        mcc: '001',
        mnc: '01',
        mme_addr: '127.0.0.1',
        gtp_bind_addr: '127.0.0.1'
      },
      log: {
        filename: '/var/log/srsran/enb.log',
        file_max_size: '-1',
        print_level: 'info',
        log_level: 'info'
      },
      rf: {
        device_name: 'zmq',
        device_args: 'fail_on_disconnect=true',
        tx_gain: '50',
        rx_gain: '40'
      },
      expert: {
        lte_sample_rates: false,
        clock_ppm: '0'
      }
    };
    setLocalConfig(defaultConfig);
    setHasChanges(true);
    onChange && onChange(defaultConfig);
  };

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
        }, 'srsRAN Configuration'),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600 mt-1'
        }, 'Configure eNB/gNB settings for srsRAN')
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

    // Configuration Sections
    React.createElement('div', { key: 'sections', className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, [

      // eNB Configuration
      React.createElement('div', { key: 'enb-section', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'enb-title',
          className: 'text-lg font-semibold mb-4'
        }, 'eNB Configuration'),
        React.createElement('div', { key: 'enb-fields', className: 'space-y-4' }, [
          React.createElement('div', { key: 'enb-id' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'eNB ID'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.enb.enb_id,
              onChange: (e) => handleFieldChange('enb', 'enb_id', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'cell-id' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Cell ID'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.enb.cell_id,
              onChange: (e) => handleFieldChange('enb', 'cell_id', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'tac' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'TAC'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.enb.tac,
              onChange: (e) => handleFieldChange('enb', 'tac', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'mcc' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'MCC'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.enb.mcc,
              onChange: (e) => handleFieldChange('enb', 'mcc', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'mnc' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'MNC'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.enb.mnc,
              onChange: (e) => handleFieldChange('enb', 'mnc', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ])
        ])
      ]),

      // RF Configuration
      React.createElement('div', { key: 'rf-section', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'rf-title',
          className: 'text-lg font-semibold mb-4'
        }, 'RF Configuration'),
        React.createElement('div', { key: 'rf-fields', className: 'space-y-4' }, [
          React.createElement('div', { key: 'device-name' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Device Name'),
            React.createElement('select', {
              value: localConfig.rf.device_name,
              onChange: (e) => handleFieldChange('rf', 'device_name', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            }, [
              React.createElement('option', { key: 'zmq', value: 'zmq' }, 'ZMQ (Virtual)'),
              React.createElement('option', { key: 'uhd', value: 'uhd' }, 'UHD (USRP)'),
              React.createElement('option', { key: 'bladerf', value: 'bladerf' }, 'BladeRF'),
              React.createElement('option', { key: 'soapysdr', value: 'soapysdr' }, 'SoapySDR')
            ])
          ]),
          React.createElement('div', { key: 'tx-gain' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'TX Gain'),
            React.createElement('input', {
              type: 'number',
              value: localConfig.rf.tx_gain,
              onChange: (e) => handleFieldChange('rf', 'tx_gain', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'rx-gain' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'RX Gain'),
            React.createElement('input', {
              type: 'number',
              value: localConfig.rf.rx_gain,
              onChange: (e) => handleFieldChange('rf', 'rx_gain', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ])
        ])
      ]),

      // Log Configuration
      React.createElement('div', { key: 'log-section', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'log-title',
          className: 'text-lg font-semibold mb-4'
        }, 'Logging Configuration'),
        React.createElement('div', { key: 'log-fields', className: 'space-y-4' }, [
          React.createElement('div', { key: 'log-file' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Log File'),
            React.createElement('input', {
              type: 'text',
              value: localConfig.log.filename,
              onChange: (e) => handleFieldChange('log', 'filename', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            })
          ]),
          React.createElement('div', { key: 'print-level' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Print Level'),
            React.createElement('select', {
              value: localConfig.log.print_level,
              onChange: (e) => handleFieldChange('log', 'print_level', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            }, [
              React.createElement('option', { key: 'none', value: 'none' }, 'None'),
              React.createElement('option', { key: 'error', value: 'error' }, 'Error'),
              React.createElement('option', { key: 'warning', value: 'warning' }, 'Warning'),
              React.createElement('option', { key: 'info', value: 'info' }, 'Info'),
              React.createElement('option', { key: 'debug', value: 'debug' }, 'Debug'),
              React.createElement('option', { key: 'trace', value: 'trace' }, 'Trace')
            ])
          ]),
          React.createElement('div', { key: 'log-level' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Log Level'),
            React.createElement('select', {
              value: localConfig.log.log_level,
              onChange: (e) => handleFieldChange('log', 'log_level', e.target.value),
              className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            }, [
              React.createElement('option', { key: 'none', value: 'none' }, 'None'),
              React.createElement('option', { key: 'error', value: 'error' }, 'Error'),
              React.createElement('option', { key: 'warning', value: 'warning' }, 'Warning'),
              React.createElement('option', { key: 'info', value: 'info' }, 'Info'),
              React.createElement('option', { key: 'debug', value: 'debug' }, 'Debug'),
              React.createElement('option', { key: 'trace', value: 'trace' }, 'Trace')
            ])
          ])
        ])
      ]),

      // Expert Configuration
      React.createElement('div', { key: 'expert-section', className: 'bg-white p-6 rounded-lg shadow' }, [
        React.createElement('h3', {
          key: 'expert-title',
          className: 'text-lg font-semibold mb-4'
        }, 'Expert Configuration'),
        React.createElement('div', { key: 'expert-fields', className: 'space-y-4' }, [
          React.createElement('div', { key: 'sample-rates' }, [
            React.createElement('label', { className: 'flex items-center' }, [
              React.createElement('input', {
                type: 'checkbox',
                checked: localConfig.expert.lte_sample_rates,
                onChange: (e) => handleFieldChange('expert', 'lte_sample_rates', e.target.checked),
                className: 'mr-2'
              }),
              React.createElement('span', { className: 'text-sm font-medium text-gray-700' }, 'LTE Sample Rates')
            ])
          ]),
          React.createElement('div', { key: 'clock-ppm' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Clock PPM'),
            React.createElement('input', {
              type: 'number',
              value: localConfig.expert.clock_ppm,
              onChange: (e) => handleFieldChange('expert', 'clock_ppm', e.target.value),
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