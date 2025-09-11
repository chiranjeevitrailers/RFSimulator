// ChannelViewer Component
function ChannelViewer({ logs, filters, onFilterChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [searchQuery, setSearchQuery] = React.useState('');
    const [sortColumn, setSortColumn] = React.useState('timestamp');
    const [sortDirection, setSortDirection] = React.useState('desc');
    const [selectedChannel, setSelectedChannel] = React.useState(null);
    const [showDetails, setShowDetails] = React.useState(false);
    
    // Process logs to extract channel information
    const channelLogs = React.useMemo(() => {
      if (!logs || !Array.isArray(logs)) return [];
      
      return logs.map(log => {
        const channelInfo = ChannelDecoder.extractChannelInfo(log);
        return channelInfo ? { ...log, channelInfo } : null;
      }).filter(Boolean);
    }, [logs]);
    
    // Filter and sort channel logs
    const filteredChannelLogs = React.useMemo(() => {
      let filtered = channelLogs.filter(log => {
        const info = log.channelInfo;
        if (!info) return false;
        
        if (searchQuery && !info.rawMessage.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        if (filters.channels?.length > 0 && !filters.channels.includes(info.channelType)) {
          return false;
        }
        if (filters.directions?.length > 0 && !filters.directions.includes(info.direction)) {
          return false;
        }
        if (filters.networkTypes?.length > 0 && !filters.networkTypes.includes(info.networkType)) {
          return false;
        }
        return true;
      });
      
      return filtered.sort((a, b) => {
        const aVal = a.channelInfo[sortColumn] || a[sortColumn] || '';
        const bVal = b.channelInfo[sortColumn] || b[sortColumn] || '';
        const result = aVal.toString().localeCompare(bVal.toString());
        return sortDirection === 'asc' ? result : -result;
      });
    }, [channelLogs, searchQuery, filters, sortColumn, sortDirection]);
    
    const handleSort = (column) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortDirection('asc');
      }
    };
    
    const getChannelColor = (channelType) => {
      const colors = {
        'PDCCH': 'bg-blue-100 text-blue-800',
        'PDSCH': 'bg-green-100 text-green-800',
        'PUCCH': 'bg-purple-100 text-purple-800',
        'PUSCH': 'bg-orange-100 text-orange-800',
        'PBCH': 'bg-red-100 text-red-800',
        'PRACH': 'bg-yellow-100 text-yellow-800'
      };
      return colors[channelType] || 'bg-gray-100 text-gray-800';
    };
    
    const getDirectionIcon = (direction) => {
      return direction === 'DL' ? 'arrow-down' : 
             direction === 'UL' ? 'arrow-up' : 
             'arrows-up-down';
    };
    
    const formatTimestamp = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('en-US', { 
        hour12: false, 
        fractionalSecondDigits: 3 
      });
    };
    
    return React.createElement('div', {
      className: 'h-full flex flex-col bg-white border border-gray-300',
      'data-name': 'channel-viewer',
      'data-file': 'components/logs/ChannelViewer.js'
    }, [
      React.createElement('div', {
        key: 'search-bar',
        className: 'border-b border-gray-300 p-3 bg-gray-50'
      }, [
        React.createElement('div', {
          key: 'search-controls',
          className: 'flex items-center justify-between'
        }, [
          React.createElement('div', {
            key: 'search-input',
            className: 'flex-1 mr-4'
          }, React.createElement('input', {
            type: 'text',
            placeholder: 'Search channels (RNTI, MCS, HARQ, etc.)...',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: 'w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
          })),
          React.createElement('span', {
            key: 'count',
            className: 'px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium'
          }, `${filteredChannelLogs.length} channels`)
        ])
      ]),
      
      React.createElement('div', {
        key: 'table-header',
        className: 'border-b border-gray-300 bg-gray-100'
      }, React.createElement('div', {
        className: 'flex text-xs font-semibold text-gray-700'
      }, [
        React.createElement('div', {
          key: 'time',
          className: 'px-2 py-2 border-r border-gray-300 w-20 cursor-pointer',
          onClick: () => handleSort('timestamp')
        }, `Time ${sortColumn === 'timestamp' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`),
        React.createElement('div', {
          key: 'dir',
          className: 'px-2 py-2 border-r border-gray-300 w-16 cursor-pointer',
          onClick: () => handleSort('direction')
        }, `Dir ${sortColumn === 'direction' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`),
        React.createElement('div', {
          key: 'channel',
          className: 'px-2 py-2 border-r border-gray-300 w-20 cursor-pointer',
          onClick: () => handleSort('channelType')
        }, `Channel ${sortColumn === 'channelType' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`),
        React.createElement('div', {
          key: 'rnti',
          className: 'px-2 py-2 border-r border-gray-300 w-16 cursor-pointer',
          onClick: () => handleSort('rnti')
        }, `RNTI ${sortColumn === 'rnti' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`),
        React.createElement('div', {
          key: 'mcs',
          className: 'px-2 py-2 border-r border-gray-300 w-12 cursor-pointer',
          onClick: () => handleSort('mcs')
        }, `MCS ${sortColumn === 'mcs' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`),
        React.createElement('div', {
          key: 'harq',
          className: 'px-2 py-2 border-r border-gray-300 w-16 cursor-pointer',
          onClick: () => handleSort('harq')
        }, `HARQ ${sortColumn === 'harq' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`),
        React.createElement('div', {
          key: 'message',
          className: 'px-2 py-2 flex-1'
        }, 'Message')
      ])),
      
      React.createElement('div', {
        key: 'table-body',
        className: 'flex-1 overflow-auto'
      }, filteredChannelLogs.length === 0 ? 
        React.createElement('div', {
          className: 'p-8 text-center text-gray-500'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'radio',
            className: 'w-8 h-8 mx-auto mb-3 text-gray-400'
          }),
          React.createElement('p', {
            key: 'title',
            className: 'text-lg'
          }, 'No channel information found'),
          React.createElement('p', {
            key: 'subtitle',
            className: 'text-sm mt-2'
          }, 'Start logging to capture DL/UL channel data')
        ]) :
        filteredChannelLogs.map((log, index) => {
          const info = log.channelInfo;
          return React.createElement('div', {
            key: `${log.id}-${index}`,
            className: `flex border-b border-gray-200 hover:bg-blue-50 cursor-pointer ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`,
            onClick: () => {
              setSelectedChannel(log);
              setShowDetails(true);
            }
          }, [
            React.createElement('div', {
              key: 'time',
              className: 'px-2 py-2 border-r border-gray-200 w-20 text-xs font-mono'
            }, formatTimestamp(info.timestamp)),
            React.createElement('div', {
              key: 'direction',
              className: 'px-2 py-2 border-r border-gray-200 w-16 text-center'
            }, React.createElement('i', {
              'data-lucide': getDirectionIcon(info.direction),
              className: `w-4 h-4 ${info.direction === 'DL' ? 'text-blue-600' : 'text-green-600'}`
            })),
            React.createElement('div', {
              key: 'channel',
              className: 'px-2 py-2 border-r border-gray-200 w-20'
            }, React.createElement('span', {
              className: `px-1 py-0.5 rounded text-xs font-medium ${getChannelColor(info.channelType)}`
            }, info.channelType)),
            React.createElement('div', {
              key: 'rnti',
              className: 'px-2 py-2 border-r border-gray-200 w-16 text-xs font-mono'
            }, info.rnti ? `0x${info.rnti.toString(16).toUpperCase()}` : '-'),
            React.createElement('div', {
              key: 'mcs',
              className: 'px-2 py-2 border-r border-gray-200 w-12 text-xs text-center'
            }, info.mcs ?? '-'),
            React.createElement('div', {
              key: 'harq',
              className: 'px-2 py-2 border-r border-gray-200 w-16 text-xs text-center'
            }, info.harq ?? '-'),
            React.createElement('div', {
              key: 'message',
              className: 'px-2 py-2 flex-1 text-xs truncate'
            }, info.rawMessage)
          ]);
        })
      ),
      
      React.createElement('div', {
        key: 'footer',
        className: 'border-t border-gray-300 px-3 py-2 bg-gray-50 text-xs text-gray-600'
      }, React.createElement('div', {
        className: 'flex justify-between items-center'
      }, [
        React.createElement('span', {
          key: 'total'
        }, `Total: ${filteredChannelLogs.length} channel messages`),
        React.createElement('div', {
          key: 'stats',
          className: 'flex items-center space-x-4'
        }, [
          React.createElement('span', {
            key: 'dl'
          }, `DL: ${filteredChannelLogs.filter(l => l.channelInfo.direction === 'DL').length}`),
          React.createElement('span', {
            key: 'ul'
          }, `UL: ${filteredChannelLogs.filter(l => l.channelInfo.direction === 'UL').length}`)
        ])
      ]))
    ]);

  } catch (error) {
    console.error('ChannelViewer component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'ChannelViewer Error');
  }
}

// Export ChannelViewer component
window.ChannelViewer = ChannelViewer;
