// EnhancedLogsView - Comprehensive protocol analyzer with real CLI integration
function EnhancedLogsView() {
  try {
    // State management
    const [logs, setLogs] = React.useState([]);
    const [filteredLogs, setFilteredLogs] = React.useState([]);
    const [filters, setFilters] = React.useState({
      layer: 'ALL', channel: 'ALL', messageType: 'ALL', 
      direction: 'ALL', source: 'ALL', rnti: 'ALL', search: ''
    });
    const [selectedMessage, setSelectedMessage] = React.useState(null);
    const [showDecoder, setShowDecoder] = React.useState(false);
    const [isConnected, setIsConnected] = React.useState(false);

    // Comprehensive filter definitions
    const layers = ['ALL', 'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'NGAP', 'GTP', 'SCTP', 'OTHER'];
    const channels = ['ALL', 'PBCH', 'PDCCH', 'PDSCH', 'PUSCH', 'PUCCH', 'PRACH', 'CCCH', 'DCCH', 'DTCH', 'BCCH', 'PCCH'];
    const messageTypes = ['ALL', 'MIB', 'SIB1', 'RRCSetup', 'RRCReconfiguration', 'SecurityModeCommand', 
      'UECapabilityEnquiry', 'PDSCH', 'PUSCH', 'DL-SCH', 'UL-SCH', 'MAC-PDU', 'RLC-PDU', 'PDCP-PDU', 
      'NAS-PDU', 'NGAP-PDU', 'GTP-PDU', 'GENERIC'];
    const directions = ['ALL', 'DL', 'UL', 'BOTH'];
    const sources = ['ALL', 'srsRAN', 'Open5GS', 'Kamailio'];

    // Connect to real CLI data sources
    React.useEffect(() => {
      try {
        if (window.LogProcessor) {
          const logProcessor = new window.LogProcessor();
          const unsubscribe = logProcessor.subscribe((processedLogs) => {
            setLogs(processedLogs || []);
            setIsConnected(true);
          });

          if (window.CLIDataBridge) {
            const cliBridge = new window.CLIDataBridge();
            cliBridge.startCollection(['srsran', 'open5gs']).catch(() => {});
          }
          return unsubscribe;
        }
      } catch (error) {
        console.error('CLI connection failed:', error);
        loadSampleData();
      }
    }, []);

    const loadSampleData = () => {
      const samples = [
        { id: 1, timestamp: '10:00:00.123', direction: 'DL', layer: 'PHY', channel: 'PBCH', 
          sfn: '100', messageType: 'MIB', rnti: 'SI-RNTI', message: 'MIB decoded', 
          rawData: '40 04 64 40 00', ies: 'SFN=100, BW=20MHz', source: 'srsRAN' },
        { id: 2, timestamp: '10:00:01.456', direction: 'DL', layer: 'MAC', channel: 'PDSCH', 
          sfn: '101', messageType: 'DL-SCH', rnti: 'C-RNTI', message: 'HARQ transmission', 
          rawData: '01 23 45 67 89', ies: 'HARQ-ID=1, RV=0, MCS=16', source: 'srsRAN' }
      ];
      setLogs(samples);
      setIsConnected(false);
    };

    // Apply comprehensive filters
    React.useEffect(() => {
      let filtered = logs;
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'ALL') {
          if (key === 'search') {
            const term = filters[key].toLowerCase();
            filtered = filtered.filter(log => 
              log.message?.toLowerCase().includes(term) ||
              log.ies?.toLowerCase().includes(term) ||
              log.component?.toLowerCase().includes(term)
            );
          } else {
            filtered = filtered.filter(log => 
              log[key] === filters[key] || log.fields?.[key] === filters[key]
            );
          }
        }
      });
      setFilteredLogs(filtered);
    }, [logs, filters]);

    const handleFilterChange = (key, value) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    };

    const decodeMessage = (log) => {
      setSelectedMessage(log);
      setShowDecoder(true);
    };

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'enhanced-logs-view',
      'data-file': 'components/views/EnhancedLogsView.js'
    }, [
      // Header
      React.createElement('div', { key: 'header' }, [
        React.createElement('h2', { key: 'title', className: 'text-2xl font-bold text-gray-800 mb-2' }, 
          'Protocol Stack Log Analysis'),
        React.createElement('p', { key: 'desc', className: 'text-gray-600' }, 
          'Real-time log viewer with comprehensive filtering and message decoding')
      ]),

      // Status and Filters
      React.createElement('div', { key: 'filters', className: 'bg-white rounded-lg shadow-sm border p-4' }, [
        React.createElement('div', { key: 'status', className: 'mb-4 flex items-center gap-4' }, [
          React.createElement('span', { key: 'status-label', className: 'font-medium' }, 'Status:'),
          React.createElement('span', { 
            key: 'status-indicator',
            className: `px-3 py-1 rounded-full text-sm ${isConnected 
              ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
          }, isConnected ? '🟢 CLI Connected' : '🔴 Sample Data'),
          React.createElement('span', { key: 'count', className: 'text-sm text-gray-500' }, 
            `${filteredLogs.length} of ${logs.length} logs`)
        ]),
        
        React.createElement('div', { key: 'filters-grid', className: 'grid grid-cols-2 md:grid-cols-4 gap-3' }, [
          ['layer', 'Layer', layers], ['channel', 'Channel', channels], 
          ['messageType', 'Message', messageTypes], ['direction', 'Direction', directions]
        ].map(([key, label, options]) =>
          React.createElement('div', { key }, [
            React.createElement('label', { key: 'label', className: 'block text-xs font-medium mb-1' }, label),
            React.createElement('select', {
              key: 'select', value: filters[key],
              onChange: (e) => handleFilterChange(key, e.target.value),
              className: 'w-full border rounded px-2 py-1 text-sm'
            }, options.map(opt => React.createElement('option', { key: opt, value: opt }, opt)))
          ])
        )),
        
        React.createElement('div', { key: 'search-row', className: 'mt-3' }, 
          React.createElement('input', {
            key: 'search', type: 'text', value: filters.search,
            onChange: (e) => handleFilterChange('search', e.target.value),
            placeholder: 'Search logs, IEs, components...',
            className: 'w-full border rounded px-3 py-2 text-sm'
          })
        )
      ]),

      // Logs Table
      React.createElement('div', { key: 'table', className: 'bg-white rounded-lg shadow-sm border overflow-x-auto' },
        React.createElement('table', { className: 'min-w-full text-sm' }, [
          React.createElement('thead', { key: 'thead', className: 'bg-gray-50' },
            React.createElement('tr', { key: 'header-row' },
              ['Time', 'Dir', 'Layer', 'Channel', 'SFN', 'Type', 'RNTI', 'IEs', 'Decode'].map(h =>
                React.createElement('th', { 
                  key: h, className: 'px-3 py-2 text-left text-xs font-medium text-gray-500'
                }, h)
              )
            )
          ),
          React.createElement('tbody', { key: 'tbody', className: 'divide-y divide-gray-200' },
            filteredLogs.slice(0, 100).map(log => 
              React.createElement('tr', { key: log.id, className: 'hover:bg-gray-50' }, [
                React.createElement('td', { key: 'time', className: 'px-3 py-2 font-mono text-xs' }, 
                  log.timestamp),
                React.createElement('td', { key: 'dir', className: 'px-3 py-2' },
                  React.createElement('span', {
                    className: `px-1 py-0.5 text-xs rounded ${log.direction === 'DL' 
                      ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`
                  }, log.direction)
                ),
                React.createElement('td', { key: 'layer', className: 'px-3 py-2' },
                  React.createElement('span', { className: 'px-1 py-0.5 text-xs rounded bg-blue-100 text-blue-700' }, 
                    log.layer)
                ),
                React.createElement('td', { key: 'channel', className: 'px-3 py-2 text-xs' }, 
                  log.channel || '-'),
                React.createElement('td', { key: 'sfn', className: 'px-3 py-2 font-mono text-xs' }, 
                  log.sfn || '-'),
                React.createElement('td', { key: 'type', className: 'px-3 py-2 font-medium text-xs' }, 
                  log.messageType),
                React.createElement('td', { key: 'rnti', className: 'px-3 py-2 font-mono text-xs' }, 
                  log.rnti || '-'),
                React.createElement('td', { key: 'ies', className: 'px-3 py-2 text-xs max-w-xs truncate' }, 
                  log.ies || '-'),
                React.createElement('td', { key: 'decode', className: 'px-3 py-2' },
                  React.createElement('button', {
                    onClick: () => decodeMessage(log),
                    className: 'text-blue-600 hover:bg-blue-50 p-1 rounded'
                  }, React.createElement('div', { className: 'icon-search text-sm' }))
                )
              ])
            )
          )
        ])
      ),

      // Decoder Modal
      showDecoder && selectedMessage && React.createElement('div', {
        key: 'modal', className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
      }, React.createElement('div', { className: 'bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto p-6' }, [
        React.createElement('div', { key: 'modal-header', className: 'flex justify-between items-center mb-4' }, [
          React.createElement('h3', { key: 'modal-title', className: 'text-lg font-semibold' }, 
            `Message Decoder - ${selectedMessage.messageType}`),
          React.createElement('button', {
            key: 'close', onClick: () => setShowDecoder(false),
            className: 'text-gray-500 hover:text-gray-700'
          }, React.createElement('div', { className: 'icon-x text-xl' }))
        ]),
        React.createElement('div', { key: 'modal-content', className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' }, [
          React.createElement('div', { key: 'raw' }, [
            React.createElement('h4', { key: 'raw-title', className: 'font-medium mb-2' }, 'Raw Data'),
            React.createElement('div', { key: 'raw-data', className: 'bg-gray-100 p-3 rounded font-mono text-sm' }, 
              selectedMessage.rawData || 'No raw data available')
          ]),
          React.createElement('div', { key: 'decoded' }, [
            React.createElement('h4', { key: 'decoded-title', className: 'font-medium mb-2' }, 'Decoded Information'),
            React.createElement('div', { key: 'decoded-content', className: 'space-y-2 text-sm' }, [
              React.createElement('p', { key: 'ies' }, [
                React.createElement('strong', { key: 'ies-label' }, 'IEs: '),
                selectedMessage.ies || 'No IEs available'
              ]),
              React.createElement('p', { key: 'source' }, [
                React.createElement('strong', { key: 'source-label' }, 'Source: '),
                selectedMessage.source || 'Unknown'
              ])
            ])
          ])
        ])
      ]))
    ]);

  } catch (error) {
    console.error('EnhancedLogsView error:', error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'Failed to load enhanced logs view');
  }
}

window.EnhancedLogsView = EnhancedLogsView;