// ConfigEditor Component - Edit and create configurations
function ConfigEditor({ component, onClose, onSave }) {
  try {
    const [configData, setConfigData] = React.useState('{}');
    const [isValid, setIsValid] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
      // Load default configuration for the component
      const defaultConfigs = {
        gnb: window.GNodeBConfigs?.basic_5g_nr || {},
        enb: window.ENodeBConfigs?.basic_lte || {},
        core: window.CoreConfigs?.basic_5g_core || {},
        ims: window.IMSConfigs?.basic_ims || {}
      };

      const config = defaultConfigs[component] || {};
      setConfigData(JSON.stringify(config, null, 2));
    }, [component]);

    const validateJson = (jsonString) => {
      try {
        JSON.parse(jsonString);
        setIsValid(true);
        setError('');
        return true;
      } catch (err) {
        setIsValid(false);
        setError(err.message);
        return false;
      }
    };

    const handleConfigChange = (value) => {
      setConfigData(value);
      validateJson(value);
    };

    const handleSave = () => {
      if (validateJson(configData)) {
        try {
          const parsedConfig = JSON.parse(configData);
          onSave(parsedConfig);
        } catch (err) {
          setError('Failed to save configuration: ' + err.message);
        }
      }
    };

    const getComponentTitle = () => {
      const titles = {
        gnb: '5G gNodeB',
        enb: '4G eNodeB',
        core: '5G Core',
        ims: 'IMS Core'
      };
      return titles[component] || 'Component';
    };

    return React.createElement('div', {
      className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      'data-name': 'config-editor',
      'data-file': 'components/config/ConfigEditor.js'
    }, React.createElement('div', {
      className: 'bg-white rounded-lg shadow-xl w-4/5 max-w-4xl max-h-4/5 overflow-hidden'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex justify-between items-center p-4 border-b'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-bold'
        }, `Edit ${getComponentTitle()} Configuration`),
        React.createElement('button', {
          key: 'close',
          onClick: onClose,
          className: 'text-gray-400 hover:text-gray-600'
        }, React.createElement('i', {
          'data-lucide': 'x',
          className: 'w-5 h-5'
        }))
      ]),

      React.createElement('div', {
        key: 'content',
        className: 'p-4'
      }, [
        React.createElement('div', {
          key: 'status',
          className: 'flex justify-between items-center mb-3'
        }, [
          React.createElement('span', {
            key: 'validation',
            className: `px-2 py-1 rounded text-xs ${
              isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`
          }, isValid ? 'Valid JSON' : 'Invalid JSON'),
          error && React.createElement('span', {
            key: 'error',
            className: 'text-red-600 text-sm'
          }, error)
        ]),

        React.createElement('textarea', {
          key: 'editor',
          value: configData,
          onChange: (e) => handleConfigChange(e.target.value),
          className: `w-full h-96 px-3 py-2 border rounded font-mono text-sm ${
            isValid ? 'border-gray-300' : 'border-red-300'
          }`,
          placeholder: 'Enter configuration JSON...'
        })
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
          disabled: !isValid,
          className: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
        }, 'Save Configuration')
      ])
    ]));

  } catch (error) {
    console.error('ConfigEditor component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'ConfigEditor Error');
  }
}

// Export ConfigEditor component
window.ConfigEditor = ConfigEditor;
