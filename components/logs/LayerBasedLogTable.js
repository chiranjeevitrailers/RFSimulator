// LayerBasedLogTable Component
function LayerBasedLogTable({ logs, selectedLog, onLogSelect, searchQuery, searchField, columnProfile, sortColumn, sortDirection, onSort }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const containerRef = React.useRef(null);

    const columnProfiles = {
      standard: [
        { key: 'timestamp', label: 'Time', width: '100px' },
        { key: 'component', label: 'Component', width: '80px' },
        { key: 'protocol', label: 'Protocol', width: '70px' },
        { key: 'level', label: 'Level', width: '60px' },
        { key: 'ueId', label: 'UE ID', width: '60px' },
        { key: 'message', label: 'Message', width: 'auto' }
      ],
      phy: [
        { key: 'timestamp', label: 'Time', width: '90px' },
        { key: 'component', label: 'Component', width: '70px' },
        { key: 'ueId', label: 'UE ID', width: '50px' },
        { key: 'frameNumber', label: 'Frame', width: '50px' },
        { key: 'subframeNumber', label: 'SF', width: '40px' },
        { key: 'channelType', label: 'Channel', width: '60px' },
        { key: 'mcs', label: 'MCS', width: '40px' },
        { key: 'rsrp', label: 'RSRP', width: '50px' },
        { key: 'message', label: 'Message', width: 'auto' }
      ],
      rrc: [
        { key: 'timestamp', label: 'Time', width: '90px' },
        { key: 'component', label: 'Component', width: '70px' },
        { key: 'ueId', label: 'UE ID', width: '50px' },
        { key: 'procedure', label: 'Procedure', width: '100px' },
        { key: 'messageType', label: 'Msg Type', width: '90px' },
        { key: 'cause', label: 'Cause', width: '80px' },
        { key: 'direction', label: 'Dir', width: '40px' },
        { key: 'message', label: 'Message', width: 'auto' }
      ],
      nas: [
        { key: 'timestamp', label: 'Time', width: '90px' },
        { key: 'component', label: 'Component', width: '70px' },
        { key: 'ueId', label: 'UE ID', width: '50px' },
        { key: 'imsi', label: 'IMSI', width: '100px' },
        { key: 'procedure', label: 'Procedure', width: '90px' },
        { key: 'messageType', label: 'Msg Type', width: '80px' },
        { key: 'direction', label: 'Dir', width: '40px' },
        { key: 'message', label: 'Message', width: 'auto' }
      ]
    };

    const columns = columnProfiles[columnProfile] || columnProfiles.standard;

    const handleSort = (columnKey) => {
      try {
        const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
        onSort(columnKey, newDirection);
      } catch (error) {
        console.error('LayerBasedLogTable sort error:', error);
        reportError(error);
      }
    };

    const getCellContent = (log, columnKey) => {
      try {
        let content = '';
        
        if (columnKey === 'timestamp') {
          content = new Date(log.timestamp).toLocaleTimeString('en-US', { 
            hour12: false, 
            fractionalSecondDigits: 3 
          });
        } else {
          content = log[columnKey] || '-';
        }
        
        return content;
      } catch (error) {
        console.error('LayerBasedLogTable get cell content error:', error);
        return '-';
      }
    };

    return React.createElement('div', {
      className: 'h-full flex flex-col',
      'data-name': 'layer-based-log-table',
      'data-file': 'components/logs/LayerBasedLogTable.js'
    }, [
      React.createElement('div', {
        key: 'table-container',
        ref: containerRef,
        className: 'flex-1 overflow-auto'
      }, React.createElement('table', {
        className: 'w-full border-collapse'
      }, [
        React.createElement('thead', {
          key: 'header',
          className: 'sticky top-0 bg-gray-100 border-b-2 border-gray-300'
        }, React.createElement('tr', {}, columns.map(column =>
          React.createElement('th', {
            key: column.key,
            className: 'px-2 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-200',
            style: { width: column.width },
            onClick: () => handleSort(column.key)
          }, React.createElement('div', {
            className: 'flex items-center space-x-1'
          }, [
            React.createElement('span', { key: 'label' }, column.label),
            sortColumn === column.key && React.createElement('i', {
              key: 'sort-icon',
              'data-lucide': sortDirection === 'asc' ? 'chevron-up' : 'chevron-down',
              className: 'w-3 h-3 text-blue-600'
            })
          ]))
        ))),
        React.createElement('tbody', {
          key: 'body'
        }, logs.map((log, index) =>
          React.createElement('tr', {
            key: log.id || index,
            className: `border-b border-gray-200 hover:bg-gray-50 cursor-pointer text-xs ${
              selectedLog && selectedLog.id === log.id ? 'bg-blue-50 border-blue-200' : ''
            }`,
            onClick: () => onLogSelect && onLogSelect(log)
          }, columns.map(column =>
            React.createElement('td', {
              key: column.key,
              className: 'px-2 py-1 whitespace-nowrap overflow-hidden text-ellipsis',
              style: { maxWidth: column.width === 'auto' ? '300px' : column.width },
              title: String(getCellContent(log, column.key))
            }, getCellContent(log, column.key))
          ))
        ))
      ]))
    ]);

  } catch (error) {
    console.error('LayerBasedLogTable component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'LayerBasedLogTable Error');
  }
}

// Export LayerBasedLogTable component
window.LayerBasedLogTable = LayerBasedLogTable;
