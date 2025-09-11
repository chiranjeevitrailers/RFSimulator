// ExportManagerView Component - Manage data exports
function ExportManagerView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [exports, setExports] = React.useState([
      {
        id: 1,
        name: 'Call Flow Analysis',
        type: 'logs',
        format: 'pcap',
        size: '2.4 MB',
        status: 'completed',
        created: '2024-01-15 14:30'
      },
      {
        id: 2,
        name: 'KPI Metrics',
        type: 'metrics',
        format: 'csv',
        size: '156 KB',
        status: 'processing',
        created: '2024-01-15 14:25'
      }
    ]);

    const handleNewExport = () => {
      try {
        // Export creation logic would go here
        alert('Export configuration dialog would open here');
      } catch (error) {
        console.error('Export creation error:', error);
        reportError(error);
      }
    };

    const getStatusColor = (status) => {
      const colors = {
        completed: 'bg-green-100 text-green-700',
        processing: 'bg-blue-100 text-blue-700',
        failed: 'bg-red-100 text-red-700'
      };
      return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'export-manager-view',
      'data-file': 'components/views/ExportManagerView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'Export Manager'),
        React.createElement('button', {
          key: 'new-export',
          onClick: handleNewExport,
          className: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'download',
            className: 'w-4 h-4 mr-2 inline'
          }),
          'New Export'
        ])
      ]),

      React.createElement('div', {
        key: 'exports-list',
        className: 'bg-white rounded-lg border border-gray-200'
      }, [
        React.createElement('div', {
          key: 'header',
          className: 'px-6 py-4 border-b border-gray-200'
        }, React.createElement('h2', {
          className: 'text-lg font-semibold text-gray-900'
        }, 'Recent Exports')),

        React.createElement('div', {
          key: 'content',
          className: 'divide-y divide-gray-200'
        }, exports.map(exportItem =>
          React.createElement('div', {
            key: exportItem.id,
            className: 'px-6 py-4 hover:bg-gray-50'
          }, [
            React.createElement('div', {
              key: 'main',
              className: 'flex items-center justify-between'
            }, [
              React.createElement('div', {
                key: 'info'
              }, [
                React.createElement('h3', {
                  key: 'name',
                  className: 'text-lg font-medium text-gray-900'
                }, exportItem.name),
                React.createElement('div', {
                  key: 'meta',
                  className: 'mt-1 flex items-center space-x-4 text-sm text-gray-500'
                }, [
                  React.createElement('span', { key: 'type' }, `Type: ${exportItem.type}`),
                  React.createElement('span', { key: 'format' }, `Format: ${exportItem.format.toUpperCase()}`),
                  React.createElement('span', { key: 'size' }, `Size: ${exportItem.size}`),
                  React.createElement('span', { key: 'created' }, `Created: ${exportItem.created}`)
                ])
              ]),
              React.createElement('div', {
                key: 'actions',
                className: 'flex items-center space-x-3'
              }, [
                React.createElement('span', {
                  key: 'status',
                  className: `px-2 py-1 rounded text-xs font-medium ${getStatusColor(exportItem.status)}`
                }, exportItem.status.toUpperCase()),
                exportItem.status === 'completed' && React.createElement('button', {
                  key: 'download',
                  className: 'px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm'
                }, 'Download'),
                React.createElement('button', {
                  key: 'delete',
                  className: 'px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm'
                }, 'Delete')
              ])
            ])
          ])
        ))
      ])
    ]);

  } catch (error) {
    console.error('ExportManagerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Export Manager Error');
  }
}

window.ExportManagerView = ExportManagerView;
