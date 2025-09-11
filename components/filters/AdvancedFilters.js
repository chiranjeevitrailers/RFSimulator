// AdvancedFilters Component
function AdvancedFilters({ onFiltersChange, availableSources = [], availableLayers = [] }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [filters, setFilters] = React.useState({
      search: '',
      level: 'all',
      source: 'all',
      layer: 'all',
      timeRange: '1h',
      messageType: 'all',
      direction: 'all'
    });

    const [isExpanded, setIsExpanded] = React.useState(false);

    React.useEffect(() => {
      if (onFiltersChange) {
        onFiltersChange(filters);
      }
    }, [filters, onFiltersChange]);

    const handleFilterChange = (key, value) => {
      try {
        setFilters(prev => ({ ...prev, [key]: value }));
      } catch (error) {
        console.error('AdvancedFilters filter change error:', error);
        reportError(error);
      }
    };

    const handleReset = () => {
      try {
        setFilters({
          search: '',
          level: 'all',
          source: 'all',
          layer: 'all',
          timeRange: '1h',
          messageType: 'all',
          direction: 'all'
        });
      } catch (error) {
        console.error('AdvancedFilters reset error:', error);
        reportError(error);
      }
    };

    const toggleExpanded = () => {
      try {
        setIsExpanded(prev => !prev);
      } catch (error) {
        console.error('AdvancedFilters toggle error:', error);
        reportError(error);
      }
    };

    const getActiveFilterCount = () => {
      return Object.values(filters).filter(value => value !== 'all' && value !== '' && value !== '1h').length;
    };

    return React.createElement('div', {
      className: 'bg-white border border-gray-200 rounded-lg',
      'data-name': 'advanced-filters',
      'data-file': 'components/filters/AdvancedFilters.js'
    }, [
      React.createElement('div', {
        key: 'filter-header',
        className: 'flex items-center justify-between p-4 border-b border-gray-200'
      }, [
        React.createElement('div', {
          key: 'header-left',
          className: 'flex items-center space-x-4'
        }, [
          React.createElement('input', {
            key: 'search',
            type: 'text',
            placeholder: 'Search logs, messages, or content...',
            value: filters.search,
            onChange: (e) => handleFilterChange('search', e.target.value),
            className: 'w-80 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
          }),
          React.createElement('button', {
            key: 'expand',
            onClick: toggleExpanded,
            className: 'flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200'
          }, [
            React.createElement('i', {
              key: 'icon',
              'data-lucide': isExpanded ? 'chevron-up' : 'chevron-down',
              className: 'w-4 h-4'
            }),
            React.createElement('span', { key: 'text' }, `Filters ${getActiveFilterCount() > 0 ? `(${getActiveFilterCount()})` : ''}`)
          ])
        ]),
        React.createElement('button', {
          key: 'reset',
          onClick: handleReset,
          className: 'px-3 py-2 text-sm text-gray-600 hover:text-gray-900',
          disabled: getActiveFilterCount() === 0
        }, 'Reset All')
      ]),
      isExpanded && React.createElement('div', {
        key: 'filter-content',
        className: 'p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4'
      }, [
        React.createElement('div', {
          key: 'level-filter'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-1'
          }, 'Log Level'),
          React.createElement('select', {
            key: 'select',
            value: filters.level,
            onChange: (e) => handleFilterChange('level', e.target.value),
            className: 'w-full border border-gray-300 rounded-md px-3 py-1 text-sm'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Levels'),
            React.createElement('option', { key: 'debug', value: 'debug' }, 'Debug'),
            React.createElement('option', { key: 'info', value: 'info' }, 'Info'),
            React.createElement('option', { key: 'warn', value: 'warn' }, 'Warning'),
            React.createElement('option', { key: 'error', value: 'error' }, 'Error')
          ])
        ]),
        React.createElement('div', {
          key: 'source-filter'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-1'
          }, 'CLI Source'),
          React.createElement('select', {
            key: 'select',
            value: filters.source,
            onChange: (e) => handleFilterChange('source', e.target.value),
            className: 'w-full border border-gray-300 rounded-md px-3 py-1 text-sm'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Sources'),
            React.createElement('option', { key: 'srsran', value: 'srsran' }, 'srsRAN'),
            React.createElement('option', { key: 'open5gs', value: 'open5gs' }, 'Open5GS'),
            React.createElement('option', { key: 'kamailio', value: 'kamailio' }, 'Kamailio')
          ])
        ]),
        React.createElement('div', {
          key: 'layer-filter'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-1'
          }, 'Protocol Layer'),
          React.createElement('select', {
            key: 'select',
            value: filters.layer,
            onChange: (e) => handleFilterChange('layer', e.target.value),
            className: 'w-full border border-gray-300 rounded-md px-3 py-1 text-sm'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Layers'),
            React.createElement('option', { key: 'phy', value: 'phy' }, 'PHY'),
            React.createElement('option', { key: 'mac', value: 'mac' }, 'MAC'),
            React.createElement('option', { key: 'rlc', value: 'rlc' }, 'RLC'),
            React.createElement('option', { key: 'pdcp', value: 'pdcp' }, 'PDCP'),
            React.createElement('option', { key: 'rrc', value: 'rrc' }, 'RRC'),
            React.createElement('option', { key: 'nas', value: 'nas' }, 'NAS'),
            React.createElement('option', { key: 'sip', value: 'sip' }, 'SIP')
          ])
        ]),
        React.createElement('div', {
          key: 'time-filter'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-1'
          }, 'Time Range'),
          React.createElement('select', {
            key: 'select',
            value: filters.timeRange,
            onChange: (e) => handleFilterChange('timeRange', e.target.value),
            className: 'w-full border border-gray-300 rounded-md px-3 py-1 text-sm'
          }, [
            React.createElement('option', { key: '15m', value: '15m' }, 'Last 15 min'),
            React.createElement('option', { key: '1h', value: '1h' }, 'Last 1 hour'),
            React.createElement('option', { key: '6h', value: '6h' }, 'Last 6 hours'),
            React.createElement('option', { key: '24h', value: '24h' }, 'Last 24 hours'),
            React.createElement('option', { key: '7d', value: '7d' }, 'Last 7 days')
          ])
        ]),
        React.createElement('div', {
          key: 'message-filter'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-1'
          }, 'Message Type'),
          React.createElement('select', {
            key: 'select',
            value: filters.messageType,
            onChange: (e) => handleFilterChange('messageType', e.target.value),
            className: 'w-full border border-gray-300 rounded-md px-3 py-1 text-sm'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Types'),
            React.createElement('option', { key: 'request', value: 'request' }, 'Request'),
            React.createElement('option', { key: 'response', value: 'response' }, 'Response'),
            React.createElement('option', { key: 'indication', value: 'indication' }, 'Indication'),
            React.createElement('option', { key: 'confirm', value: 'confirm' }, 'Confirm')
          ])
        ]),
        React.createElement('div', {
          key: 'direction-filter'
        }, [
          React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700 mb-1'
          }, 'Direction'),
          React.createElement('select', {
            key: 'select',
            value: filters.direction,
            onChange: (e) => handleFilterChange('direction', e.target.value),
            className: 'w-full border border-gray-300 rounded-md px-3 py-1 text-sm'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Directions'),
            React.createElement('option', { key: 'uplink', value: 'uplink' }, 'Uplink'),
            React.createElement('option', { key: 'downlink', value: 'downlink' }, 'Downlink')
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('AdvancedFilters component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Filters failed to load');
  }
}

// Export AdvancedFilters component
window.AdvancedFilters = AdvancedFilters;
