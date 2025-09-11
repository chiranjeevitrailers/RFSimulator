// Enhanced Logs Viewer with Complete 4G/5G Channel Support
function LogsView() {
  try {
    const [cliLogs, setCliLogs] = React.useState([]);
    const [filters, setFilters] = React.useState({
      layer: 'all', level: 'all', ueId: 'all', rnti: '', 
      channel: 'all', messageType: 'all', cellId: '', search: ''
    });
    const [selectedMessage, setSelectedMessage] = React.useState(null);
    const [showDecoder, setShowDecoder] = React.useState(false);

    // Complete 4G/5G channels as per srsRAN Project
    const allChannels = {
      '5G_DL': ['PDSCH', 'PDCCH', 'PBCH', 'SSB', 'CSI-RS'],
      '5G_UL': ['PUSCH', 'PUCCH', 'PRACH', 'SRS', 'DMRS'],
      '4G_DL': ['PDSCH', 'PDCCH', 'PBCH', 'PHICH', 'PCFICH', 'RS'],
      '4G_UL': ['PUSCH', 'PUCCH', 'PRACH', 'SRS', 'DMRS']
    };
    const protocolLayers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS'];

    React.useEffect(() => {
      const interval = setInterval(() => {
        if (window.CLIDataBridge) {
          const logs = window.CLIDataBridge.getRealtimeLogs();
          const processedLogs = logs.map(log => {
            if (window.SrsranMessageDecoder && typeof log === 'string') {
              return window.SrsranMessageDecoder.parseLogMessage(log);
            }
            return log;
          });
          setCliLogs(processedLogs);
        }
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    const filteredLogs = React.useMemo(() => {
      let logs = cliLogs;
      if (filters.layer !== 'all') logs = logs.filter(log => log.layer === filters.layer);
      if (filters.level !== 'all') logs = logs.filter(log => log.level === filters.level);
      if (filters.ueId !== 'all') logs = logs.filter(log => log.ueId === parseInt(filters.ueId));
      if (filters.rnti) logs = logs.filter(log => log.rnti?.includes(filters.rnti));
      if (filters.channel !== 'all') logs = logs.filter(log => log.channel === filters.channel);
      if (filters.messageType !== 'all') logs = logs.filter(log => log.messageType === filters.messageType);
      if (filters.cellId) logs = logs.filter(log => log.cellId?.includes(filters.cellId));
      if (filters.search) logs = logs.filter(log => log.raw?.toLowerCase().includes(filters.search.toLowerCase()));
      return logs.slice(-100);
    }, [cliLogs, filters]);

    const getUniqueValues = (field) => [...new Set(cliLogs.map(log => log[field]).filter(Boolean))].sort();

    const handleMessageClick = (log) => {
      setSelectedMessage(log);
      setShowDecoder(true);
    };

    return React.createElement('div', {
      className: 'space-y-6',
      'data-name': 'logs-view',
      'data-file': 'components/views/LogsView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'Protocol Stack Log Analysis'),

      React.createElement('div', {
        key: 'filters',
        className: 'bg-white p-4 rounded-lg border space-y-4'
      }, [
        React.createElement('div', {
          key: 'filter-title',
          className: 'flex justify-between items-center'
        }, [
          React.createElement('span', {
            key: 'title',
            className: 'text-sm font-medium text-gray-700'
          }, 'Advanced Filters'),
          React.createElement('div', {
            key: 'decoder-toggle',
            className: 'flex items-center space-x-2'
          }, [
            React.createElement('input', {
              key: 'checkbox',
              type: 'checkbox',
              checked: showDecoder,
              onChange: (e) => setShowDecoder(e.target.checked),
              className: 'rounded'
            }),
            React.createElement('label', {
              key: 'label',
              className: 'text-sm text-gray-700'
            }, 'Enable Message Decoder')
          ])
        ]),
        React.createElement('div', {
          key: 'filter-row-1',
          className: 'grid grid-cols-4 gap-3'
        }, [
          React.createElement('select', {
            key: 'layer',
            value: filters.layer,
            onChange: (e) => setFilters(prev => ({...prev, layer: e.target.value})),
            className: 'px-3 py-2 border rounded text-sm'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Layers'),
            ...protocolLayers.map(layer =>
              React.createElement('option', { key: layer, value: layer }, `${layer} Layer`)
            )
          ]),
          React.createElement('select', {
            key: 'channel',
            value: filters.channel,
            onChange: (e) => setFilters(prev => ({...prev, channel: e.target.value})),
            className: 'px-3 py-2 border rounded text-sm'
          }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Channels'),
            ...Object.entries(allChannels).map(([category, channels]) =>
              React.createElement('optgroup', { key: category, label: category.replace('_', ' ') },
                channels.map(ch => React.createElement('option', { key: ch, value: ch }, ch))
              )
            )
          ]),
          React.createElement('input', {
            key: 'rnti',
            type: 'text',
            placeholder: 'RNTI (hex)...',
            value: filters.rnti,
            onChange: (e) => setFilters(prev => ({...prev, rnti: e.target.value})),
            className: 'px-3 py-2 border rounded text-sm'
          }),
          React.createElement('input', {
            key: 'search',
            type: 'text',
            placeholder: 'Search messages...',
            value: filters.search,
            onChange: (e) => setFilters(prev => ({...prev, search: e.target.value})),
            className: 'px-3 py-2 border rounded text-sm'
          })
        ])
      ]),

      React.createElement('div', {
        key: 'logs-table',
        className: 'bg-white border rounded-lg overflow-hidden'
      }, [
        React.createElement('div', {
          key: 'header',
          className: 'px-4 py-3 bg-gray-50 border-b font-medium text-sm grid grid-cols-7 gap-2'
        }, ['Time', 'Layer', 'Level', 'Channel', 'RNTI/UE', 'Message Type', 'Raw Message']),
        React.createElement('div', {
          key: 'body',
          className: 'divide-y max-h-96 overflow-y-auto'
        }, filteredLogs.map((log, idx) =>
          React.createElement('div', {
            key: idx,
            className: 'px-4 py-2 grid grid-cols-7 gap-2 text-xs hover:bg-gray-50 cursor-pointer',
            onClick: () => handleMessageClick(log)
          }, [
            React.createElement('div', { key: 'time' }, new Date().toLocaleTimeString()),
            React.createElement('span', { key: 'layer', className: 'px-2 py-1 rounded bg-purple-100 text-purple-800' }, log.layer || 'N/A'),
            React.createElement('span', { key: 'level' }, log.level || 'info'),
            React.createElement('span', { key: 'channel' }, log.channel || 'N/A'),
            React.createElement('div', { key: 'ids' }, log.rnti ? `0x${log.rnti}` : (log.ueId ? `UE${log.ueId}` : 'N/A')),
            React.createElement('span', { key: 'type' }, log.messageType || 'Generic'),
            React.createElement('div', { key: 'msg', className: 'truncate font-mono' }, log.raw || log.message || 'No message')
          ])
        ))
      ]),

      selectedMessage && showDecoder && React.createElement(MessageDecoder, {
        key: 'decoder',
        message: selectedMessage,
        onClose: () => { setSelectedMessage(null); setShowDecoder(false); }
      })
    ]);

  } catch (error) {
    console.error('LogsView error:', error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'Failed to load logs');
  }
}

window.LogsView = LogsView;