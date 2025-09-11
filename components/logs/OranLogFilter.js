// OranLogFilter Component - Filter O-RAN logs by interface and message type
function OranLogFilter({ onFilterChange, currentFilters }) {
  try {
    const [filters, setFilters] = React.useState(currentFilters || {
      interface: 'all',
      messageType: 'all',
      level: 'all'
    });

    const interfaces = ['all', 'f1ap', 'e1ap', 'ngap', 'o1', 'a1'];
    const messageTypes = ['all', 'Setup', 'Context', 'Bearer', 'Resource'];
    const levels = ['all', 'debug', 'info', 'warn', 'error'];

    const handleFilterChange = (key, value) => {
      try {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
      } catch (error) {
        console.error('OranLogFilter filter change error:', error);
        reportError(error);
      }
    };

    return React.createElement('div', {
      className: 'bg-white p-4 rounded-lg border border-gray-200 mb-4',
      'data-name': 'oran-log-filter',
      'data-file': 'components/logs/OranLogFilter.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between mb-4'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900'
        }, 'O-RAN Log Filters'),
        React.createElement('i', {
          key: 'icon',
          'data-lucide': 'filter',
          className: 'w-5 h-5 text-gray-500'
        })
      ]),

      React.createElement('div', {
        key: 'filters',
        className: 'grid grid-cols-1 md:grid-cols-3 gap-4'
      }, [
        React.createElement('div', {
          key: 'interface',
          className: 'space-y-2'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700'
          }, 'Interface'),
          React.createElement('select', {
            key: 'select',
            value: filters.interface,
            onChange: (e) => handleFilterChange('interface', e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded'
          }, interfaces.map(intf =>
            React.createElement('option', {
              key: intf,
              value: intf
            }, intf === 'all' ? 'All Interfaces' : intf.toUpperCase())
          ))
        ]),

        React.createElement('div', {
          key: 'message-type',
          className: 'space-y-2'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700'
          }, 'Message Type'),
          React.createElement('select', {
            key: 'select',
            value: filters.messageType,
            onChange: (e) => handleFilterChange('messageType', e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded'
          }, messageTypes.map(type =>
            React.createElement('option', {
              key: type,
              value: type
            }, type === 'all' ? 'All Messages' : type)
          ))
        ]),

        React.createElement('div', {
          key: 'level',
          className: 'space-y-2'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700'
          }, 'Log Level'),
          React.createElement('select', {
            key: 'select',
            value: filters.level,
            onChange: (e) => handleFilterChange('level', e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded'
          }, levels.map(level =>
            React.createElement('option', {
              key: level,
              value: level
            }, level === 'all' ? 'All Levels' : level.toUpperCase())
          ))
        ])
      ])
    ]);

  } catch (error) {
    console.error('OranLogFilter component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'O-RAN Log Filter Error');
  }
}

window.OranLogFilter = OranLogFilter;
