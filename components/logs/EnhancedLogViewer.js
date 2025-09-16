// EnhancedLogViewer Component - Professional log viewer with O-RAN, NB-IoT, V2X and NTN support
function EnhancedLogViewer({ logs, onFilterChange }) {
  try {
    const [filters, setFilters] = React.useState({
      source: 'all',
      level: 'all',
      interface: 'all',
      search: ''
    });

    // Optional: expose clicked log details in the future
    // const [selectedLog, setSelectedLog] = React.useState(null);

    const handleFilterChange = (key, value) => {
      try {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange && onFilterChange(newFilters);
      } catch (error) {
        console.error('EnhancedLogViewer filter change error:', error);
      }
    };

    const safeLogs = Array.isArray(logs) ? logs : [];

    const filteredLogs = safeLogs.filter(log => {
      try {
        if (filters.source !== 'all' && (log.source || '').toLowerCase() !== filters.source.toLowerCase()) return false;
        if (filters.level !== 'all' && (log.level || '').toLowerCase() !== filters.level.toLowerCase()) return false;
        if (filters.interface !== 'all' && (log.component || '').toLowerCase() !== filters.interface.toLowerCase()) return false;
        if (filters.search && !log.message.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
      } catch (error) {
        return true;
      }
    });

    const getLevelColor = (level) => {
      const colors = {
        error: 'text-red-600 bg-red-50',
        warn: 'text-yellow-600 bg-yellow-50',
        info: 'text-blue-600 bg-blue-50',
        debug: 'text-gray-600 bg-gray-50'
      };
      return colors[level?.toLowerCase()] || 'text-gray-600 bg-gray-50';
    };

    const getSourceColor = (source) => {
      const colors = {
        ntn: 'bg-indigo-100 text-indigo-700',
        v2x: 'bg-green-100 text-green-700',
        nbiot: 'bg-purple-100 text-purple-700',
        oran: 'bg-blue-100 text-blue-700',
        srsran: 'bg-orange-100 text-orange-700'
      };
      return colors[source] || 'bg-gray-100 text-gray-700';
    };

    return React.createElement('div', {
      className: 'bg-white rounded-lg border border-gray-200',
      'data-name': 'enhanced-log-viewer',
      'data-file': 'components/logs/EnhancedLogViewer.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'p-4 border-b border-gray-200'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900 mb-4'
        }, 'Enhanced Log Viewer'),
        
        React.createElement('div', {
          key: 'filters',
          className: 'grid grid-cols-1 md:grid-cols-4 gap-4'
        }, [
          React.createElement('select', {
            key: 'source',
            value: filters.source,
            onChange: (e) => handleFilterChange('source', e.target.value),
            className: 'px-3 py-2 border border-gray-300 rounded text-sm'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Sources'),
            React.createElement('option', { key: 'ntn', value: 'ntn' }, 'NTN'),
            React.createElement('option', { key: 'v2x', value: 'v2x' }, 'C-V2X'),
            React.createElement('option', { key: 'nbiot', value: 'nbiot' }, 'NB-IoT'),
            React.createElement('option', { key: 'oran', value: 'oran' }, 'O-RAN'),
            React.createElement('option', { key: 'srsran', value: 'srsran' }, 'srsRAN'),
            React.createElement('option', { key: 'open5gs', value: 'open5gs' }, 'Open5GS')
          ]),
          
          React.createElement('select', {
            key: 'level',
            value: filters.level,
            onChange: (e) => handleFilterChange('level', e.target.value),
            className: 'px-3 py-2 border border-gray-300 rounded text-sm'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Levels'),
            React.createElement('option', { key: 'error', value: 'error' }, 'Error'),
            React.createElement('option', { key: 'warn', value: 'warn' }, 'Warning'),
            React.createElement('option', { key: 'info', value: 'info' }, 'Info'),
            React.createElement('option', { key: 'debug', value: 'debug' }, 'Debug')
          ]),
          
          React.createElement('select', {
            key: 'interface',
            value: filters.interface,
            onChange: (e) => handleFilterChange('interface', e.target.value),
            className: 'px-3 py-2 border border-gray-300 rounded text-sm'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Interfaces'),
            React.createElement('option', { key: 'sib19', value: 'sib19' }, 'SIB19'),
            React.createElement('option', { key: 'doppler', value: 'doppler' }, 'Doppler'),
            React.createElement('option', { key: 'delay', value: 'delay' }, 'Delay'),
            React.createElement('option', { key: 'pssch', value: 'pssch' }, 'PSSCH'),
            React.createElement('option', { key: 'pscch', value: 'pscch' }, 'PSCCH'),
            React.createElement('option', { key: 'pc5', value: 'pc5' }, 'PC5'),
            React.createElement('option', { key: 'nprach', value: 'nprach' }, 'NPRACH'),
            React.createElement('option', { key: 'npdcch', value: 'npdcch' }, 'NPDCCH'),
            React.createElement('option', { key: 'f1ap', value: 'f1ap' }, 'F1AP'),
            React.createElement('option', { key: 'e1ap', value: 'e1ap' }, 'E1AP')
          ]),
          
          React.createElement('input', {
            key: 'search',
            type: 'text',
            placeholder: 'Search logs...',
            value: filters.search,
            onChange: (e) => handleFilterChange('search', e.target.value),
            className: 'px-3 py-2 border border-gray-300 rounded text-sm'
          })
        ])
      ]),

      React.createElement('div', {
        key: 'logs',
        className: 'max-h-96 overflow-y-auto'
      }, filteredLogs.length === 0 ? React.createElement('div', {
        key: 'no-logs',
        className: 'p-8 text-center text-gray-500'
      }, 'No logs match the current filters') : filteredLogs.slice(-50).map((log, index) => {
        const logKey = log.id ?? log.timestamp ?? index;
        return React.createElement('div', {
          key: logKey,
          className: 'flex items-start space-x-3 p-3 border-b border-gray-100 hover:bg-gray-50',
        }, [
          React.createElement('span', {
            key: 'timestamp',
            className: 'text-xs text-gray-500 w-20 flex-shrink-0'
          }, new Date(log.timestamp).toString() !== 'Invalid Date' ? new Date(log.timestamp).toLocaleTimeString() : '-'),
          
          React.createElement('span', {
            key: 'level',
            className: `px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`
          }, log.level?.toUpperCase() || 'INFO'),
          
          React.createElement('span', {
            key: 'source',
            className: `text-xs px-2 py-1 rounded ${getSourceColor(log.source)}`
          }, log.source?.toUpperCase() || 'UNKNOWN'),
          
          React.createElement('span', {
            key: 'message',
            className: 'flex-1 text-sm text-gray-900'
          }, log.message)
        ]);
      }))
    ]);

  } catch (error) {
    console.error('EnhancedLogViewer component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Enhanced Log Viewer Error');
  }
}

// Default props for extra safety
EnhancedLogViewer.defaultProps = {
  logs: [],
  onFilterChange: () => {}
};

window.EnhancedLogViewer = EnhancedLogViewer;
