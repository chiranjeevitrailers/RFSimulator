// ReportGeneratorView Component - Generate analysis reports
function ReportGeneratorView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [reportConfig, setReportConfig] = React.useState({
      type: 'summary',
      timeRange: '24h',
      format: 'pdf',
      includeCharts: true
    });

    const reportTypes = [
      { id: 'summary', name: 'Summary Report', description: 'Overall system performance summary' },
      { id: 'detailed', name: 'Detailed Analysis', description: 'Comprehensive analysis with all metrics' },
      { id: 'kpi', name: 'KPI Report', description: 'Key Performance Indicators report' },
      { id: 'troubleshooting', name: 'Troubleshooting', description: 'Issue analysis and recommendations' }
    ];

    const handleGenerateReport = () => {
      try {
        // Report generation logic would go here
        alert('Report generation started. You will be notified when ready.');
      } catch (error) {
        console.error('Report generation error:', error);
        reportError(error);
      }
    };

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'report-generator-view',
      'data-file': 'components/views/ReportGeneratorView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'Report Generator'),

      React.createElement('div', {
        key: 'config',
        className: 'bg-white p-6 rounded-lg border border-gray-200'
      }, [
        React.createElement('h2', {
          key: 'config-title',
          className: 'text-lg font-semibold text-gray-900 mb-4'
        }, 'Report Configuration'),

        React.createElement('div', {
          key: 'form',
          className: 'space-y-4'
        }, [
          React.createElement('div', {
            key: 'type-selection',
            className: 'space-y-2'
          }, [
            React.createElement('label', {
              key: 'type-label',
              className: 'block text-sm font-medium text-gray-700'
            }, 'Report Type'),
            React.createElement('div', {
              key: 'type-options',
              className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
            }, reportTypes.map(type =>
              React.createElement('div', {
                key: type.id,
                className: `p-3 border rounded-lg cursor-pointer ${
                  reportConfig.type === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`,
                onClick: () => setReportConfig(prev => ({ ...prev, type: type.id }))
              }, [
                React.createElement('h4', {
                  key: 'name',
                  className: 'font-medium text-gray-900'
                }, type.name),
                React.createElement('p', {
                  key: 'desc',
                  className: 'text-sm text-gray-600'
                }, type.description)
              ])
            ))
          ]),

          React.createElement('div', {
            key: 'controls',
            className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
          }, [
            React.createElement('div', {
              key: 'time-range'
            }, [
              React.createElement('label', {
                key: 'label',
                className: 'block text-sm font-medium text-gray-700 mb-1'
              }, 'Time Range'),
              React.createElement('select', {
                key: 'select',
                value: reportConfig.timeRange,
                onChange: (e) => setReportConfig(prev => ({ ...prev, timeRange: e.target.value })),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-md'
              }, [
                React.createElement('option', { key: '1h', value: '1h' }, 'Last Hour'),
                React.createElement('option', { key: '24h', value: '24h' }, 'Last 24 Hours'),
                React.createElement('option', { key: '7d', value: '7d' }, 'Last 7 Days'),
                React.createElement('option', { key: '30d', value: '30d' }, 'Last 30 Days')
              ])
            ]),

            React.createElement('div', {
              key: 'format'
            }, [
              React.createElement('label', {
                key: 'label',
                className: 'block text-sm font-medium text-gray-700 mb-1'
              }, 'Format'),
              React.createElement('select', {
                key: 'select',
                value: reportConfig.format,
                onChange: (e) => setReportConfig(prev => ({ ...prev, format: e.target.value })),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-md'
              }, [
                React.createElement('option', { key: 'pdf', value: 'pdf' }, 'PDF'),
                React.createElement('option', { key: 'html', value: 'html' }, 'HTML'),
                React.createElement('option', { key: 'csv', value: 'csv' }, 'CSV'),
                React.createElement('option', { key: 'json', value: 'json' }, 'JSON')
              ])
            ]),

            React.createElement('div', {
              key: 'charts'
            }, [
              React.createElement('label', {
                key: 'label',
                className: 'block text-sm font-medium text-gray-700 mb-1'
              }, 'Include Charts'),
              React.createElement('div', {
                key: 'checkbox',
                className: 'flex items-center mt-2'
              }, [
                React.createElement('input', {
                  key: 'input',
                  type: 'checkbox',
                  checked: reportConfig.includeCharts,
                  onChange: (e) => setReportConfig(prev => ({ ...prev, includeCharts: e.target.checked })),
                  className: 'mr-2'
                }),
                React.createElement('span', {
                  key: 'text',
                  className: 'text-sm text-gray-600'
                }, 'Include performance charts')
              ])
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'actions',
          className: 'mt-6 flex justify-end space-x-3'
        }, [
          React.createElement('button', {
            key: 'preview',
            className: 'px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200'
          }, 'Preview'),
          React.createElement('button', {
            key: 'generate',
            onClick: handleGenerateReport,
            className: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          }, [
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'file-bar-chart',
              className: 'w-4 h-4 mr-2 inline'
            }),
            'Generate Report'
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('ReportGeneratorView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Report Generator Error');
  }
}

window.ReportGeneratorView = ReportGeneratorView;
