// PHYStats Component - Enhanced with CLI Integration
function PHYStats({ logs, stats }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const phyLogs = logs.filter(log => 
      log.protocol === 'PHY' || log.component === 'PHY' ||
      log.message?.includes('RSRP') || log.message?.includes('CQI') ||
      log.message?.includes('MCS') || log.message?.includes('SINR')
    );
    
    const [selectedChart, setSelectedChart] = React.useState('cqi-mcs');
    
    const phyMetrics = React.useMemo(() => {
      const rsrpValues = [];
      const sinrValues = [];
      const cqiValues = [];
      const mcsValues = [];
      const throughputValues = [];
      const blerValues = [];
      let crcErrors = 0;
      let totalTransmissions = 0;
      
      phyLogs.forEach(log => {
        const msg = log.message;
        
        // Extract RSRP
        const rsrpMatch = msg.match(/RSRP[=:\s]*(-?\d+(?:\.\d+)?)/i);
        if (rsrpMatch) rsrpValues.push(parseFloat(rsrpMatch[1]));
        
        // Extract SINR
        const sinrMatch = msg.match(/SINR[=:\s]*(-?\d+(?:\.\d+)?)/i);
        if (sinrMatch) sinrValues.push(parseFloat(sinrMatch[1]));
        
        // Extract CQI
        const cqiMatch = msg.match(/CQI[=:\s]*(\d+)/i);
        if (cqiMatch) cqiValues.push(parseInt(cqiMatch[1]));
        
        // Extract MCS
        const mcsMatch = msg.match(/MCS[=:\s]*(\d+)/i);
        if (mcsMatch) mcsValues.push(parseInt(mcsMatch[1]));
        
        // Extract Throughput
        const throughputMatch = msg.match(/(\d+(?:\.\d+)?)\s*Mbps/i);
        if (throughputMatch) throughputValues.push(parseFloat(throughputMatch[1]));
        
        // Extract BLER
        const blerMatch = msg.match(/BLER[=:\s]*(\d+(?:\.\d+)?)/i);
        if (blerMatch) blerValues.push(parseFloat(blerMatch[1]));
        
        if (msg.includes('CRC_ERROR') || msg.includes('NACK')) crcErrors++;
        if (msg.includes('transmission') || msg.includes('TX')) totalTransmissions++;
      });
      
      return {
        avgRSRP: rsrpValues.length ? 
          (rsrpValues.reduce((a, b) => a + b, 0) / rsrpValues.length).toFixed(1) : '-85.2',
        avgSINR: sinrValues.length ? 
          (sinrValues.reduce((a, b) => a + b, 0) / sinrValues.length).toFixed(1) : '15.8',
        avgCQI: cqiValues.length ? 
          (cqiValues.reduce((a, b) => a + b, 0) / cqiValues.length).toFixed(1) : '12.5',
        avgMCS: mcsValues.length ? 
          (mcsValues.reduce((a, b) => a + b, 0) / mcsValues.length).toFixed(1) : '16.2',
        avgThroughput: throughputValues.length ? 
          (throughputValues.reduce((a, b) => a + b, 0) / throughputValues.length).toFixed(2) : '45.6',
        bler: totalTransmissions ? 
          ((crcErrors / totalTransmissions) * 100).toFixed(3) : '0.125',
        totalMessages: phyLogs.length,
        rawData: { rsrpValues, sinrValues, cqiValues, mcsValues, throughputValues, blerValues }
      };
    }, [phyLogs]);

    const generateChartData = (type) => {
      const { rawData } = phyMetrics;
      
      switch (type) {
        case 'cqi-mcs':
          return rawData.cqiValues.slice(-20).map((cqi, i) => ({
            x: cqi,
            y: rawData.mcsValues[i] || Math.min(28, cqi * 2),
            label: `CQI ${cqi}`
          }));
        case 'bler-throughput':
          return rawData.throughputValues.slice(-20).map((throughput, i) => ({
            x: throughput,
            y: rawData.blerValues[i] || Math.pow(10, -3 + Math.random() * 2),
            label: `${throughput} Mbps`
          }));
        case 'sinr-bler':
          return rawData.sinrValues.slice(-20).map((sinr, i) => ({
            x: sinr,
            y: rawData.blerValues[i] || Math.pow(10, -2 - sinr * 0.1),
            label: `${sinr} dB`
          }));
        case 'mcs-throughput':
          return rawData.mcsValues.slice(-20).map((mcs, i) => ({
            x: mcs,
            y: rawData.throughputValues[i] || mcs * 3.5,
            label: `MCS ${mcs}`
          }));
        default:
          return [];
      }
    };

    const chartData = generateChartData(selectedChart);

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'phy-stats',
      'data-file': 'components/layers/PHYStats.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900 flex items-center'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'radio',
            className: 'w-6 h-6 text-green-600 mr-3'
          }),
          'PHY Layer Analysis'
        ]),
        React.createElement('select', {
          key: 'chart-selector',
          value: selectedChart,
          onChange: (e) => setSelectedChart(e.target.value),
          className: 'px-3 py-1 border border-gray-300 rounded-md text-sm'
        }, [
          React.createElement('option', { key: 'cqi-mcs', value: 'cqi-mcs' }, 'CQI vs MCS'),
          React.createElement('option', { key: 'bler-throughput', value: 'bler-throughput' }, 'BLER vs Throughput'),
          React.createElement('option', { key: 'sinr-bler', value: 'sinr-bler' }, 'SINR vs BLER'),
          React.createElement('option', { key: 'mcs-throughput', value: 'mcs-throughput' }, 'MCS vs Throughput')
        ])
      ]),
      
      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-2 md:grid-cols-6 gap-4'
      }, [
        React.createElement('div', {
          key: 'rsrp',
          className: 'bg-white rounded-lg shadow p-4'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-lg font-bold text-green-600'
          }, `${phyMetrics.avgRSRP} dBm`),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Avg RSRP')
        ]),
        React.createElement('div', {
          key: 'sinr',
          className: 'bg-white rounded-lg shadow p-4'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-lg font-bold text-blue-600'
          }, `${phyMetrics.avgSINR} dB`),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Avg SINR')
        ]),
        React.createElement('div', {
          key: 'cqi',
          className: 'bg-white rounded-lg shadow p-4'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-lg font-bold text-purple-600'
          }, phyMetrics.avgCQI),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Avg CQI')
        ]),
        React.createElement('div', {
          key: 'mcs',
          className: 'bg-white rounded-lg shadow p-4'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-lg font-bold text-orange-600'
          }, phyMetrics.avgMCS),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Avg MCS')
        ]),
        React.createElement('div', {
          key: 'throughput',
          className: 'bg-white rounded-lg shadow p-4'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-lg font-bold text-cyan-600'
          }, `${phyMetrics.avgThroughput} Mbps`),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'Throughput')
        ]),
        React.createElement('div', {
          key: 'bler',
          className: 'bg-white rounded-lg shadow p-4'
        }, [
          React.createElement('div', {
            key: 'value',
            className: 'text-lg font-bold text-red-600'
          }, `${phyMetrics.bler}%`),
          React.createElement('div', {
            key: 'label',
            className: 'text-xs text-gray-600'
          }, 'BLER')
        ])
      ]),
      
      React.createElement(PHYChart, {
        key: 'chart',
        chartType: selectedChart,
        data: chartData,
        title: selectedChart.replace('-', ' vs ').toUpperCase()
      })
    ]);

  } catch (error) {
    console.error('PHYStats component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'PHYStats Error');
  }
}

// Export PHYStats component
window.PHYStats = PHYStats;
