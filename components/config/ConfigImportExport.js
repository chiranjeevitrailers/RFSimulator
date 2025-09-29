// ConfigImportExport Component - Import and export configurations
function ConfigImportExport({ onClose }) {
  try {
    const [importData, setImportData] = React.useState('');
    const [exportFormat, setExportFormat] = React.useState('json');
    const [isImporting, setIsImporting] = React.useState(false);
    const [isExporting, setIsExporting] = React.useState(false);

    const handleImport = async () => {
      if (!importData.trim()) {
        alert('Please provide configuration data to import');
        return;
      }

      setIsImporting(true);
      try {
        const configs = JSON.parse(importData);
        const myConfigs = {};

        const configsToImport = Array.isArray(configs) ? configs : [configs];

        configsToImport.forEach(config => {
          const componentType = config.componentType || 'gnb';
          if (!myConfigs[componentType]) myConfigs[componentType] = [];

          const newConfig = {
            ...config,
            id: Date.now().toString() + Math.random(),
            createdAt: new Date().toISOString()
          };

          myConfigs[componentType].push(newConfig);
        });

        if (window.supabase) {
          const userId = window?.supabase?.auth?.getUser?.()?.id;
          if (userId) {
            await window.supabase.from('user_configs').upsert(
              configsToImport.map((c) => ({ user_id: userId, component_type: c.componentType || 'general', config: c }))
            );
          }
        }
        alert(`Imported ${configsToImport.length} configuration(s) successfully!`);
        setImportData('');
      } catch (error) {
        alert('Invalid JSON format. Please check your input.');
      } finally {
        setIsImporting(false);
      }
    };

    const handleExportAll = async () => {
      setIsExporting(true);
      try {
        const myConfigs = {};
        const allConfigs = [];

        Object.entries(myConfigs).forEach(([type, configs]) => {
          configs.forEach(config => {
            allConfigs.push({ ...config, componentType: type });
          });
        });

        if (allConfigs.length === 0) {
          alert('No configurations found to export');
          return;
        }

        const dataStr = JSON.stringify(allConfigs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `all_configurations.${exportFormat}`;
        link.click();
        URL.revokeObjectURL(url);

        alert(`Exported ${allConfigs.length} configurations successfully!`);
      } catch (error) {
        alert(`Export failed: ${error.message}`);
      } finally {
        setIsExporting(false);
      }
    };

    const handleFileImport = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImportData(e.target.result);
        };
        reader.readAsText(file);
      }
    };

    return React.createElement('div', {
      className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      'data-name': 'config-import-export',
      'data-file': 'components/config/ConfigImportExport.js'
    }, React.createElement('div', {
      className: 'bg-white rounded-lg shadow-xl w-3/4 max-w-4xl max-h-4/5 overflow-hidden'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex justify-between items-center p-4 border-b'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-bold'
        }, 'Import/Export Configurations'),
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
        className: 'p-4 grid grid-cols-2 gap-6'
      }, [
        React.createElement('div', {
          key: 'import',
          className: 'space-y-4'
        }, [
          React.createElement('h4', {
            key: 'import-title',
            className: 'text-lg font-semibold'
          }, 'Import Configurations'),
          React.createElement('input', {
            key: 'file-input',
            type: 'file',
            accept: '.json,.yml,.yaml',
            onChange: handleFileImport,
            className: 'w-full px-3 py-2 border border-gray-300 rounded'
          }),
          React.createElement('textarea', {
            key: 'import-textarea',
            value: importData,
            onChange: (e) => setImportData(e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm',
            rows: '8',
            placeholder: 'Paste JSON configuration data here...'
          }),
          React.createElement('button', {
            key: 'import-btn',
            onClick: handleImport,
            disabled: !importData.trim() || isImporting,
            className: 'w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50'
          }, isImporting ? 'Importing...' : 'Import Configurations')
        ]),

        React.createElement('div', {
          key: 'export',
          className: 'space-y-4'
        }, [
          React.createElement('h4', {
            key: 'export-title',
            className: 'text-lg font-semibold'
          }, 'Export Configurations'),
          React.createElement('select', {
            key: 'format-select',
            value: exportFormat,
            onChange: (e) => setExportFormat(e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded'
          }, [
            React.createElement('option', { key: 'json', value: 'json' }, 'JSON'),
            React.createElement('option', { key: 'yaml', value: 'yaml' }, 'YAML')
          ]),
          React.createElement('button', {
            key: 'export-btn',
            onClick: handleExportAll,
            disabled: isExporting,
            className: 'w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
          }, isExporting ? 'Exporting...' : 'Export All Configurations')
        ])
      ])
    ]));

  } catch (error) {
    console.error('ConfigImportExport component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'ConfigImportExport Error');
  }
}

// Export ConfigImportExport component
window.ConfigImportExport = ConfigImportExport;
