// ChannelFilter Component
function ChannelFilter({ filters = {}, onFiltersChange }) {
  try {
    // Initialize with safe defaults to prevent undefined errors
    const [tempFilters, setTempFilters] = React.useState({
      channels: filters.channels || [],
      directions: filters.directions || [],
      networkTypes: filters.networkTypes || []
    });
    
    const channelTypes = ['PDCCH', 'PDSCH', 'PUCCH', 'PUSCH', 'PBCH', 'PRACH', 'PCFICH', 'PHICH'];
    const directions = ['DL', 'UL'];
    const networkTypes = ['5G', 'LTE', 'NB-IoT', 'V2X', 'NTN', 'O-RAN'];
    
    // Update tempFilters when filters prop changes
    React.useEffect(() => {
      setTempFilters({
        channels: filters.channels || [],
        directions: filters.directions || [],
        networkTypes: filters.networkTypes || []
      });
    }, [filters]);
    
    const handleChannelChange = (channel) => {
      const currentChannels = tempFilters.channels || [];
      const newChannels = currentChannels.includes(channel)
        ? currentChannels.filter(c => c !== channel)
        : [...currentChannels, channel];
      
      const newFilters = { ...tempFilters, channels: newChannels };
      setTempFilters(newFilters);
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
    };
    
    const handleDirectionChange = (direction) => {
      const currentDirections = tempFilters.directions || [];
      const newDirections = currentDirections.includes(direction)
        ? currentDirections.filter(d => d !== direction)
        : [...currentDirections, direction];
      
      const newFilters = { ...tempFilters, directions: newDirections };
      setTempFilters(newFilters);
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
    };
    
    const handleNetworkTypeChange = (networkType) => {
      const currentNetworkTypes = tempFilters.networkTypes || [];
      const newNetworkTypes = currentNetworkTypes.includes(networkType)
        ? currentNetworkTypes.filter(n => n !== networkType)
        : [...currentNetworkTypes, networkType];
      
      const newFilters = { ...tempFilters, networkTypes: newNetworkTypes };
      setTempFilters(newFilters);
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
    };
    
    const clearFilters = () => {
      const newFilters = { channels: [], directions: [], networkTypes: [] };
      setTempFilters(newFilters);
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
    };
    
    const totalActiveFilters = (tempFilters.channels?.length || 0) + 
                             (tempFilters.directions?.length || 0) + 
                             (tempFilters.networkTypes?.length || 0);
    
    return React.createElement('div', {
      className: 'p-4 bg-white border-b border-gray-300',
      'data-name': 'channel-filter',
      'data-file': 'components/logs/ChannelFilter.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex justify-between items-center mb-3'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-sm font-semibold text-gray-900'
        }, 'Channel Filters'),
        React.createElement('button', {
          key: 'clear',
          onClick: clearFilters,
          className: 'text-xs text-blue-600 hover:text-blue-800'
        }, 'Clear All')
      ]),
      
      React.createElement('div', {
        key: 'filters',
        className: 'space-y-3'
      }, [
        React.createElement('div', {
          key: 'channel-types'
        }, [
          React.createElement('h4', {
            key: 'title',
            className: 'text-xs font-medium text-gray-700 mb-2'
          }, 'Channel Types'),
          React.createElement('div', {
            key: 'checkboxes',
            className: 'grid grid-cols-4 gap-1'
          }, channelTypes.map(channel =>
            React.createElement('label', {
              key: channel,
              className: 'flex items-center text-xs'
            }, [
              React.createElement('input', {
                key: 'checkbox',
                type: 'checkbox',
                checked: (tempFilters.channels || []).includes(channel),
                onChange: () => handleChannelChange(channel),
                className: 'mr-1 text-blue-600'
              }),
              React.createElement('span', { key: 'label' }, channel)
            ])
          ))
        ]),
        
        React.createElement('div', {
          key: 'directions'
        }, [
          React.createElement('h4', {
            key: 'title',
            className: 'text-xs font-medium text-gray-700 mb-2'
          }, 'Direction'),
          React.createElement('div', {
            key: 'checkboxes',
            className: 'flex space-x-4'
          }, directions.map(direction =>
            React.createElement('label', {
              key: direction,
              className: 'flex items-center text-xs'
            }, [
              React.createElement('input', {
                key: 'checkbox',
                type: 'checkbox',
                checked: (tempFilters.directions || []).includes(direction),
                onChange: () => handleDirectionChange(direction),
                className: 'mr-1 text-blue-600'
              }),
              React.createElement('span', {
                key: 'label',
                className: direction === 'DL' ? 'text-blue-600' : 'text-green-600'
              }, direction)
            ])
          ))
        ]),
        
        React.createElement('div', {
          key: 'network-types'
        }, [
          React.createElement('h4', {
            key: 'title',
            className: 'text-xs font-medium text-gray-700 mb-2'
          }, 'Network Types'),
          React.createElement('div', {
            key: 'checkboxes',
            className: 'grid grid-cols-3 gap-1'
          }, networkTypes.map(networkType =>
            React.createElement('label', {
              key: networkType,
              className: 'flex items-center text-xs'
            }, [
              React.createElement('input', {
                key: 'checkbox',
                type: 'checkbox',
                checked: (tempFilters.networkTypes || []).includes(networkType),
                onChange: () => handleNetworkTypeChange(networkType),
                className: 'mr-1 text-blue-600'
              }),
              React.createElement('span', { key: 'label' }, networkType)
            ])
          ))
        ])
      ]),
      
      React.createElement('div', {
        key: 'footer',
        className: 'mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500'
      }, `Active: ${totalActiveFilters} filters`)
    ]);

  } catch (error) {
    console.error('ChannelFilter component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'ChannelFilter Error');
  }
}

// Export ChannelFilter component
window.ChannelFilter = ChannelFilter;
