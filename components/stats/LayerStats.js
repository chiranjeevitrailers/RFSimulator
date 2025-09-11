// LayerStats Component
function LayerStats({ logs = [], protocolMessages = [] }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [selectedLayer, setSelectedLayer] = React.useState('all');
    const [timeRange, setTimeRange] = React.useState('1h');

    const calculateLayerStats = () => {
      try {
        const stats = {
          phy: { count: 0, errors: 0, throughput: 0, rsrp: [], rsrq: [] },
          mac: { count: 0, errors: 0, harq: 0, crc: 0 },
          rlc: { count: 0, errors: 0, retransmissions: 0 },
          pdcp: { count: 0, errors: 0, sequence: 0 },
          rrc: { count: 0, errors: 0, connections: 0, handovers: 0 },
          nas: { count: 0, errors: 0, registrations: 0, sessions: 0 },
          sip: { count: 0, errors: 0, calls: 0, registrations: 0 }
        };

        // Process logs
        logs.forEach(log => {
          const layer = log.component?.toLowerCase();
          if (stats[layer]) {
            stats[layer].count++;
            if (log.level === 'error') {
              stats[layer].errors++;
            }
            
            // Extract specific metrics
            if (layer === 'phy' && log.metrics) {
              if (log.metrics.rsrp) stats[layer].rsrp.push(log.metrics.rsrp);
              if (log.metrics.rsrq) stats[layer].rsrq.push(log.metrics.rsrq);
              if (log.metrics.throughput) stats[layer].throughput += log.metrics.throughput;
            }
          }
        });

        // Process protocol messages
        protocolMessages.forEach(msg => {
          const layer = msg.layer?.toLowerCase();
          if (stats[layer]) {
            if (layer === 'rrc' && msg.messageType.includes('CONNECTION')) {
              stats[layer].connections++;
            }
            if (layer === 'nas' && msg.messageType.includes('REGISTRATION')) {
              stats[layer].registrations++;
            }
            if (layer === 'sip' && msg.messageType === 'INVITE') {
              stats[layer].calls++;
            }
          }
        });

        return stats;
      } catch (error) {
        console.error('LayerStats calculate stats error:', error);
        return {};
      }
    };

    const layerStats = calculateLayerStats();

    const renderLayerCard = (layerName, stats) => {
      try {
        const layerColors = {
          phy: 'bg-purple-100 text-purple-800 border-purple-200',
          mac: 'bg-blue-100 text-blue-800 border-blue-200',
          rlc: 'bg-green-100 text-green-800 border-green-200',
          pdcp: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          rrc: 'bg-red-100 text-red-800 border-red-200',
          nas: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          sip: 'bg-pink-100 text-pink-800 border-pink-200'
        };

        const errorRate = stats.count > 0 ? ((stats.errors / stats.count) * 100).toFixed(1) : 0;
        const isSelected = selectedLayer === layerName;

        return React.createElement('div', {
          key: layerName,
          className: `p-4 border-2 rounded-lg cursor-pointer transition-all ${
            isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
          } ${layerColors[layerName] || 'bg-gray-100 text-gray-800 border-gray-200'}`,
          onClick: () => setSelectedLayer(isSelected ? 'all' : layerName)
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-3'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-lg font-semibold'
            }, layerName.toUpperCase()),
            React.createElement('div', {
              key: 'count',
              className: 'text-2xl font-bold'
            }, stats.count.toLocaleString())
          ]),
          React.createElement('div', {
            key: 'metrics',
            className: 'space-y-2 text-sm'
          }, [
            React.createElement('div', {
              key: 'error-rate',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Error Rate:'),
              React.createElement('span', { 
                key: 'value',
                className: errorRate > 5 ? 'text-red-600 font-semibold' : ''
              }, `${errorRate}%`)
            ]),
            layerName === 'phy' && stats.rsrp.length > 0 && React.createElement('div', {
              key: 'rsrp',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Avg RSRP:'),
              React.createElement('span', { key: 'value' }, `${(stats.rsrp.reduce((a, b) => a + b, 0) / stats.rsrp.length).toFixed(1)} dBm`)
            ]),
            layerName === 'rrc' && React.createElement('div', {
              key: 'connections',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Connections:'),
              React.createElement('span', { key: 'value' }, stats.connections)
            ]),
            layerName === 'nas' && React.createElement('div', {
              key: 'registrations',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Registrations:'),
              React.createElement('span', { key: 'value' }, stats.registrations)
            ]),
            layerName === 'sip' && React.createElement('div', {
              key: 'calls',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Calls:'),
              React.createElement('span', { key: 'value' }, stats.calls)
            ])
          ])
        ]);
      } catch (error) {
        console.error('LayerStats render layer card error:', error);
        return null;
      }
    };

    return React.createElement('div', {
      className: 'space-y-6',
      'data-name': 'layer-stats',
      'data-file': 'components/stats/LayerStats.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h2', {
          key: 'title',
          className: 'text-xl font-bold text-gray-900'
        }, 'Protocol Layer Statistics'),
        React.createElement('select', {
          key: 'time-range',
          value: timeRange,
          onChange: (e) => setTimeRange(e.target.value),
          className: 'border border-gray-300 rounded-md px-3 py-1 text-sm'
        }, [
          React.createElement('option', { key: '15m', value: '15m' }, 'Last 15 min'),
          React.createElement('option', { key: '1h', value: '1h' }, 'Last 1 hour'),
          React.createElement('option', { key: '6h', value: '6h' }, 'Last 6 hours'),
          React.createElement('option', { key: '24h', value: '24h' }, 'Last 24 hours')
        ])
      ]),
      React.createElement('div', {
        key: 'stats-grid',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
      }, Object.entries(layerStats).map(([layer, stats]) => renderLayerCard(layer, stats))),
      selectedLayer !== 'all' && React.createElement('div', {
        key: 'detailed-stats',
        className: 'bg-white p-6 rounded-lg border border-gray-200'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900 mb-4'
        }, `${selectedLayer.toUpperCase()} Layer Details`),
        React.createElement('div', {
          key: 'details',
          className: 'text-center text-gray-500'
        }, 'Detailed layer analysis coming soon...')
      ])
    ]);

  } catch (error) {
    console.error('LayerStats component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Layer stats failed to load');
  }
}

// Export LayerStats component
window.LayerStats = LayerStats;
